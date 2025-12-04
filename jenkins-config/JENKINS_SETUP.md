# 🚀 Jenkins Configuration for E2E Testing Pipeline

## Required Jenkins Plugins

### Essential Plugins
```bash
# Core pipeline plugins
Pipeline
Pipeline: Stage View
Pipeline: Declarative

# Testing & reporting
HTML Publisher
Test Results Analyzer
JUnit
Coverage Report

# Docker integration  
Docker Pipeline
Docker Commons

# Email notifications
Email Extension Template
Mailer

# SCM & Git
Git
GitHub
GitHub Branch Source

# Node.js support
NodeJS
```

## Jenkins Installation Commands

### Install Required Plugins via CLI
```bash
java -jar jenkins-cli.jar install-plugin pipeline-stage-view
java -jar jenkins-cli.jar install-plugin pipeline-declarative-agent-api
java -jar jenkins-cli.jar install-plugin htmlpublisher
java -jar jenkins-cli.jar install-plugin email-ext
java -jar jenkins-cli.jar install-plugin nodejs
java -jar jenkins-cli.jar install-plugin docker-workflow
java -jar jenkins-cli.jar install-plugin git
```

### Or Install via Jenkins UI
1. **Manage Jenkins** → **Manage Plugins** → **Available**
2. Search and install:
   - Pipeline
   - HTML Publisher
   - Email Extension Plugin
   - NodeJS Plugin
   - Docker Pipeline
   - Git plugin

## Global Configuration

### 1. Node.js Configuration
**Manage Jenkins** → **Global Tool Configuration** → **NodeJS**
- Name: `NodeJS-18`
- Version: `18.x` (latest LTS)
- ✅ Install automatically

### 2. Docker Configuration
**Manage Jenkins** → **System Configuration**
- ✅ Enable Docker Pipeline plugin
- Docker Host URI: `unix:///var/run/docker.sock` (Linux/Mac)
- Docker Host URI: `tcp://localhost:2376` (Windows)

### 3. Email Configuration
**Manage Jenkins** → **System Configuration** → **Email Extension**
- SMTP Server: `your-smtp-server.com`
- Default Recipients: `team@yourcompany.com`
- ✅ Use SMTP Authentication

## Pipeline Job Setup

### 1. Create New Pipeline Job
1. **New Item** → **Pipeline** → Name: `Fusion-Electronics-E2E`
2. **Pipeline** → **Definition**: `Pipeline script from SCM`
3. **SCM**: Git
4. **Repository URL**: `your-repo-url`
5. **Branch**: `*/main`
6. **Script Path**: `Jenkinsfile`

### 2. Build Triggers
- ✅ Poll SCM: `H/15 * * * *` (every 15 minutes)
- ✅ GitHub hook trigger for GITScm polling

### 3. Pipeline Configuration
- ✅ Discard old builds: Keep 20 builds
- ✅ Do not allow concurrent builds
- ✅ Build periodically: `0 2 * * 1,4` (Mon/Thu 2 AM)

## Environment Variables

### Required Environment Variables
Set in **Manage Jenkins** → **System Configuration** → **Environment Variables**:

```env
# Application
MONGO_URI=mongodb://localhost:27017/jenkins-test
JWT_SECRET=jenkins-test-secret-key

# Selenium
SELENIUM_TIMEOUT=180
E2E_BROWSERS=chrome,firefox,edge

# Email notifications
DEFAULT_RECIPIENTS=devops@yourcompany.com
```

## Security Configuration

### 1. Credentials Setup
**Manage Jenkins** → **Credentials** → **Add Credentials**

- **Docker Registry**:
  - Kind: Username with password
  - ID: `docker-registry`
  - Username: Your Docker Hub username
  - Password: Your Docker Hub token

- **Git Repository** (if private):
  - Kind: SSH Username with private key
  - ID: `github-ssh`
  - Username: git
  - Private Key: Your SSH private key

### 2. Script Approval
**Manage Jenkins** → **In-process Script Approval**
- Approve any required scripts automatically

## Pipeline Features

### ✅ Comprehensive Testing Stages
1. **Setup & Checkout**: Code retrieval and environment setup
2. **Install Dependencies**: npm install for frontend/backend
3. **Test & Build**: Unit tests, integration tests, build validation
4. **SonarQube Analysis**: Code quality analysis
5. **Start Application Services**: MongoDB + Backend + Frontend
6. **Selenium E2E Tests - Parallel**: Cross-browser E2E testing
7. **Selenium Quick Demo Tests**: Fast demo validation
8. **Build**: Cleanup and finalization

