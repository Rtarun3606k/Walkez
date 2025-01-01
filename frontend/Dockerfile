# Step 1: Build the project using Node.js
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the project (this creates the 'dist/' folder)
RUN npm run build

# Step 2: Serve the built project using Nginx
FROM nginx:alpine

# Copy the built project from the 'build' stage to Nginx's public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the default HTTP port (80)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
