/**
 * Grid Test Base Class
 * Base class for running tests on Selenium Grid
 */

const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');
const config = require('./grid-config');

class GridBaseTest {
  constructor(browserConfig) {
    this.driver = null;
    this.browserConfig = browserConfig;
    this.testName = '';
    this.startTime = null;
  }

  /**
   * Set up WebDriver for Grid execution
   */
  async setup(testName = 'GridTest') {
    this.testName = `${testName}_${this.browserConfig.name}`;
    this.startTime = Date.now();
    
    console.log(`\n🚀 [${this.browserConfig.displayName}] Starting: ${testName}`);
    console.log(`   🌐 Connecting to Grid: ${config.gridHubUrl}`);

    try {
      // Build driver with Grid capabilities
      this.driver = await new Builder()
        .usingServer(config.gridHubUrl)
        .withCapabilities(this.browserConfig.capabilities)
        .build();

      console.log(`   ✅ [${this.browserConfig.displayName}] Connected to Grid`);

      // Set timeouts
      await this.driver.manage().setTimeouts({
        implicit: config.timeouts.implicit,
        pageLoad: config.timeouts.pageLoad,
        script: config.timeouts.script
      });

      // Maximize window
      await this.driver.manage().window().maximize();
      console.log(`   📏 [${this.browserConfig.displayName}] Window maximized`);

      // Startup delay for visibility
      if (config.fastMode.startupDelay) {
        await this.sleep(config.fastMode.startupDelay);
      }

      console.log(`   👀 [${this.browserConfig.displayName}] Ready! Watch Grid UI!`);

    } catch (error) {
      console.error(`   ❌ [${this.browserConfig.displayName}] Setup failed:`, error.message);
      throw error;
    }
  }

  /**
   * Clean up after test
   */
  async teardown() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(1);
    
    if (this.driver) {
      // Final delay to see result
      await this.sleep(config.fastMode.finalDelay);
      await this.driver.quit();
      console.log(`   ✅ [${this.browserConfig.displayName}] Completed in ${duration}s\n`);
    }
  }

  /**
   * Navigate to a URL
   */
  async navigateTo(path = '') {
    const url = `${config.baseUrl}${path}`;
    await this.driver.get(url);
    console.log(`   📍 [${this.browserConfig.displayName}] → ${url}`);
  }

  /**
   * Sleep for specified milliseconds
   */
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad() {
    await this.driver.wait(
      () => this.driver.executeScript('return document.readyState === "complete"'),
      config.timeouts.pageLoad
    );
  }

  /**
   * Wait for element to be present
   */
  async waitForElement(selector, timeout = config.timeouts.elementWait) {
    return await this.driver.wait(
      until.elementLocated(By.css(selector)), 
      timeout
    );
  }

  /**
   * Find elements
   */
  async findElements(selector) {
    return await this.driver.findElements(By.css(selector));
  }

  /**
   * Get page title
   */
  async getPageTitle() {
    return await this.driver.getTitle();
  }

  /**
   * Execute JavaScript
   */
  async executeScript(script) {
    return await this.driver.executeScript(script);
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name) {
    try {
      const screenshot = await this.driver.takeScreenshot();
      const timestamp = Date.now();
      const filename = `${this.testName}_${name}_${timestamp}.png`;
      const filepath = path.join(__dirname, 'screenshots', filename);
      
      // Ensure directory exists
      const dir = path.dirname(filepath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filepath, screenshot, 'base64');
      console.log(`   📸 [${this.browserConfig.displayName}] Screenshot: ${filename}`);
      return filename;
    } catch (error) {
      console.error(`   📸 [${this.browserConfig.displayName}] Screenshot failed:`, error.message);
    }
  }

  /**
   * Assert condition
   */
  assert(condition, message) {
    if (!condition) {
      throw new Error(`❌ [${this.browserConfig.displayName}] Assertion failed: ${message}`);
    }
    console.log(`   ✅ [${this.browserConfig.displayName}] ${message}`);
  }
}

module.exports = GridBaseTest;