# Jenkins Pipeline Setup Guide

## 📋 Overview

This guide explains how to set up and use the Jenkins CI/CD pipeline for the Fusion Electronics E-commerce application.

## 🎯 Pipeline Features

### Automated Stages
1. **Checkout** - Retrieves code from Git repository
2. **Environment Setup** - Configures build environment
3. **Install Dependencies** - Installs npm packages (parallel: frontend & backend)
4. **Code Quality & Security** - Linting and security audits (parallel)
5. **Unit Tests** - Runs Jest tests with coverage (parallel: frontend & backend)
6. **SonarQube Analysis** - Static code analysis and quality gates
7. **Build Application** - Creates production builds (parallel)
8. **Docker Build** - Creates Docker images (main branch only)
9. **Integration Tests** - End-to-end testing
10. **Performance Tests** - Load testing with Artillery (main branch only)
11. **Deploy to Staging** - Kubernetes deployment (main branch only)
12. **Smoke Tests** - Post-deployment validation

### Build Triggers
- **Poll SCM**: Every 2 hours
- **Scheduled Builds**: Monday and Thursday at 2 AM (minimum 2 builds per week)
- **Manual Trigger**: Available through Jenkins UI
- **Webhook Trigger**: On push to repository (if configured)

### Build Retention
- Keeps last 10 builds
- Archives artifacts for historical reference

## 🛠️ Prerequisites

### Required Jenkins Plugins
1. **Pipeline** - Pipeline functionality
2. **Git** - Git integration
3. **NodeJS** - Node.js installation
4. **Docker Pipeline** - Docker integration
5. **SonarQube Scanner** - Code quality analysis
6. **HTML Publisher** - Coverage reports
7. **JUnit** - Test results
8. **Email Extension** - Build notifications
9. **Kubernetes CLI** - Kubernetes deployment

### Required Tools in Jenkins
1. **NodeJS 18.x** - Named as "NodeJS-18" in Jenkins
2. **SonarQube Scanner** - Named as "SonarQubeScanner"
3. **Docker** - Docker CLI available on Jenkins agent
4. **kubectl** - Kubernetes CLI for deployments

## 📦 Jenkins Setup Instructions

### Step 1: Install Jenkins

**Option A: Windows**
```powershell
# Download Jenkins MSI installer from jenkins.io
# Install and start Jenkins service
```

**Option B: Docker**
```bash
docker run -d -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  --name jenkins \
  jenkins/jenkins:lts
```

**Option C: Linux**
```bash
wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt update
sudo apt install jenkins
sudo systemctl start jenkins
```

### Step 2: Access Jenkins
1. Open browser: `http://localhost:8080`
2. Get initial admin password:
   ```bash
   # Windows
   type C:\ProgramData\Jenkins\.jenkins\secrets\initialAdminPassword
   
   # Linux/Mac
   cat /var/lib/jenkins/secrets/initialAdminPassword
   
   # Docker Jenkins
   docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   ```
3. Install suggested plugins
4. Create admin user

### Step 3: Install Required Plugins
1. Go to **Manage Jenkins** → **Manage Plugins**
2. Click **Available** tab
3. Search and install:
   - Pipeline
   - Git
   - NodeJS Plugin
   - Docker Pipeline
   - SonarQube Scanner
   - HTML Publisher
   - JUnit Plugin
   - Email Extension Plugin
   - Kubernetes CLI Plugin

### Step 4: Configure Global Tools

#### NodeJS Configuration
1. Go to **Manage Jenkins** → **Global Tool Configuration**
2. Scroll to **NodeJS** section
3. Click **Add NodeJS**
4. Configure:
   - Name: `NodeJS-18`
   - Version: `NodeJS 18.x`
   - Install automatically: ✅

#### SonarQube Scanner Configuration
1. In **Global Tool Configuration**
2. Scroll to **SonarQube Scanner** section
3. Click **Add SonarQube Scanner**
4. Configure:
   - Name: `SonarQubeScanner`
   - Install automatically: ✅

### Step 5: Configure SonarQube Server
1. Go to **Manage Jenkins** → **Configure System**
2. Scroll to **SonarQube servers** section
3. Click **Add SonarQube**
4. Configure:
   - Name: `SonarQube`
   - Server URL: `http://localhost:9000` (or your SonarQube URL)
   - Server authentication token: (Generate from SonarQube)

### Step 6: Create Pipeline Job

1. **Create New Item**:
   - Click **New Item**
   - Enter name: `Fusion-Electronics-Pipeline`
   - Select **Pipeline**
   - Click **OK**

2. **Configure Pipeline**:
   - **General**:
     - Description: "CI/CD Pipeline for Fusion Electronics E-commerce Application"
     - ✅ Discard old builds (Keep last 10 builds)
   
   - **Build Triggers**:
     - ✅ Poll SCM: `H */2 * * *`
     - ✅ Build periodically: `0 2 * * 1,4`
   
   - **Pipeline**:
     - Definition: **Pipeline script from SCM**
     - SCM: **Git**
     - Repository URL: `https://github.com/BITSSAP2025AugAPIBP3Sections/APIBP-20234YC-Team-09.git`
     - Branch Specifier: `*/main`
     - Script Path: `Jenkinsfile`

