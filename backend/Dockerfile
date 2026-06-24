ARG PIP_INDEX_URL=https://pypi.org/simple/

FROM docker.m.daocloud.io/library/python:3.12-slim

ARG PIP_INDEX_URL

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt -i $PIP_INDEX_URL

COPY . .

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
