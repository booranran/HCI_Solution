from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path


import json
import requests
import base64
import imghdr
import pandas as pd

from google.oauth2 import service_account
import google.auth.transport.requests

# ✅ 서비스 계정 키 파일 경로
CREDENTIAL_PATH = "backend/vertex-ai-key.json"

# ✅ Vertex AI 토큰 자동 발급
credentials = service_account.Credentials.from_service_account_file(
    CREDENTIAL_PATH, scopes=["https://www.googleapis.com/auth/cloud-platform"]
)

def get_access_token():
    credentials = service_account.Credentials.from_service_account_file(
        CREDENTIAL_PATH, scopes=["https://www.googleapis.com/auth/cloud-platform"]
    )
    auth_req = google.auth.transport.requests.Request()
    credentials.refresh(auth_req)
    return credentials.token

app = FastAPI(title="Fittory Prototype API")


@app.on_event("startup")
async def show_routes():
    print("ROUTES ->", [r.path for r in app.router.routes])


# CORS 설정 (테스트용 전체 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 정적 파일 서빙 (옷 이미지용)
app.mount("/static", StaticFiles(directory="backend"), name="static")

CLOTHES_PATH = Path(__file__).parent / "clothes.json"
UPLOADS_DIR = Path(__file__).parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)
CSV_PATH = Path(__file__).parent.parent / "data" / "review_results.csv"


@app.get("/health")
def health():
    return {"ok": True}


@app.get("/clothes")
def list_clothes():
    try:
        clothes = json.loads(CLOTHES_PATH.read_text(encoding="utf-8"))
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"error": f"Failed to read clothes.json: {e}"}
        )
    return {"items": clothes}


PROJECT_ID = "teak-amphora-477208-r0"
LOCATION = "us-central1"  # Imagen 모델은 보통 이 리전에 존재
MODEL_ID = "virtual-try-on-preview-08-04"

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

    print(f"--- 1. API 호출됨 ---")
    print(f"--- 2. 받은 cloth_id: {cloth_id} ---")

    # 1️⃣ 사용자 이미지 저장
    user_bytes = await file.read()
    # save_path = UPLOADS_DIR / file.filename
    # save_path.write_bytes(user_bytes)

    # 2️⃣ 옷 데이터 로드
    clothes = json.loads(CLOTHES_PATH.read_text(encoding="utf-8"))
    cloth = next((c for c in clothes if c["id"] == cloth_id), None)

    print(f"--- 3. 찾은 cloth 데이터: {cloth} ---")
    if not cloth:
        print("🚨🚨🚨 에러: cloth_id가 clothes.json에 없습니다!")
        return JSONResponse(status_code=400, content={"error": "Invalid cloth_id"})

    # 3️⃣ 옷 이미지 로드 (로컬 or 웹)
    image_path = cloth["image_path"]
    print(f"--- 4. 옷 이미지 로드 시도: {image_path} ---")  # 👈 NEW

    if image_path.startswith("http"):
        img_headers = {"User-Agent": "Mozilla/5.0"}
        resp = requests.get(image_path, headers=img_headers)
        if resp.status_code != 200:
            print(f"🚨🚨🚨 에러: 웹 이미지 다운로드 실패! {image_path}")  # 👈 NEW
            return JSONResponse(
                status_code=400, content={"error": "Image download failed"}
            )
        cloth_img = resp.content
    else:
        local_path = Path(__file__).parent / image_path
        print(f"--- 4.1. 계산된 로컬 경로: {local_path} ---")  # 👈 NEW

        if not local_path.exists():
            print(
                f"🚨🚨🚨 에러: 로컬 옷 파일을 찾을 수 없습니다! 경로: {local_path}"
            )  # 👈 NEW
            return JSONResponse(
                status_code=400,
                content={"error": f"로컬 옷 이미지를 찾을 수 없습니다: {image_path}"},
            )

        cloth_img = local_path.read_bytes()
        print("--- 4.2. 로컬 옷 파일 읽기 성공 ---")  # 👈 NEW

    # 3-1️⃣ 배경제거
    print("--- 5. 옷 배경 제거 시도 (remove.bg) ---")  # 👈 NEW
    cloth_img = remove_background(
        cloth_img
    )  # 이 함수는 실패 시 스스로 에러 로그를 찍음
    print("--- 5.1. 옷 배경 제거 완료 ---")  # 👈 NEW

    # 4️⃣ base64 인코딩
    print("--- 6. base64 인코딩 중 ---")  # 👈 NEW
    user_b64 = base64.b64encode(user_bytes).decode("utf-8")
    cloth_b64 = base64.b64encode(cloth_img).decode("utf-8")

    # ✅ 6️⃣ Vertex AI (VTO) 요청 준비
    current_token = get_access_token()
    
    headers = {
        "Authorization": f"Bearer {current_token}", # ⭐️ 변수 교체 (ACCESS_TOKEN -> current_token)
        "Content-Type": "application/json",
    }

    # ⚙️ 7. VTO용 요청 포맷 (카테고리 동적 적용)
    payload = {
        "instances": [
            {
                "personImage": {"image": {"bytesBase64Encoded": user_b64}},
                "productImages": [{"image": {"bytesBase64Encoded": cloth_b64}}],
            }
        ],
        "parameters": {
            # 👇 clothes.json에서 읽어온 값으로 자동 설정
            "productType": cloth["category"]
        },
    }

    print(
        "--- 7.1. (수정된 payload) 'image' 키 사용 버전 실행됨 ---"
    )  # (이건 저번에 넣은거)

    print("--- 7. Vertex AI 요청 페이로드 준비 완료 ---")

    # ✅ 8️⃣ API 요청
    print("--- 8. Vertex AI API 호출 시도... ---")  # 👈 NEW
    res = requests.post(API_URL, headers=headers, json=payload)

    # ✅ 9️⃣ 응답 확인 (이게 제일 중요!)
    if res.status_code != 200:
        print(
            f"🚨🚨🚨 에러: Vertex AI API가 {res.status_code} 코드를 반환했습니다!"
        )  # 👈 NEW
        print(f"🚨 Vertex AI 응답 내용: {res.text}")  # 👈 NEW (에러 내용 보여줌)
        return JSONResponse(
            status_code=res.status_code,
            content={"error": "Vertex AI API 호출 실패", "detail": res.text},
        )

    print("--- 9. Vertex AI API 호출 성공 ---")  # 👈 NEW

    # ✅ 10. 응답 파싱
    result = res.json()
    predictions = result.get("predictions", [])

    # 👇 "bytesBase64Encoded"로 수정
    if predictions and "bytesBase64Encoded" in predictions[0]:
        image_b64 = predictions[0]["bytesBase64Encoded"]
        print("--- 10. 최종 이미지 생성 성공 ---")
        return {"cloth": cloth, "result_image": f"data:image/png;base64,{image_b64}"}

    # 👇 이제 이 에러는 안 뜰 거야
    print("🚨🚨🚨 에러: Vertex AI가 200을 줬지만 'bytesBase64Encoded' 키가 없습니다.")
    return {"error": "이미지 데이터를 찾을 수 없습니다.", "detail": result}


