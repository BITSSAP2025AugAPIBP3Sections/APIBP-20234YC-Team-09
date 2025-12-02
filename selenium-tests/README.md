# Selenium Testing for Fusion Electronics E-commerce

Complete end-to-end testing suite using Selenium WebDriver for automated browser testing.

## 📋 Prerequisites

- Node.js 18.x or higher
- Chrome browser installed
- Application running on http://localhost:8000

## 🚀 Quick Start

### 1. Install Dependencies

Dependencies are already installed. If needed:
```bash
npm install --save-dev selenium-webdriver chromedriver
```

### 2. Start Application

Make sure your application is running:
```bash
npm start
```

Application should be accessible at http://localhost:8000

### 3. Run Tests

#### Run All Tests
```bash
node selenium-tests/runAllTests.js
```

#### Run Individual Tests
```bash
# Home Page Test
node selenium-tests/tests/HomePageTest.js

# Shop Page Test
node selenium-tests/tests/ShopPageTest.js

# User Registration Test
node selenium-tests/tests/UserRegistrationTest.js

# Add to Cart Test
node selenium-tests/tests/AddToCartTest.js
```

## 📁 Test Structure

```
selenium-tests/
├── test-config.js           # Configuration (URLs, timeouts, browser settings)
├── BaseTest.js              # Base class with common test utilities
├── runAllTests.js           # Master test runner
├── tests/
│   ├── HomePageTest.js      # Home page functionality tests
│   ├── ShopPageTest.js      # Product listing page tests
│   ├── UserRegistrationTest.js  # User registration flow tests
│   └── AddToCartTest.js     # Shopping cart tests
├── screenshots/             # Auto-generated test screenshots
└── reports/                 # Test reports (future)
```

## 🧪 Available Tests

### 1. **Home Page Test** (`HomePageTest.js`)
- ✅ Page loads successfully
- ✅ Title contains "Fusion Electronics"
- ✅ Navigation bar is present
- ✅ Logo/brand link exists
- ✅ Featured products are displayed
- ✅ Shop link is accessible
- ✅ Footer is rendered

### 2. **Shop Page Test** (`ShopPageTest.js`)
- ✅ Shop page loads
- ✅ Products are displayed
- ✅ Product cards show images, titles, prices
- ✅ Click product to view details
- ✅ Navigation back to shop works
- ✅ Page scrolling works

### 3. **User Registration Test** (`UserRegistrationTest.js`)
- ✅ Registration page loads
- ✅ Form fields exist (name, email, password)
- ✅ Form can be filled
- ✅ Registration submission works
- ✅ Success message or redirect occurs

### 4. **Add to Cart Test** (`AddToCartTest.js`)
- ✅ Shop page loads
- ✅ Add to Cart button is clickable
- ✅ Product is added to cart
- ✅ Cart badge updates
- ✅ Cart page shows added product

## ⚙️ Configuration

Edit `test-config.js` to customize:

```javascript
module.exports = {
  baseUrl: 'http://localhost:8000',  // Your app URL
  browser: 'chrome',                 // Browser to use
  timeouts: {
    implicit: 10000,    // Wait for elements
    pageLoad: 30000,    // Wait for page load
    elementWait: 10000  // Wait for specific elements
  },
  chromeOptions: {
    args: [
      '--disable-gpu',
      '--no-sandbox',
      '--window-size=1920,1080'
      // Add '--headless' for headless mode
    ]
  }
};
```

### Run in Headless Mode

For CI/CD or background testing, enable headless mode in `test-config.js`:

```javascript
chromeOptions: {
  args: [
    '--headless',
    '--disable-gpu',
    '--no-sandbox'
  ]
}
```

## 📸 Screenshots

Screenshots are automatically captured during tests:
- **Success**: Captures key steps of each test
- **Failure**: Captures error state for debugging

Location: `selenium-tests/screenshots/`

Naming format: `{TestName}_{StepName}_{Timestamp}.png`

## 🔧 Troubleshooting

### Chrome Driver Issues

If you get ChromeDriver version errors:
```bash
npm install --save-dev chromedriver@latest
```

### Application Not Running

Error: "ECONNREFUSED" or "ERR_CONNECTION_REFUSED"
- **Solution**: Make sure application is running on http://localhost:8000
- Start with: `npm start`

### Tests Timing Out

- Increase timeouts in `test-config.js`
- Check if application is slow to load
- Ensure good internet connection (for loading external resources)

### Element Not Found

- Application UI might have changed
- Update selectors in test files
- Check if element is inside iframe
- Wait for dynamic content to load

## 📊 Adding New Tests

1. Create new test file in `selenium-tests/tests/`
2. Extend `BaseTest` class
3. Implement `run()` method
4. Add to `runAllTests.js`

Example:
```javascript
const BaseTest = require('../BaseTest');

class MyNewTest extends BaseTest {
  async run() {
    try {
      await this.setup('MyNewTest');
      
      // Your test logic here
      await this.navigateTo('/some-page');
      await this.click('button.my-button');
      this.assert(true, 'Test passed');
      
    } catch (error) {
      await this.takeScreenshot('ERROR');
      throw error;
    } finally {
      await this.teardown();
    }
  }
}

module.exports = MyNewTest;
```

## 🎯 Best Practices

1. **Always use try-catch-finally** for proper cleanup
2. **Take screenshots** at key steps and errors
3. **Use descriptive test names** and assertions
4. **Wait for elements** instead of hard sleeps
5. **Keep tests independent** - don't rely on previous test state
6. **Clean up test data** after tests complete

## 📈 CI/CD Integration

### Jenkins Pipeline

Add to your Jenkinsfile:
```groovy
stage('Selenium Tests') {
  steps {
    script {
      sh 'npm start &'
      sleep 10
      sh 'node selenium-tests/runAllTests.js'
    }
  }
}
```

### GitHub Actions

```yaml
- name: Run Selenium Tests
  run: |
    npm start &
    sleep 10
    node selenium-tests/runAllTests.js
```

## 📝 Test Reports

Current output: Console logs with emojis and colors

Future enhancements:
- HTML test reports
- JUnit XML reports
- Screenshot gallery
- Test execution videos

## 🛠️ Available Utilities (BaseTest)

- `navigateTo(path)` - Navigate to URL
- `click(selector)` - Click element
- `type(selector, text)` - Type into input
- `getText(selector)` - Get element text
- `waitForElement(locator)` - Wait for element
- `elementExists(selector)` - Check if element exists
- `takeScreenshot(name)` - Capture screenshot
- `scrollToElement(selector)` - Scroll to element
- `getCurrentUrl()` - Get current page URL
- `getPageTitle()` - Get page title
- `executeScript(script)` - Run JavaScript
- `assert(condition, message)` - Assertion helper

## 📚 Resources

- [Selenium WebDriver Docs](https://www.selenium.dev/documentation/webdriver/)
- [ChromeDriver Downloads](https://chromedriver.chromium.org/downloads)
- [Selenium Best Practices](https://www.selenium.dev/documentation/test_practices/)

## 🤝 Contributing

To add more test coverage:
1. Identify user flows to test
2. Create test file in `tests/` directory
3. Implement test cases
4. Add to master test runner
5. Document in this README

## 📞 Support

For issues or questions about Selenium tests:
- Check screenshots in `selenium-tests/screenshots/`
- Review console output for error details
- Verify application is running correctly
- Check Chrome/ChromeDriver compatibility

---

**Last Updated**: December 2, 2025  
**Maintained by**: Fusion Electronics Team
