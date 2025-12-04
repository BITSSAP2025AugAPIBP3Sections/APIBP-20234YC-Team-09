const axios = require('axios');

const BASE_URL = 'http://localhost:8000';

async function generateTestLogs() {
  console.log('🧪 Generating test logs for ELK Stack...\n');

  const requests = [
    { method: 'GET', url: '/api/products', desc: 'Fetch all products' },
    { method: 'GET', url: '/api/products/673b825e0d54eec5ba60ba01', desc: 'Fetch single product' },
    { method: 'GET', url: '/api/search?q=laptop', desc: 'Search for laptops' },
    { method: 'GET', url: '/api/products/category/Laptops', desc: 'Get laptop category' },
    { method: 'GET', url: '/api-docs', desc: 'Access API docs' },
    { method: 'GET', url: '/api/products/invalid-id', desc: 'Test 404 error' },
    { method: 'GET', url: '/api/nonexistent', desc: 'Test another error' },
  ];

  for (const req of requests) {
    try {
      console.log(`📤 ${req.method} ${req.url} - ${req.desc}`);
      const response = await axios({
        method: req.method,
        url: BASE_URL + req.url,
        validateStatus: () => true // Accept any status code
      });
      console.log(`   ✅ Status: ${response.status}\n`);
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }

  console.log('✨ Test log generation complete!');
  console.log('\n📊 Check your logs:');
  console.log('   1. Console: Check logs/application.log file');
  console.log('   2. Kibana: http://localhost:5601 (wait 30-60 seconds for logs to appear)');
  console.log('\n💡 Next steps:');
  console.log('   - Create index pattern in Kibana: fusion-logs-*');
  console.log('   - Go to Discover tab to see all logs');
}

generateTestLogs().catch(console.error);
