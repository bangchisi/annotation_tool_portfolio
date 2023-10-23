FROM node:18

WORKDIR /workspace

COPY package.json ./
COPY package-lock.json ./

RUN npm install -g npm@10.2.1

RUN npm install

COPY . .

EXPOSE 60143
CMD ["npm", "run", "start"]