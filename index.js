const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const CORS = require("cors");


server.use(bodyParser.json(), CORS());

// Users Endpoints
const usersRouter = require("./routes/users/users");
server.use("/users", usersRouter);

// Products Enpoints
const productsRouter = require("./routes/products/products");
server.use("/products", productsRouter);

// Orders Endpoints
const ordersRouter = require("./routes/orders/orders");
server.use("/orders", ordersRouter);

// Initializing server
server.listen(3000, () => {
    console.log("Server connected");
});