/**
 * Grid Demo Test - Fast parallel execution on all browsers
 */

const GridBaseTest = require('../GridBaseTest');
const config = require('../grid-config');

class GridDemoTest extends GridBaseTest {
  async run() {
    try {
      await this.setup('GridDemo');

      console.log(`🎬 [${this.browserConfig.displayName}] Starting FAST demo...`);

      // Step 1: Homepage
      console.log(`📍 [${this.browserConfig.displayName}] STEP 1: Loading homepage...`);
      await this.navigateTo('/');
      await this.waitForPageLoad();
      await this.sleep(config.fastMode.stepDelay);
      await this.takeScreenshot('01_homepage');

      // Step 2: Title check
      console.log(`📍 [${this.browserConfig.displayName}] STEP 2: Checking title...`);
      const title = await this.getPageTitle();
      this.assert(title.includes('Fusion'), 'Page title contains "Fusion"');
      await this.sleep(config.fastMode.stepDelay);

      // Step 3: Scroll and check products
      console.log(`📍 [${this.browserConfig.displayName}] STEP 3: Checking products...`);
      await this.executeScript('window.scrollTo({top: 500, behavior: "smooth"})');
      await this.sleep(config.fastMode.stepDelay);
      
      const products = await this.findElements('.MuiCard-root, .product-card, [class*="Card"]');
      this.assert(products.length > 0, `Found ${products.length} products`);
      await this.takeScreenshot('02_products');

      // Step 4: Navigate to Shop
      console.log(`📍 [${this.browserConfig.displayName}] STEP 4: Navigating to shop...`);
      await this.navigateTo('/shop');
      await this.sleep(config.fastMode.navigationDelay);
      await this.takeScreenshot('03_shop');

      // Step 5: Scroll in shop
      console.log(`📍 [${this.browserConfig.displayName}] STEP 5: Browsing shop...`);
      await this.executeScript('window.scrollTo({top: document.body.scrollHeight / 2, behavior: "smooth"})');
      await this.sleep(config.fastMode.stepDelay);
      await this.takeScreenshot('04_shop_scrolled');

      console.log(`🎉 [${this.browserConfig.displayName}] Demo completed successfully!`);

    } catch (error) {
      console.error(`❌ [${this.browserConfig.displayName}] Test failed:`, error.message);
      await this.takeScreenshot('ERROR');
      throw error;
    } finally {
      await this.teardown();
    }
  }
}

module.exports = GridDemoTest;