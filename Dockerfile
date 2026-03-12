# Stage 1: Build the Angular application
FROM node:20 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# This command builds the app for production.
RUN npm run build -- --configuration production

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built static files from the 'build' stage to the Nginx server directory.
COPY --from=build /usr/src/app/dist/jk-portfolio /usr/share/nginx/html

# Nginx will serve the index.html file by default.
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
