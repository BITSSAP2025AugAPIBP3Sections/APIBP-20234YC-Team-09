# 🚀 QUICK COMMAND REFERENCE - ELK + SELENIUM

## 📦 Services Status
```bash
docker ps --filter name=fusion-
```

---

## 🔥 ELK Stack Commands

### Start/Stop
```bash
npm run elk:start          # Start ELK Stack
npm run elk:stop           # Stop ELK Stack
npm run elk:restart        # Restart all services
npm run elk:status         # Check status
npm run elk:logs           # View logs
```

### Direct Docker Commands
```bash
# Start
docker-compose -f docker-compose-elk.yml up -d

# Stop
docker-compose -f docker-compose-elk.yml down

# View logs
docker logs -f fusion-elasticsearch
docker logs -f fusion-logstash
docker logs -f fusion-kibana
```

### Check Services
```bash
# Elasticsearch
curl http://localhost:9200/_cluster/health

# Kibana
curl http://localhost:5601/api/status

# Logstash
curl http://localhost:9600
```

---

## 🧪 Selenium Commands

```bash
npm run selenium           # Run all tests (~2 min)
npm run selenium:demo      # Slow demo (~45 sec)
npm run selenium:home      # Home page test
npm run selenium:shop      # Shop page test
npm run selenium:register  # Registration test
npm run selenium:cart      # Cart test
```

---

## 📊 Generate Logs

```bash
# Generate test traffic
npm run logs:generate

# Or directly
node generate-test-logs.js
```

---

## 🌐 Access URLs

- **Application**: http://localhost:8000
- **Kibana**: http://localhost:5601
- **SonarQube**: http://localhost:9000
- **Elasticsearch**: http://localhost:9200
- **Swagger Docs**: http://localhost:8000/api-docs
- **Jenkins**: http://localhost:8080 (if running)

---

## 🎯 Demo Flow for Presentation

### 1. Show All Services Running
```bash
npm run elk:status
```

### 2. Start Application
```bash
npm start
# Wait for "Server ready on port 8000"
```

### 3. Generate Logs
```bash
npm run logs:generate
```

### 4. Open Kibana
- Browser: http://localhost:5601
- Create index: `fusion-logs-*`
- Go to Discover tab

### 5. Run Selenium Demo
```bash
npm run selenium:demo
# Watch Chrome for ~45 seconds
```

---

## 🎬 Complete Presentation Order

1. **Docker Services** (30 sec)
   ```bash
   docker ps
   ```

2. **Jenkins** (1 min)
   - Open http://localhost:8080
   - Show last build (43 seconds)
   - Show test results

3. **SonarQube** (1 min)
   - Open http://localhost:9000
   - Show code quality metrics
   - Show coverage report

4. **Application** (30 sec)
   - Open http://localhost:8000
   - Show working e-commerce site

5. **Selenium** (2 min)
   ```bash
   npm run selenium:demo
   ```
   - Watch automated testing
   - Show screenshots folder

6. **ELK Stack** (2 min)
   ```bash
   npm run logs:generate
   ```
   - Open Kibana
   - Show real-time logs
   - Filter errors: `level: error`
   - Show response times

---

## 💾 Backup Commands (If Something Breaks)

### Restart Everything
```bash
# Stop all containers
docker stop $(docker ps -q)

# Start ELK
npm run elk:start

# Start app
npm start
```

### Clean Slate
```bash
# Remove all stopped containers
docker container prune -f

# Restart ELK from scratch
npm run elk:stop
npm run elk:start
```

### Check Logs for Issues
```bash
# Application logs
dir logs

# Docker logs
docker logs fusion-elasticsearch
docker logs fusion-logstash
docker logs fusion-kibana
```

---

## 📸 Screenshots to Take Now

1. `docker ps` output
2. Jenkins dashboard
3. SonarQube dashboard with metrics
4. Application homepage
5. Selenium test running (Chrome visible)
6. Kibana Discover with logs
7. Kibana with error filter
8. All services running together

---

## 🆘 Emergency Fixes

### Port 9200 already in use?
```bash
# Find process
netstat -ano | findstr :9200
# Kill it
taskkill /PID <PID> /F
```

### Docker out of memory?
- Docker Desktop → Settings → Resources
- Increase RAM to 6-8 GB

### Kibana not loading?
```bash
# Wait 3 minutes after starting
# Then restart
docker restart fusion-kibana
```

---

## ✅ Pre-Presentation Checklist

- [ ] All Docker containers running
- [ ] Application starts without errors
- [ ] Kibana accessible at :5601
- [ ] Index pattern created in Kibana
- [ ] Test logs generated and visible
- [ ] Selenium tests run successfully
- [ ] Screenshots captured
- [ ] PRESENTATION-DEMO-GUIDE.md reviewed

---

**Everything Ready!** Run `npm run elk:status` to verify all services are up! 🎉
