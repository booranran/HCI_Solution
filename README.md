
# Fittory Prototype (워킹 프로토타입)

사진 업로드 → 옷 선택 → (현재는 더미) AI 합성 결과를 화면에 표시하는 최소 프로토타입입니다.
추후 Google NaNo Banana / Imagen API 호출만 붙이면 실제 합성으로 전환됩니다.

## 0) 사전 준비
- Python 3.10+ 권장
- macOS 기준 명령어 예시 (Windows는 `python` 대신 `py` 사용 가능)

## 1) 의존성 설치
```bash
cd fittory-proto
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## 2) 백엔드 실행
```bash
uvicorn backend.main:app --reload
```
- 실행 후: http://127.0.0.1:8000/health 가 {"ok": true}면 정상

## 3) 프론트 띄우기 (간이 서버)
```bash
# 새 터미널을 열고 같은 폴더에서
python3 -m http.server 5173
```
- 브라우저에서 http://127.0.0.1:5173/frontend/ 접속
- 사진 업로드 + 옷 선택 → **AI 합성** 클릭
- 현재는 더미 이미지를 반환하므로, UI 흐름만 먼저 검증합니다.

## 4) 실제 API로 교체 (가짜 → 진짜)
- `backend/main.py`의 `/generate` 엔드포인트 하단 "MOCK RESPONSE" 블록을
  실제 Google NaNo Banana (Imagen) API 호출 코드로 교체하세요.
- 옷 PNG는 `backend/clothes.json`에 URL을 넣어두면 됩니다. (투명 배경 권장)

## Troubleshooting
- CORS 에러: `backend/main.py`에서 CORS를 `allow_origins=["*"]`로 열어둠. 여전히 에러면 프론트를 http:// 로 띄우세요 (file:// 로 띄우면 이슈 생길 수 있음).
- 포트 충돌: `http.server` 기본 포트를 5173으로 사용. 이미 쓰는 중이면 5174 등으로 바꿔 실행 후 접속 URL도 변경.
- Python 버전: 3.10 이상 권장.
```
