# Select node version from https://hub.docker.com/_/node/
FROM node:16.13.0

# Node enviroment, development or production
# set default to production, compose overrides this to dev on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Working directory in Container
WORKDIR /app

# Ports: 80 for node, 9229 and 9230 (tests) for debug
ARG PORT=80
ENV PORT $PORT
EXPOSE $PORT 9229 9230

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm ci

# Copy source code last -> source code most changes
COPY . /app

CMD ["node", "src/index.js"]