FROM nginx:stable-alpine

COPY ./dist/app /usr/share/nginx/html/
