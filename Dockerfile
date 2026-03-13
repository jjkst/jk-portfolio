# Stage 1: Build the Angular application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Remove default nginx page, then copy Angular static files
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/jk-portfolio/browser /usr/share/nginx/html
# Angular SSR builds produce index.csr.html instead of index.html
RUN if [ -f /usr/share/nginx/html/index.csr.html ] && [ ! -f /usr/share/nginx/html/index.html ]; then \
      mv /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html; \
    fi
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