3. **Save** the configuration

### Step 7: Configure Email Notifications (Optional)
1. Go to **Manage Jenkins** → **Configure System**
2. Scroll to **Extended E-mail Notification**
3. Configure SMTP server settings
4. Set default recipients

## 🚀 Running the Pipeline

### Manual Build
1. Go to pipeline job page
2. Click **Build Now**
3. View build progress in **Build History**
4. Click on build number to see details

### Automatic Builds
- Triggered every 2 hours (poll SCM)
- Scheduled Monday and Thursday at 2 AM
- Triggered on Git push (if webhook configured)

## 📊 Viewing Build Results

### Console Output
1. Click on build number
2. Click **Console Output**
3. View detailed logs

### Test Results
1. Click on build number
2. Click **Test Result**
3. View pass/fail statistics

### Coverage Reports
1. Click on build number
2. Click **Frontend Coverage Report** or **Backend Coverage Report**
3. View detailed coverage metrics

### SonarQube Results
1. Click on build number
2. Click **SonarQube**
3. View code quality metrics

## 📈 Build Artifacts

### Archived Artifacts
- Frontend build: `build/**/*`
- Backend artifacts: `backend/dist/**/*`
- Test results: `junit.xml`
- Coverage reports: `coverage/**/*`

### Accessing Artifacts
1. Click on build number
2. Click **Build Artifacts**
3. Download required files

## 🔍 Understanding Build Status

| Status | Icon | Description |
|--------|------|-------------|
| Success | ✅ | All stages passed |
| Failure | ❌ | One or more stages failed |
| Unstable | ⚠️ | Build succeeded but tests failed |
| Aborted | 🛑 | Build was manually stopped |

## 📝 Build History

### Weekly Builds Requirement
- **Minimum**: 2 builds per week (automated)
- **Scheduled**: Monday 2 AM, Thursday 2 AM
- **Additional**: Poll SCM every 2 hours
- **Manual**: Available anytime

### Build Reports
Each build generates:
1. Build number and timestamp
2. Git commit information
3. Test results summary
4. Code coverage metrics
5. SonarQube quality gate status
6. Build artifacts
7. Deployment status (if applicable)

## 🐳 Docker Integration

### Docker Images Built
- **Frontend**: `fusion-electronics-frontend:latest`
- **Backend**: `fusion-electronics-backend:latest`
- **Tagged**: Both images tagged with build number

### Docker Commands (Manual)
```bash
# View built images
docker images | grep fusion-electronics

# Run frontend container
docker run -p 3000:3000 fusion-electronics-frontend:latest

# Run backend container
docker run -p 5000:5000 fusion-electronics-backend:latest
```

## ☸️ Kubernetes Deployment

### Deployment Resources
- ConfigMap: Application configuration
- Backend Deployment: Backend pods
- Backend Service: Backend load balancer
- Frontend Deployment: Frontend pods
- Frontend Service: Frontend load balancer

### Manual Deployment
```bash
kubectl apply -f kubernetes/
kubectl get pods -n fusion-ecommerce
kubectl get services -n fusion-ecommerce
```

## 🔧 Troubleshooting

### Common Issues

**Issue 1: NodeJS not found**
- Solution: Install NodeJS plugin and configure in Global Tool Configuration

**Issue 2: Docker command not found**
- Solution: Install Docker on Jenkins agent or use Docker in Docker

**Issue 3: SonarQube analysis failed**
- Solution: Verify SonarQube server is running and credentials are correct

**Issue 4: Tests failing**
- Solution: Check console output for specific test errors

**Issue 5: Deployment failed**
- Solution: Verify Kubernetes cluster is accessible and credentials are configured

## 📞 Support

For issues or questions:
- Check Jenkins logs: `/var/log/jenkins/jenkins.log`
- View console output of failed builds
- Contact: suryansh.pandey@sap.com

## 🎓 Best Practices

1. **Always review build logs** for warnings
2. **Fix failing tests immediately** - don't let them accumulate
3. **Monitor code coverage** - maintain >80% coverage
4. **Check SonarQube reports** - address code smells
5. **Review security audit results** - update vulnerable dependencies
6. **Test deployments in staging** before production
7. **Keep Jenkins plugins updated** for security

## 📊 Metrics to Track

- Build success rate
- Average build time
- Test pass rate
- Code coverage percentage
- SonarQube quality gate status
- Deployment frequency
- Mean time to recovery (MTTR)

## 🔄 Pipeline Updates

To update the pipeline:
1. Modify `Jenkinsfile` in repository
2. Commit and push changes
3. Jenkins will automatically use new pipeline definition on next build

---

**Last Updated**: November 30, 2025  
**Version**: 1.0.0  
**Maintained by**: Team 09
