const Transaction = require("mongoose-transactions");
const { Product } = require("../models/products");


async function cart(req, res, next) {
    let products = [];
    let totalPrice = 0;

    const transaction = new Transaction();

    try {
        await Promise.all(req.body.cart.map(async (product) => {
            const prod = await Product.findById(product._id);
            if (!prod) {
                throw new Error("Product not found");
            };
            if (prod.stock < product.quantity) {
                throw new Error("Not enough stock");
            };

            products.push({
                _id: prod._id,
                title: prod.title,
                price: prod.price,
                quantity: product.quantity
            });

            totalPrice += prod.price * product.quantity;
            prod.stock -= product.quantity;

            console.log(prod.stock);
            transaction.update("Product", prod._id, prod);
            await transaction.run();
        }));

        req.products = products;
        req.totalPrice = totalPrice;
        next();
    }
    catch (err) {
        await transaction.rollback().catch(console.error);
        transaction.clean();
        return res.status(500).send("Something went wrong");
    }
}

module.exports = cart;