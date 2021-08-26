FROM zenika/alpine-chrome:77-with-node

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

USER root

WORKDIR /app
COPY . /app

COPY package*.json ./

RUN npm install

CMD npm run start:prod

EXPOSE 4390