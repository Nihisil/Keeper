FROM node:15.13.0-alpine

WORKDIR /home/node/app

COPY ./frontend/package.json ./
COPY ./frontend/yarn.lock ./

RUN yarn
RUN mkdir /home/node/app/node_modules/.cache

COPY ./frontend/ .

CMD [ "yarn", "run", "build"]
