# Use the official Node.js v12 image as a parent image
FROM node:12

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Compile the application if needed
# RUN npm run build

# Expose the port the app runs on
EXPOSE 1337

# Command to run the application
CMD ["npm", "run", "develop"]
