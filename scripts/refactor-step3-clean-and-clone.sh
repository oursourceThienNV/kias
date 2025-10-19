#!/bin/bash

###############################################################################
# HAPAS ECOMMERCE - REFACTOR STEP 3: CLEAN AND CLONE UPSTREAM
# Xóa code cũ và clone EverShop upstream
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="/Volumes/DoanBHSST9/Outsource/hapas_ecommerce"
EVERSHOP_REPO="https://github.com/evershopcommerce/evershop.git"
UPSTREAM_BRANCH="dev"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  HAPAS ECOMMERCE - REFACTOR STEP 3: CLEAN & CLONE         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verify custom backup exists
if [ ! -f "$PROJECT_ROOT/refactor-backup-path.txt" ]; then
    echo -e "${RED}❌ Backup path not found!${NC}"
    echo -e "${YELLOW}Please run refactor-step2-preserve-custom.sh first${NC}"
    exit 1
fi

CUSTOM_BACKUP=$(cat "$PROJECT_ROOT/refactor-backup-path.txt")

if [ ! -d "$CUSTOM_BACKUP" ]; then
    echo -e "${RED}❌ Custom backup not found: $CUSTOM_BACKUP${NC}"
    echo -e "${YELLOW}Please run refactor-step2-preserve-custom.sh again${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Custom backup found: $CUSTOM_BACKUP${NC}"
echo ""

cd "$PROJECT_ROOT"

# Safety check
echo -e "${YELLOW}⚠️  WARNING: This will DELETE all current code!${NC}"
echo -e "${YELLOW}   Custom files are backed up at: $CUSTOM_BACKUP${NC}"
echo ""
read -p "Are you sure you want to continue? (type 'yes' to confirm): " -r
echo ""
if [ "$REPLY" != "yes" ]; then
    echo -e "${YELLOW}Aborted by user${NC}"
    exit 1
fi

# Create new branch for refactor
echo -e "${YELLOW}[1/8]${NC} Creating refactor branch..."
git checkout -b refactor/upstream-sync 2>/dev/null || git checkout refactor/upstream-sync
echo -e "${GREEN}✅ Branch: refactor/upstream-sync${NC}"
echo ""

# Remove packages
echo -e "${YELLOW}[2/8]${NC} Removing EverShop core packages..."
if [ -d "packages" ]; then
    rm -rf packages/
    echo -e "${GREEN}✅ Packages removed${NC}"
fi
echo ""

# Remove extensions (keep list for review)
echo -e "${YELLOW}[3/8]${NC} Removing standard extensions..."
if [ -d "extensions" ]; then
    ls -la extensions/ > "$CUSTOM_BACKUP/extensions-list.txt"
    rm -rf extensions/
    echo -e "${GREEN}✅ Extensions removed (list saved)${NC}"
fi
echo ""

# Remove translations
echo -e "${YELLOW}[4/8]${NC} Removing translations..."
if [ -d "translations" ]; then
    rm -rf translations/
    echo -e "${GREEN}✅ Translations removed${NC}"
fi
echo ""

# Remove node_modules and lock
echo -e "${YELLOW}[5/8]${NC} Removing node_modules and lock file..."
rm -rf node_modules/
rm -f package-lock.json
echo -e "${GREEN}✅ Dependencies cleaned${NC}"
echo ""

# Remove build artifacts
echo -e "${YELLOW}[6/8]${NC} Removing build artifacts..."
rm -rf .evershop/
rm -rf themes/*/dist/ 2>/dev/null || true
echo -e "${GREEN}✅ Build artifacts removed${NC}"
echo ""

# Commit clean state
echo -e "${YELLOW}[7/8]${NC} Committing clean state..."
git add .
git commit -m "chore: remove upstream code - keep only custom files" --allow-empty
echo -e "${GREEN}✅ Clean state committed${NC}"
echo ""

# Add and fetch upstream
echo -e "${YELLOW}[8/8]${NC} Setting up EverShop upstream..."

# Check if remote already exists
if git remote | grep -q "^evershop$"; then
    echo "   Upstream remote already exists, updating..."
    git remote set-url evershop "$EVERSHOP_REPO"
else
    echo "   Adding upstream remote..."
    git remote add evershop "$EVERSHOP_REPO"
fi

echo "   Fetching upstream..."
git fetch evershop

echo -e "${GREEN}✅ EverShop upstream configured${NC}"
echo ""

# Show upstream branches
echo -e "${BLUE}Available upstream branches:${NC}"
git branch -r | grep evershop | head -10
echo ""

# Merge upstream
echo -e "${YELLOW}Merging EverShop upstream...${NC}"
echo ""
read -p "Ready to merge upstream/$UPSTREAM_BRANCH? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "   Merging evershop/$UPSTREAM_BRANCH..."
    
    # Try to merge
    if git merge --allow-unrelated-histories -X theirs "evershop/$UPSTREAM_BRANCH" --no-edit; then
        echo -e "${GREEN}✅ Upstream merged successfully${NC}"
    else
        echo -e "${YELLOW}⚠️  Merge conflicts detected${NC}"
        echo -e "${YELLOW}   Please resolve conflicts manually${NC}"
        echo ""
        echo -e "${YELLOW}After resolving:${NC}"
        echo -e "   git add ."
        echo -e "   git commit -m 'chore: merge upstream EverShop'"
        echo -e "   ./scripts/refactor-step4-restore-custom.sh"
        exit 1
    fi
else
    echo -e "${YELLOW}Merge skipped. You can merge later with:${NC}"
    echo -e "   git merge --allow-unrelated-histories -X theirs evershop/$UPSTREAM_BRANCH"
fi

echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  CLEAN AND CLONE COMPLETED                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ Completed Steps:${NC}"
echo -e "   1. Created refactor branch"
echo -e "   2. Removed old packages"
echo -e "   3. Removed standard extensions"
echo -e "   4. Removed translations"
echo -e "   5. Cleaned dependencies"
echo -e "   6. Removed build artifacts"
echo -e "   7. Committed clean state"
echo -e "   8. Configured upstream"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo -e "   1. Review the merge result"
echo -e "   2. Run: ./scripts/refactor-step4-restore-custom.sh"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

