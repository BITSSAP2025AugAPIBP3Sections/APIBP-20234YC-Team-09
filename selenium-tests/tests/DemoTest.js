/**
 * Demo Test - Slow motion version for presentation
 * Shows Selenium actions with longer delays for visibility
 */

const BaseTest = require('../BaseTest');

class DemoTest extends BaseTest {
  async run() {
    try {
      await this.setup('DemoTest');

      console.log('\n🎬 Starting DEMO test with visible delays...\n');

      // Step 1: Navigate to home page
      console.log('📍 STEP 1: Navigating to homepage...');
      console.log('   👀 WATCH: Browser is loading your website now!');
      await this.navigateTo('/');
      await this.waitForPageLoad();
      await this.sleep(1500); // 1.5 second pause
      await this.takeScreenshot('01_homepage');
      console.log('✅ Homepage loaded!\n');

      // Step 2: Check title
      console.log('📍 STEP 2: Checking page title...');
      const title = await this.getPageTitle();
      console.log(`   Found title: "${title}"`);
      this.assert(title.includes('Fusion'), 'Page title contains "Fusion"');
      await this.sleep(1000);
      console.log('✅ Title verified!\n');

      // Step 3: Scroll down
      console.log('📍 STEP 3: Scrolling down the page...');
      console.log('   👀 WATCH: Page is scrolling now!');
      await this.executeScript('window.scrollTo({top: 500, behavior: "smooth"})');
      await this.sleep(1500);
      await this.takeScreenshot('02_scrolled');
      console.log('✅ Scrolled!\n');

      // Step 4: Check products
      console.log('📍 STEP 4: Checking for products...');
      await this.sleep(1000);
      const products = await this.findElements('.MuiCard-root, .product-card, [class*="Card"]');
      console.log(`   Found ${products.length} products on page`);
      this.assert(products.length > 0, `Products displayed (${products.length} products)`);
      await this.sleep(1500);
      await this.takeScreenshot('03_products_visible');
      console.log('✅ Products verified!\n');

      // Step 5: Navigate to Shop
      console.log('📍 STEP 5: Navigating to Shop page...');
      console.log('   👀 WATCH: Navigating to /shop now!');
      await this.navigateTo('/shop');
      await this.sleep(1500);
      await this.takeScreenshot('04_shop_page');
      console.log('✅ Shop page loaded!\n');

      // Step 6: Scroll through shop
      console.log('📍 STEP 6: Scrolling through products...');
      console.log('   👀 WATCH: Scrolling down the shop page!');
      await this.executeScript('window.scrollTo({top: document.body.scrollHeight / 2, behavior: "smooth"})');
      await this.sleep(1500);
      await this.takeScreenshot('05_shop_scrolled');
      console.log('✅ Scrolled through shop!\n');

      // Step 7: Scroll to bottom
      console.log('📍 STEP 7: Scrolling to footer...');
      console.log('   👀 WATCH: Scrolling to bottom!');
      await this.executeScript('window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"})');
      await this.sleep(1500);
      await this.takeScreenshot('06_footer');
      console.log('✅ Reached footer!\n');

      console.log('═══════════════════════════════════════');
      console.log('🎉 DEMO TEST COMPLETED SUCCESSFULLY! 🎉');
      console.log('═══════════════════════════════════════\n');
      console.log('📸 Screenshots saved in: selenium-tests/screenshots/\n');
      
    } catch (error) {
      console.error('\n❌ Demo test failed:', error.message);
      await this.takeScreenshot('ERROR_demo');
      throw error;
    } finally {
      console.log('\n⏳ Browser will stay open for 3 seconds so you can see the final result...');
      await this.sleep(3000);
      console.log('Now closing browser...');
      await this.teardown();
    }
  }
}

// Run the test
if (require.main === module) {
  const test = new DemoTest();
  test.run().catch(err => {
    console.error('Test execution failed:', err);
    process.exit(1);
  });
}

module.exports = DemoTest;
