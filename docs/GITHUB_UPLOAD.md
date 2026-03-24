# 📤 GitHub Upload Guide

Complete guide to uploading your MedBot Health Assistant project to GitHub.

---

## 📋 Prerequisites

Before uploading to GitHub, ensure:
- ✅ You have a GitHub account (create at github.com)
- ✅ Git is installed on your Mac M2
- ✅ Project is working locally
- ✅ You've tested all components

---

## 🔍 Step 1: Check Git Installation

```bash
git --version
```

**If Git is not installed:**
```bash
# Install Git using Homebrew
brew install git

# Verify installation
git --version
```

---

## 👤 Step 2: Configure Git (First Time Only)

```bash
# Set your name
git config --global user.name "Your Name"

# Set your email (use GitHub email)
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
```

---

## 📁 Step 3: Prepare Your Project

### 3.1 Navigate to project directory
```bash
cd ~/Downloads/medbot-health-assistant
```

### 3.2 Create .gitignore file

This prevents unnecessary files from being uploaded:

```bash
cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
ENV/
backend/venv/
*.db
*.sqlite3

# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.env.local
.env.development.local
.env.test.local
.env.production.local
build/
dist/

# React Native / Expo
.expo/
.expo-shared/
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# OS
Thumbs.db
.DS_Store

# Logs
*.log
logs/

# Misc
.cache/
.parcel-cache/
coverage/
.nyc_output/
EOF
```

### 3.3 Clean up unnecessary files
```bash
# Remove any existing database (will be recreated)
rm -f backend/medbot.db

# Remove node_modules (will be reinstalled via npm install)
rm -rf web-frontend/node_modules
rm -rf mobile-app/node_modules

# Remove any log files
find . -name "*.log" -delete
```

---

## 🏗️ Step 4: Initialize Git Repository

### 4.1 Initialize Git
```bash
cd ~/Downloads/medbot-health-assistant
git init
```

Expected output: `Initialized empty Git repository in ...`

### 4.2 Add all files
```bash
git add .
```

### 4.3 Check status
```bash
git status
```

You should see many files ready to be committed (in green).

### 4.4 Make first commit
```bash
git commit -m "Initial commit: MedBot Health Assistant - Complete application with CLI, Web, and Mobile interfaces"
```

---

## 🌐 Step 5: Create GitHub Repository

### 5.1 Go to GitHub
1. Visit https://github.com
2. Sign in to your account
3. Click the **"+"** icon (top right)
4. Select **"New repository"**

### 5.2 Repository Settings
Fill in the form:

**Repository name:**
```
medbot-health-assistant
```

**Description:**
```
Intelligent Health Assistant with COVID-19 Detection - Full-stack application featuring CLI, React Web Interface, and React Native Mobile App (iOS/Android)
```

**Visibility:**
- ✅ Public (recommended for portfolio)
- ⬜ Private (if you prefer)

**Initialize repository:**
- ⬜ DO NOT check "Add a README file"
- ⬜ DO NOT add .gitignore
- ⬜ DO NOT choose a license yet

**Click:** "Create repository"

---

## 🔗 Step 6: Connect Local Repository to GitHub

GitHub will show you a page with commands. Use the "push an existing repository" section:

### 6.1 Add remote repository
```bash
# Replace YOUR-USERNAME with your GitHub username
git remote add origin https://github.com/YOUR-USERNAME/medbot-health-assistant.git
```

### 6.2 Verify remote
```bash
git remote -v
```

Expected output:
```
origin  https://github.com/YOUR-USERNAME/medbot-health-assistant.git (fetch)
origin  https://github.com/YOUR-USERNAME/medbot-health-assistant.git (push)
```

### 6.3 Set main branch
```bash
git branch -M main
```

---

## 📤 Step 7: Push to GitHub

### 7.1 Push your code
```bash
git push -u origin main
```

You may be prompted for GitHub credentials:
- **Username:** your GitHub username
- **Password:** your GitHub Personal Access Token (NOT your password)

**Note:** GitHub no longer accepts passwords for Git operations. You need a Personal Access Token.

