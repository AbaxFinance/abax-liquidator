FROM node:18-alpine as builder

COPY ["abax-sdk", "/abax-sdk"]

# Create app directory
WORKDIR /app

# Install app dependencies
COPY ["abax-liquidator", "."]

RUN yarn install

# RUN yarn build

CMD ["npx","tsx", "./src/runActor.ts"]