# 1단계: 안정적인 Python 3.11 환경 사용
FROM python:3.11-slim

# 2단계: 시스템 의존성 설치 (C 컴파일러 포함)
WORKDIR /app
RUN apt-get update && \
    apt-get install -y build-essential gcc && \
    rm -rf /var/lib/apt/lists/*

# 3단계: 필수 빌드 도구 사전 설치 및 업데이트
RUN pip install --upgrade pip setuptools wheel

# 4단계: requirements.txt 복사 및 의존성 설치
# numpy, pandas를 분리하지 않아도 되지만, 일단 requirements.txt를 그대로 사용한다고 가정합니다.
# 주의: requirements.txt는 backend/ 안에 있으므로, 먼저 폴더를 만들고 파일을 복사합니다.
RUN mkdir backend
COPY backend/requirements.txt backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# 5단계: 나머지 애플리케이션 코드 복사
# backend/ 폴더 안의 모든 코드를 컨테이너의 backend/ 폴더로 복사
COPY backend/ backend/

# 6단계: 환경 변수 설정
ENV PORT 8000

# 7단계: 컨테이너 실행 명령어 정의
# uvicorn이 backend 폴더의 main.py 안에 있는 app을 실행하도록 명확히 지정
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]