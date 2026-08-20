import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function wipeData() {
  console.log('Wiping Categories and Courses to fix unique constraints...');
  try {
    // TRUNCATE CASCADE will delete all rows from Categories and Courses, 
    // and also automatically delete related rows in Sections, Payments, etc.
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Categories" CASCADE;`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Courses" CASCADE;`);
    console.log('✅ All Categories, Courses, and their related data have been successfully deleted!');
  } catch (error) {
    console.error('❌ Error wiping data:', error);
    process.exit(1);
  }
}

wipeData().finally(() => prisma.$disconnect());
