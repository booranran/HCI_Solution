# 1단계: 안정적인 Python 3.11 환경 사용
FROM python:3.11-slim

# 2단계: 시스템 의존성 설치 (libmagic 등)
WORKDIR /app
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libmagic1 && \
    rm -rf /var/lib/apt/lists/*

# 3단계: 필수 빌드 도구 업데이트
RUN pip install --upgrade pip setuptools wheel --no-cache-dir

# 4단계: requirements.txt 복사 및 의존성 설치
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 5단계: 애플리케이션 코드 복사
COPY backend/ ./

# 6단계: 환경 변수 설정
ENV PORT=8000

# 7단계: 컨테이너 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]