### 7.2 Create Personal Access Token (if needed)

If you don't have a token:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: "MedBot Upload"
4. Select scopes: ✅ repo (all permissions)
5. Click "Generate token"
6. **COPY THE TOKEN** (you can't see it again!)
7. Use this token as your password when pushing

### 7.3 Verify upload
Visit: `https://github.com/YOUR-USERNAME/medbot-health-assistant`

You should see all your files uploaded!

---

## 📝 Step 8: Enhance Your GitHub Repository

### 8.1 Add Topics/Tags
On your repository page:
1. Click **"Add topics"** (next to About)
2. Add relevant tags:
   - `python`
   - `flask`
   - `react`
   - `react-native`
   - `healthcare`
   - `covid-19`
   - `symptom-checker`
   - `mobile-app`
   - `web-app`
   - `cli`
   - `full-stack`
   - `health-tech`

### 8.2 Edit Repository Description
Update the About section:
- ✅ Use description from Step 5.2
- ✅ Add website (if you deploy it)
- ✅ Add topics as above

### 8.3 Add README Badges (Optional)
Add these to the top of your README.md:

```markdown
![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)
![React](https://img.shields.io/badge/React-18.2-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.73-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
```

---

## 🎨 Step 9: Create Repository Visual Assets

### 9.1 Add Screenshots
Create a `screenshots/` folder and add images:

```bash
mkdir screenshots
# Add screenshots of:
# - CLI interface
# - Web homepage
# - Symptom checker
# - Assessment results
# - Mobile app screens
```

Update README.md with screenshots:
```markdown
## Screenshots

### Web Interface
![Web Interface](screenshots/web-home.png)

### Mobile App
![Mobile App](screenshots/mobile-app.png)

### CLI
![CLI](screenshots/cli-screenshot.png)
```

### 9.2 Create Demo GIF (Optional)
Use tools like:
- **ScreenToGif** (Windows/Mac)
- **LICEcap** (Mac)
- **Kap** (Mac - recommended)

Add to README:
```markdown
![Demo](screenshots/demo.gif)
```

---

## 🔒 Step 10: Add License

### 10.1 Create LICENSE file
```bash
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2024 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
```

### 10.2 Commit and push
```bash
git add LICENSE
git commit -m "Add MIT license"
git push
```

---

## 🔄 Step 11: Making Updates

When you make changes to your project:

```bash
# 1. Check what changed
git status

# 2. Add changed files
git add .
# Or add specific files:
git add backend/app.py

# 3. Commit with descriptive message
git commit -m "Add new symptom category for respiratory issues"

# 4. Push to GitHub
git push
```

---

## 📌 Step 12: Create Releases

### 12.1 Tag a version
```bash
git tag -a v1.0.0 -m "Version 1.0.0 - Initial release"
git push origin v1.0.0
```

### 12.2 Create GitHub Release
1. Go to your repository on GitHub
2. Click **"Releases"** (right sidebar)
3. Click **"Create a new release"**
4. Choose tag: v1.0.0
5. Release title: "MedBot v1.0.0 - Initial Release"
6. Description: List features and changes
7. Click **"Publish release"**

---

## 🌟 Step 13: Repository Best Practices

### Good Commit Messages
✅ **Good:**
```
"Add COVID-19 symptom detection algorithm"
"Fix: Resolve database connection timeout"
"Update: Improve mobile app UI responsiveness"
```

❌ **Bad:**
```
"update"
"fix stuff"
"changes"
```

### Commit Frequency
- Commit after completing each feature
- Commit before making major changes
- Push to GitHub at least daily when actively developing

### Branch Strategy (Advanced)
```bash
# Create feature branch
git checkout -b feature/new-symptom-category

# Make changes, commit
git add .
git commit -m "Add allergy symptom category"

# Switch back to main
git checkout main

# Merge feature
git merge feature/new-symptom-category

# Push
git push
```

---

## 🎯 Step 14: Showcase Your Project

### Add to README:
```markdown
## 🚀 Live Demo

- **Web App**: [Link if deployed]
- **API Docs**: [Link to API documentation]
- **Video Demo**: [Link to demo video]

## 🎥 Demo Video

[Embed YouTube video or add link]
```

### Create Project Website (Optional)
Deploy web frontend to:
- **Vercel** (free, easy)
- **Netlify** (free, easy)
- **GitHub Pages** (free)

Deploy backend to:
- **Heroku** (free tier)
- **Railway** (free tier)
- **Render** (free tier)

---

## ✅ Verification Checklist

Before sharing your repository:

- [ ] All code is pushed to GitHub
- [ ] README.md is comprehensive
- [ ] .gitignore is properly configured
- [ ] No sensitive data (API keys, passwords) in code
- [ ] License is added
- [ ] Screenshots/demo added
- [ ] Topics/tags added
- [ ] Repository description is clear
- [ ] All documentation files included
- [ ] Code is tested and working
- [ ] Installation instructions are clear

---

## 🔗 Useful Git Commands

### View Changes
```bash
git diff                    # Show unstaged changes
git diff --staged          # Show staged changes
git log                    # View commit history
git log --oneline          # Compact history
```

### Undo Changes
```bash
git checkout -- file.txt   # Discard changes to file
git reset HEAD file.txt    # Unstage file
git reset --soft HEAD~1    # Undo last commit, keep changes
git reset --hard HEAD~1    # Undo last commit, discard changes
```

### Branch Management
```bash
git branch                 # List branches
git branch feature-name    # Create branch
git checkout feature-name  # Switch to branch
git checkout -b new-branch # Create and switch
git branch -d branch-name  # Delete branch
```

### Remote Management
```bash
git remote -v              # View remotes
git fetch origin           # Fetch updates
git pull origin main       # Pull and merge
git push origin main       # Push to remote
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Failed to push"
**Error:** `Updates were rejected because the remote contains work`

**Solution:**
```bash
git pull origin main --rebase
git push origin main
```

### Issue 2: "Permission denied"
**Error:** `Permission denied (publickey)`

**Solution:** Use HTTPS instead of SSH, or set up SSH keys

### Issue 3: "Large files"
**Error:** `File size exceeds GitHub's limit`

**Solution:**
```bash
# Add to .gitignore
echo "large-file.zip" >> .gitignore
git rm --cached large-file.zip
git commit -m "Remove large file"
git push
```

### Issue 4: "Merge conflicts"
**Error:** Conflicts when pulling

**Solution:**
```bash
# Edit conflicting files
# Look for <<<<<<< markers
# Choose which changes to keep
git add .
git commit -m "Resolve merge conflicts"
git push
```

---

## 📱 GitHub Mobile App

Download GitHub mobile app for:
- iOS: App Store
- Android: Google Play

Stay updated on:
- Issues
- Pull requests
- Notifications
- Repository activity

---

## 🎓 Additional Resources

### Learning Git
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials)

### GitHub Features
- [GitHub Actions](https://github.com/features/actions) - CI/CD
- [GitHub Pages](https://pages.github.com/) - Free hosting
- [GitHub Packages](https://github.com/features/packages) - Package hosting

---

## 💼 Portfolio Tips

Make your repository stand out:

1. **Professional README**
   - Clear description
   - Screenshots
   - Demo video
   - Installation instructions
   - API documentation

2. **Code Quality**
   - Consistent formatting
   - Meaningful comments
   - Clean structure
   - Error handling

3. **Documentation**
   - Setup guide
   - API docs
   - Architecture diagrams
   - Use case examples

4. **Activity**
   - Regular commits
   - Version tags
   - Issue tracking
   - Project board

---

## 🎉 Congratulations!

Your MedBot Health Assistant is now on GitHub!

**Share your repository:**
- Add to LinkedIn profile
- Include in resume/CV
- Share with potential employers
- Add to portfolio website

**Repository URL:**
```
https://github.com/YOUR-USERNAME/medbot-health-assistant
```

**Keep developing and updating!** 🚀

---

**Questions?** Review this guide or check GitHub documentation.

**Happy Coding! 🏥💻**
