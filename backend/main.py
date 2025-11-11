from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path

import json
import requests
import base64
import imghdr

from google.oauth2 import service_account
import google.auth.transport.requests

# ✅ 서비스 계정 키 파일 경로
CREDENTIAL_PATH = "backend/vertex-ai-key.json"

# ✅ Vertex AI 토큰 자동 발급
credentials = service_account.Credentials.from_service_account_file(
    CREDENTIAL_PATH,
    scopes=["https://www.googleapis.com/auth/cloud-platform"]
)
auth_req = google.auth.transport.requests.Request()
credentials.refresh(auth_req)
ACCESS_TOKEN = credentials.token


app = FastAPI(title="Fittory Prototype API")

@app.on_event("startup")
async def show_routes():
    print("ROUTES ->", [r.path for r in app.router.routes])


# CORS 설정 (테스트용 전체 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 정적 파일 서빙 (옷 이미지용)
app.mount("/static", StaticFiles(directory="backend"), name="static")

CLOTHES_PATH = Path(__file__).parent / "clothes.json"
UPLOADS_DIR = Path(__file__).parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/clothes")
def list_clothes():
    try:
        clothes = json.loads(CLOTHES_PATH.read_text(encoding="utf-8"))
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Failed to read clothes.json: {e}"})
    return {"items": clothes}


PROJECT_ID = "teak-amphora-477208-r0"
LOCATION = "us-central1"  # Imagen 모델은 보통 이 리전에 존재
MODEL_ID = "imagen-4.0-generate-001"

API_URL = (
    f"https://{LOCATION}-aiplatform.googleapis.com/v1/"
    f"projects/{PROJECT_ID}/locations/{LOCATION}/publishers/google/models/{MODEL_ID}:predict"
)

# ✅ 배경제거 함수
def remove_background(image_bytes: bytes):
    REMOVE_BG_KEY = "scfmBt22NGarDhAPck4ALYxd"
    image_type = imghdr.what(None, image_bytes) or "png"
    mime_type = f"image/{image_type}"

    res = requests.post(
        "https://api.remove.bg/v1.0/removebg",
        files={"image_file": (f"input.{image_type}", image_bytes, mime_type)},
        data={"size": "auto"},
        headers={"X-Api-Key": REMOVE_BG_KEY},
    )

    if res.status_code == 200:
        return res.content
    else:
        print("remove.bg error:", res.text)
        return image_bytes



# ✅ 핵심 엔드포인트
@app.post("/generate")
async def generate(file: UploadFile = File(...), cloth_id: str = Form(...)):
    # 1️⃣ 사용자 이미지 저장
    user_bytes = await file.read()
    save_path = UPLOADS_DIR / file.filename
    save_path.write_bytes(user_bytes)

    # 2️⃣ 옷 데이터 로드
    clothes = json.loads(CLOTHES_PATH.read_text(encoding="utf-8"))
    cloth = next((c for c in clothes if c["id"] == cloth_id), None)
    if not cloth:
        return JSONResponse(status_code=400, content={"error": "Invalid cloth_id"})

    # 3️⃣ 옷 이미지 로드 (로컬 or 웹)
    image_path = cloth["image_path"]
    if image_path.startswith("http"):
        img_headers = {"User-Agent": "Mozilla/5.0"}
        resp = requests.get(image_path, headers=img_headers)
        if resp.status_code != 200:
            return JSONResponse(status_code=400, content={"error": "Image download failed"})
        cloth_img = resp.content
    else:
        local_path = Path(__file__).parent / image_path
        if not local_path.exists():
            return JSONResponse(status_code=400, content={"error": f"로컬 옷 이미지를 찾을 수 없습니다: {image_path}"})
        cloth_img = local_path.read_bytes()

    # 3-1️⃣ 배경제거
    #cloth_img = remove_background(cloth_img)

    # 4️⃣ base64 인코딩
    user_b64 = base64.b64encode(user_bytes).decode("utf-8")
    cloth_b64 = base64.b64encode(cloth_img).decode("utf-8")

    # ✅ 5️⃣ 프롬프트 (룩북 스타일로 변경)
    prompt = (
        f"패션 룩북 화보 스타일의 사진. "
        f"모델이 '{cloth['name']}'을 입고 자연광 아래 포즈를 취하고 있는 장면. "
        f"카메라는 상반신을 중심으로, 피부 질감과 조명이 자연스러우며, "
        f"얼굴은 직접적으로 묘사하지 않고 스타일 전체 분위기를 강조해줘."
    )

    # ✅ 6️⃣ Vertex AI (Imagen 4 / 나노바나나) 요청 준비
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }

    # ⚙️ Imagen 4.0용 요청 포맷
    payload = {
        "instances": [
            {
                "prompt": prompt,
                "image": {"bytesBase64Encoded": user_b64},  # 사용자 이미지
            }
        ],
        "parameters": {
            "sampleCount": 2,          # 두 장 생성 → 품질 좋은 결과 선택 가능
            "aspectRatio": "1:1",
            "negativePrompt": "blur, distorted face, uncanny, low quality, glitch, watermark",
            "guidanceScale": 7.5       # 스타일 가이드 강화
        }
    }

    # ✅ 7️⃣ API 요청
    res = requests.post(API_URL, headers=headers, json=payload)
    if res.status_code != 200:
        return JSONResponse(
            status_code=res.status_code,
            content={"error": "Vertex AI API 호출 실패", "detail": res.text},
        )

    # ✅ 8️⃣ 응답 파싱
    result = res.json()
    predictions = result.get("predictions", [])
    if predictions and "bytesBase64Encoded" in predictions[0]:
        image_b64 = predictions[0]["bytesBase64Encoded"]
        return {
            "prompt": prompt,
            "cloth": cloth,
            "result_image": f"data:image/png;base64,{image_b64}"
        }

    return {"error": "이미지 데이터를 찾을 수 없습니다.", "detail": result}
