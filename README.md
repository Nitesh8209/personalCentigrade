# Playwright Automation Tests

This repository contains Playwright automation tests configured to run in a Docker container. Follow the steps below to build the Docker image, execute the tests, and view the test reports.

## Prerequisites

- [Docker](https://www.docker.com/) installed on your system.
- [Node.js](https://nodejs.org/) installed if you want to run Playwright's report viewer locally.

## Steps to Run Tests

### 1. Build the Docker Image

To build the Docker image for Playwright tests, run the following command:

```bash
docker build -t playwright-tests .
```

### 2. Run the test 

#### For local

```bash
docker run --rm \
  -e PLATFORM=local \
  -v "$(pwd -W)/test-results:/app/test-results" \
  -v "$(pwd -W)/playwright-report:/app/playwright-report" \
  playwright-tests

```
### For Dev

```bash
docker run --rm \
  -e PLATFORM=dev \
  -v "$(pwd -W)/test-results:/app/test-results" \
  -v "$(pwd -W)/playwright-report:/app/playwright-report" \
  playwright-tests

```
### For Prod

```bash
docker run --rm \
  -e PLATFORM=prod \
  -v "$(pwd -W)/test-results:/app/test-results" \
  -v "$(pwd -W)/playwright-report:/app/playwright-report" \
  playwright-tests

```

### 3. See the report

```bash
npx playwright show-report

```

