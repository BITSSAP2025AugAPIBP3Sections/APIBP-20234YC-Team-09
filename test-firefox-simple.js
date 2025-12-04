const { Builder } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const geckodriverPath = require('geckodriver').path;

async function testFirefox() {
  console.log('\n🦊 Testing Mozilla Firefox...\n');
  
  try {
    const options = new firefox.Options();
    options.addArguments('--width=1920');
    options.addArguments('--height=1080');
    
    console.log('🔨 Building Firefox driver...');
    const service = new firefox.ServiceBuilder(geckodriverPath);
    
    const driver = await new Builder()
      .forBrowser('firefox')
      .setFirefoxOptions(options)
      .setFirefoxService(service)
      .build();
    
    console.log('✅ Firefox opened!');
    
    await driver.manage().window().maximize();
    console.log('✅ Window maximized!');
    
    console.log('🌐 Loading Google...');
    await driver.get('https://www.google.com');
    console.log('✅ Page loaded!');
    
    console.log('\n👀 WATCH YOUR SCREEN - Firefox should be visible!\n');
    console.log('⏰ Waiting 5 seconds...\n');
    
    for (let i = 5; i > 0; i--) {
      console.log(`   ${i}...`);
      await driver.sleep(1000);
    }
    
    console.log('\n🔴 Closing Firefox...');
    await driver.quit();
    console.log('✅ Test completed!\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testFirefox();
