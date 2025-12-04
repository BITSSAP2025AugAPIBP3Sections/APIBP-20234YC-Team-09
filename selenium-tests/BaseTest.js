/**
 * Base Test Class
 * Provides common setup and teardown for all Selenium tests
 */

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const edge = require('selenium-webdriver/edge');
const firefox = require('selenium-webdriver/firefox');
const chromedriverPath = require('chromedriver').path;
const fs = require('fs');
const path = require('path');
const config = require('./test-config');

class BaseTest {
  constructor() {
    this.driver = null;
    this.testName = '';
  }

  /**
   * Set up the WebDriver before tests
   */
  async setup(testName = 'test') {
    this.testName = testName;
    console.log(`\n🚀 Starting test: ${testName}`);
    
    let browserName = 'Microsoft Edge';
    if (config.browser === 'chrome') browserName = 'Google Chrome';
    else if (config.browser === 'firefox') browserName = 'Mozilla Firefox';
    console.log(`⏳ Initializing ${browserName} browser...`);

    try {
      // Configure browser options based on selected browser
      let browserOptions;
      if (config.browser === 'chrome') {
        browserOptions = new chrome.Options();
        config.chromeOptions.args.forEach(arg => browserOptions.addArguments(arg));
        console.log('   📋 Chrome options configured');
      } else if (config.browser === 'firefox') {
        browserOptions = new firefox.Options();
        config.firefoxOptions.args.forEach(arg => browserOptions.addArguments(arg));
        // Set Firefox preferences
        Object.entries(config.firefoxOptions.prefs).forEach(([key, value]) => {
          browserOptions.setPreference(key, value);
        });
        console.log('   📋 Firefox options configured');
      } else {
        browserOptions = new edge.Options();
        config.edgeOptions.args.forEach(arg => browserOptions.addArguments(arg));
        console.log('   📋 Edge options configured');
      }

      // Build the driver with appropriate options
      console.log('   🔨 Building WebDriver...');
      
      let driver;
      if (config.browser === 'chrome') {
        // Chrome with explicit driver path
        const service = new chrome.ServiceBuilder(chromedriverPath);
        driver = await new Builder()
          .forBrowser('chrome')
          .setChromeOptions(browserOptions)
          .setChromeService(service)
          .build();
      } else if (config.browser === 'firefox') {
        // Firefox with auto driver management
        driver = await new Builder()
          .forBrowser('firefox')
          .setFirefoxOptions(browserOptions)
          .build();
      } else {
        // Edge
        driver = await new Builder()
          .forBrowser('MicrosoftEdge')
          .setEdgeOptions(browserOptions)
          .build();
      }
      
      this.driver = driver;
      console.log('   ✅ Driver built successfully');

      // Set timeouts
      await this.driver.manage().setTimeouts({
        implicit: config.timeouts.implicit,
        pageLoad: config.timeouts.pageLoad,
        script: config.timeouts.script
      });
      console.log('   ⏲️  Timeouts configured');

      // Set custom window size and position for each browser
      if (config.browser === 'chrome') {
        // Chrome: Top-left with margins
        await this.driver.manage().window().setRect({ width: 580, height: 500, x: 10, y: 10 });
        console.log('📍 Chrome positioned: Top-left (580x500 at 10,10)');
      } else if (config.browser === 'MicrosoftEdge') {
        // Edge: Top-right with proper spacing
        await this.driver.manage().window().setRect({ width: 580, height: 500, x: 610, y: 10 });
        console.log('📍 Edge positioned: Top-right (580x500 at 610,10)');
      } else if (config.browser === 'firefox') {
        // Firefox: Bottom-center with no overlap
        await this.driver.manage().window().setRect({ width: 580, height: 480, x: 310, y: 530 });
        console.log('📍 Firefox positioned: Bottom-center (580x480 at 310,530)');
      }

      console.log('✅ WebDriver initialized (window positioned)');
      
      // Startup delay to allow browser to fully load and be visible
      if (config.startupDelay) {
        console.log(`⏱️  Waiting ${config.startupDelay}ms for browser to fully initialize...`);
        await this.sleep(config.startupDelay);
        console.log('👀 Browser ready! Watch your screen now!');
      }
    } catch (error) {
      console.error('❌ Error during browser setup:', error.message);
      throw error;
    }
  }

