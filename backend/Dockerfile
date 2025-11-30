1단계: 안정적인 Python 3.11 환경 사용

FROM python:3.11-slim

2단계: 작업 디렉터리 설정 (프로젝트 루트)

WORKDIR /app

3단계: 시스템 의존성 설치 (C 컴파일러 포함)

pandas/numpy 빌드 에러를 해결하기 위해 필수적인 빌드 도구 설치

RUN apt-get update && 

apt-get install -y build-essential gcc

4단계: 파이썬 의존성 복사 및 설치

requirements.txt에 numpy==1.23.5와 pandas==1.5.3가 있다고 가정합니다.

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

5단계: 나머지 애플리케이션 코드 복사

나머지 모든 파일(main.py 등)을 컨테이너로 복사

COPY . .

6단계: 환경 변수 설정

ENV PORT 8000

7단계: 컨테이너 실행 명령어 정의

main.py 안에 있는 FastAPI 인스턴스 'app'을 실행합니다.

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]