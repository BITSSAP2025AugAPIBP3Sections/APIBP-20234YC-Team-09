pipeline {
    agent any
    
    environment {
        // Node.js version
        NODEJS_HOME = tool name: 'NodeJS-18', type: 'nodejs'
        PATH = "${NODEJS_HOME};${env.PATH}"
        
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
                    // Get commit information (Windows compatible)
                    if (isUnix()) {
                        env.GIT_COMMIT_MSG = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                        env.GIT_AUTHOR = sh(script: 'git log -1 --pretty=%an', returnStdout: true).trim()
                        env.GIT_COMMIT_SHORT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    } else {
                        env.GIT_COMMIT_MSG = bat(script: '@git log -1 --pretty=%%B', returnStdout: true).trim()
                        env.GIT_AUTHOR = bat(script: '@git log -1 --pretty=%%an', returnStdout: true).trim()
                        env.GIT_COMMIT_SHORT = bat(script: '@git rev-parse --short HEAD', returnStdout: true).trim()
                    }
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
                    // Display Node.js and npm versions (Windows/Unix compatible)
                    if (isUnix()) {
                        sh 'node --version'
                        sh 'npm --version'
                    } else {
                        bat 'node --version'
                        bat 'npm --version'
                    }
                    
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
                            script {
                                if (isUnix()) {
                                    sh 'npm ci'
                                } else {
                                    bat 'npm ci'
                                }
                            }
                        }
                    }
                }
                
                stage('Backend Dependencies') {
                    steps {
                        echo '📦 Installing backend dependencies...'
                        dir("${BACKEND_DIR}") {
                            script {
                                if (isUnix()) {
                                    sh 'npm ci'
                                } else {
                                    bat 'npm ci'
                                }
                            }
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
                            script {
                                if (isUnix()) {
                                    sh 'npm run lint || true'
                                } else {
                                    bat 'npm run lint || exit 0'
                                }
                            }
                        }
                    }
                }
                
                stage('Lint Backend') {
                    steps {
                        echo '🔍 Running backend linting...'
                        dir("${BACKEND_DIR}") {
                            script {
                                if (isUnix()) {
                                    sh 'npm run lint || true'
                                } else {
                                    bat 'npm run lint || exit 0'
                                }
                            }
                        }
                    }
                }
                
                stage('Security Audit') {
                    steps {
                        echo '🔒 Running security audit...'
                        script {
                            if (isUnix()) {
                                dir("${FRONTEND_DIR}") {
                                    sh 'npm audit --audit-level=moderate || true'
                                }
                                dir("${BACKEND_DIR}") {
                                    sh 'npm audit --audit-level=moderate || true'
                                }
                            } else {
                                dir("${FRONTEND_DIR}") {
                                    bat 'npm audit --audit-level=moderate || exit 0'
                                }
                                dir("${BACKEND_DIR}") {
                                    bat 'npm audit --audit-level=moderate || exit 0'
                                }
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
                            script {
                                if (isUnix()) {
                                    sh 'npm test -- --ci --watchAll=false --maxWorkers=2'
                                } else {
                                    bat 'npm test -- --ci --watchAll=false --maxWorkers=2'
                                }
                            }
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
                            script {
                                if (isUnix()) {
                                    sh 'SUPPRESS_JEST_WARNINGS=true npm test -- --ci --coverage'
                                } else {
                                    bat 'set SUPPRESS_JEST_WARNINGS=true && npm test -- --ci --coverage'
                                }
                            }
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
                    echo 'SonarQube not configured, skipping...'
                    // def scannerHome = tool 'SonarQubeScanner'
                    // withSonarQubeEnv('SonarQube') {
                    //     if (isUnix()) {
                    //         sh "${scannerHome}/bin/sonar-scanner ..."
                    //     } else {
                    //         bat "${scannerHome}\\bin\\sonar-scanner.bat ..."
                    //     }
                    // }
                }
            }
        }
        
        stage('Build Application') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        echo '🏗️  Building frontend application...'
                        dir("${FRONTEND_DIR}") {
                            script {
                                if (isUnix()) {
                                    sh 'npm run build'
                                } else {
                                    bat 'npm run build'
                                }
                            }
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
                            script {
                                if (isUnix()) {
                                    sh 'echo "Backend prepared for deployment"'
                                } else {
                                    bat 'echo Backend prepared for deployment'
                                }
                            }
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
                    echo 'Docker not configured, skipping Docker build...'
                    // Uncomment when Docker is available
                    // if (isUnix()) {
                    //     sh "docker build -t ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} -t ${DOCKER_IMAGE_FRONTEND}:latest -f Dockerfile ."
                    //     sh "docker build -t ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} -t ${DOCKER_IMAGE_BACKEND}:latest -f backend/Dockerfile ./backend"
                    // } else {
                    //     bat "docker build -t ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} -t ${DOCKER_IMAGE_FRONTEND}:latest -f Dockerfile ."
                    //     bat "docker build -t ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} -t ${DOCKER_IMAGE_BACKEND}:latest -f backend/Dockerfile ./backend"
                    // }
                }
            }
        }
        
        stage('Integration Tests') {
            steps {
                echo '🔗 Running integration tests...'
                script {
                    if (isUnix()) {
                        sh 'echo "Integration tests would run here"'
                    } else {
                        bat 'echo Integration tests would run here'
                    }
                }
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
                    if (isUnix()) {
                        sh 'npx artillery quick --count 10 --num 3 http://localhost:5000/api/products || true'
                    } else {
                        bat 'npx artillery quick --count 10 --num 3 http://localhost:5000/api/products || exit 0'
                    }
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
                    echo 'Kubernetes not configured, skipping deployment...'
                    // Uncomment when Kubernetes is configured
                    // if (isUnix()) {
                    //     sh 'kubectl apply -f kubernetes/'
                    //     sh 'kubectl rollout status deployment/fusion-backend -n fusion-ecommerce || true'
                    // } else {
                    //     bat 'kubectl apply -f kubernetes\\'
                    //     bat 'kubectl rollout status deployment/fusion-backend -n fusion-ecommerce || exit 0'
                    // }
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
                    echo 'Smoke tests skipped (staging not configured)'
                    // Uncomment when staging is available
                    // if (isUnix()) {
                    //     sh 'curl -f http://staging.fusion-electronics.com/api/health || true'
                    // } else {
                    //     bat 'curl -f http://staging.fusion-electronics.com/api/health || exit 0'
                    // }
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