### ✅ Advanced Features
- **Parallel E2E Testing**: Chrome, Firefox, Edge simultaneously
- **Screenshot Archiving**: Automatic test evidence collection
- **Fallback Testing**: Single-browser backup if parallel fails
- **Service Management**: Automatic start/stop of test services
- **Enhanced Notifications**: Rich HTML emails with test metrics
- **Coverage Reports**: HTML coverage reports publication
- **Artifact Management**: Screenshot and log preservation

### ✅ Error Handling
- Graceful service cleanup on failure
- Fallback E2E testing strategy
- Comprehensive error reporting
- Process cleanup (Node.js, Docker containers)

## Expected Pipeline Performance

### ⏱️ Stage Timings
- **Setup & Dependencies**: ~2 minutes
- **Unit/Integration Tests**: ~3 minutes
- **SonarQube Analysis**: ~2 minutes
- **Service Startup**: ~30 seconds
- **Parallel E2E Tests**: ~8 minutes
- **Cleanup**: ~30 seconds
- **Total**: ~16 minutes

### 📊 Success Metrics
- **✅ All tests passing**: Unit + Integration + E2E
- **📸 Screenshots captured**: 36+ per successful run
- **🌐 Cross-browser validation**: Chrome, Firefox, Edge
- **📧 Email notifications**: Success/failure with metrics
- **📊 Coverage reports**: Published to Jenkins

## Troubleshooting

### Common Issues

#### 1. Selenium WebDriver Issues
```bash
# Check browser installations
which chrome
which firefox
which msedge

# Check WebDriver versions
npm list selenium-webdriver
```

#### 2. Port Conflicts
```bash
# Kill processes on common ports
sudo kill -9 $(lsof -ti:3000)  # React dev server
sudo kill -9 $(lsof -ti:5000)  # Backend server
sudo kill -9 $(lsof-ti:27017)  # MongoDB
```

#### 3. Docker Issues
```bash
# Restart Docker daemon
sudo systemctl restart docker

# Clean up containers
docker container prune -f
docker volume prune -f
```

#### 4. Node.js Memory Issues
Add to Jenkinsfile environment:
```groovy
NODE_OPTIONS = '--max-old-space-size=4096'
```

### Debug Commands

#### Pipeline Debug Mode
Add to Jenkinsfile for debugging:
```groovy
options {
    // Enable verbose logging
    ansiColor('xterm')
    buildDiscarder(logRotator(daysToKeepStr: '30'))
}
```

#### Local Testing
Test pipeline components locally:
```bash
# Test E2E locally
npm run selenium:e2e:parallel

# Test with Docker
docker-compose up selenium-grid
npm run selenium:grid:parallel
```

## Monitoring & Alerts

### 1. Build Notifications
- **Success**: Team notification with metrics
- **Failure**: Immediate alert with debugging links
- **Unstable**: Warning notification

### 2. Performance Monitoring
- Track build duration trends
- Monitor E2E test execution times
- Screenshot count validation

### 3. Quality Gates
- **Unit Test Coverage**: >80%
- **E2E Test Success**: 100%
- **SonarQube Quality Gate**: Passed
- **Cross-Browser Compatibility**: All browsers

## Maintenance

### Weekly Tasks
- [ ] Review build performance trends
- [ ] Update browser drivers if needed
- [ ] Clean up old screenshots/artifacts
- [ ] Verify email notification delivery

### Monthly Tasks  
- [ ] Update Jenkins plugins
- [ ] Review and optimize pipeline stages
- [ ] Update Node.js/browser versions
- [ ] Security patch updates

---

## 🎯 Quick Start Checklist

- [ ] Install required Jenkins plugins
- [ ] Configure Node.js global tool
- [ ] Set up environment variables
- [ ] Create pipeline job from SCM
- [ ] Configure build triggers
- [ ] Set up email notifications
- [ ] Test initial pipeline run
- [ ] Verify E2E test execution
- [ ] Validate screenshot archiving
- [ ] Confirm email notifications

**🚀 Your Jenkins pipeline is now ready for enterprise-level E2E testing!**