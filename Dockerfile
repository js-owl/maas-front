#---- Stage 1: Build the Vure application ----
#FROM node:20.19.5-alpine AS builder
FROM vortex.kronshtadt.ru:8443/maas-proxy/node:20.19.5-alpine AS builder

# Set the working directory
WORKDIR /app

# Install git for build info (optional)
#RUN apk add --no-cache git

# Copy package files and install dependencies
COPY package*.json ./
COPY package-lock.json ./
COPY .env.production ./

RUN npm config set strict-ssl false
RUN npm config set registry https://vortex.kronshtadt.ru:8443/repository/npm-proxy/
RUN npm config set //vortex.kronshtadt.ru:8443/repository/npm-proxy/:_auth=bWFhc3VzZXI6UHM4NGJtdVNkSjZGZVg0NzRmQSVtd00z
RUN npm config ls
RUN npm install --production=false
RUN npm install vue-tsc --save-dev
RUN npm ci

# Copy the entire project source code
COPY . .

# Build the application for production
# This  creates the /app/dist folder

RUN ls -la ./node_modules/.bin

RUN npm run build -- --mode production


# Stage 2: Server the application with Nginx ----
# Use a lightweight Nginx image
FROM vortex.kronshtadt.ru:8443/maas-proxy/nginx:stable-alpine

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Set the working directory to Nginx's web root
WORKDIR /usr/share/nginx/html

# Remove default Nginx welcome page
RUN rm -rf ./*

# Copy the built assets from the 'builder' stage
COPY --from=builder /app/dist .

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx and keep it in the background
CMD ["nginx", "-g", "daemon off;"]
