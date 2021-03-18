require("dotenv").config();
const http = require('http');

const app = require('./app.js');

const PORT = process.env.APP_PORT;

const server =  http.createServer(app);

server.listen(PORT, () => {console.log(`Server started on port ${PORT}`);});