# 👈 [수정] API 주소에 {product_id}를 받도록 변경
@app.get("/reviews/{product_id}")
def get_reviews(product_id: str): # 👈 [수정] product_id를 인자로 받음
    if not CSV_PATH.exists():
        return {"summary": {}, "reviews": []}

    # 1. (수정) 일단 CSV *전체*를 읽는다
    df_all = pd.read_csv(CSV_PATH)
    
    # 2. (추가) 🚨 이 상품 ID에 해당하는 리뷰만 필터링한다 🚨
    # (df가 '여기서' 생성됨)
    df = df_all[df_all["product_id"] == product_id].copy()

    # 3. (추가) 만약 이 상품의 리뷰가 아예 없다면? (이 검사 빠뜨리면 안 됨)
    if df.empty:
        return {"summary": {"total": 0}, "reviews": []}

    # 4. (수정) 'df'가 생성된 *후*, .empty 체크도 *후*에, '여기서' NaN을 고쳐야 함
    # (이게 아까 에러난 230번째 줄의 올바른 위치임)
    df = df.where(pd.notna(df), None) 

    # 5. (수정) 이제 df는 '필터링된' 리뷰이므로, 
    #    요약 리포트도 이 상품 기준으로만 계산됨
    total = len(df)
    size_rate = (df["size_match"] == "정사이즈").mean()
    pos_rate = (df["fit_sentiment"] == "긍정").mean()
    mat_rate = df["material_mention"].mean()

    summary = {
        "total": total,
        "size_rate": size_rate,
        "pos_rate": pos_rate,
        "mat_rate": mat_rate
    }
    
    reviews = df.to_dict(orient="records")
    return {"summary": summary, "reviews": reviews}