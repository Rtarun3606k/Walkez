#Dockerfile for the frontend
FROM node:alpine AS build

WORKDIR  /app 

COPY ./package.json ./package.json

RUN npm install 

COPY . .

RUN npm run build


#Ngnix to serve the frontend 

FROM nginx:latest 

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build  /app/dist .

ENTRYPOINT ["nginx", "-g", "daemon off;"]