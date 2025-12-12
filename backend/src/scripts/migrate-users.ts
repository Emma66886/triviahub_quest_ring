import dotenv from 'dotenv';
import connectDatabase from '../config/database';
import User from '../database/models/User';

dotenv.config();

const migrateUsers = async () => {
  try {
    await connectDatabase();

    // Update all users with old difficulty levels to new ones
    const migrationMap = {
      'FOOLS_GOLD': 'NOVICE',
      'COPPER_MINER': 'EXPLORER',
      'SILVER_SMITH': 'BUILDER',
      'GOLD_MASTER': 'MASTER'
    };

    console.log('🔄 Starting user migration...');

    for (const [oldLevel, newLevel] of Object.entries(migrationMap)) {
      const result = await User.updateMany(
        { currentLevel: oldLevel },
        { $set: { currentLevel: newLevel } }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✅ Updated ${result.modifiedCount} users from ${oldLevel} to ${newLevel}`);
      }
    }

    console.log('🎉 User migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrateUsers();
