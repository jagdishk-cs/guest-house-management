# Single-container deploy — use MongoDB Atlas for MONGODB_URI
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --strict-ssl=false
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev --strict-ssl=false
COPY backend/ ./
COPY --from=frontend-build /app/frontend/dist ../frontend/dist

ENV NODE_ENV=production
ENV SERVE_FRONTEND=true
ENV PORT=5000
EXPOSE 5000

CMD ["node", "server.js"]
