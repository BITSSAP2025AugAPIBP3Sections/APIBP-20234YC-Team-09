/**
 * Parallel Grid Test Runner
 * Runs tests in parallel across all browsers in Selenium Grid
 */

const GridDemoTest = require('./grid/GridDemoTest');
const config = require('./grid-config');

async function runParallelTests() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🌐 SELENIUM GRID - PARALLEL BROWSER TESTING');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`🎯 Testing on ${config.browsers.length} browsers simultaneously`);
  console.log(`🔗 Grid Hub: ${config.gridHubUrl}`);
  console.log(`🌐 Application: ${config.baseUrl}`);
  console.log('');

  // Display browser VNC URLs for watching
  console.log('👀 WATCH TESTS LIVE:');
  console.log('   🌐 Chrome:  http://localhost:7900 (password: secret)');
  console.log('   🦊 Firefox: http://localhost:7901 (password: secret)');
  console.log('   🔷 Edge:    http://localhost:7902 (password: secret)');
  console.log('   📊 Grid UI: http://localhost:4444');
  console.log('');

  const startTime = Date.now();
  const testPromises = [];

  // Create test instances for each browser
  for (const browserConfig of config.browsers) {
    const test = new GridDemoTest(browserConfig);
    testPromises.push(
      test.run().catch(error => {
        console.error(`❌ ${browserConfig.displayName} failed:`, error.message);
        return { browser: browserConfig.name, status: 'failed', error: error.message };
      }).then(result => {
        return { browser: browserConfig.name, status: result ? 'failed' : 'passed', error: result?.error };
      })
    );
  }

  console.log('🚀 Starting parallel execution...\n');

  try {
    // Wait for all tests to complete
    const results = await Promise.all(testPromises);
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    
    // Display results
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📊 PARALLEL TEST RESULTS');
    console.log('═══════════════════════════════════════════════════════════');
    
    let passed = 0;
    let failed = 0;
    
    results.forEach(result => {
      if (result.status === 'passed') {
        console.log(`✅ ${result.browser.toUpperCase().padEnd(10)} - PASSED`);
        passed++;
      } else {
        console.log(`❌ ${result.browser.toUpperCase().padEnd(10)} - FAILED: ${result.error}`);
        failed++;
      }
    });
    
    console.log('');
    console.log(`📈 Summary: ${passed} passed, ${failed} failed`);
    console.log(`⏱️  Total time: ${duration} seconds`);
    console.log(`🚀 Speed: ${config.browsers.length} browsers tested in parallel!`);
    console.log('');
    
    if (failed > 0) {
      console.log('💡 Check screenshots in selenium-tests/screenshots/');
      process.exit(1);
    } else {
      console.log('🎉 All tests passed! Parallel execution successful!');
    }
    
  } catch (error) {
    console.error('❌ Parallel test execution failed:', error);
    process.exit(1);
  }
}

// Check if this script is being run directly
if (require.main === module) {
  runParallelTests();
}

module.exports = runParallelTests;