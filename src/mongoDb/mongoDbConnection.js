const mongoose = require('mongoose');

let firstConnection = true;

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    if (firstConnection) {
      console.log('MongoDB Connected Successfully');
      firstConnection = false;
    }

  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectToMongoDB;