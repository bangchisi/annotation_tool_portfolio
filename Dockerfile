FROM node:18

WORKDIR /

COPY package.json ./
COPY package-lock.json ./

RUN npm install -g npm@10.2.0 

RUN npm install

ENV NODE_PATH=/node_modules

COPY . .

EXPOSE 60143
CMD ["npm", "run", "start"]