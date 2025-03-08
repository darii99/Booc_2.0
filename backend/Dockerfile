FROM node:19.9.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY app.js ./

# install dependencies
RUN npm ci --omit=dev
#RUN npm install

COPY ./bin ./bin
COPY ./public ./public
COPY ./routes ./routes
COPY ./services ./services
COPY ./views ./views


EXPOSE 4000

#CMD ["node", "app.js"]

CMD ["npm", "start"]
