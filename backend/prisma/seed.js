const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.task.deleteMany();

  // Seed tasks
  const tasks = await prisma.task.createMany({
    data: [
      {
        title: "Learn Express.js",
        description: "Study Express.js framework for building REST APIs",
        completed: true,
      },
      {
        title: "Setup Prisma ORM",
        description: "Configure Prisma with PostgreSQL database",
        completed: true,
      },
      {
        title: "Build Frontend with Quasar",
        description: "Create a responsive UI using Quasar/Vue framework",
        completed: false,
      },
      {
        title: "Deploy to Cloud",
        description: "Deploy backend to Render and frontend to Netlify",
        completed: false,
      },
      {
        title: "Write Documentation",
        description: "Document the API endpoints and project setup",
        completed: false,
      },
    ],
  });

  console.log(`Seeded ${tasks.count} tasks successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
