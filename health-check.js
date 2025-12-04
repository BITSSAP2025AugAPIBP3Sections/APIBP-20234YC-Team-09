#!/usr/bin/env node

/**
 * 🏥 FUSION ELECTRONICS - HEALTH CHECK SYSTEM
 * Comprehensive health monitoring for all services
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Service endpoints
const SERVICES = {
  frontend: 'http://localhost:3000',
  backend: 'http://localhost:8000/api/products',
  sonarqube: 'http://34.132.244.48:9000/api/system/ping',
  jenkins: 'http://34.45.194.215:8080/login',
  elk_elasticsearch: 'http://34.132.244.48:9200/_cluster/health',
  elk_kibana: 'http://34.132.244.48:5601/api/status'
};

class HealthChecker {
  constructor() {
    this.results = {};
    this.timestamp = new Date().toISOString();
  }

  async checkService(name, url, timeout = 5000) {
    console.log(`🔍 Checking ${name}...`);
    
    try {
      const start = Date.now();
      const response = await axios.get(url, { 
        timeout,
        validateStatus: () => true // Accept any status
      });
      
      const responseTime = Date.now() - start;
      const isHealthy = response.status >= 200 && response.status < 400;
      
      this.results[name] = {
        status: isHealthy ? 'UP' : 'DOWN',
        responseTime: `${responseTime}ms`,
        statusCode: response.status,
        url: url,
        timestamp: new Date().toISOString()
      };
      
      console.log(`${isHealthy ? '✅' : '❌'} ${name}: ${this.results[name].status} (${responseTime}ms)`);
      
    } catch (error) {
      this.results[name] = {
        status: 'DOWN',
        error: error.message,
        url: url,
        timestamp: new Date().toISOString()
      };
      
      console.log(`❌ ${name}: DOWN - ${error.message}`);
    }
  }

  async checkAll() {
    console.log('🏥 FUSION ELECTRONICS - HEALTH CHECK STARTING...');
    console.log('=' .repeat(60));
    
    // Check all services
    for (const [name, url] of Object.entries(SERVICES)) {
      await this.checkService(name, url);
    }
    
    // Generate summary
    this.generateReport();
  }

  generateReport() {
    const upServices = Object.values(this.results).filter(r => r.status === 'UP').length;
    const totalServices = Object.keys(this.results).length;
    const healthPercentage = Math.round((upServices / totalServices) * 100);
    
    console.log('\n' + '=' .repeat(60));
    console.log('📊 HEALTH CHECK SUMMARY');
    console.log('=' .repeat(60));
    console.log(`🎯 Overall Health: ${healthPercentage}% (${upServices}/${totalServices} services UP)`);
    console.log(`⏰ Check Time: ${this.timestamp}`);
    
    // Detailed results
    console.log('\n📋 DETAILED RESULTS:');
    for (const [service, result] of Object.entries(this.results)) {
      const emoji = result.status === 'UP' ? '✅' : '❌';
      const time = result.responseTime || 'N/A';
      console.log(`${emoji} ${service.padEnd(20)} ${result.status.padEnd(6)} ${time}`);
    }
    
    // Save to file for Jenkins
    const reportPath = path.join(__dirname, 'health-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: this.timestamp,
      overall: {
        health: healthPercentage,
        upServices,
        totalServices,
        status: healthPercentage >= 80 ? 'HEALTHY' : 'DEGRADED'
      },
      services: this.results
    }, null, 2));
    
    console.log(`\n💾 Report saved: ${reportPath}`);
    
    // Exit with appropriate code for Jenkins
    process.exit(healthPercentage >= 80 ? 0 : 1);
  }
}

// CLI execution
if (require.main === module) {
  const checker = new HealthChecker();
  checker.checkAll().catch(console.error);
}

module.exports = HealthChecker;