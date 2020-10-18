// Queries
const { productsList, insertProductInDB, findProductById, applyProductChanges, updateProductInDb, deleteQuery } = require("../../database/queries/queries");
// Database
const { sequelize } = require("../../database/sequelize/config");

const getProducts = async (req, res, next) => {
    try {
        req.productList = await productsList();
        next();
    } catch (error) {
        next(new Error(error));
    };
};

const insertProduct = async (req, res, next) => {
    const { product_name, product_price, product_photo } = req.body;

    if (product_name && product_price && product_photo) {
        try {
            const createdProduct = await insertProductInDB(product_name, product_price, product_photo);

            req.newProduct = { productId: createdProduct };

            next();

        } catch (error) {
            next(new Error(error));
        };
    } else {
        res.status(400).json("Missing Arguments");
    };
};

const updateProductMiddWare = async (req, res, next) => {
    const id = req.params.productId;
    const updatedProps = req.body;
    try {
        const productToUpdate = await findProductById(id);

        if (productToUpdate) {
            console.log("entra en middleware imprime lo que trae el request")
            console.log(updatedProps)
            const updatedProduct = await applyProductChanges(productToUpdate, updatedProps);
            console.log("sale de apllyChanges")
            const savedProduct = await updateProductInDb(id, updatedProduct);
            console.log("sale de updateProdinDB")
            req.updatedProduct = savedProduct;
            next();
        } else {
            res.status(404).json("Product not found");
        }
    } catch (error) {
        next(new Error(error));
    }
};

const deleteProduct = async (req, res, next) => {
    const id = req.params.productId;

    try {
        const productToDelete = await findProductById(id);

        if (productToDelete) {
            const isDeleted = async () => {
                const query = deleteQuery("products", `product_id = ${id}`);
                await sequelize.query(query, { raw: true });
                return true;
            };
            req.isDeleted = await isDeleted();
            next();
        } else {
            res.status(404).json("Product not found");
        };

    } catch (error) {
        next(new Error(error));
    }
};

module.exports = { getProducts, insertProduct, updateProductMiddWare, deleteProduct };