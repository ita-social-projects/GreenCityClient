FROM node:14.17.6-alpine as node

WORKDIR /usr/src/dir

COPY package*.json ./

RUN npm install

COPY . .

RUN npm start