# 🔍 SonarQube Code Analysis Setup

## Quick Start

### 1. Start SonarQube Server
```powershell
.\start-sonar.ps1
```
Or manually:
```powershell
docker-compose -f docker-compose.sonar.yml up -d
```

### 2. Access SonarQube Dashboard
- **URL**: http://localhost:9000
- **Default Login**: `admin` / `admin`
- **⚠️ Change password on first login!**

### 3. Run Code Analysis

#### Option A: From Command Line
```powershell
docker-compose -f docker-compose.sonar.yml run --rm sonar-scanner
```

#### Option B: Jenkins Pipeline
The Jenkins pipeline automatically runs SonarQube analysis after tests pass.

### 4. View Results
Go to http://localhost:9000 and view your project: **fusion-electronics-ecommerce**

## What Gets Analyzed

✅ **Included:**
- All JavaScript/React source code (`src/`, `backend/`)
- Code quality metrics
- Security vulnerabilities
- Code smells
- Duplications
- Test coverage

❌ **Excluded:**
- `node_modules/`
- `build/`, `dist/`
- Test files (`*.test.js`, `*.spec.js`)
- Config files

## Stop SonarQube

```powershell
docker-compose -f docker-compose.sonar.yml down
```

## Troubleshooting

### SonarQube not starting?
```powershell
# Check container logs
docker logs fusion-sonarqube

# Restart containers
docker-compose -f docker-compose.sonar.yml restart
```

### Port 9000 already in use?
```powershell
# Find process using port 9000
netstat -ano | findstr :9000

# Stop the process or change port in docker-compose.sonar.yml
```

## Integration with Jenkins

The Jenkinsfile includes a **SonarQube Analysis** stage that:
1. Runs after tests pass
2. Uses Docker to scan code
3. Sends results to SonarQube server at http://localhost:9000
4. Shows analysis report in Jenkins console

## Configuration Files

- **sonar-project.properties**: SonarQube project configuration
- **docker-compose.sonar.yml**: Docker services (SonarQube + PostgreSQL)
- **start-sonar.ps1**: Quick start script

---

**Created**: December 1, 2025  
**Project**: Fusion Electronics E-commerce
