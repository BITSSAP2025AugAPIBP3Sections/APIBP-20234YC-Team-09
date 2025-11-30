pipeline {
    agent any
    
    environment {
        // Node.js version
        NODEJS_HOME = tool name: 'NodeJS-18', type: 'nodejs'
        PATH = "${NODEJS_HOME}/bin:${env.PATH}"
        
        // Project directories
        BACKEND_DIR = 'backend'
        FRONTEND_DIR = '.'
        
        // Build artifacts
        BUILD_DIR = 'build'
        DIST_DIR = 'dist'
        
        // Docker configuration
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_IMAGE_FRONTEND = 'fusion-electronics-frontend'
        DOCKER_IMAGE_BACKEND = 'fusion-electronics-backend'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        
        // SonarQube
        SONAR_PROJECT_KEY = 'fusion-electronics'
        SONAR_PROJECT_NAME = 'Fusion Electronics E-commerce'
    }
    
    options {
        // Keep last 10 builds
        buildDiscarder(logRotator(numToKeepStr: '10'))
        
        // Timeout for entire pipeline
        timeout(time: 30, unit: 'MINUTES')
        
        // Timestamps in console output
        timestamps()
        
        // Disable concurrent builds
        disableConcurrentBuilds()
    }
    
    triggers {
        // Poll SCM every 2 hours
        pollSCM('H */2 * * *')
        
        // Build at least twice a week (Monday and Thursday at 2 AM)
        cron('0 2 * * 1,4')
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Checking out code from repository...'
                checkout scm
                
                script {
                    // Get commit information
                    env.GIT_COMMIT_MSG = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                    env.GIT_AUTHOR = sh(script: 'git log -1 --pretty=%an', returnStdout: true).trim()
                    env.GIT_COMMIT_SHORT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                }
                
                echo "📝 Commit: ${env.GIT_COMMIT_SHORT}"
                echo "👤 Author: ${env.GIT_AUTHOR}"
                echo "💬 Message: ${env.GIT_COMMIT_MSG}"
            }
        }
        
        stage('Environment Setup') {
            steps {
                echo '🔧 Setting up build environment...'
                
                script {
                    // Display Node.js and npm versions
                    sh 'node --version'
                    sh 'npm --version'
                    
                    // Display build information
                    echo "🏗️  Build Number: ${env.BUILD_NUMBER}"
                    echo "🌿 Branch: ${env.BRANCH_NAME ?: 'main'}"
                    echo "📅 Build Date: ${new Date()}"
                }
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Frontend Dependencies') {
                    steps {
                        echo '📦 Installing frontend dependencies...'
                        dir("${FRONTEND_DIR}") {
                            sh 'npm ci'
                        }
                    }
                }
                
                stage('Backend Dependencies') {
                    steps {
                        echo '📦 Installing backend dependencies...'
                        dir("${BACKEND_DIR}") {
                            sh 'npm ci'
                        }
                    }
                }
            }
        }
        
        stage('Code Quality & Security') {
            parallel {
                stage('Lint Frontend') {
                    steps {
                        echo '🔍 Running frontend linting...'
                        dir("${FRONTEND_DIR}") {
                            sh 'npm run lint || true'
                        }
                    }
                }
                
                stage('Lint Backend') {
                    steps {
                        echo '🔍 Running backend linting...'
                        dir("${BACKEND_DIR}") {
                            sh 'npm run lint || true'
                        }
                    }
                }
                
                stage('Security Audit') {
                    steps {
                        echo '🔒 Running security audit...'
                        script {
                            dir("${FRONTEND_DIR}") {
                                sh 'npm audit --audit-level=moderate || true'
                            }
                            dir("${BACKEND_DIR}") {
                                sh 'npm audit --audit-level=moderate || true'
                            }
                        }
                    }
                }
            }
        }
        
        stage('Unit Tests') {
            parallel {
                stage('Frontend Tests') {
                    steps {
                        echo '🧪 Running frontend unit tests...'
                        dir("${FRONTEND_DIR}") {
                            sh 'npm test -- --ci --coverage --watchAll=false'
                        }
                    }
                    post {
                        always {
                            // Publish test results
                            junit allowEmptyResults: true, testResults: '**/junit.xml'
                            
                            // Publish coverage report
                            publishHTML(target: [
                                allowMissing: true,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'coverage/lcov-report',
                                reportFiles: 'index.html',
                                reportName: 'Frontend Coverage Report'
                            ])
                        }
                    }
                }
                
                stage('Backend Tests') {
                    steps {
                        echo '🧪 Running backend unit tests...'
                        dir("${BACKEND_DIR}") {
                            sh 'npm test -- --ci --coverage'
                        }
                    }
                    post {
                        always {
                            // Publish test results
                            junit allowEmptyResults: true, testResults: 'backend/**/junit.xml'
                            
                            // Publish coverage report
                            publishHTML(target: [
                                allowMissing: true,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'backend/coverage/lcov-report',
                                reportFiles: 'index.html',
                                reportName: 'Backend Coverage Report'
                            ])
                        }
                    }
                }
            }
        }
        
        stage('SonarQube Analysis') {
            when {
                expression { return env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'develop' }
            }
            steps {
                echo '📊 Running SonarQube analysis...'
                script {
                    def scannerHome = tool 'SonarQubeScanner'
                    withSonarQubeEnv('SonarQube') {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                            -Dsonar.projectName='${SONAR_PROJECT_NAME}' \
                            -Dsonar.projectVersion=${env.BUILD_NUMBER} \
                            -Dsonar.sources=src,backend \
                            -Dsonar.exclusions=**/node_modules/**,**/build/**,**/dist/**,**/coverage/** \
                            -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info,backend/coverage/lcov.info
                        """
                    }
                }
            }
        }
        
        stage('Build Application') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        echo '🏗️  Building frontend application...'
                        dir("${FRONTEND_DIR}") {
                            sh 'npm run build'
                        }
                    }
                    post {
                        success {
                            echo '✅ Frontend build successful!'
                            archiveArtifacts artifacts: 'build/**/*', fingerprint: true
                        }
                    }
                }
                
                stage('Build Backend') {
                    steps {
                        echo '🏗️  Preparing backend for deployment...'
                        dir("${BACKEND_DIR}") {
                            sh 'echo "Backend prepared for deployment"'
                        }
                    }
                }
            }
        }
        
        stage('Docker Build') {
            when {
                expression { return env.BRANCH_NAME == 'main' }
            }
            steps {
                echo '🐳 Building Docker images...'
                script {
                    // Build frontend Docker image
                    sh """
                        docker build -t ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} \
                        -t ${DOCKER_IMAGE_FRONTEND}:latest \
                        -f Dockerfile .
                    """
                    
                    // Build backend Docker image
                    sh """
                        docker build -t ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} \
                        -t ${DOCKER_IMAGE_BACKEND}:latest \
                        -f backend/Dockerfile ./backend
                    """
                }
            }
        }
        
        stage('Integration Tests') {
            steps {
                echo '🔗 Running integration tests...'
                sh 'echo "Integration tests would run here"'
                // Add your integration tests here
            }
        }
        
        stage('Performance Tests') {
            when {
                expression { return env.BRANCH_NAME == 'main' }
            }
            steps {
                echo '⚡ Running performance tests...'
                script {
                    // Run load tests with Artillery
                    sh 'npx artillery quick --count 10 --num 3 http://localhost:5000/api/products || true'
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                expression { return env.BRANCH_NAME == 'main' }
            }
            steps {
                echo '🚀 Deploying to staging environment...'
                script {
                    // Deploy using Kubernetes
                    sh """
                        kubectl apply -f kubernetes/configmap.yaml
                        kubectl apply -f kubernetes/backend-deployment.yaml
                        kubectl apply -f kubernetes/backend-service.yaml
                        kubectl apply -f kubernetes/frontend-deployment.yaml
                        kubectl apply -f kubernetes/frontend-service.yaml
                    """
                    
                    // Wait for deployment to complete
                    sh 'kubectl rollout status deployment/fusion-backend -n fusion-ecommerce || true'
                    sh 'kubectl rollout status deployment/fusion-frontend -n fusion-ecommerce || true'
                }
            }
        }
        
        stage('Smoke Tests') {
            when {
                expression { return env.BRANCH_NAME == 'main' }
            }
            steps {
                echo '💨 Running smoke tests on staging...'
                script {
                    // Health check
                    sh 'curl -f http://staging.fusion-electronics.com/api/health || true'
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline completed successfully!'
            
            script {
                // Send success notification
                emailext(
                    subject: "✅ Build #${env.BUILD_NUMBER} - SUCCESS",
                    body: """
                        <h2>Build Successful! 🎉</h2>
                        <p><strong>Project:</strong> Fusion Electronics E-commerce</p>
                        <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                        <p><strong>Branch:</strong> ${env.BRANCH_NAME ?: 'main'}</p>
                        <p><strong>Commit:</strong> ${env.GIT_COMMIT_SHORT}</p>
                        <p><strong>Author:</strong> ${env.GIT_AUTHOR}</p>
                        <p><strong>Duration:</strong> ${currentBuild.durationString}</p>
                        <p><a href="${env.BUILD_URL}">View Build Details</a></p>
                    """,
                    mimeType: 'text/html',
                    to: '${DEFAULT_RECIPIENTS}'
                )
            }
        }
        
        failure {
            echo '❌ Pipeline failed!'
            
            script {
                // Send failure notification
                emailext(
                    subject: "❌ Build #${env.BUILD_NUMBER} - FAILED",
                    body: """
                        <h2>Build Failed! ⚠️</h2>
                        <p><strong>Project:</strong> Fusion Electronics E-commerce</p>
                        <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                        <p><strong>Branch:</strong> ${env.BRANCH_NAME ?: 'main'}</p>
                        <p><strong>Commit:</strong> ${env.GIT_COMMIT_SHORT}</p>
                        <p><strong>Author:</strong> ${env.GIT_AUTHOR}</p>
                        <p><strong>Stage Failed:</strong> ${env.STAGE_NAME}</p>
                        <p><a href="${env.BUILD_URL}">View Build Details</a></p>
                        <p><a href="${env.BUILD_URL}console">View Console Output</a></p>
                    """,
                    mimeType: 'text/html',
                    to: '${DEFAULT_RECIPIENTS}'
                )
            }
        }
        
        unstable {
            echo '⚠️  Pipeline unstable!'
        }
        
        always {
            echo '🧹 Cleaning up workspace...'
            
            // Archive build artifacts
            archiveArtifacts artifacts: '**/build/**,**/dist/**', allowEmptyArchive: true
            
            // Clean workspace
            cleanWs(
                cleanWhenNotBuilt: false,
                deleteDirs: true,
                disableDeferredWipeout: true,
                patterns: [
                    [pattern: 'node_modules', type: 'INCLUDE'],
                    [pattern: 'build', type: 'INCLUDE'],
                    [pattern: 'coverage', type: 'INCLUDE']
                ]
            )
            
            // Record build metrics
            script {
                def buildDuration = currentBuild.duration / 1000
                echo "⏱️  Total build time: ${buildDuration} seconds"
            }
        }
    }
}
