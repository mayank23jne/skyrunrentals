import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const plainPassword = 'admin123';
  const hashedPassword = crypto.createHash('md5').update(plainPassword).digest('hex');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@skyrentals.com' },
    update: {},
    create: {
      firstname: 'Admin',
      lastname: 'User',
      email: 'admin@skyrentals.com',
      password: hashedPassword,
      original_password: plainPassword,
      contact_number: '1234567890',
      country: 'USA',
      state: 'NY',
      city: 'New York',
      address: '123 Admin St',
      zipcode: 10001,
      token: '',
      usertype: '0',
      status: 0,
      subscription_type: 0,
    },
  });

  console.log('Admin seeded successfully:', admin.email);

  // Create 30 dummy users for pagination testing
  for (let i = 1; i <= 30; i++) {
    await prisma.user.create({
      data: {
        firstname: `User${i}`,
        lastname: `Demo`,
        email: `user${i}@example.com`,
        password: hashedPassword,
        original_password: plainPassword,
        contact_number: `1234567${i.toString().padStart(3, '0')}`,
        country: 'USA',
        state: 'NY',
        city: 'New York',
        address: `${i} Placeholder St`,
        zipcode: 10001,
        token: '',
        usertype: '1',
        status: 0,
        subscription_type: 0,
      },
    });
  }
  console.log('30 dummy users seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
