import mongoose from 'mongoose';

const REQUIRED_URI_MSG =
  'Set MONGODB_URI in backend/.env to your MongoDB Atlas or local Community Server connection string.';

/** Connect to a real MongoDB database (Atlas or local). No in-memory fallback. */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    console.error(`Missing MONGODB_URI. ${REQUIRED_URI_MSG}`);
    process.exit(1);
  }

  mongoose.connection.on('connected', () => {
    console.log(`MongoDB connected: ${mongoose.connection.host} / ${mongoose.connection.name}`);
  });
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    console.error('');
    console.error('Ensure one of the following is running:');
    console.error('  • MongoDB Atlas cluster (mongodb+srv://...)');
    console.error('  • Local MongoDB Community Server on mongodb://127.0.0.1:27017');
    console.error('');
    console.error(REQUIRED_URI_MSG);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
};
