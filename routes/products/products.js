const express = require("express");
const router = express.Router();
//Middleware
const { getProducts, insertProduct, updateProductMiddWare, deleteProduct } = require("./middlewareProducts");
const { validateJWT } = require("../../utils/auth/auth");


//Routes
router.get("/", getProducts, (req, res) => {
    const { productList } = req;
    res.status(200).json(productList);
});

router.post("/", validateJWT, insertProduct, (req, res) => {
    const { newProduct } = req;
    res.status(201).json(newProduct);
});

router.put("/:productId", validateJWT, updateProductMiddWare, (req, res) => {
    const { updatedProduct } = req;
    res.status(202).json(updatedProduct);
});

router.delete("/:productId", validateJWT, deleteProduct, (req, res) => {
    const { isDeleted } = req;

    isDeleted && res.status(200).json("Deleted");
});

module.exports = router;