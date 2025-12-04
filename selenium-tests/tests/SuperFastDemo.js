/**
 * Super Fast Demo Test - For Live Presentations
 * Optimized for maximum visual impact with minimal time
 */

const { By } = require('selenium-webdriver');
const BaseTest = require('../BaseTest');
const config = require('../test-config');

class SuperFastDemo extends BaseTest {
  async run() {
    try {
      await this.setup('SuperFastDemo');

      console.log(`🎬 [${config.browser.toUpperCase()}] Starting SUPER FAST demo...`);

      // Step 1: Homepage (reduced timing)
      console.log(`📍 [${config.browser.toUpperCase()}] STEP 1: Homepage check...`);
      await this.navigateTo('/');
      await this.driver.wait(
        () => this.driver.executeScript('return document.readyState === "complete"'),
        10000
      );
      await this.sleep(config.presentationMode.stepDelay);
      await this.takeScreenshot('01_homepage');

      // Step 2: Quick title check
      const title = await this.driver.getTitle();
      this.assert(title.includes('Fusion'), 'Page title contains "Fusion"');
      
      // Step 3: Quick product check
      console.log(`📍 [${config.browser.toUpperCase()}] STEP 2: Product detection...`);
      await this.driver.executeScript('window.scrollTo({top: 300, behavior: "instant"})');
      await this.sleep(config.presentationMode.scrollDelay);
      
      const products = await this.driver.findElements(By.css('.MuiCard-root, .product-card, [class*="Card"]'));
      this.assert(products.length > 0, `Found ${products.length} products`);
      await this.takeScreenshot('02_products');

      // Step 4: Quick shop navigation
      console.log(`📍 [${config.browser.toUpperCase()}] STEP 3: Shop navigation...`);
      await this.navigateTo('/shop');
      await this.sleep(config.presentationMode.navigationDelay);
      await this.takeScreenshot('03_shop');

      // Step 5: Final scroll
      console.log(`📍 [${config.browser.toUpperCase()}] STEP 4: Final check...`);
      await this.driver.executeScript('window.scrollTo({top: 500, behavior: "instant"})');
      await this.sleep(config.presentationMode.scrollDelay);
      await this.takeScreenshot('04_complete');

      console.log(`🎉 [${config.browser.toUpperCase()}] SUPER FAST demo completed!`);

    } catch (error) {
      console.error(`❌ [${config.browser.toUpperCase()}] Test failed:`, error.message);
      await this.takeScreenshot('ERROR');
      throw error;
    } finally {
      await this.teardown();
    }
  }
}

// Run if called directly
if (require.main === module) {
  const test = new SuperFastDemo();
  test.run();
}

module.exports = SuperFastDemo;