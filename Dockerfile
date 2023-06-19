FROM node:14-alpine as builder

# Set the working directory
WORKDIR /app

# Copy the package.json file and install dependencies
COPY package.json .
RUN npm install

# Copy the rest of the source code and build the application
COPY . .
RUN npm run build

# Set the base image for the final image
FROM nginx:alpine

# Copy the built application from the builder image
COPY --from=builder /app/build /usr/share/nginx/html

# Set the command to run when the container is stopped
STOPSIGNAL SIGTERM
CMD curl -X POST -d '{"serviceName": "frontend", "url": "http://SERVICE_HOSTNAME:PORT/"}' http://gateway.e-nomads.com:3030/unregister -H "Content-Type: application/json" && nginx -g "daemon off;"
