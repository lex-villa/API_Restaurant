const express = require("express");
const router = express.Router();
//Middleware
const { orderList, createOrder, updateOrderStatus, deleteOrder } = require("./middlewareOrders");
const { validateJWT } = require("../../utils/auth/auth");


//Routes
router.get("/", validateJWT, orderList, (req, res) => {
    const { orderList } = req;
    res.status(200).json(orderList);
});

router.post("/", createOrder, (req, res) => {
    const { createdOrder } = req;
    console.log(createdOrder)
    res.status(201).json(createdOrder);
});

router.put("/:orderId", validateJWT, updateOrderStatus, (req, res) => {
    const { updatedOrder } = req;
    res.status(202).json(updatedOrder);
});

router.delete("/:orderId", validateJWT, deleteOrder, (req, res) => {
    const { isDeleted } = req;
    isDeleted && res.status(200).json("Deleted");
});

module.exports = router;