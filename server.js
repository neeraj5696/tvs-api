require('dotenv').config();
const express = require('express');
const { connectDB } = require('./db/connection');
const { errorHandler } = require('./middleware/errorHandler');
const biostarRoutes = require('./routes/biostar');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/biostar', biostarRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'BioStar API is running' });
});

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.rocket(`BioStar API running on port ${PORT}`);
      
      logger.info('📡 API ready to handle date-based queries');
    });
  } catch (error) {
    logger.error('Failed to start server: ' + error.message);
    process.exit(1);
  }
};

startServer();