# Use an official Playwright image as a base
FROM mcr.microsoft.com/playwright:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install project dependencies
RUN npm ci

# Copy the rest of your project files
COPY . .

# Install Playwright browsers
RUN npx playwright install

# Install Playwright Dependencies
RUN npx playwright install-deps

# Ensure reports are generated to this directory
VOLUME ["/app/test-results", "/app/playwright-report"]

# Default command to run tests
CMD ["npx", "playwright", "test", "--reporter=html"]