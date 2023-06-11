# build stage
FROM node:14-slim as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG BASE_URL
RUN echo $BASE_URL

ENV BASE_URL=$BASE_URL

RUN env
RUN npm run build

# production stage
FROM nginx:stable-alpine
COPY ./nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
