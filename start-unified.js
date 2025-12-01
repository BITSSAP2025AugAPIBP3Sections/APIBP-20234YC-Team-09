#!/usr/bin/env node
/**
 * Unified Startup Script for Fusion Electronics
 * Runs both frontend build and backend API on a single port (8000)
 */

// Load environment variables from backend/.env
require('dotenv').config({ path: require('path').join(__dirname, 'backend', '.env') });

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Fusion Electronics - Unified Startup\n');

// Check if build folder exists
const buildPath = path.join(__dirname, 'build');
const buildExists = fs.existsSync(buildPath);

if (!buildExists) {
  console.log('📦 Frontend build not found. Building React app...\n');
  try {
    execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
    console.log('\n✅ Frontend build complete!\n');
  } catch (error) {
    console.error('❌ Frontend build failed:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Frontend build found\n');
}

console.log('🎯 Starting unified server on port 8000...');
console.log('   - Frontend: http://localhost:8000');
console.log('   - API: http://localhost:8000/api');
console.log('   - Swagger: http://localhost:8000/api-docs\n');

// Start the backend server (which now serves the frontend too)
require('./backend/index.js');
