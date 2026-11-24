FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM python:3.13-slim
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
WORKDIR /app
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt gunicorn
COPY backend/ ./backend/
COPY Pildid/ ./Pildid/
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
WORKDIR /app/backend
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-10000} 'app:create_app()'"]
