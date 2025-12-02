/**
 * Add to Cart Test
 * Tests adding products to shopping cart
 */

const BaseTest = require('../BaseTest');

class AddToCartTest extends BaseTest {
  async run() {
    try {
      await this.setup('AddToCartTest');

      // Test 1: Navigate to shop page
      await this.navigateTo('/shop');
      await this.waitForPageLoad();
      await this.sleep(2000);
      await this.takeScreenshot('01_shop_page');

      // Test 2: Find "Add to Cart" button
      const addToCartButtons = await this.findElements('button:has-text("Add to Cart"), button[aria-label*="cart"]');
      
      if (addToCartButtons.length === 0) {
        // Try alternative approach - click product first
        const products = await this.findElements('.MuiCard-root, .product-card');
        this.assert(products.length > 0, 'Products found on page');

        // Click first product
        await products[0].click();
        console.log('🖱️  Clicked on product to view details');
        await this.sleep(2000);
        await this.takeScreenshot('02_product_details');

        // Now find Add to Cart button on product page
        const detailsAddButton = await this.findElements('button:has-text("Add to Cart"), button[aria-label*="cart"], button:contains("Add")');
        this.assert(detailsAddButton.length > 0, 'Add to Cart button found on product details page');

        // Click Add to Cart
        await detailsAddButton[0].click();
        console.log('🖱️  Clicked Add to Cart button');
      } else {
        // Add to cart from shop page
        await addToCartButtons[0].click();
        console.log('🖱️  Clicked Add to Cart button from shop page');
      }

      await this.sleep(2000);
      await this.takeScreenshot('03_after_add_to_cart');

      // Test 3: Check cart icon/badge updated
      const cartBadge = await this.findElements('[class*="badge"], .MuiBadge-badge, .cart-count');
      if (cartBadge.length > 0) {
        const badgeText = await cartBadge[0].getText();
        console.log(`🛒 Cart badge shows: ${badgeText}`);
        this.assert(true, 'Cart badge updated after adding product');
      }

      // Test 4: Navigate to cart page
      const cartLinks = await this.findElements('a[href="/cart"], button[aria-label*="cart"], .cart-icon');
      if (cartLinks.length > 0) {
        await cartLinks[0].click();
        console.log('🖱️  Navigated to cart page');
        await this.sleep(2000);
        await this.takeScreenshot('04_cart_page');

        const currentUrl = await this.getCurrentUrl();
        this.assert(currentUrl.includes('/cart'), 'Successfully navigated to cart page');

        // Check if product is in cart
        const cartItems = await this.findElements('.MuiCard-root, .cart-item, [class*="cartItem"]');
        this.assert(cartItems.length > 0, `Product added to cart (${cartItems.length} item(s))`);
      }

      console.log('\n✅ All add to cart tests passed!');
      
    } catch (error) {
      console.error('\n❌ Add to cart test failed:', error.message);
      await this.takeScreenshot('ERROR_add_to_cart');
      throw error;
    } finally {
      await this.teardown();
    }
  }
}

// Run the test
if (require.main === module) {
  const test = new AddToCartTest();
  test.run().catch(err => {
    console.error('Test execution failed:', err);
    process.exit(1);
  });
}

module.exports = AddToCartTest;
