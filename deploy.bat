@echo off
setlocal enabledelayedexpansion

:: GitHub Pages Deployment Script for NoteApp
:: Simple batch version of the PowerShell script

if "%1"=="setup" goto :setup
if "%1"=="deploy" goto :deploy
if "%1"=="help" goto :help
if "%1"=="" goto :help

:help
echo.
echo === NoteApp GitHub Pages Deployment Script ===
echo.
echo Usage:
echo   deploy.bat setup    - First-time setup (configure GitHub remote)
echo   deploy.bat deploy   - Deploy to GitHub Pages  
echo   deploy.bat help     - Show this help message
echo.
echo Before running:
echo 1. Edit deploy.config.json with your GitHub username
echo 2. Create a repository on GitHub with the same name
echo 3. Make sure gh-pages package is installed: npm install --save-dev gh-pages
echo.
goto :end

:setup
echo.
echo [SETUP] Setting up GitHub repository...
echo.

:: Check if config exists
if not exist "deploy.config.json" (
    echo ERROR: deploy.config.json not found!
    echo Please make sure the config file exists in the project root.
    goto :end
)

:: Initialize git if needed
if not exist ".git" (
    echo [SETUP] Initializing Git repository...
    git init
)

echo [SETUP] Please manually update deploy.config.json with your GitHub username
echo [SETUP] Then run the following commands:
echo.
echo   git remote add origin https://github.com/YOUR_USERNAME/NoteApp.git
echo   git add .
echo   git commit -m "Setup: Prepare for GitHub Pages deployment"
echo   git branch -M main
echo   git push -u origin main
echo.
echo [SETUP] After pushing, run: deploy.bat deploy
goto :end

:deploy
echo.
echo [DEPLOY] Deploying to GitHub Pages...
echo.

:: Check if gh-pages is installed
npm list gh-pages --depth=0 >nul 2>&1
if !errorlevel! neq 0 (
    echo [DEPLOY] Installing gh-pages...
    npm install --save-dev gh-pages
)

:: Build the project
echo [DEPLOY] Building project...
npm run build
if !errorlevel! neq 0 (
    echo ERROR: Build failed!
    goto :end
)

:: Deploy to gh-pages
echo [DEPLOY] Deploying to GitHub Pages...
npm run deploy
if !errorlevel! equ 0 (
    echo.
    echo SUCCESS: Deployment successful!
    echo.
    echo Your app will be available at:
    echo https://YOUR_USERNAME.github.io/NoteApp/
    echo.
    echo Note: It may take a few minutes for changes to appear.
) else (
    echo ERROR: Deployment failed!
)

:end
echo.
pause
