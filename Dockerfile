FROM node:12-alpine as builder
WORKDIR /app
COPY package.json /app/package.json
RUN npm cache clean --force
RUN npm install
COPY . /app