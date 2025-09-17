# Stage 1: Build the Angular app
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Stage 2: Serve the app with Nginx
FROM nginx:alpine AS production

# Remove the default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom configuration file to the container
COPY nginx.conf /etc/nginx/conf.d/

# Copy the built files from the 'build' stage
COPY --from=build /app/dist/jk-portfolio/browser /usr/share/nginx/html

# Overwrite the default index.html with a custom one
COPY /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]