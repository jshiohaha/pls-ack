# pls-ack

Basic Express.js app to ack any HTTP request type on the root path configured for the service.

## Installation

Run `yarn`. Or, whatever the equivalent is in your package manager of choice.

## Run with docker

Build image and then run it. Just replace `<service_name>`.

```
IMAGE_NAME=<service_name> yarn build:image
docker run -p 3000:3000 <service_name>
```

## Run without docker

1. Execute `yarn build` to dump a compiled output in `/dist`
2. Execute `yarn start` to run the app

### Run in development mode

Run `yarn dev`
