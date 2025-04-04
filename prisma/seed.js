const { PrismaClient } = require("@prisma/client");
const argon2 = require("argon2");
const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log("Cleaning up existing data...");
  await prisma.orderItems.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.dish.deleteMany({});
  await prisma.restaurant.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("Database cleaned");
}

async function main() {
  await cleanDatabase();

  // Create a test user
  const password = await argon2.hash("password123");
  const user = await prisma.user.create({
    data: {
      name: "Test User",
      phone: "9876543210",
      password: password,
    },
  });

  console.log("Created test user:", user);
  console.log("Test user credentials:");
  console.log("Phone: 9876543210");
  console.log("Password: password123");

  // Create restaurants one by one to get their IDs
  const paradiseBiryani = await prisma.restaurant.create({
    data: {
      name: "Paradise Biryani",
      address: "123 Food Street, Hitech City",
      city: "Hyderabad",
      rating: 4,
      imageUrl: "https://imgstaticcontent.lbb.in/lbbnew/wp-content/uploads/2017/08/29152230/ParadiseBiryani01.jpg?fm=webp&w=750&h=500&dpr=1",
    },
  });

  const punjabGrill = await prisma.restaurant.create({
    data: {
      name: "Punjab Grill",
      address: "456 Curry Road, Banjara Hills",
      city: "Hyderabad",
      rating: 5,
      imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/13/5a/c9/punjab-grill-select-city.jpg?w=900&h=500&s=1",
    },
  });

  const pizzaHub = await prisma.restaurant.create({
    data: {
      name: "Pizza Hub",
      address: "789 Italian Avenue, Jubilee Hills",
      city: "Hyderabad",
      rating: 4,
      imageUrl: "https://pakkalokal.biz/frontend/web/upload/cover/Pizza%20Hub-1695914858.jpg",
    },
  });

  // Creating dishes one by one to ensure correct IDs
  const chickenBiryani = await prisma.dish.create({
    data: {
      name: "Chicken Biryani",
      price: 300,
      nonVeg: true,
      imageUrl:
        "https://lh3.googleusercontent.com/GnFQheuyGTwyzc9ak0ZfWXmhASjjHsHwvxknx9BSjvHioVCim2BvjmAtnW4OEth8IEihXlFEfdf58Aub7Jj3G6YRp6S2d8a_xXKch41k=w1200-rw",
      restaurantId: paradiseBiryani.id,
    },
  });

  const vegBiryani = await prisma.dish.create({
    data: {
      name: "Veg Biryani",
      price: 250,
      nonVeg: false,
      imageUrl:
        "https://www.ruchiskitchen.com/wp-content/uploads/2019/01/Shahi-Veg-Biryani-recipe-1-1.jpg.webp",
      restaurantId: paradiseBiryani.id,
    },
  });

  const butterChicken = await prisma.dish.create({
    data: {
      name: "Butter Chicken",
      price: 350,
      nonVeg: true,
      imageUrl:
        "https://www.licious.in/blog/wp-content/uploads/2020/10/butter-chicken--750x750.jpg",
      restaurantId: punjabGrill.id,
    },
  });

  const paneerButterMasala = await prisma.dish.create({
    data: {
      name: "Paneer Butter Masala",
      price: 280,
      nonVeg: false,
      imageUrl:
        "https://www.vegrecipesofindia.com/wp-content/uploads/2020/01/paneer-butter-masala-1-1152x1536.jpg",
      restaurantId: punjabGrill.id,
    },
  });

  const margheritaPizza = await prisma.dish.create({
    data: {
      name: "Margherita Pizza",
      price: 400,
      nonVeg: false,
      imageUrl:
        "https://cdn.loveandlemons.com/wp-content/uploads/2023/07/margherita-pizza-recipe-580x826.jpg",
      restaurantId: pizzaHub.id,
    },
  });

  const chickenBBQPizza = await prisma.dish.create({
    data: {
      name: "Chicken BBQ Pizza",
      price: 450,
      nonVeg: true,
      imageUrl:
        "https://www.allrecipes.com/thmb/GaPoTsU1nxkKlmrhYgVHRglGFs0=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/AR-24878-bbq-chicken-pizza-beauty-4x3-39cd80585ad04941914dca4bd82eae3d.jpg",
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

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
