# modules/review_analysis.py
import os, json, re, csv, time
from pathlib import Path
from dotenv import load_dotenv

import google.generativeai as genai
import pandas as pd
from termcolor import colored


# ----------------------------
# 환경 설정
# ----------------------------
# 1. BASE_DIR (루트 폴더) 정의를 맨 위로
BASE_DIR = Path(__file__).resolve().parents[1]

# 2. .env 파일 경로를 정확히 지정 (이게 루트에 있는 .env를 읽음)
dotenv_path = BASE_DIR / ".env"
load_dotenv(dotenv_path)

# 3. .env 에 새로 추가한 "GEMINI_API_KEY"를 사용
api_key = os.getenv("GOOGLE_API_KEY")

# ✅ 4. (디버깅) 키가 진짜 로드됐는지 확인
if not api_key:
    print("🚨🚨🚨 에러: .env 파일에서 GOOGLE_API_KEY 찾을 수 없습니다!")
    print(f"찾으려는 .env 파일 경로: {dotenv_path}")
    print("--- .env 파일 내용 (확인용) ---")
    try:
        print(dotenv_path.read_text())
    except FileNotFoundError:
        print(".env 파일 자체가 존재하지 않습니다.")
    print("----------------------------")
    exit()  # 👈 키 없으면 그냥 멈춤

genai.configure(api_key=api_key)
print("✅ Gemini API 키 로드 성공!")  # 👈 디버깅용

# 5. MODEL_NAME (오타 수정했던 거)
MODEL_NAME = "gemini-2.5-flash"

# 6. 나머지 경로 설정
DATA_DIR = BASE_DIR / "data"
REVIEWS_PATH = DATA_DIR / "reviews_sample.json"
OUT_CSV = DATA_DIR / "review_results.csv"

# 7. gemini_prompt.txt 경로 (저번에 수정한 거)
PROMPT_TEMPLATE = (Path(__file__).resolve().parent / "gemini_prompt.txt").read_text(
    encoding="utf-8"
)


# ----------------------------
# Gemini 호출 함수
# ----------------------------
def call_gemini(review_text: str) -> str:
    prompt = PROMPT_TEMPLATE.replace("{review_text}", review_text)
    model = genai.GenerativeModel(MODEL_NAME)
    response = model.generate_content(prompt)
    return response.text


def coerce_json(text: str):
    """Gemini 응답에서 JSON만 추출"""
    text = text.strip()
    text = re.sub(r"^```(?:json)?", "", text)
    text = re.sub(r"```$", "", text)
    match = re.search(r"\{.*\}", text, flags=re.S)
    json_str = match.group(0) if match else text
    try:
        return json.loads(json_str)
    except Exception as e:
        print("JSON 파싱 실패:", e)
        return None


# ----------------------------
# 리뷰 분석 메인 함수
# ----------------------------
def run_analysis(input_path=REVIEWS_PATH, output_path=OUT_CSV, limit=None):
    """리뷰 JSON 파일을 분석하고 CSV로 저장"""

    with open(input_path, "r", encoding="utf-8") as f:
        reviews = json.load(f)

    results = []
    for i, review in enumerate(reviews[:limit]):
        # 👇 product_id도 가져오기
        rid, text, stars, product_id = (
            review.get("id"),
            review.get("text"),
            review.get("stars"),
            review.get("product_id"),
        )

        print(f"[{i+1}/{len(reviews)}] ({product_id}) 분석 중: {text[:40]}...")
        raw = call_gemini(text)
        parsed = coerce_json(raw)
        if not parsed:
            print(f"⚠️ {rid} 파싱 실패")
            continue

        # 👇 product_id도 결과에 추가하기
        parsed["id"], parsed["stars"], parsed["product_id"], parsed["text"] = rid, stars, product_id, text 
        results.append(parsed)
        time.sleep(6.1)

    df = pd.DataFrame(results)
    # 👇 이제 CSV 파일에는 product_id 컬럼이 포함됨
    df.to_csv(output_path, index=False, encoding="utf-8-sig")
    print(f"✅ {len(df)}개 리뷰 분석 완료 → {output_path.name}")
    return df


# ----------------------------
# 요약 리포트 생성 (선택)
# ----------------------------
def pretty_summary_report(csv_path=OUT_CSV):
    df = pd.read_csv(csv_path)
    total = len(df)
    size_rate = (df["size_match"] == "정사이즈").mean()
    pos_rate = (df["fit_sentiment"] == "긍정").mean()
    mat_rate = df["material_mention"].mean()

    # 색상 강조
    def color_num(val):
        if val >= 0.7:
            return colored(f"{val*100:.1f}%", "green")
        elif val >= 0.4:
            return colored(f"{val*100:.1f}%", "yellow")
        else:
            return colored(f"{val*100:.1f}%", "red")

    print("\n🧵  Fittory 리뷰 분석 리포트")
    print("───────────────────────────────")
    print(f"👕 총 리뷰 수: {total}건")
    print(f"📏 정사이즈 비율: {color_num(size_rate)}")
    print(f"😊 긍정 리뷰 비율: {color_num(pos_rate)}")
    print(f"🧶 재질 언급 비율: {color_num(mat_rate)}")
    print("───────────────────────────────")

    # 인사이트 문장 자동 생성
    insights = []
    if size_rate < 0.5:
        insights.append(
            "👖 사이즈 불만이 많은 제품이에요. 상세 사이즈 안내가 필요합니다."
        )
    else:
        insights.append("✨ 대부분 사용자들이 정사이즈라고 평가했어요.")

    if mat_rate > 0.7:
        insights.append(
            "🌿 재질 관련 언급이 많아요. 품질이나 촉감에 대한 리뷰 강조가 좋아요."
        )
    if pos_rate < 0.4:
        insights.append(
            "😕 전반적인 만족도가 낮아요. 후기 분석으로 문제 포인트를 파악해보세요."
        )
    elif pos_rate > 0.7:
        insights.append("💖 사용자들의 만족도가 높아요. 대표 후기 노출에 활용하세요!")

    print("\n💡 인사이트")
    for line in insights:
        print("  •", line)


if __name__ == "__main__":
    run_analysis()
    pretty_summary_report()
