const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function createSeedData() {
  // Clear existing data
  await prisma.comment.deleteMany();
  await prisma.category.deleteMany();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();

  // Create 10 users with the "AUTHOR" role
  for (let i = 0; i < 10; i++) {
    const hashedPassword = await bcrypt.hash('omartahri2002', 10);
    const user = await prisma.user.create({
      data: {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: hashedPassword ,
        verified: "ACCEPTED"
      },
    });
    console.log('Created user:', user);
  }
  const hashedPassword = await bcrypt.hash('12345', 10);
  // Create 1 user with the "ADMIN" role
  const admin = await prisma.user.create({
    data: {
      name: "otari2002",
      email: "mineEmail@gmail.com",
      password: hashedPassword,
      role: 'ADMIN',
      verified: "ACCEPTED"
    },
  });
  console.log('Created admin:', admin);

  // Create 10 categories
  for (let i = 0; i < 10; i++) {
    const category = await prisma.category.create({
      data: {
        name: faker.lorem.word(),
      },
    });
    console.log('Created category:', category);
  }

  // Create 100 articles
  for (let i = 0; i < 100; i++) {
    const title = faker.lorem.sentence();
    const content = faker.lorem.paragraphs();
    const imageUrl = faker.image.url();

    const categories = await prisma.category.findMany();
    const randomCategories = faker.helpers.arrayElements(categories, faker.number.int({ min: 1, max: 4 }));

    const authors = await prisma.user.findMany();
    const author = faker.helpers.arrayElement(authors);

    const article = await prisma.article.create({
      data: {
        title: title,
        content: content,
        imageUrl: imageUrl,
        authorName: author.name,
        published: true,
        categories: {
          connect: randomCategories.map((category) => ({ name: category.name })),
        },
      },
    });
    console.log('Created article:', article);

    // Create 0 to 20 comments for each article
    const numComments = faker.number.int({ min: 0, max: 20 });
    for (let j = 0; j < numComments; j++) {
      const comment = await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          authorEmail: faker.internet.email(),
          articleId: article.id,
        },
      });
      console.log('Created comment:', comment);
    }
  }
}

createSeedData()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
