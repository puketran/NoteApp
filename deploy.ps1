# GitHub Pages Deployment Script for NoteApp
# This script automates the entire deployment process

param(
    [switch]$Setup,
    [switch]$Deploy,
    [switch]$Help
)

# Colors for console output
$Red = [System.ConsoleColor]::Red
$Green = [System.ConsoleColor]::Green
$Yellow = [System.ConsoleColor]::Yellow
$Blue = [System.ConsoleColor]::Blue

function Write-ColorOutput($ForegroundColor) {
    if ($args) {
        Write-Host $args -ForegroundColor $ForegroundColor
    }
}

function Show-Help {
    Write-ColorOutput $Blue "=== NoteApp GitHub Pages Deployment Script ==="
    Write-Host ""
    Write-ColorOutput $Green "Usage:"
    Write-Host "  .\deploy.ps1 -Setup    # First-time setup (configure GitHub remote)"
    Write-Host "  .\deploy.ps1 -Deploy   # Deploy to GitHub Pages"
    Write-Host "  .\deploy.ps1 -Help     # Show this help message"
    Write-Host ""
    Write-ColorOutput $Yellow "Before running:"
    Write-Host "1. Edit deploy.config.json with your GitHub username"
    Write-Host "2. Create a repository on GitHub with the same name"
    Write-Host "3. Make sure gh-pages package is installed: npm install --save-dev gh-pages"
    Write-Host ""
}

function Read-Config {
    if (!(Test-Path "deploy.config.json")) {
        Write-ColorOutput $Red "❌ deploy.config.json not found!"
        Write-Host "Please make sure the config file exists in the project root."
        exit 1
    }
    
    try {
        $config = Get-Content "deploy.config.json" | ConvertFrom-Json
        return $config
    }
    catch {
        Write-ColorOutput $Red "❌ Error reading deploy.config.json: $($_.Exception.Message)"
        exit 1
    }
}

function Setup-GitHub {
    Write-ColorOutput $Blue "🔧 Setting up GitHub repository..."
    
    $config = Read-Config
    $username = $config.github.username
    $repository = $config.github.repository
    $branch = $config.github.branch
    
    if ($username -eq "YOUR_GITHUB_USERNAME") {
        Write-ColorOutput $Red "❌ Please update deploy.config.json with your actual GitHub username!"
        exit 1
    }
    
    $remoteUrl = "https://github.com/$username/$repository.git"
    
    Write-ColorOutput $Yellow "📋 Configuration:"
    Write-Host "  Username: $username"
    Write-Host "  Repository: $repository"
    Write-Host "  Branch: $branch"
    Write-Host "  Remote URL: $remoteUrl"
    Write-Host ""
    
    # Check if git is initialized
    if (!(Test-Path ".git")) {
        Write-ColorOutput $Yellow "📁 Initializing Git repository..."
        git init
    }
    
    # Check if remote already exists
    $existingRemote = git remote get-url origin 2>$null
    if ($existingRemote) {
        Write-ColorOutput $Yellow "🔄 Updating existing remote origin..."
        git remote set-url origin $remoteUrl
    } else {
        Write-ColorOutput $Yellow "🔗 Adding remote origin..."
        git remote add origin $remoteUrl
    }
    
    # Stage and commit all changes
    Write-ColorOutput $Yellow "📦 Staging and committing changes..."
    git add .
    git commit -m "Setup: Prepare for GitHub Pages deployment"
    
    # Push to GitHub
    Write-ColorOutput $Yellow "⬆️ Pushing to GitHub..."
    git branch -M $branch
    git push -u origin $branch
    
    Write-ColorOutput $Green "✅ GitHub setup complete!"
    Write-Host ""
    Write-ColorOutput $Blue "🌐 Next steps:"
    Write-Host "1. Go to https://github.com/$username/$repository"
    Write-Host "2. Go to Settings > Pages"
    Write-Host "3. Set source to 'Deploy from a branch'"
    Write-Host "4. Select 'gh-pages' branch"
    Write-Host "5. Run: .\deploy.ps1 -Deploy"
}

function Deploy-ToGitHubPages {
    Write-ColorOutput $Blue "🚀 Deploying to GitHub Pages..."
    
    $config = Read-Config
    $username = $config.github.username
    $repository = $config.github.repository
    
    if ($username -eq "YOUR_GITHUB_USERNAME") {
        Write-ColorOutput $Red "❌ Please update deploy.config.json with your actual GitHub username!"
        exit 1
    }
    
    # Check if gh-pages is installed
    $ghPagesCheck = npm list gh-pages --depth=0 2>$null
    if (!$ghPagesCheck -or $ghPagesCheck -notmatch "gh-pages") {
        Write-ColorOutput $Yellow "📦 Installing gh-pages..."
        npm install --save-dev gh-pages
    }
    
    # Build the project
    Write-ColorOutput $Yellow "🔨 Building project..."
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput $Red "❌ Build failed!"
        exit 1
    }
    
    # Deploy to gh-pages
    Write-ColorOutput $Yellow "📤 Deploying to GitHub Pages..."
    npm run deploy
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput $Green "✅ Deployment successful!"
        Write-Host ""
        Write-ColorOutput $Blue "🌐 Your app will be available at:"
        Write-Host "https://$username.github.io/$repository/"
        Write-Host ""
        Write-ColorOutput $Yellow "⏰ Note: It may take a few minutes for changes to appear."
    } else {
        Write-ColorOutput $Red "❌ Deployment failed!"
        exit 1
    }
}

function Main {
    if ($Help) {
        Show-Help
        return
    }
    
    if ($Setup) {
        Setup-GitHub
        return
    }
    
    if ($Deploy) {
        Deploy-ToGitHubPages
        return
    }
    
    # No parameters provided
    Write-ColorOutput $Yellow "🤔 No action specified. Use -Help to see available options."
    Show-Help
}

# Run the main function
Main
