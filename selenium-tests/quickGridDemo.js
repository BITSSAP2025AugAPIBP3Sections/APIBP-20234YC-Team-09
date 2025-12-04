/**
 * Quick Grid Setup and Demo
 * Sets up Selenium Grid and runs parallel tests
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function checkDockerStatus() {
  try {
    await execPromise('docker --version');
    console.log('✅ Docker is available');
    return true;
  } catch (error) {
    console.error('❌ Docker is not available. Please start Docker Desktop.');
    return false;
  }
}

async function checkApplication() {
  try {
    const axios = require('axios');
    await axios.get('http://localhost:8000');
    console.log('✅ Application is running on port 8000');
    return true;
  } catch (error) {
    console.error('❌ Application not running on port 8000. Please start: npm start');
    return false;
  }
}

async function setupGrid() {
  console.log('🚀 Setting up Selenium Grid...');
  
  try {
    // Start Grid
    await execPromise('npm run grid:start');
    console.log('📦 Grid containers starting...');
    
    // Wait for Grid to be ready
    console.log('⏳ Waiting for Grid to initialize (30 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    // Check Grid status
    const { stdout } = await execPromise('npm run grid:status');
    console.log('📊 Grid Status:');
    console.log(stdout);
    
    return true;
  } catch (error) {
    console.error('❌ Grid setup failed:', error.message);
    return false;
  }
}

async function runDemo() {
  console.log('\n🎬 Starting PARALLEL GRID DEMO!');
  console.log('==========================================');
  
  try {
    const { stdout, stderr } = await execPromise('npm run selenium:grid');
    console.log(stdout);
    if (stderr) console.error(stderr);
    return true;
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🌐 SELENIUM GRID - QUICK SETUP & DEMO');
  console.log('======================================\n');
  
  // Check prerequisites
  const dockerOK = await checkDockerStatus();
  if (!dockerOK) {
    process.exit(1);
  }
  
  const appOK = await checkApplication();
  if (!appOK) {
    process.exit(1);
  }
  
  // Setup Grid
  const gridOK = await setupGrid();
  if (!gridOK) {
    process.exit(1);
  }
  
  console.log('\n👀 WATCH YOUR TESTS LIVE:');
  console.log('   🌐 Chrome:  http://localhost:7900 (password: secret)');
  console.log('   🦊 Firefox: http://localhost:7901 (password: secret)');
  console.log('   🔷 Edge:    http://localhost:7902 (password: secret)');
  console.log('   📊 Grid UI: http://localhost:4444');
  console.log('\n💡 Open these URLs in your browser to watch tests!\n');
  
  // Wait a moment for user to open URLs
  console.log('⏳ Starting tests in 10 seconds... (Open URLs above!)');
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // Run demo
  await runDemo();
  
  console.log('\n🎉 Demo completed! Check the URLs above to see what happened!');
  console.log('💡 To stop Grid: npm run grid:stop');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, setupGrid, runDemo };