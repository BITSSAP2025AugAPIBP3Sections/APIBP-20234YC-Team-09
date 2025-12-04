/**
 * Selenium Grid Configuration
 * Configuration for running tests on Selenium Grid with Docker
 */

module.exports = {
  // Base URL for the application
  baseUrl: process.env.TEST_URL || 'http://host.docker.internal:8000',
  
  // Selenium Grid Hub URL
  gridHubUrl: 'http://localhost:4444',
  
  // Browser configurations for parallel execution
  browsers: [
    {
      name: 'chrome',
      displayName: 'Google Chrome',
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: [
            '--disable-gpu',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-software-rasterizer',
            '--window-size=1920,1080',
            '--remote-debugging-port=9222'
          ]
        }
      }
    },
    {
      name: 'firefox',
      displayName: 'Mozilla Firefox',
      capabilities: {
        browserName: 'firefox',
        'moz:firefoxOptions': {
          args: [],
          prefs: {
            'browser.privatebrowsing.autostart': false
          }
        }
      }
    },
    {
      name: 'edge',
      displayName: 'Microsoft Edge',
      capabilities: {
        browserName: 'MicrosoftEdge',
        'ms:edgeOptions': {
          args: [
            '--disable-gpu',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-software-rasterizer',
            '--window-size=1920,1080',
            '--remote-debugging-port=9223'
          ]
        }
      }
    }
  ],
  
  // Timeouts (reduced for faster execution)
  timeouts: {
    implicit: 5000,       // 5 seconds (reduced from 10)
    pageLoad: 20000,      // 20 seconds (reduced from 30)
    script: 20000,        // 20 seconds (reduced from 30)
    elementWait: 8000     // 8 seconds (reduced from 10)
  },
  
  // Reduced delays for faster execution
  fastMode: {
    startupDelay: 500,    // 0.5 second (reduced from 1)
    stepDelay: 800,       // 0.8 second (reduced from 1.5)
    navigationDelay: 1000, // 1 second (reduced from 1.5)
    finalDelay: 2000      // 2 seconds (reduced from 3)
  },
  
  // Screenshots directory
  screenshotsDir: './selenium-tests/screenshots',
  
  // Parallel execution settings
  parallel: {
    maxConcurrency: 3,    // Run all 3 browsers simultaneously
    retries: 1            // Retry once on failure
  },
  
  // Test data
  testUser: {
    name: 'Grid Test User',
    email: `gridtest.${Date.now()}@example.com`,
    password: 'GridTest@123'
  }
};