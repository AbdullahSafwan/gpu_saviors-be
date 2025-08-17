# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22.16.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Install wget for health checks and openssl for Prisma
RUN apk add --no-cache wget openssl

# Set working directory for all build stages.
WORKDIR /opt/gpu_saviors-be


################################################################################
# Create a stage for installing production dependecies.
FROM base as deps

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

################################################################################
# Create a stage for building the application.
FROM deps as build

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the source files into the image.
COPY . .

# Generate Prisma client and run the build script.
RUN npx prisma generate && npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base as final

# Use production node environment by default.
ENV NODE_ENV production

# Copy package.json and prisma schema for runtime.
COPY package.json .
COPY prisma ./prisma

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /opt/gpu_saviors-be/node_modules ./node_modules
COPY --from=build /opt/gpu_saviors-be/build ./build

# Generate Prisma client in the final stage
RUN npx prisma generate

# Change ownership to node user
RUN chown -R node:node /opt/gpu_saviors-be

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 8080

# Run the application.
CMD ["npm", "start"]
