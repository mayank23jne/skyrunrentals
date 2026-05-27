import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const feedbacks = await prisma.feedback.findMany();
  console.log('--- FEEDBACKS IN DATABASE ---');
  console.log(JSON.stringify(feedbacks, null, 2));
  console.log('--- COUNT:', feedbacks.length);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
