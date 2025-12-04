const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function testChrome() {
  console.log('\n🧪 Testing Chrome Browser Visibility...\n');
  
  const options = new chrome.Options();
  options.addArguments(
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--start-maximized',
    '--force-device-scale-factor=1'
  );
  
  // Make sure it's NOT headless
  options.excludeSwitches('headless');
  
  console.log('🚀 Opening Chrome...');
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  
  console.log('✅ Chrome driver created!');
  
  // Maximize and bring to front
  await driver.manage().window().maximize();
  console.log('✅ Window maximized!');
  
  // Wait 2 seconds for Chrome to appear
  console.log('\n⏳ Waiting 2 seconds...');
  await driver.sleep(2000);
  
  // Navigate to Google
  console.log('🌐 Loading Google.com...');
  await driver.get('https://www.google.com');
  console.log('✅ Page loaded!');
  
  // Get window handles to ensure it's in focus
  const handles = await driver.getAllWindowHandles();
  console.log(`📊 Window handles: ${handles.length}`);
  
  console.log('\n👀 LOOK AT YOUR SCREEN NOW!');
  console.log('⏰ Chrome will stay open for 10 seconds...\n');
  
  for (let i = 10; i > 0; i--) {
    console.log(`   ${i}...`);
    await driver.sleep(1000);
  }
  
  console.log('\n🔴 Closing Chrome...');
  await driver.quit();
  console.log('✅ Test completed!\n');
}

testChrome().catch(err => {
  console.error('\n❌ Error:', err.message);
  console.error(err);
  process.exit(1);
});
