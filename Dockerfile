FROM node:20

WORKDIR /

COPY package.json ./
COPY package-lock.json ./

# npm install이 작동하기 않기에 
# project 폴더에서 npm i 명령어 직접 실행 후 docker build 하세요
# RUN npm install

COPY . .

EXPOSE 60142
CMD ["npm", "run", "start"]