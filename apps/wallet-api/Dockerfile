# Base image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json from the root directory
COPY ../../package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY ./src ./src

# Build application (if necessary)
RUN npm run build --workspace=wallet-api

# Command to run application
CMD ["npm", "run", "start:prod", "--workspace=wallet-api"]
