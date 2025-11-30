# 1단계: 안정적인 Python 3.11 환경 사용
FROM python:3.11-slim

# 2단계: 시스템 의존성 설치 (C 컴파일러 포함)
# apt-get은 의존성 설치가 끝난 후 삭제하여 최종 이미지 크기를 줄입니다.
WORKDIR /app
RUN apt-get update && \
    apt-get install -y build-essential gcc && \
    rm -rf /var/lib/apt/lists/*

# 3단계: 필수 빌드 도구 사전 설치 및 업데이트
# setuptools/pip/wheel이 최신 상태인지 확인
RUN pip install --upgrade pip setuptools wheel

# 4단계: 핵심 문제 라이브러리(numpy, pandas) 개별 설치 (가장 중요)
# requirements.txt에서 이 두 줄을 제거하고 여기에 직접 설치 명령을 넣습니다.
# 이렇게 하면 pip의 resolver나 requirements.txt 파일 순서 문제에서 벗어날 수 있습니다.
# (이 두 라이브러리는 Render 환경에서 호환성 문제가 많기 때문에 분리)
RUN pip install numpy==1.23.5 pandas==1.5.3 --no-cache-dir

# 5단계: 나머지 의존성 복사 및 설치
# requirements.txt에서 numpy와 pandas를 제외한 나머지 의존성만 설치합니다.
# 주의: 이 시점에는 requirements.txt 파일에서 numpy와 pandas가 제거되어 있어야 합니다.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 6단계: 나머지 애플리케이션 코드 복사
COPY . .

# 7단계: 환경 변수 설정
ENV PORT 8000

# 8단계: 컨테이너 실행 명령어 정의
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]