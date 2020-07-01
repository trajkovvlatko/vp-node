FROM node:10-alpine

RUN apk update
RUN apk --no-cache add --virtual builds-deps build-base python
RUN rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# store node_modules in cache first and move them to the . volume on entrypoint
RUN mkdir -p /usr/src/cache
WORKDIR /usr/src/cache
COPY package*.json ./
RUN npm install

# put the code in the app folder
WORKDIR /usr/src/app

RUN chown -R node:node /usr/src/app

USER node

COPY . .

EXPOSE 4000 9229

CMD "bin/wait && bin/docker-entrypoint.sh"
