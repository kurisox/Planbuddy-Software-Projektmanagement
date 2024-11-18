FROM node:16.13.0 AS development

ENV CI=true
ENV PORT=3000

WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm ci
COPY . /app

CMD [ "npm", "start" ]

FROM development AS builder

RUN npm run build

FROM nginx:1.13-alpine

COPY --from=builder /app/build /usr/share/nginx/html