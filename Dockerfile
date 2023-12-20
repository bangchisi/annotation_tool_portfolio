FROM node:20

WORKDIR /

COPY package.json ./
COPY package-lock.json ./

RUN yarn install

COPY . .

EXPOSE 60143
CMD ["yarn", "run", "start"]