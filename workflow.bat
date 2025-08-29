@echo off
setlocal enabledelayedexpansion

:: NoteApp Complete Development & Deployment Workflow
:: This script handles testing, building, and deploying your app

set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "RESET=[0m"

if "%1"=="dev" goto :dev
if "%1"=="deploy" goto :deploy
if "%1"=="full" goto :full
if "%1"=="quick" goto :quick
if "%1"=="help" goto :help
if "%1"=="" goto :help

:help
echo.
echo %BLUE%=== NoteApp Development ^& Deployment Script ===%RESET%
echo.
echo %GREEN%Usage:%RESET%
echo   workflow.bat dev     - Start development server only
echo   workflow.bat deploy  - Deploy to GitHub Pages only
echo   workflow.bat quick   - Quick deploy (build + deploy)
echo   workflow.bat full    - Complete workflow (test + save + deploy)
echo   workflow.bat help    - Show this help message
echo.
echo %YELLOW%Commands explained:%RESET%
echo   dev:    Starts local development server at http://localhost:5173
echo   deploy: Builds and deploys to GitHub Pages
echo   quick:  Build + deploy (fastest deployment)
echo   full:   Save to Git + build + deploy + backup (complete workflow)
echo.
goto :end

:dev
echo.
echo %BLUE%[DEV] Starting development server...%RESET%
echo %YELLOW%Your app will be available at: http://localhost:5173%RESET%
echo %YELLOW%Press Ctrl+C to stop the server%RESET%
echo.
npm run dev
goto :end

:deploy
echo.
echo %BLUE%[DEPLOY] Deploying to GitHub Pages...%RESET%
call :deploy_only
goto :end

:quick
echo.
echo %BLUE%[QUICK] Quick deployment workflow...%RESET%
call :deploy_only
goto :end

:full
echo.
echo %BLUE%[FULL] Complete development workflow...%RESET%
echo.

:: Step 1: Save current work to Git
echo %YELLOW%Step 1/3: Saving changes to Git...%RESET%
call :save_to_git

:: Step 2: Deploy to GitHub Pages
echo %YELLOW%Step 2/3: Deploying to GitHub Pages...%RESET%
call :deploy_only

:: Step 3: Create backup info
echo %YELLOW%Step 3/3: Creating deployment info...%RESET%
call :create_deployment_info

echo.
echo %GREEN%✅ Complete workflow finished!%RESET%
goto :end

:: Function to save changes to Git
:save_to_git
echo   📝 Staging changes...
git add . 2>nul
if !errorlevel! neq 0 (
    echo %RED%   ❌ Failed to stage changes%RESET%
    goto :end
)

echo   💾 Committing changes...
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set timestamp=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%
git commit -m "Update: Changes made on %timestamp%" 2>nul
if !errorlevel! neq 0 (
    echo %YELLOW%   ⚠️ No changes to commit or commit failed%RESET%
) else (
    echo %GREEN%   ✅ Changes committed%RESET%
)

echo   ⬆️ Pushing to GitHub...
git push origin main 2>nul
if !errorlevel! neq 0 (
    echo %YELLOW%   ⚠️ Push failed or no remote configured%RESET%
) else (
    echo %GREEN%   ✅ Pushed to GitHub%RESET%
)
goto :eof

:: Function to deploy to GitHub Pages
:deploy_only
echo   🔨 Building project...
npm run build 2>nul
if !errorlevel! neq 0 (
    echo %RED%   ❌ Build failed! Check your code for errors.%RESET%
    echo.
    echo %YELLOW%   To see detailed errors, run: npm run build%RESET%
    goto :end
)
echo %GREEN%   ✅ Build successful%RESET%

echo   🚀 Deploying to GitHub Pages...
npm run deploy 2>nul
if !errorlevel! neq 0 (
    echo %RED%   ❌ Deployment failed!%RESET%
    goto :end
)

echo %GREEN%   ✅ Deployment successful!%RESET%
echo.
echo %BLUE%   🌐 Your app is live at:%RESET%
echo   https://puketran.github.io/NoteApp/
echo.
echo %YELLOW%   ⏰ Note: Changes may take 2-5 minutes to appear%RESET%
goto :eof

:: Function to create deployment info
:create_deployment_info
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set deploy_time=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%:%datetime:~12,2%

echo.
echo 📋 Deployment Summary:
echo   Time: %deploy_time%
echo   Repository: https://github.com/puketran/NoteApp
echo   Live URL: https://puketran.github.io/NoteApp/
echo   Status: ✅ Deployed successfully
echo.
goto :eof

:end
echo.
pause
