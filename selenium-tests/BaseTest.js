/**
 * Base Test Class
 * Provides common setup and teardown for all Selenium tests
 */

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
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

    // Configure Chrome options
    const chromeOptions = new chrome.Options();
    config.chromeOptions.args.forEach(arg => chromeOptions.addArguments(arg));

    // Build the driver
    this.driver = await new Builder()
      .forBrowser(config.browser)
      .setChromeOptions(chromeOptions)
      .build();

    // Set timeouts
    await this.driver.manage().setTimeouts({
      implicit: config.timeouts.implicit,
      pageLoad: config.timeouts.pageLoad,
      script: config.timeouts.script
    });

    console.log('✅ WebDriver initialized');
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
