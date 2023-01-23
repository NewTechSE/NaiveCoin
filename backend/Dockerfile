# Common build stage
FROM node:16-alpine as common-build-stage

COPY . ./app

WORKDIR /app

RUN npm ci

EXPOSE 3000

# Production build stage
FROM common-build-stage as production-build-stage

ENV NODE_ENV production

CMD ["npm", "run", "deploy:prod"]
