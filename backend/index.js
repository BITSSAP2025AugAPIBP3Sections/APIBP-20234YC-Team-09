require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const seedDB = require('./seed/productSeeds');
const syncPinecone = require('./sync/syncPinecone');
const productRoutes = require('./routes/products');
const checkoutRoutes = require('./routes/checkout');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const newsletterRoutes = require('./routes/newsletter');
const { swaggerUi, swaggerSpec, setupSwaggerUi, setupSwaggerJson } = require('./docs/swagger');
const logger = require('./logger'); // ELK logging

// Create Express App
const app = express();
const PORT = process.env.PORT || 8000;

// ELK: Log application startup
logger.info('🚀 Fusion Electronics Backend starting...', {
  port: PORT,
  nodeEnv: process.env.NODE_ENV || 'development'
});

// Database Connection + Seed + Vector Sync + Server Start
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('MongoDB Connected');

    // 1. Seed the database (only when necessary)
    const skipSeed = process.env.SKIP_SEED_ON_START === 'true';
    if (!skipSeed) {
      try {
        const forceSeed = process.env.FORCE_SEED_ON_START === 'true';
        const result = await seedDB({ force: forceSeed, skipIfExists: !forceSeed });
        if (result?.seeded) {
          console.log('🪴 Database seeded');
        } else if (result?.skipped) {
          console.log('🌱 Seed skipped (existing products retained)');
        }
      } catch (err) {
        console.error('❌ Seeding error:', err);
      }
    } else {
      console.log('🌱 SKIP_SEED_ON_START enabled. Existing products preserved.');
    }

    // 2. Sync with Pinecone (primary recommendation engine)
    try {
      await syncPinecone();
      console.log('✅ Pinecone synced');
    } catch (err) {
      console.error('❌ Pinecone sync error (continuing with fallbacks):', err);
    }

    // 3. Start Express server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server ready on port ${PORT}.`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ELK: Request logging middleware
app.use(logger.middleware);

// Setup Swagger UI with customized title
setupSwaggerJson(app); // serves /api-docs/swagger.json
setupSwaggerUi(app);

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/search', require('./routes/search'));
app.use('/api/auth', authRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Serve static frontend files (React build)
const path = require('path');
const frontendBuildPath = path.join(__dirname, '..', 'build');

// Check if build folder exists
const fs = require('fs');
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  
  // All non-API routes should serve the React app
  app.get('*', (req, res) => {
    // Exclude API and docs routes
    if (!req.path.startsWith('/api') && !req.path.startsWith('/api-docs')) {
      res.sendFile(path.join(frontendBuildPath, 'index.html'));
    }
  });
  
  console.log('🚀 Serving frontend from:', frontendBuildPath);
} else {
  // Fallback: redirect root to API docs if no frontend build exists
  app.get('/', (req, res) => {
    res.redirect('/api-docs');
  });
  console.log('⚠️  Frontend build not found. Serving API only.');
}

module.exports = app;
