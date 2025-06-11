// db/connection.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://hit98987:dgDEiUGe1o3EgTa1@cluster0.6nu2hgt.mongodb.net/users';

let isConnected = false;

const DbConnection = async (): Promise<void> => {
  if (isConnected) {
    console.log('✅ Already connected to MongoDB');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};


export default DbConnection;