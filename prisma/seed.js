const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');
const prisma = new PrismaClient();

async function cleanDatabase() {
    console.log('Cleaning up existing data...');
    await prisma.orderItems.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.dish.deleteMany({});
    await prisma.restaurant.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('Database cleaned');
}

async function main() {
    await cleanDatabase();

    // Create a test user
    const password = await argon2.hash('password123');
    const user = await prisma.user.create({
        data: {
            name: 'Test User',
            phone: '9876543210',
            password: password,
        },
    });

    console.log('Created test user:', user);
    console.log('Test user credentials:');
    console.log('Phone: 9876543210');
    console.log('Password: password123');

    // Create restaurants one by one to get their IDs
    const paradiseBiryani = await prisma.restaurant.create({
        data: {
            name: 'Paradise Biryani',
            address: '123 Food Street, Hitech City',
            city: 'Hyderabad',
            rating: 4,
            imageUrl: 'https://source.unsplash.com/800x600/?biryani,restaurant',
        },
    });

    const punjabGrill = await prisma.restaurant.create({
        data: {
            name: 'Punjab Grill',
            address: '456 Curry Road, Banjara Hills',
            city: 'Hyderabad',
            rating: 5,
            imageUrl: 'https://source.unsplash.com/800x600/?indian-food,restaurant',
        },
    });

    const pizzaHub = await prisma.restaurant.create({
        data: {
            name: 'Pizza Hub',
            address: '789 Italian Avenue, Jubilee Hills',
            city: 'Hyderabad',
            rating: 4,
            imageUrl: 'https://source.unsplash.com/800x600/?pizza,restaurant',
        },
    });

    // Creating dishes one by one to ensure correct IDs
    const chickenBiryani = await prisma.dish.create({
        data: {
            name: 'Chicken Biryani',
            price: 300,
            nonVeg: true,
            imageUrl: 'https://source.unsplash.com/800x600/?chicken,biryani',
            restaurantId: paradiseBiryani.id,
        },
    });

    const vegBiryani = await prisma.dish.create({
        data: {
            name: 'Veg Biryani',
            price: 250,
            nonVeg: false,
            imageUrl: 'https://source.unsplash.com/800x600/?veg,biryani',
            restaurantId: paradiseBiryani.id,
        },
    });

    const butterChicken = await prisma.dish.create({
        data: {
            name: 'Butter Chicken',
            price: 350,
            nonVeg: true,
            imageUrl: 'https://source.unsplash.com/800x600/?butter-chicken',
            restaurantId: punjabGrill.id,
        },
    });

    const paneerButterMasala = await prisma.dish.create({
        data: {
            name: 'Paneer Butter Masala',
            price: 280,
            nonVeg: false,
            imageUrl: 'https://source.unsplash.com/800x600/?paneer,curry',
            restaurantId: punjabGrill.id,
        },
    });

    const margheritaPizza = await prisma.dish.create({
        data: {
            name: 'Margherita Pizza',
            price: 400,
            nonVeg: false,
            imageUrl: 'https://source.unsplash.com/800x600/?margherita-pizza',
            restaurantId: pizzaHub.id,
        },
    });

    const chickenBBQPizza = await prisma.dish.create({
        data: {
            name: 'Chicken BBQ Pizza',
            price: 450,
            nonVeg: true,
            imageUrl: 'https://source.unsplash.com/800x600/?bbq-pizza',
            restaurantId: pizzaHub.id,
        },
    });

    // Create a sample order with actual dish IDs
    const order = await prisma.order.create({
        data: {
            userId: user.id,
            orderItems: {
                create: [
                    {
                        quantity: 2,
                        price: 300,
                        dishId: chickenBiryani.id,
                    },
                    {
                        quantity: 1,
                        price: 350,
                        dishId: butterChicken.id,
                    },
                ],
            },
        },
        include: {
            orderItems: true,
        },
    });

    console.log('Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
