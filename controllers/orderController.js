const prisma = require('../prisma/client');

// Create order with transaction
const createOrderWithTransaction = async (req, res) => {
    try {
        const order = await prisma.$transaction(async (tx) => {
            // Create the order
            const newOrder = await tx.order.create({
                data: {
                    userId: req.user.id
                }
            });

            // Create order items
            const orderItems = await Promise.all(
                req.body.items.map(item =>
                    tx.orderItems.create({
                        data: {
                            orderId: newOrder.id,
                            dishId: item.dishId,
                            quantity: item.quantity,
                            price: item.price
                        }
                    })
                )
            );

            return { ...newOrder, orderItems };
        });

        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}; 