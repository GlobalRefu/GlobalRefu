# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm install

# Copy source code
COPY . .

# Build the app (if needed, e.g., for React, Angular, or other builds)
# Uncomment if your backend requires a build step:
# RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy only production dependencies from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copy application source code from builder stage
COPY --from=builder /usr/src/app .

# Expose API port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
