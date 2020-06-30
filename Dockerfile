FROM node:10-alpine

RUN apk --no-cache add --virtual builds-deps build-base python
RUN apk update && \
  apk add --no-cache libc6-compat && \
  rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# store node_modules in cache first and move them to the . volume on entrypoint
RUN mkdir -p /usr/src/cache
WORKDIR /usr/src/cache
COPY package*.json ./
RUN npm install

# put the code in the app folder
WORKDIR /usr/src/app

RUN chown -R node:node /usr/src/app

USER node

# ! CHECK THIS
# RUN npm rebuild bcrypt --build-from-source

COPY . .

EXPOSE 4000 9229

# COPY ./scripts ./scripts

CMD "scripts/wait && scripts/docker-entrypoint.sh"
