# 첫 번째 단계: 앱 빌드
FROM node:20 as builder

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사
COPY package*.json ./

# npm install이 작동하기 않기에 
# project 폴더에서 npm i 명령어 직접 실행 후 docker build 하세요
# RUN npm install

# 앱 소스 코드 복사
COPY . .

# 앱 빌드
RUN npm run build

# 두 번째 단계: Nginx 서빙
FROM nginx:alpine

# Nginx 설정 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 앱 복사
COPY --from=builder /app/build /usr/share/nginx/html

# 포트 80으로 노출
EXPOSE 60143

# Nginx 시작
CMD ["nginx", "-g", "daemon off;"]