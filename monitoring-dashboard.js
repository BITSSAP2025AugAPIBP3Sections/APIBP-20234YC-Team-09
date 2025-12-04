#!/usr/bin/env node

/**
 * 🚀 FUSION ELECTRONICS - DEPLOYMENT MONITORING DASHBOARD
 * Real-time monitoring of all DevOps components
 */

const axios = require('axios');
const { spawn } = require('child_process');

class DevOpsMonitor {
  constructor() {
    this.services = {
      'Frontend': 'http://localhost:3000',
      'Backend API': 'http://localhost:8000/api/products',
      'Jenkins': 'http://34.45.194.215:8080/login',
      'SonarQube': 'http://34.132.244.48:9000/api/system/ping',
      'Elasticsearch': 'http://34.132.244.48:9200/_cluster/health',
      'Kibana': 'http://34.132.244.48:5601/api/status'
    };
    
    this.dockerServices = [
      'fusion-electronics',
      'fusion-production',
      'mongo-test'
    ];
  }

  async checkServiceHealth(name, url) {
    try {
      const response = await axios.get(url, { timeout: 5000 });
      const isHealthy = response.status >= 200 && response.status < 400;
      return {
        name,
        status: isHealthy ? 'UP' : 'DOWN',
        responseTime: response.config.timeout || 'N/A',
        details: `HTTP ${response.status}`
      };
    } catch (error) {
      return {
        name,
        status: 'DOWN',
        responseTime: 'N/A',
        details: error.message.split('\n')[0]
      };
    }
  }

  async checkDockerServices() {
    return new Promise((resolve) => {
      const docker = spawn('docker', ['ps', '--format', 'table {{.Names}}\\t{{.Status}}\\t{{.Ports}}']);
      let output = '';
      
      docker.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      docker.on('close', () => {
        const services = [];
        const lines = output.split('\n').filter(line => line.trim());
        
        for (const service of this.dockerServices) {
          const found = lines.some(line => line.includes(service));
          services.push({
            name: service,
            status: found ? 'RUNNING' : 'STOPPED',
            details: found ? 'Container active' : 'Container not found'
          });
        }
        
        resolve(services);
      });
    });
  }

  async generateReport() {
    console.clear();
    console.log('🚀 FUSION ELECTRONICS - DEVOPS MONITORING DASHBOARD');
    console.log('=' .repeat(70));
    console.log(`⏰ Last Update: ${new Date().toLocaleString()}`);
    console.log('=' .repeat(70));
    
    // Check all web services
    console.log('\n🌐 WEB SERVICES STATUS:');
    console.log('-' .repeat(70));
    
    const serviceChecks = Object.entries(this.services).map(([name, url]) =>
      this.checkServiceHealth(name, url)
    );
    
    const serviceResults = await Promise.all(serviceChecks);
    
    for (const result of serviceResults) {
      const emoji = result.status === 'UP' ? '✅' : '❌';
      const status = result.status.padEnd(6);
      const details = result.details.substring(0, 30);
      console.log(`${emoji} ${result.name.padEnd(15)} ${status} ${details}`);
    }
    
    // Check Docker services
    console.log('\n🐳 DOCKER SERVICES STATUS:');
    console.log('-' .repeat(70));
    
    const dockerResults = await this.checkDockerServices();
    
    for (const result of dockerResults) {
      const emoji = result.status === 'RUNNING' ? '✅' : '❌';
      const status = result.status.padEnd(8);
      console.log(`${emoji} ${result.name.padEnd(20)} ${status} ${result.details}`);
    }
    
    // Calculate overall health
    const upServices = serviceResults.filter(r => r.status === 'UP').length;
    const totalServices = serviceResults.length;
    const healthPercentage = Math.round((upServices / totalServices) * 100);
    
    const runningContainers = dockerResults.filter(r => r.status === 'RUNNING').length;
    const totalContainers = dockerResults.length;
    
    console.log('\n📊 OVERALL SYSTEM HEALTH:');
    console.log('-' .repeat(70));
    console.log(`🎯 Web Services: ${healthPercentage}% (${upServices}/${totalServices} UP)`);
    console.log(`🐳 Docker Services: ${Math.round((runningContainers/totalContainers)*100)}% (${runningContainers}/${totalContainers} RUNNING)`);
    
    const overallHealth = (healthPercentage + Math.round((runningContainers/totalContainers)*100)) / 2;
    const healthStatus = overallHealth >= 80 ? '🟢 HEALTHY' : overallHealth >= 50 ? '🟡 DEGRADED' : '🔴 CRITICAL';
    console.log(`🏥 Overall Status: ${healthStatus} (${Math.round(overallHealth)}%)`);
    
    console.log('\n💡 QUICK ACTIONS:');
    console.log('-' .repeat(70));
    console.log('🔧 Restart Services: npm run dev');
    console.log('🏥 Health Check: npm run health');
    console.log('🚀 Deploy: npm run deploy');
    console.log('📊 Jenkins: http://34.45.194.215:8080');
    console.log('🔍 SonarQube: http://34.132.244.48:9000');
    console.log('📈 ELK Stack: http://34.132.244.48:5601');
    
    console.log('=' .repeat(70));
  }

  startMonitoring(interval = 30) {
    console.log(`🔄 Starting continuous monitoring (${interval}s intervals)...`);
    console.log('Press Ctrl+C to stop monitoring\n');
    
    this.generateReport();
    
    this.monitoringInterval = setInterval(() => {
      this.generateReport();
    }, interval * 1000);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping monitoring...');
      clearInterval(this.monitoringInterval);
      process.exit(0);
    });
  }
}

// CLI execution
if (require.main === module) {
  const monitor = new DevOpsMonitor();
  
  const args = process.argv.slice(2);
  const command = args[0] || 'once';
  
  switch (command) {
    case 'continuous':
    case 'watch':
      const interval = parseInt(args[1]) || 30;
      monitor.startMonitoring(interval);
      break;
      
    case 'once':
    default:
      monitor.generateReport();
      break;
  }
}

module.exports = DevOpsMonitor;