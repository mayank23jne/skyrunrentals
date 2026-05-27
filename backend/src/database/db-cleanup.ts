// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   console.log('Cleaning up invalid datetime values in rates table...');
  
//   // Update start_date column
//   const updateStartDate = await prisma.$executeRawUnsafe(
//     `UPDATE rates SET start_date = NULL WHERE start_date = '0000-00-00' OR (start_date IS NOT NULL AND (MONTH(start_date) = 0 OR DAY(start_date) = 0))`
//   );
//   console.log(`Updated ${updateStartDate} start_date values.`);

//   // Update end_date column
//   const updateEndDate = await prisma.$executeRawUnsafe(
//     `UPDATE rates SET end_date = NULL WHERE end_date = '0000-00-00' OR (end_date IS NOT NULL AND (MONTH(end_date) = 0 OR DAY(end_date) = 0))`
//   );
//   console.log(`Updated ${updateEndDate} end_date values.`);
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
