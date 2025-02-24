FROM node:19.9.0-alpine

WORKDIR /backend

COPY package*.json ./

# install dependencies
RUN npm ci --omit=dev
#RUN npm install

COPY Microservices/Gateway/ ./

EXPOSE 4000

CMD ["node", "gateway.js"]

