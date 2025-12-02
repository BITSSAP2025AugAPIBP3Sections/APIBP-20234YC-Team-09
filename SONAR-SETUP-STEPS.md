# Quick SonarQube Setup & Scan Instructions

## Step 1: Access SonarQube (Open in Browser)
http://localhost:9000

## Step 2: Login
- Username: `admin`
- Password: `admin`
- You'll be prompted to change password - use a new password

## Step 3: Generate Authentication Token
1. Click on your **profile icon** (top right) → **My Account**
2. Go to **Security** tab
3. Under **Generate Tokens**:
   - Name: `jenkins-scanner`
   - Type: **Global Analysis Token**
   - Expires in: **30 days**
4. Click **Generate**
5. **COPY THE TOKEN** (you won't see it again!)

## Step 4: Run Analysis with Token

Replace `YOUR_TOKEN_HERE` with the token you copied:

```powershell
docker run --rm `
    --network mern-stack-ecommerce-app_sonarnet `
    -v "${PWD}:/usr/src" `
    -e SONAR_HOST_URL=http://sonarqube:9000 `
    -e SONAR_TOKEN=YOUR_TOKEN_HERE `
    sonarsource/sonar-scanner-cli:latest `
    -Dsonar.projectKey=fusion-electronics-ecommerce `
    -Dsonar.sources=. `
    -Dsonar.exclusions=**/node_modules/**,**/build/**,**/dist/**,**/coverage/**
```

## Alternative: Use Default Credentials (Quick Test)

```powershell
docker run --rm `
    --network mern-stack-ecommerce-app_sonarnet `
    -v "${PWD}:/usr/src" `
    -e SONAR_HOST_URL=http://sonarqube:9000 `
    -e SONAR_LOGIN=admin `
    -e SONAR_PASSWORD=YOUR_NEW_PASSWORD `
    sonarsource/sonar-scanner-cli:latest `
    -Dsonar.projectKey=fusion-electronics-ecommerce `
    -Dsonar.sources=. `
    -Dsonar.exclusions=**/node_modules/**,**/build/**,**/dist/**,**/coverage/**
```

## Step 5: View Results
Go to http://localhost:9000/dashboard?id=fusion-electronics-ecommerce

## For Jenkins Integration
Add the token as a Jenkins credential and use it in the pipeline.
