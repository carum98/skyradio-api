FROM node:21.6.1-alpine3.19

WORKDIR /app

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .