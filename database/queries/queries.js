// Database
const { sequelize } = require("../sequelize/config");


// General Queries
const selectQuery = (table, columns = "*", conditions = null) => {
    const query = `SELECT ${columns} FROM ${table}` +
        ` ${conditions ? `WHERE ${conditions}` : ""}`;

    return query
};

const insertQuery = (table, properties, values) => {
    const dataToInsert = values.map((value) => `"${value}"`).join(",");
    const query = `INSERT INTO ${table}(${properties}) VALUES(${dataToInsert})`;
    return query;
};

const updateQuery = (table, changes, conditions) => {
    const query = `UPDATE ${table} SET ${changes}` + `WHERE ${conditions}`;

    return query;
};

const deleteQuery = (table, conditions) => {
    const query = `DELETE FROM ${table} WHERE ${conditions}`;

    return query;
};

function joinQuery(mainTable, columns, joiners, conditions) {
    const fullJoiners = joiners
        .map((element) => `JOIN ${element} `)
        .toString()
        .replace(/,/g, "");
    const query =
        `SELECT ${columns} FROM ${mainTable}` +
        ` ${fullJoiners}` +
        `${conditions ? `WHERE ${conditions}` : ""}`;
    return query;
};

// Functions Queries for USERS
const usersList = async () => {
    const query = selectQuery("users");
    const dbUsers = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
    return dbUsers;
};

const findUserByName = async (firstname, lastname) => {
    const query = selectQuery(
        "users",
        "firstname, lastname",
        `firstname = '${firstname}' AND lastname = '${lastname}' `
    );

    const dbUser = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
    const existingUser = await dbUser.find(x => {
        (x.firstname === firstname) && (x.lastname === lastname);
    });

    return existingUser ? true : false;
};

const findUserByUsername = async (username) => {
    const query = selectQuery(
        "users",
        "user_id, username, password, is_admin",
        `username = '${username}'`
    );
    const [dbUser] = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
    return dbUser;
}

const findUserByEmail = async (email) => {
    const query = selectQuery(
        "users",
        "email",
        `email = '${email}'`
    );
    const dbUser = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
    const isFoundEmail = dbUser.length === 0 ? false : true;
    return isFoundEmail;
};


// Functions Queries for PRODUCTS
const productsList = async () => {
    const query = selectQuery("products");
    const dbProducts = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
    return dbProducts;
};

const insertProductInDB = async (product_name, product_price, product_photo) => {
    const query = insertQuery(
        "products",
        "product_name, product_photo, product_price",
        [product_name, product_photo, product_price]
    );

    const [newProductID] = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

    return newProductID;
};

const findProductById = async (id) => {
    const query = selectQuery("products", "*", `product_id = ${id}`);
    const [dbFoundProduct] = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

    return dbFoundProduct;
};

const applyProductChanges = (prodToUpdate, updatedProps) => {
    const props = Object.keys(updatedProps).filter(prop =>  // if a false is present, that prop won't be in the props constant
        updatedProps[prop] &&
        updatedProps[prop] !== " " &&
        updatedProps[prop] !== "null" &&
        updatedProps[prop] !== "undefined" &&
        !updatedProps[prop].toString().includes("  ")
    );
    console.log("entra en applyChanges imprime props")
    console.log(props)
    const newProperties = props.reduce((obj, property) => {
        obj[property] = updatedProps[property];
        return obj;
    }, {});
    console.log("entra en applyChanges imprime newProps")
    console.log(newProperties)
    const updatedProduct = { ...prodToUpdate, ...newProperties };
    console.log("entra en applyChanges imprime updatedprops")
    console.log(updatedProduct)
    return updatedProduct;
};

const updateProductInDb = async (id, product) => {
    console.log("entra a updateProdInDB")
    const { product_name, product_price, product_photo } = product;
    console.log("entra antes de query")
    const query = updateQuery(
        "products",
        `product_name = '${product_name}', product_price = '${product_price}', product_photo = '${product_photo}'`,
        `product_id = ${id}`
    );
    console.log("sale del query")
    await sequelize.query(query, { raw: true });
    console.log("antes de findProd")
    const dbProduct = await findProductById(id);
    console.log("passo bien el updateProd")
    return dbProduct;
};

