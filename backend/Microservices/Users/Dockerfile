# Use official Node.js image as base
FROM node:19.9.0-alpine

# Set the working directory inside the container
WORKDIR /backend

COPY package*.json ./


# Install dependencies
RUN npm ci --omit=dev

COPY /Microservices/Users/ ./

# Expose the port the service runs on
EXPOSE 3200

# Set the command to start the service
CMD ["node", "userService.js"]

