FROM node:19.9.0-alpine

WORKDIR /backend

COPY package*.json ./

# install dependencies
RUN npm ci --omit=dev
#RUN npm install

COPY . .
#COPY app.js ./
#COPY ./bin ./bin
#COPY ./public ./public
#COPY ./routes ./routes
#COPY ./services ./services
#COPY ./views ./views

EXPOSE 6400

#CMD ["node", "gateway.js"]
CMD ["npm", "start"]
