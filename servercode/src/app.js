require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser'); // ← ADD THIS
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: true,           
  credentials: true      
}));

app.use(cookieParser());  

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Rate limiting
app.use(generalLimiter);

// Routes
app.use('/', routes);
app.use('/api', routes);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;