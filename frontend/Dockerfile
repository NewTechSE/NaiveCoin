FROM node:16

RUN apt-get update && \
    apt-get install -y nginx

WORKDIR /app

COPY . /app

RUN npm ci

CMD /bin/bash /app/run.sh