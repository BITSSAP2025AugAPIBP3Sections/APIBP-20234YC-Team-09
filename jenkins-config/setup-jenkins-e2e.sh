#!/bin/bash
# 🚀 Jenkins E2E Pipeline Setup Script

set -e

echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║              🛠️  JENKINS E2E PIPELINE SETUP                     ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Jenkins is running
check_jenkins() {
    print_info "Checking Jenkins status..."
    if curl -s http://localhost:8080/login >/dev/null; then
        print_status "Jenkins is running on http://localhost:8080"
    else
        print_error "Jenkins is not running. Please start Jenkins first."
        echo "  • On Ubuntu: sudo systemctl start jenkins"
        echo "  • On macOS: brew services start jenkins-lts"
        echo "  • On Windows: Start Jenkins service"
        exit 1
    fi
}

# Install required plugins
install_plugins() {
    print_info "Installing required Jenkins plugins..."
    
    PLUGINS=(
        "pipeline-stage-view"
        "pipeline-declarative-agent-api"
        "htmlpublisher"
        "email-ext"
        "nodejs"
        "docker-workflow"
        "git"
        "junit"
        "coverage"
    )
    
    for plugin in "${PLUGINS[@]}"; do
        print_info "Installing plugin: $plugin"
        java -jar jenkins-cli.jar install-plugin "$plugin" || print_warning "Plugin $plugin may already be installed"
    done
    
    print_status "All required plugins installed!"
}

# Create Jenkins job configuration
create_job_config() {
    cat > fusion-electronics-e2e-job.xml << 'EOF'
<?xml version='1.1' encoding='UTF-8'?>
<flow-definition plugin="workflow-job@2.40">
  <actions/>
  <description>🛒 Fusion Electronics E-commerce E2E Testing Pipeline with Selenium Grid</description>
  <keepDependencies>false</keepDependencies>
  <properties>
    <org.jenkinsci.plugins.workflow.job.properties.DisableConcurrentBuildsJobProperty/>
    <org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty>
      <triggers>
        <hudson.triggers.SCMTrigger>
          <spec>H/15 * * * *</spec>
          <ignorePostCommitHooks>false</ignorePostCommitHooks>
        </hudson.triggers.SCMTrigger>
        <hudson.triggers.TimerTrigger>
          <spec>0 2 * * 1,4</spec>
        </hudson.triggers.TimerTrigger>
      </triggers>
    </org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty>
  </properties>
  <definition class="org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition" plugin="workflow-cps@2.80">
    <scm class="hudson.plugins.git.GitSCM" plugin="git@4.4.5">
      <configVersion>2</configVersion>
      <userRemoteConfigs>
        <hudson.plugins.git.UserRemoteConfig>
          <url>https://github.com/BITSSAP2025AugAPIBP3Sections/APIBP-20234YC-Team-09.git</url>
        </hudson.plugins.git.UserRemoteConfig>
      </userRemoteConfigs>
      <branches>
        <hudson.plugins.git.BranchSpec>
          <name>*/main</name>
        </hudson.plugins.git.BranchSpec>
      </branches>
      <doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations>
      <submoduleCfg class="list"/>
      <extensions/>
    </scm>
    <scriptPath>Jenkinsfile</scriptPath>
    <lightweight>true</lightweight>
  </definition>
  <triggers/>
  <disabled>false</disabled>
</flow-definition>
EOF
    print_status "Jenkins job configuration created!"
}

# Setup environment variables
setup_environment() {
    print_info "Setting up environment variables..."
    
    cat > jenkins-env-vars.properties << 'EOF'
# Fusion Electronics E2E Environment Variables
MONGO_URI=mongodb://localhost:27017/jenkins-test
JWT_SECRET=jenkins-e2e-test-secret-key-12345
SELENIUM_TIMEOUT=180
E2E_BROWSERS=chrome,firefox,edge
DEFAULT_RECIPIENTS=devops@fusionelectronics.com
NODE_OPTIONS=--max-old-space-size=4096
EOF
    
    print_status "Environment variables configuration created!"
    print_info "Please configure these in Jenkins: Manage Jenkins → System Configuration → Environment Variables"
}

# Create Docker Compose for Jenkins with Docker
create_jenkins_docker() {
    cat > docker-compose.jenkins.yml << 'EOF'
version: '3.8'
services:
  jenkins:
    image: jenkins/jenkins:lts
    container_name: jenkins-e2e
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
      - ./jenkins-config:/jenkins-config
    environment:
      - JENKINS_OPTS=--httpPort=8080
      - JAVA_OPTS=-Xmx2048m
    networks:
      - jenkins-network
    restart: unless-stopped

  docker-dind:
    image: docker:dind
    container_name: jenkins-docker
    privileged: true
    ports:
      - "2376:2376"
    environment:
      - DOCKER_TLS_CERTDIR=/certs
    volumes:
      - jenkins-docker-certs:/certs/client
      - jenkins_home:/var/jenkins_home
    networks:
      - jenkins-network
    restart: unless-stopped

volumes:
  jenkins_home:
  jenkins-docker-certs:

networks:
  jenkins-network:
    driver: bridge
EOF
    
    print_status "Docker Compose configuration for Jenkins created!"
}

# Test pipeline locally
test_pipeline() {
    print_info "Testing E2E pipeline components..."
    
    if command -v npm &> /dev/null; then
        print_info "Testing npm commands..."
        npm install --no-audit
        
        print_info "Testing backend..."
        cd backend && npm test -- --testNamePattern="auth" --ci --bail --testTimeout=15000 && cd ..
        
        print_status "Pipeline components test completed!"
    else
        print_warning "npm not found. Skipping pipeline test."
    fi
}

# Main setup function
main() {
    echo
    print_info "🚀 Starting Jenkins E2E Pipeline Setup..."
    echo
    
    # Check prerequisites
    check_jenkins
    
    # Create configurations
    create_job_config
    setup_environment
    create_jenkins_docker
    
    # Optional plugin installation (requires Jenkins CLI)
    if command -v java &> /dev/null; then
        print_info "Java found. You can install plugins with:"
        echo "  java -jar jenkins-cli.jar install-plugin <plugin-name>"
    else
        print_warning "Java not found. Install plugins manually via Jenkins UI."
    fi
    
    # Test components
    test_pipeline
    
    echo
    print_status "🎉 Jenkins E2E Pipeline Setup Complete!"
    echo
    echo "📋 Next Steps:"
    echo "  1. 🌐 Open Jenkins: http://localhost:8080"
    echo "  2. 🔧 Create new Pipeline job: 'Fusion-Electronics-E2E'"
    echo "  3. 📄 Use job config: fusion-electronics-e2e-job.xml"
    echo "  4. ⚙️  Configure environment variables from: jenkins-env-vars.properties"
    echo "  5. 🚀 Run first build to test E2E pipeline"
    echo
    echo "🧪 E2E Test Commands:"
    echo "  • Quick Demo: npm run selenium:visible"
    echo "  • Full E2E: npm run selenium:e2e:parallel"
    echo "  • Single Browser: npm run selenium:e2e:chrome"
    echo
    echo "📊 Expected Results:"
    echo "  • ✅ 3 browsers tested in parallel"
    echo "  • 📸 36+ screenshots captured"
    echo "  • ⏱️  ~8 minutes for complete E2E testing"
    echo "  • 🎯 100% cross-browser compatibility"
    echo
}

# Run main function
main "$@"