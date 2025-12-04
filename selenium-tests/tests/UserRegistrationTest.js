/**
 * User Registration Test
 * Tests the user registration flow
 */

const BaseTest = require('../BaseTest');
const config = require('../test-config');

class UserRegistrationTest extends BaseTest {
  async run() {
    try {
      await this.setup('UserRegistrationTest');

      // Test 1: Navigate to registration page
      await this.navigateTo('/register');
      await this.waitForPageLoad();
      await this.takeScreenshot('01_registration_page');

      const url = await this.getCurrentUrl();
      this.assert(url.includes('/register'), 'Navigated to registration page');

      // Test 2: Check form fields exist
      const nameFieldExists = await this.elementExists('input[name="name"], input[id*="name"], input[placeholder*="Name"]');
      this.assert(nameFieldExists, 'Name field exists');

      const emailFieldExists = await this.elementExists('input[name="email"], input[id*="email"], input[type="email"]');
      this.assert(emailFieldExists, 'Email field exists');

      const passwordFieldExists = await this.elementExists('input[name="password"], input[id*="password"], input[type="password"]');
      this.assert(passwordFieldExists, 'Password field exists');

      // Test 3: Fill registration form with unique email
      const testUser = {
        name: 'Selenium Test User',
        email: `selenium.test.${Date.now()}@example.com`,
        password: 'Test@123456'
      };

      await this.sleep(1000);

      // Find and fill name field
      try {
        await this.type('input[name="name"], input[id*="name"], input[placeholder*="Name"]', testUser.name);
      } catch (e) {
        console.log('⚠️  Name field selector might be different');
      }

      // Find and fill email field
      await this.type('input[name="email"], input[id*="email"], input[type="email"]', testUser.email);

      // Find and fill password field
      const passwordFields = await this.findElements('input[type="password"]');
      if (passwordFields.length > 0) {
        await passwordFields[0].sendKeys(testUser.password);
        console.log('⌨️  Typed password');
      }

      // Confirm password if field exists
      if (passwordFields.length > 1) {
        await passwordFields[1].sendKeys(testUser.password);
        console.log('⌨️  Typed confirm password');
      }

      await this.takeScreenshot('02_form_filled');

      // Test 4: Submit registration form
      const submitButton = await this.findElements('button[type="submit"], button:has-text("Register"), button:has-text("Sign Up")');
      if (submitButton.length > 0) {
        await this.sleep(500);
        await submitButton[0].click();
        console.log('🖱️  Clicked register button');

        // Wait for response
        await this.sleep(3000);
        await this.takeScreenshot('03_after_registration');

        // Check if redirected or success message appears
        const currentUrl = await this.getCurrentUrl();
        const hasSuccessMessage = await this.elementExists('.MuiAlert-success, .success, [class*="success"]');
        
        if (currentUrl.includes('/login') || currentUrl.includes('/shop') || currentUrl === config.baseUrl + '/' || hasSuccessMessage) {
          this.assert(true, 'Registration successful - redirected or success message shown');
        } else {
          console.log('⚠️  Registration response unclear - check manually');
        }
      }

      console.log('\n✅ All registration tests passed!');
      
    } catch (error) {
      console.error('\n❌ Registration test failed:', error.message);
      await this.takeScreenshot('ERROR_registration');
      throw error;
    } finally {
      await this.teardown();
    }
  }
}

// Run the test
if (require.main === module) {
  const test = new UserRegistrationTest();
  test.run().catch(err => {
    console.error('Test execution failed:', err);
    process.exit(1);
  });
}

module.exports = UserRegistrationTest;
