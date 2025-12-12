import dotenv from 'dotenv';
import connectDatabase from '../config/database';
import { seedDatabase } from '../utils/seed';

dotenv.config();

const runSeed = async () => {
  try {
    await connectDatabase();
    await seedDatabase();
    console.log('✅ Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

runSeed();
