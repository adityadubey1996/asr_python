# Use the specified version of the official Node runtime as a parent image
FROM node:18.20.2

# Set the working directory in the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Configure the store directory for pnpm inside the container
RUN pnpm config set store-dir /app/.pnpm-store

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Perform a clean installation of dependencies
RUN pnpm install --store-dir /app/.pnpm-store

# Force rebuild of all native modules, not just bcrypt
RUN pnpm rebuild --store-dir /app/.pnpm-store

# Copy the rest of your application source code
COPY . .

# Expose port 3000 to the outside once the container starts
EXPOSE 3000

# Define environment variable from .env file for use in the application
ENV NODE_ENV=production

# Command to run your app
CMD ["node", "index.js"]
