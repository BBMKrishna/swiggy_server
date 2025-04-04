const prisma = require('../prisma/client');

// Create User (Signup)
const createUser = async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                phone: req.body.phone,
                password: req.body.password, // Remember to hash password
            },
        });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Find User by Phone
const findUserByPhone = async (phone) => {
    return await prisma.user.findUnique({
        where: { phone }
    });
};

// Get all restaurants
const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await prisma.restaurant.findMany({
            include: {
                dishes: true, // Include related dishes
            },
        });
        res.json(restaurants);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Create Order with Items
const createOrder = async (req, res) => {
    try {
        const order = await prisma.order.create({
            data: {
                userId: req.user.id,
                orderItems: {
                    create: req.body.items.map(item => ({
                        quantity: item.quantity,
                        price: item.price,
                        dishId: item.dishId
                    }))
                }
            },
            include: {
                orderItems: {
                    include: {
                        dish: true
                    }
                }
            }
        });
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}; 