const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 5000;
dotenv.config();
const connectToMongoDB = require('./mongoDb/mongoDbConnection');
const indexRoutes = require('./routes/index');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');


connectToMongoDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => res.send('Server is running!'));



// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Routes
app.use('/api', indexRoutes);