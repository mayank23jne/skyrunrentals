const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedAmenities() {
  const categories = [
    { 
      name: 'Basics', 
      items: [
        { name: 'Wifi', icon: 'wifi' },
        { name: 'TV', icon: 'tv' },
        { name: 'Heating', icon: 'thermometer' },
        { name: 'Air conditioning', icon: 'wind' }
      ] 
    },
    { 
      name: 'Bathroom', 
      items: [
        { name: 'Bathtub', icon: 'bath' },
        { name: 'Hair dryer', icon: 'wind' },
        { name: 'Cleaning products', icon: 'sparkles' },
        { name: 'Shampoo', icon: 'droplet' },
        { name: 'Conditioner', icon: 'droplet' },
        { name: 'Body soap', icon: 'droplet' },
        { name: 'Hot water', icon: 'thermometer' },
        { name: 'Shower gel', icon: 'droplet' }
      ] 
    },
    { 
      name: 'Bedroom and laundry', 
      items: [
        { name: 'Washer', icon: 'disc' },
        { name: 'Dryer', icon: 'wind' },
        { name: 'Essentials', icon: 'box' },
        { name: 'Hangers', icon: 'shirt' },
        { name: 'Bed linens', icon: 'bed' },
        { name: 'Extra pillows and blankets', icon: 'bed' },
        { name: 'Iron', icon: 'thermometer' },
        { name: 'Clothing storage', icon: 'archive' }
      ] 
    },
    { 
      name: 'Entertainment', 
      items: [
        { name: 'TV', icon: 'tv' },
        { name: 'Game console', icon: 'gamepad-2' },
        { name: 'Books and reading material', icon: 'book' }
      ] 
    },
    { 
      name: 'Family', 
      items: [
        { name: 'Crib', icon: 'baby' },
        { name: 'High chair', icon: 'armchair' },
        { name: 'Pack ’n play/Travel crib', icon: 'box' },
        { name: 'Children’s dinnerware', icon: 'utensils' },
        { name: 'Changing table', icon: 'table' }
      ] 
    },
    { 
      name: 'Heating and cooling', 
      items: [
        { name: 'Air conditioning', icon: 'wind' },
        { name: 'Indoor fireplace', icon: 'flame' },
        { name: 'Ceiling fan', icon: 'fan' },
        { name: 'Portable heater', icon: 'thermometer' }
      ] 
    },
    { 
      name: 'Home safety', 
      items: [
        { name: 'Smoke alarm', icon: 'bell-ring' },
        { name: 'Carbon monoxide alarm', icon: 'bell' },
        { name: 'Fire extinguisher', icon: 'flame' },
        { name: 'First aid kit', icon: 'cross' }
      ] 
    },
    { 
      name: 'Internet and office', 
      items: [
        { name: 'Wifi', icon: 'wifi' },
        { name: 'Dedicated workspace', icon: 'briefcase' }
      ] 
    },
    { 
      name: 'Kitchen and dining', 
      items: [
        { name: 'Kitchen', icon: 'chef-hat' },
        { name: 'Refrigerator', icon: 'box' },
        { name: 'Microwave', icon: 'box' },
        { name: 'Cooking basics', icon: 'utensils' },
        { name: 'Pots and pans', icon: 'utensils' },
        { name: 'Dishes and silverware', icon: 'utensils' },
        { name: 'Dishwasher', icon: 'box' },
        { name: 'Stove', icon: 'flame' },
        { name: 'Oven', icon: 'box' },
        { name: 'Coffee maker', icon: 'coffee' }
      ] 
    },
    { 
      name: 'Location features', 
      items: [
        { name: 'Waterfront', icon: 'waves' },
        { name: 'Beach access', icon: 'umbrella' },
        { name: 'Ski-in/Ski-out', icon: 'snowflake' },
        { name: 'Private entrance', icon: 'door-open' }
      ] 
    },
    { 
      name: 'Outdoor', 
      items: [
        { name: 'Patio or balcony', icon: 'sun' },
        { name: 'Backyard', icon: 'tree-pine' },
        { name: 'Outdoor furniture', icon: 'armchair' },
        { name: 'BBQ grill', icon: 'flame' },
        { name: 'Fire pit', icon: 'flame' }
      ] 
    },
    { 
      name: 'Parking and facilities', 
      items: [
        { name: 'Free parking on premises', icon: 'car' },
        { name: 'Free street parking', icon: 'car' },
        { name: 'EV charger', icon: 'zap' },
        { name: 'Pool', icon: 'waves' },
        { name: 'Hot tub', icon: 'droplets' },
        { name: 'Gym', icon: 'dumbbell' }
      ] 
    },
    { 
      name: 'Services', 
      items: [
        { name: 'Luggage dropoff allowed', icon: 'briefcase' },
        { name: 'Long term stays allowed', icon: 'calendar' },
        { name: 'Cleaning available during stay', icon: 'sparkles' },
        { name: 'Breakfast', icon: 'coffee' }
      ] 
    },
  ];

  for (const cat of categories) {
    // Check if category exists
    let existingCat = await prisma.amenityCategory.findFirst({ where: { name: cat.name } });
    if (!existingCat) {
      existingCat = await prisma.amenityCategory.create({
        data: { name: cat.name }
      });
      console.log('Created category: ' + cat.name);
    }

    // Add items
    for (const item of cat.items) {
      let existingItem = await prisma.amenityItem.findFirst({
        where: { name: item.name, categoryId: existingCat.id }
      });
      if (!existingItem) {
        await prisma.amenityItem.create({
          data: {
            name: item.name,
            icon: item.icon,
            categoryId: existingCat.id
          }
        });
        console.log('Created item: ' + item.name + ' in ' + cat.name);
      }
    }
  }

  console.log('Seeding completed!');
}

seedAmenities()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
