FROM node:14.17.6

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json /app

RUN npm install

COPY . /app

CMD npm start