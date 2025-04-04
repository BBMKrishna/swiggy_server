const prisma = require('../prisma/client');

// Get restaurant with dishes
const getRestaurantWithDishes = async (req, res) => {
    try {
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                dishes: true
            }
        });
        res.json(restaurant);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get user orders with details
const getUserOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user.id },
            include: {
                orderItems: {
                    include: {
                        dish: {
                            include: {
                                restaurant: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(orders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}; 