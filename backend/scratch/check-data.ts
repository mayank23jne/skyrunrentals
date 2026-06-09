import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const payments = await prisma.paymentDetail.findMany({ take: 5 });
  await prisma.$disconnect();
}

main().catch(console.error);
