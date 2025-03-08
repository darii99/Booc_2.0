FROM node:19.9.0-alpine

WORKDIR /app

COPY package*.json ./


# install dependencies
RUN npm ci --omit=dev
#RUN npm install

COPY backend/app.js ./
COPY backend/bin ./bin
COPY backend/public ./public
COPY backend/routes ./routes
COPY backend/services ./services
COPY backend/views ./views


EXPOSE 4000

#CMD ["node", "app.js"]

CMD ["npm", "start"]
