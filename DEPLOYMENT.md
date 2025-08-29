# 🚀 GitHub Pages Deployment Guide

This folder contains automated deployment scripts for your NoteApp.

## 📁 Files Created

- **`deploy.config.json`** - Configuration file with GitHub settings
- **`deploy.ps1`** - PowerShell script (recommended for Windows)
- **`deploy.bat`** - Batch script (alternative for Windows)

## 🔧 Setup Instructions

### 1. Configure GitHub Settings

Edit `deploy.config.json`:

```json
{
  "github": {
    "username": "YOUR_ACTUAL_GITHUB_USERNAME", // ← Change this!
    "repository": "NoteApp",
    "branch": "main"
  }
}
```

### 2. Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click **"+"** → **"New repository"**
3. Repository name: **`NoteApp`** (or match your config)
4. Set to **Public**
5. **Don't** initialize with README/gitignore
6. Click **"Create repository"**

### 3. Run Setup (Choose One Method)

#### Method A: PowerShell (Recommended)

```powershell
.\deploy.ps1 -Setup
```

#### Method B: Batch File

```cmd
deploy.bat setup
```

#### Method C: Manual Commands

```bash
git remote add origin https://github.com/YOUR_USERNAME/NoteApp.git
git add .
git commit -m "Setup: Prepare for GitHub Pages deployment"
git branch -M main
git push -u origin main
```

## 🚀 Deploy to GitHub Pages

### One-Command Deployment

#### PowerShell:

```powershell
.\deploy.ps1 -Deploy
```

#### Batch:

```cmd
deploy.bat deploy
```

### What It Does:

1. ✅ Installs `gh-pages` if needed
2. ✅ Builds your React app (`npm run build`)
3. ✅ Deploys to `gh-pages` branch
4. ✅ Shows your live URL

## 🌐 Enable GitHub Pages

After first deployment:

1. Go to your repository on GitHub
2. **Settings** → **Pages**
3. **Source**: Deploy from a branch
4. **Branch**: `gh-pages` → **Save**

Your app will be live at:

```
https://YOUR_USERNAME.github.io/NoteApp/
```

## 🛠️ Troubleshooting

### Permission Issues (PowerShell)

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Build Errors

```bash
npm install          # Install dependencies
npm run build        # Test build locally
```

### Git Issues

```bash
git status           # Check git status
git remote -v        # Verify remote URL
```

## 📝 Manual Deployment

If scripts don't work:

```bash
npm run build
npx gh-pages -d dist
```

## 🔄 Updates

For future updates:

1. Make your changes
2. Run: `.\deploy.ps1 -Deploy` or `deploy.bat deploy`
3. Changes will appear in ~5 minutes

## 💡 Tips

- **First deployment** takes ~10 minutes to go live
- **Updates** appear in ~2-5 minutes
- Check **Actions** tab on GitHub for deployment status
- Your notes are saved in browser localStorage (not affected by deployments)
