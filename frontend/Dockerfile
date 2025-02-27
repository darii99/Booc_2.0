FROM node:19.9.0-alpine

WORKDIR /frontend

COPY package*.json ./

# install dependencies
RUN npm ci --omit=dev
#RUN npm install

#COPY src/ ./
COPY . .

EXPOSE 5000

CMD ["npm", "start"]

