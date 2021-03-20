require("dotenv").config();
const http = require("http");

const appServer = require("./app");

const PORT = process.env.APP_PORT;

const server = http.createServer(appServer);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
