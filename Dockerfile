FROM node:20.9-slim

WORKDIR /app

COPY . .

COPY .env.sample .env

RUN npm ci

ENV PORT 3000

EXPOSE 3000

CMD npm start