  /**
   * Clean up after tests
   */
  async teardown() {
    if (this.driver) {
      await this.driver.quit();
      console.log(`✅ Test completed: ${this.testName}\n`);
    }
  }

  /**
   * Navigate to a URL
   */
  async navigateTo(path = '') {
    const url = `${config.baseUrl}${path}`;
    await this.driver.get(url);
    console.log(`📍 Navigated to: ${url}`);
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(locator, timeout = config.timeouts.elementWait) {
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }

  /**
   * Wait for element to be clickable
   */
  async waitForClickable(locator, timeout = config.timeouts.elementWait) {
    const element = await this.waitForElement(locator, timeout);
    await this.driver.wait(until.elementIsEnabled(element), timeout);
    return element;
  }

  /**
   * Find element by CSS selector
   */
  async findElement(selector) {
    return await this.driver.findElement(By.css(selector));
  }

  /**
   * Find elements by CSS selector
   */
  async findElements(selector) {
    return await this.driver.findElements(By.css(selector));
  }

  /**
   * Click on an element
   */
  async click(selector) {
    const element = await this.waitForClickable(By.css(selector));
    await element.click();
    console.log(`🖱️  Clicked: ${selector}`);
  }

  /**
   * Type text into an input field
   */
  async type(selector, text) {
    const element = await this.waitForElement(By.css(selector));
    await element.clear();
    await element.sendKeys(text);
    console.log(`⌨️  Typed into ${selector}: ${text.replace(/./g, '*')}`);
  }

  /**
   * Get text from an element
   */
  async getText(selector) {
    const element = await this.findElement(selector);
    return await element.getText();
  }

  /**
   * Check if element exists
   */
  async elementExists(selector) {
    try {
      await this.driver.findElement(By.css(selector));
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad() {
    await this.driver.wait(async () => {
      const readyState = await this.driver.executeScript('return document.readyState');
      return readyState === 'complete';
    }, config.timeouts.pageLoad);
  }

  /**
   * Take a screenshot
   */
  async takeScreenshot(name) {
    try {
      // Create screenshots directory if it doesn't exist
      if (!fs.existsSync(config.screenshotsDir)) {
        fs.mkdirSync(config.screenshotsDir, { recursive: true });
      }

      const screenshot = await this.driver.takeScreenshot();
      const filename = `${this.testName}_${name}_${Date.now()}.png`;
      const filepath = path.join(config.screenshotsDir, filename);
      
      fs.writeFileSync(filepath, screenshot, 'base64');
      console.log(`📸 Screenshot saved: ${filename}`);
      return filepath;
    } catch (error) {
      console.error('❌ Failed to take screenshot:', error.message);
    }
  }

  /**
   * Scroll to element
   */
  async scrollToElement(selector) {
    const element = await this.findElement(selector);
    await this.driver.executeScript('arguments[0].scrollIntoView({behavior: "smooth", block: "center"});', element);
  }

  /**
   * Wait for specified time (use sparingly)
   */
  async sleep(milliseconds) {
    await this.driver.sleep(milliseconds);
  }

  /**
   * Get current URL
   */
  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
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
  async executeScript(script, ...args) {
    return await this.driver.executeScript(script, ...args);
  }

  /**
   * Assert helper
   */
  assert(condition, message) {
    if (!condition) {
      throw new Error(`❌ Assertion failed: ${message}`);
    }
    console.log(`✅ ${message}`);
  }
}

module.exports = BaseTest;
