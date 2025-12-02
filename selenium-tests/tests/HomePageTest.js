/**
 * Home Page Test
 * Tests the main landing page functionality
 */

const BaseTest = require('../BaseTest');

class HomePageTest extends BaseTest {
  async run() {
    try {
      await this.setup('HomePageTest');

      // Test 1: Load home page
      await this.navigateTo('/');
      await this.waitForPageLoad();
      await this.takeScreenshot('01_homepage_loaded');

      const title = await this.getPageTitle();
      this.assert(title.includes('Fusion Electronics'), 'Page title contains "Fusion Electronics"');

      // Test 2: Check navigation bar
      const navExists = await this.elementExists('nav');
      this.assert(navExists, 'Navigation bar exists');

      // Test 3: Check logo/brand
      const logoExists = await this.elementExists('.navbar-brand, [href="/"]');
      this.assert(logoExists, 'Logo/brand link exists');

      // Test 4: Check featured products section
      await this.sleep(2000); // Wait for products to load
      const products = await this.findElements('.MuiCard-root, .product-card');
      this.assert(products.length > 0, `Featured products displayed (${products.length} products)`);
      await this.takeScreenshot('02_products_displayed');

      // Test 5: Check "Shop" link in navigation
      const shopLinkExists = await this.elementExists('a[href="/shop"], button:has-text("Shop")');
      this.assert(shopLinkExists, 'Shop link exists in navigation');

      // Test 6: Scroll to footer
      await this.executeScript('window.scrollTo(0, document.body.scrollHeight)');
      await this.sleep(1000);
      await this.takeScreenshot('03_footer_visible');

      const footerExists = await this.elementExists('footer');
      this.assert(footerExists, 'Footer exists');

      console.log('\n✅ All home page tests passed!');
      
    } catch (error) {
      console.error('\n❌ Home page test failed:', error.message);
      await this.takeScreenshot('ERROR_homepage');
      throw error;
    } finally {
      await this.teardown();
    }
  }
}

// Run the test
if (require.main === module) {
  const test = new HomePageTest();
  test.run().catch(err => {
    console.error('Test execution failed:', err);
    process.exit(1);
  });
}

module.exports = HomePageTest;
