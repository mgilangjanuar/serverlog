[![vercel](https://www.datocms-assets.com/31049/1618983297-powered-by-vercel.svg)](https://vercel.com/?utm_source=restfire-studio&utm_campaign=oss)

# server.log()

A tiny tool for monitoring and debugging your project.

Live at [serverlog.vercel.app](https://serverlog.vercel.app)

## Getting Started

 - Build All

   ```bash
   yarn workspaces run build
   ```

 - Run

   ```bash
   # All services will served in server with Express
   yarn server node .
   ```

Or, if you want to run in the local environment:

 - Build Server

   ```bash
   yarn server build -w
   ```

 - Run Server

   ```bash
   yarn server start
   ```

 - Run Web

   ```bash
   # Define the REACT_APP_API_URL in web/.env first, then
   yarn web start
   ```

## How to Contribute

 0. Like this repo <3
 1. Send an issue
 2. Or, fork and send us a pull request to `main` branch

## License

[MIT](./LICENSE.md)

![high-five](https://media0.giphy.com/media/26BREWfA5cRZJbMd2/giphy.gif?cid=ecf05e4721370e49dc41cdc59e140f4c0337fcaa46553ddb&rid=giphy.gif)