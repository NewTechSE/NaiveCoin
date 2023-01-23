#!/usr/bin/env bash
set -e
set -x

export NODE_ENV="${NODE_ENV:-development}"

if [ $NODE_ENV == "development" ]; then
  # this runs webpack-dev-server with hot reloading
  npm start
else
  # build the app and serve it via nginx
  npm run build
  cp -r build/* /usr/share/nginx/html
  mkdir -p $ROOT/logs/nginx
  nginx -g 'daemon off;' -c $ROOT/app/nginx.conf
  nginx -c $ROOT/app/nginx.conf
fi