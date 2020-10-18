// Queries
const { addOrderInDb, validateStatus, findOrderById, updateQuery, selectQuery, printOrderInfo, deleteQuery } = require("../../database/queries/queries");
const { sequelize } = require("../../database/sequelize/config");

const orderList = async (req, res, next) => {
    try {
        const ordersQuery = selectQuery("orders", "order_id");
        const [ordersIds] = await sequelize.query(ordersQuery, { raw: true });
        const detailedOrders = async () => {
            return Promise.all(
                ordersIds.map(async (order) => printOrderInfo(order.order_id))
            );
        };

        req.orderList = await detailedOrders();
        next();
    } catch (error) {
        next(new Error(error));
    }
};

const createOrder = async (req, res, next) => {
    try {
        const order = await addOrderInDb(req, res);
        console.log("ORDEEEER")
        console.log(order)
        req.createdOrder = order;
        next();
    } catch (err) {
        next(new Error(err));
    }
};

const updateOrderStatus = async (req, res, next) => {
    const id = +req.params.orderId;
    const { status } = req.body;
    const validStatus = validateStatus(status);

    if (validStatus) {
        try {
            const orderToUpdate = await findOrderById(id);

            if (orderToUpdate) {
                const query = updateQuery(
                    "orders",
                    `order_status = '${status}'`,
                    `order_id = ${id}`
                );

                await sequelize.query(query, { raw: true });

                req.updatedOrder = await findOrderById(id);
                next();
            } else {
                res.status(404).json("Order not found");
            };
        } catch (error) {
            next(new Error(error));
        };
    } else {
        res.status(405).json("Invalid status suplied");
    };
};

const deleteOrder = async (req, res, next) => {
    const id = +req.params.orderId;
    try {
        const orderToDelete = await findOrderById(id);
        if (orderToDelete) {
            const query = deleteQuery("orders", `order_id = ${id}`);
            await sequelize.query(query, { raw: true });
            req.isDeleted = true;
            next();
        } else {
            res.status(404).json("Order not found");
        }
    } catch (error) {
        next(new Error(error));
    }
};

module.exports = { orderList, createOrder, updateOrderStatus, deleteOrder };