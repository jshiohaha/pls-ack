# official Node.js image: https://hub.docker.com/_/node
# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md
FROM node:18

ARG PORT

# Create and change to the app directory.
WORKDIR /usr/src/app

# Install app dependencies.
COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

# Copy local code to the container image.
COPY ./src ./src

# Build the TypeScript code.
RUN npm run build

# Run the web service on container startup.
CMD ["npm", "run", "start"]
