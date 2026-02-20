const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const connectToMongoDB = require('./mongoDb/mongoDbConnection');
const indexRoutes = require('./routes/index');

connectToMongoDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => res.send('Server is running!'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Routes
app.use('/api', indexRoutes);