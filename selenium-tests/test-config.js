/**
 * Selenium Test Configuration
 * Configuration settings for Selenium WebDriver tests
 */

module.exports = {
  // Base URL for the application
  baseUrl: process.env.TEST_URL || 'http://localhost:8000',
  
  // Browser configuration - Set to 'chrome', 'MicrosoftEdge', or 'firefox'
  browser: process.env.BROWSER || 'MicrosoftEdge',  // Default: Edge
  
  // Timeouts (in milliseconds)
  timeouts: {
    implicit: 10000,      // 10 seconds
    pageLoad: 30000,      // 30 seconds
    script: 30000,        // 30 seconds
    elementWait: 10000    // 10 seconds
  },
  
  // Chrome options - Top Left Position
  chromeOptions: {
    args: [
      '--disable-gpu',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=580,500',
      '--window-position=10,10',
      '--force-device-scale-factor=1'
      // Headless mode is DISABLED for visibility during demos/presentation
      // Add '--headless' to run without UI
    ]
  },
  
  // Edge options - Top Right Position
  edgeOptions: {
    args: [
      '--disable-gpu',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=580,500',
      '--window-position=610,10',
      '--inprivate'  // Edge's equivalent to incognito
      // Headless mode is DISABLED for visibility during demos/presentation
      // Add '--headless' to run without UI
    ]
  },
  
  // Firefox options - Bottom Center Position
  firefoxOptions: {
    args: [
      '--width=580',
      '--height=480'
    ],
    prefs: {
      'browser.privatebrowsing.autostart': false
    }
  },
  
  // Startup delay (milliseconds) - allows browser to fully initialize
  startupDelay: 1000,  // 1 second
  
  // Presentation timing options
  presentationMode: {
    stepDelay: 500,       // 0.5 second between steps
    scrollDelay: 300,     // 0.3 second for scrolling
    navigationDelay: 800, // 0.8 second for page navigation
    finalDelay: 1500      // 1.5 second final pause
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
