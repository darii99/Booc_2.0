FROM node:19.9.0-alpine

# working directory inside the container
WORKDIR /backend

COPY package*.json ./


# install dependencies
RUN npm ci --omit=dev

COPY Microservices/Events/ ./
#COPY . ./

# port the service runs on
EXPOSE 3400

# command to start the service
CMD ["node", "eventService.js"]

