# Build
FROM node:9-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
ENV NODE_ENV "DOCKER"
COPY . .
RUN npm run build

# Deploy
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
ENV CI_PROJECT_NAME ""
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
