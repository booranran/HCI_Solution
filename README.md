# 👕 Fitory (AI Fashion Solution)

**Fitory**는 AI 기술을 활용하여 개인화된 쇼핑 경험을 제공하는 패션 커머스 프로토타입입니다.
생성형 AI를 통해 사용자의 체형에 맞는 핏을 추천하고, 가상으로 옷을 입어보며, 리뷰를 스마트하게 분석합니다.

---

## ✨ 주요 기능 (Key Features)

1.  **AI 사이즈 추천 (Body Compare):** 사용자의 신체 치수와 옷의 실측 정보를 비교하여 최적의 핏과 사이즈를 시각적으로 제안합니다.
2.  **가상 피팅 (Virtual Try-On):** Vertex AI를 활용하여 사용자의 전신 사진에 선택한 옷을 가상으로 입혀봅니다.
3.  **AI 리뷰 분석:** Gemini AI가 수많은 리뷰를 분석하여 사이즈, 재질, 만족도에 대한 핵심 인사이트를 요약해 줍니다.

---

## 🛠️ 설치 및 실행 방법 (How to Run)

이 프로젝트는 **Frontend(React)**와 **Backend(FastAPI)** 서버를 동시에 실행해야 합니다.

### 0. 사전 준비 (Prerequisites)
* **Node.js** (v18 이상 권장)
* **Python** (3.10 이상 권장)
* **Google Cloud API Key 파일** (`vertex-ai-key.json`)
    * *주의: 보안상의 이유로 API 키 파일은 저장소에 포함되어 있지 않습니다. 관리자에게 문의하여 `backend/` 폴더에 위치시켜야 합니다.*

---

### 1. 백엔드 서버 실행 (Backend)

먼저 파이썬 서버를 실행하여 데이터와 AI 기능을 활성화합니다.

1. `backend` 폴더로 이동합니다.
   ```bash
   cd backend
필요한 라이브러리를 설치합니다.

Bash

pip install fastapi uvicorn pandas requests google-cloud-aiplatform python-dotenv termcolor
# 또는
pip install -r requirements.txt
환경 변수 및 키 파일 확인:

backend/vertex-ai-key.json 파일이 있는지 확인하세요.

backend/.env 파일에 GEMINI_API_KEY가 설정되어 있는지 확인하세요.

서버를 실행합니다.

Bash

uvicorn main:app --reload
실행 성공 시: http://localhost:8000 에서 서버가 작동합니다.

2. 프론트엔드 실행 (Frontend)
새로운 터미널을 열고 리액트 앱을 실행합니다.

frontend 폴더로 이동합니다.

Bash

cd frontend
패키지를 설치합니다.

Bash

npm install
개발 서버를 실행합니다.

Bash

npm run dev
실행 후 터미널에 표시된 로컬 주소(예: http://localhost:5173 또는 3000)로 접속하세요.

📂 프로젝트 구조 (Project Structure)
HCI_SOLUTION/
├── backend/             # Python FastAPI Server
│   ├── clothes.json     # 상품 데이터 (DB 역할)
│   ├── main.py          # 메인 서버 코드
│   ├── review_analysis.py # 리뷰 분석 AI 스크립트
│   └── assets/          # 상품 이미지 폴더
│
└── frontend/            # React Vite App
    ├── src/
    │   ├── components/  # UI 컴포넌트
    │   ├── pages/       # 주요 페이지 (BodyCompare, VirtualTryOn 등)
    │   └── utils/       # 유틸리티 함수 (fitCalculator 등)
    └── ...
⚠️ 트러블슈팅 (Troubleshooting)
이미지가 안 보이나요?

백엔드 서버(uvicorn)가 켜져 있는지 확인하세요. 이미지는 백엔드에서 서빙됩니다.

API 오류가 발생하나요?

vertex-ai-key.json 파일 경로가 정확한지, 유효 기간이 만료되지 않았는지 확인하세요.

.env 파일에 Gemini API Key가 올바르게 입력되었는지 확인하세요.