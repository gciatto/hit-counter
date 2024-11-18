# Pulls an image from docker hub with this name. Alternatively, "scratch" can be used for an empty container
FROM alpine:latest
# Runs a command
RUN apk update; apk add nodejs npm
# Copies a file/directory from the host into the image
COPY . /hit-counter
# Sets the working directory
WORKDIR /hit-counter
# Runs a command
RUN npm install
# Adds a new environment variable
ENV SERVICE_PORT=8080
# Exposes a port
EXPOSE ${SERVICE_PORT}
# Configures the default command to execute
CMD npm run service