// Functions Queries for ORDERS
const printDescName = async (product) => {
    const { productId, quantity } = product;
    const productName = (await findProductById(productId)).product_name;
    const productDesc = `${quantity}x${productName.slice(0, 5)} `;
    return productDesc;
};

const findProductPrice = async (product) => {
    const { productId, quantity } = product;
    const productPrice = (await findProductById(productId)).product_price;
    const subtotal = `${+productPrice * +quantity}`;
    return subtotal;
};

const createOrderRegistry = async (orderTime, orderDescription, totalPrice, paymentMethod, user) => {
    const query = insertQuery(
        "orders",
        "order_time, order_description, order_amount, payment_method, user_id",
        [orderTime, orderDescription, totalPrice, paymentMethod, user]
    );
    const [addedRegistry] = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
    return addedRegistry;
};

const obtainOrderDescAndPrice = async (products) => {
    let orderDescription = "";
    let subtotal = 0;
    for (let i = 0; i < products.length; i++) {
        orderDescription = orderDescription + (await printDescName(products[i]));
        subtotal = +subtotal + +(await findProductPrice(products[i]));
    }
    return [orderDescription, subtotal];
};

const createOrderRelationship = async (orderId, products) => {
    console.log("func createOrderRelations ENTER")
    products.forEach(async (product) => {
        const { productId, quantity } = product;
        const query = insertQuery(
            "orders_products",
            "order_id, product_id, product_quantity",
            [orderId, productId, quantity]
        );
        await sequelize.query(query, { raw: true });
    });
    console.log("func createOrderRelations EXIT")
    return true;
};

const completeDesc = async (orderInfo) => {
    console.log("func completeDesc ENTER")
    console.log(orderInfo)
    const order = orderInfo;
    const productsQuery = joinQuery(
        "orders_products",
        "orders_products.product_quantity, products.*",
        [`products ON orders_products.product_id = products.product_id`],
        `order_id = ${order.order_id}`
    );
    const [productsInfo] = await sequelize.query(productsQuery, { type: sequelize.QueryTypes.SELECT });
    order.products = await productsInfo;
    console.log("func completeDesc EXIT")
    return order;
};

const printOrderInfo = async (orderId) => {
    console.log("func printOrderInfo ENTER")
    const ordersQuery = joinQuery(
        "orders",
        "orders.*, users.username, users.firstname, users.lastname,users.address, users.email, users.phone_number",
        ["users ON orders.user_id = users.user_id"],
        `order_id = ${orderId}`
    );
    const [orderInfo] = await sequelize.query(ordersQuery, { type: sequelize.QueryTypes.SELECT });
    console.log(orderInfo)
    console.log("func printOrderInfo EXIT")
    return completeDesc(orderInfo);
};

const addOrderInDb = async (req, res) => {
    const { username, products, payment_method } = req.body;

    if (username && products && payment_method) {
        const userData = await findUserByUsername(username);

        if (userData) {
            const userId = userData.user_id;
            //const orderTime = new Date().toLocaleTimeString();
            const today = new Date();
            const orderTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            const [orderDesc, totalPrice] = await obtainOrderDescAndPrice(products);
            const addedOrder = await createOrderRegistry(
                orderTime,
                orderDesc,
                totalPrice,
                payment_method,
                userId
            );
            console.log("Func principal addInDB added order")
            console.log(addedOrder)
            await createOrderRelationship(addedOrder, products);

            return await printOrderInfo(addedOrder);

        } else {
            res.status(400).json("User not found");
        };

    } else {
        res.status(405).json("Missing Arguments");
    }
};

// To update Order
const validateStatus = (submittedStatus) => {
    const validStatus = ["new", "confirmed", "preparing", "delivering", "delivered"];
    const existingStatus = validStatus.find(status => status === submittedStatus);

    return existingStatus;
};

const findOrderById = async (orderId) => {
    const query = selectQuery("orders", "*", `order_id = ${orderId}`);
    const [dbOrder] = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
    
    return dbOrder;
};




module.exports = {
    selectQuery,
    insertQuery,
    usersList,
    findUserByName,
    findUserByEmail,
    findUserByUsername,
    productsList,
    insertProductInDB,
    findProductById,
    applyProductChanges,
    updateProductInDb,
    deleteQuery,
    addOrderInDb,
    validateStatus,
    findOrderById,
    updateQuery,
    printOrderInfo
};