# Publish the Codveda portfolio to GitHub (run in PowerShell, inside the codveda-data-science-portfolio folder)
# Needs: Git (https://git-scm.com) and GitHub CLI (https://cli.github.com). Run `gh auth login` once beforehand.

$ErrorActionPreference = "Stop"
$repo = "codveda-data-science-portfolio"
$desc = "Codveda Data Science Internship (Mar-Apr 2026): data cleaning, EDA, regression, churn classification (RF ROC-AUC 0.923), NLP with TF-IDF and a Keras neural network."

# 1. Make sure raw datasets and secrets are never uploaded
if (-not (Test-Path ".gitignore")) { New-Item ".gitignore" -ItemType File | Out-Null }
$ignore = @("data/raw/", "*.csv", ".env", ".venv/", "__pycache__/", ".ipynb_checkpoints/")
foreach ($line in $ignore) {
  if (-not (Select-String -Path ".gitignore" -Pattern ([regex]::Escape($line)) -Quiet)) { Add-Content ".gitignore" $line }
}

# 2. Create the local repository and first commit
if (-not (Test-Path ".git")) { git init -b main | Out-Null }
git add .
$staged = git diff --cached --name-only
if ($staged -match "\.csv$|\.env$") { Write-Error "A CSV or .env file is staged. Remove it before publishing."; exit 1 }
git commit -m "Codveda Data Science Internship portfolio" | Out-Null

# 3. Create the public GitHub repo and push
gh repo create $repo --public --source . --remote origin --push --description $desc

# 4. Add topics so recruiters can find it
gh repo edit "greythinkerdue/$repo" --add-topic data-science --add-topic machine-learning --add-topic churn-prediction --add-topic nlp --add-topic keras --add-topic scikit-learn --add-topic eda --add-topic portfolio

Write-Host "Done: https://github.com/greythinkerdue/$repo"