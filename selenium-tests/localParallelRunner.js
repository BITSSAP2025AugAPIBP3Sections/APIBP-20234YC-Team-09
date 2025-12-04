/**
 * Local Parallel Test Runner
 * Runs tests in parallel on local Windows browsers (visible on screen)
 */

const path = require('path');
const { spawn } = require('child_process');

class LocalParallelRunner {
  constructor() {
    this.browsers = [
      { name: 'chrome', command: 'npm', args: ['run', 'selenium:chrome:fast'] },
      { name: 'firefox', command: 'npm', args: ['run', 'selenium:firefox:fast'] },
      { name: 'edge', command: 'npm', args: ['run', 'selenium:edge:fast'] }
    ];
    this.processes = [];
    this.results = [];
  }

  async runParallel() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🖥️  LOCAL PARALLEL BROWSER TESTING - VISIBLE ON SCREEN!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`🎯 Testing on ${this.browsers.length} browsers simultaneously`);
    console.log(`🌐 Application: http://localhost:8000`);
    console.log('');
    console.log('👀 WATCH: All browsers will open on your Windows desktop!');
    console.log('');

    const startTime = Date.now();

    // Start all browser tests in parallel
    const promises = this.browsers.map(browser => this.runBrowserTest(browser));

    try {
      console.log('🚀 Starting parallel execution...\n');
      
      // Wait for all tests to complete
      const results = await Promise.all(promises);
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      
      // Display results
      this.displayResults(results, duration);
      
    } catch (error) {
      console.error('❌ Parallel test execution failed:', error);
      process.exit(1);
    }
  }

  runBrowserTest(browser) {
    return new Promise((resolve, reject) => {
      console.log(`🚀 [${browser.name.toUpperCase()}] Starting browser test...`);
      
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
        // Real-time output
        const lines = data.toString().split('\n').filter(line => line.trim());
        lines.forEach(line => {
          if (line.includes('✅') || line.includes('📍') || line.includes('🎉') || line.includes('📸')) {
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
          console.log(`✅ [${browser.name.toUpperCase()}] Completed successfully in ${duration}s\n`);
          resolve({
            browser: browser.name,
            status: 'passed',
            duration: duration,
            output: stdout
          });
        } else {
          console.log(`❌ [${browser.name.toUpperCase()}] Failed with exit code ${code}\n`);
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
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📊 LOCAL PARALLEL TEST RESULTS');
    console.log('═══════════════════════════════════════════════════════════');
    
    let passed = 0;
    let failed = 0;
    
    results.forEach(result => {
      if (result.status === 'passed') {
        console.log(`✅ ${result.browser.toUpperCase().padEnd(10)} - PASSED (${result.duration}s)`);
        passed++;
      } else {
        console.log(`❌ ${result.browser.toUpperCase().padEnd(10)} - FAILED: ${result.error}`);
        failed++;
      }
    });
    
    console.log('');
    console.log(`📈 Summary: ${passed} passed, ${failed} failed`);
    console.log(`⏱️  Total parallel time: ${totalDuration} seconds`);
    console.log(`🖥️  All browsers were visible on your Windows desktop!`);
    console.log('');
    
    if (failed > 0) {
      console.log('💡 Check screenshots in selenium-tests/screenshots/');
      process.exit(1);
    } else {
      console.log('🎉 All local parallel tests passed!');
      console.log('🚀 Perfect for live presentation - browsers opened visibly!');
    }
  }
}

// Run if called directly
if (require.main === module) {
  const runner = new LocalParallelRunner();
  runner.runParallel().catch(console.error);
}

module.exports = LocalParallelRunner;