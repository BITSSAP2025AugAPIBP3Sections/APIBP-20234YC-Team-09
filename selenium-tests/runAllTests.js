/**
 * Master Test Runner
 * Runs all Selenium tests sequentially
 */

const HomePageTest = require('./tests/HomePageTest');
const ShopPageTest = require('./tests/ShopPageTest');
const UserRegistrationTest = require('./tests/UserRegistrationTest');
const AddToCartTest = require('./tests/AddToCartTest');

class TestRunner {
  constructor() {
    this.tests = [
      { name: 'Home Page Test', testClass: HomePageTest },
      { name: 'Shop Page Test', testClass: ShopPageTest },
      { name: 'User Registration Test', testClass: UserRegistrationTest },
      { name: 'Add to Cart Test', testClass: AddToCartTest }
    ];
    this.results = {
      passed: [],
      failed: [],
      total: 0
    };
  }

  async runAllTests() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🧪 FUSION ELECTRONICS - SELENIUM TEST SUITE');
    console.log('═══════════════════════════════════════════════════════════\n');

    const startTime = Date.now();

    for (const test of this.tests) {
      this.results.total++;
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Running: ${test.name}`);
      console.log('='.repeat(60));

      try {
        const testInstance = new test.testClass();
        await testInstance.run();
        this.results.passed.push(test.name);
        console.log(`\n✅ ${test.name} - PASSED`);
      } catch (error) {
        this.results.failed.push({ name: test.name, error: error.message });
        console.error(`\n❌ ${test.name} - FAILED`);
        console.error(`Error: ${error.message}`);
      }

      // Wait between tests
      await this.sleep(2000);
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    this.printSummary(duration);
  }

  printSummary(duration) {
    console.log('\n\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 TEST SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Total Tests: ${this.results.total}`);
    console.log(`✅ Passed: ${this.results.passed.length}`);
    console.log(`❌ Failed: ${this.results.failed.length}`);
    console.log(`⏱️  Duration: ${duration}s`);
    console.log('═══════════════════════════════════════════════════════════');

    if (this.results.passed.length > 0) {
      console.log('\n✅ Passed Tests:');
      this.results.passed.forEach((test, index) => {
        console.log(`  ${index + 1}. ${test}`);
      });
    }

    if (this.results.failed.length > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.failed.forEach((test, index) => {
        console.log(`  ${index + 1}. ${test.name}`);
        console.log(`     Error: ${test.error}`);
      });
    }

    console.log('\n═══════════════════════════════════════════════════════════\n');

    if (this.results.failed.length === 0) {
      console.log('🎉 ALL TESTS PASSED! 🎉\n');
      process.exit(0);
    } else {
      console.log('⚠️  SOME TESTS FAILED\n');
      process.exit(1);
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run all tests if this file is executed directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.runAllTests().catch(err => {
    console.error('Test runner failed:', err);
    process.exit(1);
  });
}

module.exports = TestRunner;
