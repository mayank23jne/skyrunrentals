import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const donations: any[] = [];
  for (let i = 1; i <= 15; i++) {
    donations.push({
      name: `Donor${i}`,
      middleName: i % 2 === 0 ? 'M' : '',
      lastName: `Test${i}`,
      streetAddress: `${i} Main St`,
      addressLine2: '',
      country: 'USA',
      state: 'CA',
      city: 'San Francisco',
      postalCode: '94105',
      email: `donor${i}@example.com`,
      phone: `555-010${i}`,
      amount: (100 + i * 10).toString(),
      response: 'SUCCESS',
      status: i % 3 === 0 ? 'Pending' : 'success',
      createdDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // Different days
    });
  }

  await prisma.covid19Donation.createMany({
    data: donations,
  });
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
