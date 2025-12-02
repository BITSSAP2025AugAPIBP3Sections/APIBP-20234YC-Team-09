/**
 * Selenium Test Configuration
 * Configuration settings for Selenium WebDriver tests
 */

module.exports = {
  // Base URL for the application
  baseUrl: process.env.TEST_URL || 'http://localhost:8000',
  
  // Browser configuration
  browser: 'chrome',
  
  // Timeouts (in milliseconds)
  timeouts: {
    implicit: 10000,      // 10 seconds
    pageLoad: 30000,      // 30 seconds
    script: 30000,        // 30 seconds
    elementWait: 10000    // 10 seconds
  },
  
  // Chrome options
  chromeOptions: {
    args: [
      '--disable-gpu',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1920,1080'
      // Uncomment for headless mode (no UI)
      // '--headless'
    ]
  },
  
  // Test data
  testUser: {
    name: 'Test User',
    email: `test.${Date.now()}@example.com`,
    password: 'Test@123456'
  },
  
  // Screenshots directory
  screenshotsDir: './selenium-tests/screenshots',
  
  // Reports directory
  reportsDir: './selenium-tests/reports'
};
