const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const states = await prisma.bookingState.findMany();
  console.log('--- BOOKING STATES ---');
  console.log(JSON.stringify(states, null, 2));
  
  const items = await prisma.bookingItem.findMany();
  console.log('--- BOOKING ITEMS ---');
  console.log(JSON.stringify(items, null, 2));

  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
