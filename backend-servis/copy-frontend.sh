#!/bin/bash
# Script untuk Copy Frontend React ke Laravel Resources (Mac/Linux)

echo -e "\033[0;32mCopying frontend files to Laravel resources...\033[0m"

# Buat folder jika belum ada
folders=(
    "resources/js/components"
    "resources/js/pages"
    "resources/js/contexts"
    "resources/js/services"
    "resources/js/utils"
)

for folder in "${folders[@]}"; do
    if [ ! -d "$folder" ]; then
        mkdir -p "$folder"
        echo -e "\033[0;33mCreated folder: $folder\033[0m"
    fi
done

# Copy files
echo -e "\n\033[0;36mCopying components...\033[0m"
cp -R ../frontend-web/src/components/* resources/js/components/ 2>/dev/null

echo -e "\033[0;36mCopying pages...\033[0m"
cp -R ../frontend-web/src/pages/* resources/js/pages/ 2>/dev/null

echo -e "\033[0;36mCopying contexts...\033[0m"
cp -R ../frontend-web/src/contexts/* resources/js/contexts/ 2>/dev/null

echo -e "\033[0;36mCopying services...\033[0m"
cp -R ../frontend-web/src/services/* resources/js/services/ 2>/dev/null

echo -e "\033[0;36mCopying utils...\033[0m"
cp -R ../frontend-web/src/utils/* resources/js/utils/ 2>/dev/null

# Update API base URL di api.js
echo -e "\n\033[0;36mUpdating API base URL...\033[0m"
apiFile="resources/js/services/api.js"
if [ -f "$apiFile" ]; then
    # Replace URL
    perl -i -pe "s|const API_BASE_URL = import\.meta\.env\.VITE_API_URL \|\| 'http://localhost:8000/api'|const API_BASE_URL = '/api'|" "$apiFile"
    echo -e "\033[0;32mUpdated API base URL to '/api'\033[0m"
fi

# Merge CSS
echo -e "\n\033[0;36mMerging CSS...\033[0m"
frontendCss="../frontend-web/src/index.css"
laravelCss="resources/css/app.css"

if [ -f "$frontendCss" ]; then
    # Check if css already merged (simple check)
    if ! grep -q "@tailwind base" "$laravelCss"; then
        cat "$frontendCss" >> "$laravelCss"
        echo -e "\033[0;32mMerged CSS files\033[0m"
    else
        echo -e "\033[0;33mCSS might be already merged, skipping append to avoid duplicates.\033[0m"
    fi
fi

echo -e "\n\033[0;32m✅ Copy completed!\033[0m"
echo -e "\n\033[0;33mNext steps:\033[0m"
echo "1. Install dependencies: npm install"
echo "2. Run dev server: npm run dev"
echo "3. Start Laravel: php artisan serve"
