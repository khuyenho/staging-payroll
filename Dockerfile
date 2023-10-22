# Use the official Node.js 14 image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the entire application to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the desired port (e.g., 3000)
EXPOSE 3000

# Set the environment variables (if necessary)
# ENV NODE_ENV=production

# Start the Next.js application
CMD ["npm", "start"]
