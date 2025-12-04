/**
 * Parallel E2E Test Runner
 * Runs complete user journey tests in parallel across all browsers
 */

const path = require('path');
const { spawn } = require('child_process');

class ParallelE2ERunner {
  constructor() {
    this.browsers = [
      { name: 'chrome', command: 'npm', args: ['run', 'selenium:e2e:chrome'] },
      { name: 'firefox', command: 'npm', args: ['run', 'selenium:e2e:firefox'] },
      { name: 'edge', command: 'npm', args: ['run', 'selenium:e2e:edge'] }
    ];
    this.processes = [];
    this.results = [];
  }

  async runParallel() {
    console.log('═══════════════════════════════════════════════════════════════════════');
    console.log('🛒 END-TO-END E-COMMERCE TESTING - PARALLEL EXECUTION');
    console.log('═══════════════════════════════════════════════════════════════════════');
    console.log(`🎯 Testing complete user journey on ${this.browsers.length} browsers`);
    console.log(`🌐 Application: http://localhost:8000`);
    console.log('');
    console.log('👤 USER JOURNEY:');
    console.log('   1. 🏠 Navigate to Homepage');
    console.log('   2. 📝 Register New User');
    console.log('   3. 🔐 Login with Credentials');
    console.log('   4. 🛍️  Browse Products');
    console.log('   5. 🛒 Add Product to Cart');
    console.log('   6. 👀 View Shopping Cart');
    console.log('   7. 💳 Proceed to Checkout');
    console.log('   8. ✍️  Fill Payment Details');
    console.log('   9. 🎉 Complete Purchase');
    console.log('');
    console.log('📐 WINDOW POSITIONS:');
    console.log('   🌐 Chrome: Top-left (580x500)');
    console.log('   🔷 Edge: Top-right (580x500)');
    console.log('   🦊 Firefox: Bottom-center (580x480)');
    console.log('');
    console.log('👀 WATCH: All browsers will show complete shopping journey!');
    console.log('');

    const startTime = Date.now();

    // Start all browser tests in parallel
    const promises = this.browsers.map(browser => this.runBrowserTest(browser));

    try {
      console.log('🚀 Starting parallel E2E execution...\n');
      
      // Wait for all tests to complete
      const results = await Promise.all(promises);
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      
      // Display results
      this.displayResults(results, duration);
      
    } catch (error) {
      console.error('❌ Parallel E2E test execution failed:', error);
      process.exit(1);
    }
  }

  runBrowserTest(browser) {
    return new Promise((resolve, reject) => {
      console.log(`🚀 [${browser.name.toUpperCase()}] Starting E2E user journey...`);
      
      const startTime = Date.now();
      const childProcess = spawn(browser.command, browser.args, {
        stdio: 'pipe',
        shell: true,
        cwd: process.cwd()
      });

      let stdout = '';
      let stderr = '';

      childProcess.stdout.on('data', (data) => {
        stdout += data.toString();
        // Real-time output for important steps
        const lines = data.toString().split('\n').filter(line => line.trim());
        lines.forEach(line => {
          if (line.includes('STEP') || line.includes('✅') || line.includes('🎉') || line.includes('📊')) {
            console.log(`   [${browser.name.toUpperCase()}] ${line.trim()}`);
          }
        });
      });

      childProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      childProcess.on('close', (code) => {
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        
        if (code === 0) {
          console.log(`✅ [${browser.name.toUpperCase()}] E2E Journey completed successfully in ${duration}s\n`);
          resolve({
            browser: browser.name,
            status: 'passed',
            duration: duration,
            output: stdout
          });
        } else {
          console.log(`❌ [${browser.name.toUpperCase()}] E2E Journey failed with exit code ${code}\n`);
          resolve({
            browser: browser.name,
            status: 'failed',
            duration: duration,
            error: stderr || 'Process exited with non-zero code'
          });
        }
      });

      childProcess.on('error', (error) => {
        console.error(`❌ [${browser.name.toUpperCase()}] Process error:`, error.message);
        resolve({
          browser: browser.name,
          status: 'failed',
          duration: '0',
          error: error.message
        });
      });
    });
  }

  displayResults(results, totalDuration) {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('📊 PARALLEL E2E TEST RESULTS');
    console.log('═══════════════════════════════════════════════════════════════════════');
    
    let passed = 0;
    let failed = 0;
    
    results.forEach(result => {
      if (result.status === 'passed') {
        console.log(`✅ ${result.browser.toUpperCase().padEnd(10)} - PASSED (${result.duration}s) - Complete user journey successful!`);
        passed++;
      } else {
        console.log(`❌ ${result.browser.toUpperCase().padEnd(10)} - FAILED: ${result.error}`);
        failed++;
      }
    });
    
    console.log('');
    console.log(`📈 Summary: ${passed} passed, ${failed} failed`);
    console.log(`⏱️  Total parallel time: ${totalDuration} seconds`);
    console.log(`🛒 User journeys completed: ${passed} out of ${results.length}`);
    console.log(`📸 Expected screenshots: ${passed * 12} (12 per successful journey)`);
    console.log('');
    
    if (failed > 0) {
      console.log('💡 Check screenshots in selenium-tests/screenshots/');
      console.log('🔍 Review logs above for detailed error information');
      process.exit(1);
    } else {
      console.log('🎉 All E2E user journeys completed successfully!');
      console.log('🚀 Perfect demonstration of complete e-commerce workflow!');
      console.log('');
      console.log('📋 What was tested:');
      console.log('   ✅ User Registration & Authentication');
      console.log('   ✅ Product Browsing & Selection');
      console.log('   ✅ Shopping Cart Management');
      console.log('   ✅ Checkout Process & Payment');
      console.log('   ✅ Cross-Browser Compatibility');
      console.log('   ✅ Parallel Test Execution');
    }
  }
}

// Run if called directly
if (require.main === module) {
  const runner = new ParallelE2ERunner();
  runner.runParallel().catch(console.error);
}

module.exports = ParallelE2ERunner;