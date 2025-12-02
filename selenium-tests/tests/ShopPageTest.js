/**
 * Shop Page Test
 * Tests the shop/products listing page
 */

const BaseTest = require('../BaseTest');

class ShopPageTest extends BaseTest {
  async run() {
    try {
      await this.setup('ShopPageTest');

      // Test 1: Navigate to shop page
      await this.navigateTo('/shop');
      await this.waitForPageLoad();
      await this.sleep(2000); // Wait for products to load
      await this.takeScreenshot('01_shop_page_loaded');

      const url = await this.getCurrentUrl();
      this.assert(url.includes('/shop'), 'Navigated to shop page');

      // Test 2: Check if products are displayed
      const products = await this.findElements('.MuiCard-root, .product-card');
      this.assert(products.length > 0, `Products displayed on shop page (${products.length} products)`);

      // Test 3: Check product cards have required elements
      if (products.length > 0) {
        const firstProduct = products[0];
        
        // Check for product image
        const images = await firstProduct.findElements({ css: 'img' });
        this.assert(images.length > 0, 'Product has image');

        // Check for product name/title
        const hasTitle = await firstProduct.findElements({ css: 'h5, h6, .MuiTypography-h5, .MuiTypography-h6' });
        this.assert(hasTitle.length > 0, 'Product has title');

        // Check for price
        const hasPrice = await firstProduct.findElements({ css: '[class*="price"], .MuiTypography-body1' });
        this.assert(hasPrice.length > 0, 'Product has price displayed');

        await this.takeScreenshot('02_product_details_visible');
      }

      // Test 4: Click on first product to view details
      if (products.length > 0) {
        await this.sleep(500);
        await products[0].click();
        console.log('🖱️  Clicked on first product');
        
        await this.sleep(2000);
        await this.takeScreenshot('03_product_details_page');

        const detailsUrl = await this.getCurrentUrl();
        this.assert(detailsUrl.includes('/product/'), 'Navigated to product details page');

        // Go back to shop
        await this.driver.navigate().back();
        await this.sleep(1000);
        console.log('🔙 Navigated back to shop page');
      }

      // Test 5: Scroll through products
      await this.executeScript('window.scrollTo(0, document.body.scrollHeight / 2)');
      await this.sleep(1000);
      await this.takeScreenshot('04_scrolled_products');

      console.log('\n✅ All shop page tests passed!');
      
    } catch (error) {
      console.error('\n❌ Shop page test failed:', error.message);
      await this.takeScreenshot('ERROR_shop_page');
      throw error;
    } finally {
      await this.teardown();
    }
  }
}

// Run the test
if (require.main === module) {
  const test = new ShopPageTest();
  test.run().catch(err => {
    console.error('Test execution failed:', err);
    process.exit(1);
  });
}

module.exports = ShopPageTest;
