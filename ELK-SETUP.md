# ELK Stack Setup for Fusion Electronics

## 🎯 Overview
This setup includes the complete ELK Stack (Elasticsearch, Logstash, Kibana) + Filebeat for centralized logging and monitoring of your MERN application.

## 📦 Components
- **Elasticsearch** (Port 9200): Data storage and search engine
- **Logstash** (Port 5044, 5000): Log processing pipeline
- **Kibana** (Port 5601): Visualization dashboard
- **Filebeat**: Log shipper for application logs

## 🚀 Quick Start

### 1. Start ELK Stack
```bash
# Start all ELK services
docker-compose -f docker-compose-elk.yml up -d

# Check services are running
docker ps | findstr fusion

# View logs
docker-compose -f docker-compose-elk.yml logs -f
```

### 2. Wait for Services to Initialize (~2-3 minutes)
```bash
# Check Elasticsearch health
curl http://localhost:9200/_cluster/health

# Check Kibana is ready
curl http://localhost:5601/api/status
```

### 3. Start Your Application (with logging enabled)
```bash
# Restart backend to enable ELK logging
cd backend
npm start
```

### 4. Access Kibana Dashboard
Open browser: **http://localhost:5601**

## 📊 Kibana Setup (First Time)

### Create Index Pattern
1. Go to **Kibana** → **Management** → **Stack Management** → **Index Patterns**
2. Click **Create index pattern**
3. Enter pattern: `fusion-logs-*`
4. Select time field: `@timestamp`
5. Click **Create index pattern**

### View Logs
1. Go to **Discover** tab
2. Select `fusion-logs-*` index
3. You'll see all application logs with:
   - Timestamp
   - Log level (info, warn, error)
   - HTTP method and path
   - Response time
   - Status codes
   - IP addresses

## 🎨 Dashboard Visualizations

### Create Useful Visualizations:

#### 1. Request Count Over Time
- Type: Line chart
- Metric: Count
- Buckets: Date histogram (@timestamp)

#### 2. Response Time Average
- Type: Gauge
- Metric: Average of `duration`
- Filter: `log_type: api_request`

#### 3. Status Code Distribution
- Type: Pie chart
- Metric: Count
- Buckets: Terms aggregation on `statusCode`

#### 4. Error Logs
- Type: Data table
- Filter: `level: error`
- Columns: timestamp, message, path, statusCode

#### 5. Top API Endpoints
- Type: Bar chart
- Metric: Count
- Buckets: Terms aggregation on `path.keyword`

## 🔍 Sample Queries

### Find all errors
```
level: error
```

### Find slow requests (>500ms)
```
duration > 500 AND log_type: api_request
```

### Find 4xx client errors
```
statusCode >= 400 AND statusCode < 500
```

### Find 5xx server errors
```
statusCode >= 500
```

### Search specific endpoint
```
path: "/api/products"
```

## 📝 Log Format

Application logs are stored in JSON format:
```json
{
  "timestamp": "2025-12-02T10:30:45.123Z",
  "level": "info",
  "message": "GET /api/products 200 - 45.3 ms",
  "application": "fusion-electronics",
  "environment": "development",
  "method": "GET",
  "path": "/api/products",
  "statusCode": 200,
  "duration": 45.3,
  "ip": "::1"
}
```

## 🐛 Troubleshooting

### Elasticsearch won't start
```bash
# Check logs
docker logs fusion-elasticsearch

# Increase memory if needed (edit docker-compose-elk.yml)
ES_JAVA_OPTS=-Xms1g -Xmx1g
```

### No logs appearing in Kibana
```bash
# Check if logs are being written
dir logs

# Check Logstash is receiving logs
docker logs fusion-logstash

# Check Filebeat status
docker logs fusion-filebeat
```

### Kibana connection error
```bash
# Wait for Elasticsearch to be healthy
curl http://localhost:9200/_cluster/health

# Restart Kibana
docker restart fusion-kibana
```

## 🎯 Presentation Demo Flow

### 1. Show Docker Services
```bash
docker ps | findstr fusion
```

### 2. Show Live Logs in Kibana
- Open http://localhost:5601
- Navigate to Discover
- Filter by last 15 minutes

### 3. Generate Some Traffic
```bash
# Make API requests
curl http://localhost:8000/api/products
curl http://localhost:8000/api/products/673b825e0d54eec5ba60ba01
```

### 4. Show Real-Time Updates
- Refresh Kibana Discover view
- Show the new requests appearing

### 5. Demo Visualizations
- Show request count chart
- Show response time metrics
- Show status code distribution

### 6. Demo Error Tracking
- Trigger an error (wrong endpoint)
```bash
curl http://localhost:8000/api/invalid-endpoint
```
- Filter for errors in Kibana
- Show error details

## 📸 Screenshots to Capture

1. Docker containers running (all ELK services)
2. Kibana Discover view with live logs
3. Request count dashboard
4. Response time metrics
5. Error log details
6. Custom dashboard with multiple visualizations

## 🚦 Service Status

Check all services:
```bash
# Elasticsearch
curl http://localhost:9200

# Kibana
curl http://localhost:5601/api/status

# Logstash
curl http://localhost:9600
```

## 🛑 Stop Services

```bash
# Stop all services
docker-compose -f docker-compose-elk.yml down

# Stop and remove volumes (clean slate)
docker-compose -f docker-compose-elk.yml down -v
```

## 💰 AWS Deployment (Using Your Credits)

If you want to deploy ELK on AWS:

### Option 1: Amazon Elasticsearch Service (Easiest)
- Managed Elasticsearch + Kibana
- No server management
- ~ $50-100/month (free tier available)

### Option 2: EC2 with Docker (Most Control)
- Launch t3.large or t3.xlarge EC2 instance
- Install Docker and Docker Compose
- Deploy same docker-compose-elk.yml
- ~ $30-70/month

### Quick AWS Setup:
```bash
# SSH to EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Clone your repo
git clone <your-repo>
cd MERN-Stack-Ecommerce-App

# Start ELK
docker-compose -f docker-compose-elk.yml up -d
```

## 🎓 Presentation Tips

1. **Show the architecture**: Explain how logs flow:
   - Application → Logger → File
   - Filebeat → Logstash → Elasticsearch
   - Kibana visualizes from Elasticsearch

2. **Demonstrate real-time**: Make API requests and show logs appearing instantly

3. **Show filtering**: Demonstrate complex queries and filtering

4. **Explain benefits**: 
   - Centralized logging
   - Real-time monitoring
   - Error tracking
   - Performance analysis
   - Production debugging

5. **Compare**: Show logs in console vs. Kibana dashboard

## 📚 Additional Resources

- [Elasticsearch Docs](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
- [Kibana Guide](https://www.elastic.co/guide/en/kibana/current/index.html)
- [Logstash Documentation](https://www.elastic.co/guide/en/logstash/current/index.html)

---

**Created by**: Fusion Electronics DevOps Team
**Last Updated**: December 2, 2025
