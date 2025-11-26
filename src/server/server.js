const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { pool } = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const itemRoutes = require('./routes/itemRoutes');
const userRoutes = require('./routes/userRoutes');
const claimRoutes = require('./routes/claimRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(process.env.UPLOAD_PATH || './uploads'));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({
      success: true,
      message: 'Server is healthy',
      database: 'Connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Server is unhealthy',
      database: 'Disconnected',
      error: error.message,
    });
  }
});

// API Routes
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/admin', adminRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to FLIRT API',
    version: '1.0.0',
    endpoints: {
      items: '/api/items',
      users: '/api/users',
      claims: '/api/claims',
      admin: '/api/admin',
      health: '/health',
    },
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   🚀 FLIRT Server Started              ║');
  console.log('╠════════════════════════════════════════╣');
  console.log(`║   Environment: ${process.env.NODE_ENV || 'development'.padEnd(22)}║`);
  console.log(`║   Port: ${PORT.toString().padEnd(31)}║`);
  console.log(`║   URL: http://localhost:${PORT.toString().padEnd(17)}║`);
  console.log('╚════════════════════════════════════════╝');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});
