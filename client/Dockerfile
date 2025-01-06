# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Install serve to run the built app
RUN npm install -g serve

# Expose frontend port
EXPOSE 5173

# Serve the built app
CMD ["serve", "-s", "dist", "-l", "5173"]