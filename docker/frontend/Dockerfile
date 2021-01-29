FROM node:15.7.0-alpine

WORKDIR /app/

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY ./frontend/package.json ./
COPY ./frontend/yarn.lock ./

RUN yarn

COPY ./frontend .

CMD [ "yarn", "run", "start"]
