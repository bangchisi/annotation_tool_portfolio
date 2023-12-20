# 첫 번째 단계: 앱 빌드
FROM node:20 as builder

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사
COPY package*.json ./

RUN yarn install

# 앱 소스 코드 복사
COPY . .

# 앱 빌드
RUN yarn run build

# 두 번째 단계: Nginx 서빙
FROM nginx:alpine

# Nginx 설정 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 앱 복사
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 60144

# Nginx 시작
CMD ["nginx", "-g", "daemon off;"]