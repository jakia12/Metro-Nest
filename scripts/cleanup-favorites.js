// Script to clean up old favorites collection and indexes
// Run this once to fix the duplicate key error

import mongoose from 'mongoose';
import connectDB from '../database/connect.js';

async function cleanupFavorites() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    const db = mongoose.connection.db;
    const collection = db.collection('favorites');
    
    console.log('Checking existing indexes...');
    const indexes = await collection.indexes();
    console.log('Current indexes:', JSON.stringify(indexes, null, 2));
    
    // Drop the old index if it exists
    try {
      console.log('Attempting to drop old index: user_1_property_1');
      await collection.dropIndex('user_1_property_1');
      console.log('✓ Old index dropped successfully');
    } catch (error) {
      if (error.code === 27) {
        console.log('Old index does not exist (already dropped)');
      } else {
        console.log('Error dropping old index:', error.message);
      }
    }
    
    // Delete all documents with null userId or propertyId
    console.log('Removing invalid documents...');
    const deleteResult = await collection.deleteMany({
      $or: [
        { userId: null },
        { propertyId: null },
        { user: { $exists: true } },
        { property: { $exists: true } }
      ]
    });
    console.log(`✓ Deleted ${deleteResult.deletedCount} invalid documents`);
    
    // Create the new index
    console.log('Creating new index: userId_1_propertyId_1');
    await collection.createIndex(
      { userId: 1, propertyId: 1 },
      { unique: true, name: 'userId_1_propertyId_1' }
    );
    console.log('✓ New index created successfully');
    
    // Show final indexes
    const finalIndexes = await collection.indexes();
    console.log('\nFinal indexes:', JSON.stringify(finalIndexes, null, 2));
    
    console.log('\n✅ Cleanup completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

cleanupFavorites();
