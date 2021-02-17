FROM node:15.8.0-alpine

WORKDIR /home/node/app

COPY ./frontend/package.json ./
COPY ./frontend/yarn.lock ./

RUN yarn

COPY ./frontend/ .

CMD [ "yarn", "run", "build"]
