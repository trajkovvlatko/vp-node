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

CMD ["npm", "start"]
