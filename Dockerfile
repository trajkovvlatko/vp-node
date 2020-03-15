FROM node:10-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN apk --no-cache add --virtual builds-deps build-base python
RUN apk update \
  && apk add sudo \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
RUN npm install

# Bundle app source
COPY . .

EXPOSE 4000 9229

COPY ./scripts/*.sh ./scripts

RUN chmod +x ./scripts/*.sh

# Add docker-compose-wait tool
ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.2/wait ./scripts/wait
RUN chmod +x ./scripts/wait

CMD "scripts/wait && scripts/docker-entrypoint.sh"
