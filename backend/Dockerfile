FROM node:19.9.0-alpine

WORKDIR /backend

COPY package*.json ./

# install dependencies
RUN npm ci --omit=dev
#RUN npm install

COPY . .

EXPOSE 6400

#CMD ["node", "gateway.js"]
CMD ["npm", "start"]
