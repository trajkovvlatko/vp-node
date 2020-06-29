FROM node:10-alpine

RUN apk --no-cache add --virtual builds-deps build-base python
RUN apk update \
  && apk add sudo \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm rebuild bcrypt --build-from-source

# Bundle app source
COPY . .

EXPOSE 4000 9229

COPY ./scripts ./scripts

RUN chmod +x ./scripts/*

CMD "scripts/wait && scripts/docker-entrypoint.sh"
