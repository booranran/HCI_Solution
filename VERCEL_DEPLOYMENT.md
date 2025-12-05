## Vercel 배포 가이드 (백엔드 + 프론트엔드)

### 📝 현재 설정 상태
- **프론트엔드**: Vite + React (TypeScript)
- **백엔드**: FastAPI (Python)
- **배포 환경**: Vercel (API + Frontend 모두)

---

## 🚀 배포 단계

### 1️⃣ **백엔드 배포 (Vercel Serverless Functions)**

#### 방법 1: `vercel.json` 이용 (이미 설정됨)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "backend/main.py"
    }
  ]
}
```

#### 배포 명령:
```bash
# 프로젝트 루트에서 실행
vercel deploy --prod
```

배포 후 Vercel이 부여하는 URL 확인:
- 예: `https://hci-solution.vercel.app`

---

### 2️⃣ **프론트엔드 환경 변수 설정**

#### `.env.production` (이미 생성됨)
```env
VITE_API_BASE_URL=https://hci-solution.vercel.app/api
```

⚠️ **Vercel 배포 시, 실제 URL로 수정해야 함:**
```env
VITE_API_BASE_URL=https://your-vercel-domain.vercel.app
```

---

### 3️⃣ **프론트엔드 배포 (Vercel)**

#### Vercel CLI로 배포:
```bash
cd frontend
vercel deploy --prod
```

또는 **GitHub 연결:**
1. GitHub에 코드 푸시
2. Vercel Dashboard에서 "New Project" → GitHub repo 선택
3. "Root Directory" = `frontend` 설정
4. 배포

---

### 4️⃣ **환경 변수 설정 (Vercel Dashboard)**

#### 프론트엔드 프로젝트 설정:
1. **Settings** → **Environment Variables**
2. 다음 추가:
   ```
   VITE_API_BASE_URL = https://your-vercel-domain.vercel.app
   ```
3. Save & Redeploy

---

## ✅ 수정된 코드 요약

모든 fetch 호출이 다음과 같이 변경됨:

```typescript
// ❌ 이전 (하드코딩)
const response = await fetch('http://localhost:8000/clothes');

// ✅ 이후 (환경 변수 사용)
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const response = await fetch(`${baseUrl}/clothes`);
```

#### 수정된 파일:
- ✅ `frontend/src/components/FeaturedProducts.tsx`
- ✅ `frontend/src/components/ProductListPage.tsx`
- ✅ `frontend/src/components/ProductDetailPage.tsx`
- ✅ `frontend/src/utils/useVirtualTryOnLogic.ts`
- ✅ `frontend/.env.production` (생성)

---

## 🔍 배포 후 확인

1. **백엔드 엔드포인트 테스트:**
   ```bash
   curl https://your-vercel-domain.vercel.app/health
   ```
   응답: `{"ok": true}`

2. **프론트엔드 테스트:**
   - https://your-vercel-domain.vercel.app 접속
   - 상품 목록 로드 확인
   - 가상 피팅 기능 테스트

---

## ⚠️ 주의사항

1. **CORS 설정** 확인:
   - Backend `main.py`에서 CORS 허용 설정 확인
   - 현재: `allow_origins=["*"]` ✅

2. **정적 파일 경로** 확인:
   - Backend: `app.mount("/static", StaticFiles(directory="backend"), name="static")`
   - 의류 이미지: `/backend/assets/` 폴더에 위치

3. **환경 변수 확인:**
   - 로컬: `.env.local` 사용
   - 배포: `.env.production` 또는 Vercel Dashboard 환경 변수 사용

---

## 🎯 최종 배포 체크리스트

- [ ] Backend `main.py` 모든 엔드포인트 테스트
- [ ] Frontend 모든 fetch URL 수정
- [ ] `.env.production` 파일 생성 및 URL 확인
- [ ] GitHub에 코드 푸시
- [ ] Vercel 배포 실행
- [ ] 배포된 URL에서 프론트엔드 기능 테스트
- [ ] 백엔드 API 응답 확인
