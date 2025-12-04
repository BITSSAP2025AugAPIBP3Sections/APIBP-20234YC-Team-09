/**
 * Simple diagnostic test to check if Chrome opens
 */

const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function testChrome() {
  let driver;
  
  try {
    console.log('\n🔍 Testing Chrome WebDriver...\n');
    
    console.log('Step 1: Setting up Chrome options...');
    const options = new chrome.Options();
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--window-size=1200,800');
    // Make sure it's NOT headless
    console.log('✅ Chrome options configured (NOT headless)\n');
    
    console.log('Step 2: Building WebDriver...');
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    console.log('✅ WebDriver created!\n');
    
    console.log('Maximizing window...');
    await driver.manage().window().maximize();
    console.log('✅ Window maximized!\n');
    
    console.log('Step 3: Opening Google...');
    await driver.get('https://www.google.com');
    console.log('✅ Google opened!\n');
    
    console.log('Step 4: Getting page title...');
    const title = await driver.getTitle();
    console.log(`✅ Page title: "${title}"\n`);
    
    console.log('Step 5: Waiting 10 seconds so you can see the browser...');
    console.log('👀 LOOK AT YOUR SCREEN NOW - Chrome should be visible!\n');
    await driver.sleep(10000);
    
    console.log('\n✅ TEST PASSED! Chrome opened successfully!\n');
    console.log('If you saw Chrome open and load Google, Selenium is working!\n');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED!');
    console.error('Error:', error.message);
    console.error('\nCommon issues:');
    console.error('1. Chrome not installed');
    console.error('2. ChromeDriver version mismatch');
    console.error('3. Antivirus blocking Chrome automation');
    console.error('\nTry running: npm install --save-dev chromedriver@latest\n');
  } finally {
    if (driver) {
      console.log('Closing browser...');
      await driver.quit();
      console.log('✅ Browser closed\n');
    }
  }
}

testChrome();
