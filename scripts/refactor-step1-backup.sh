#!/bin/bash

###############################################################################
# HAPAS ECOMMERCE - REFACTOR STEP 1: BACKUP
# Tạo backup toàn bộ project trước khi refactor
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
BACKUP_DIR="/Volumes/DoanBHSST9/Outsource"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="hapas_ecommerce_backup_${TIMESTAMP}"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  HAPAS ECOMMERCE - REFACTOR STEP 1: BACKUP                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Verify we're in the right directory
echo -e "${YELLOW}[1/5]${NC} Verifying project directory..."
if [ ! -d "$PROJECT_ROOT" ]; then
    echo -e "${RED}❌ Project directory not found: $PROJECT_ROOT${NC}"
    exit 1
fi

if [ ! -f "$PROJECT_ROOT/package.json" ]; then
    echo -e "${RED}❌ package.json not found. Are you in the right directory?${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Project directory verified${NC}"
echo ""

# Step 2: Check Git status
echo -e "${YELLOW}[2/5]${NC} Checking Git status..."
cd "$PROJECT_ROOT"

if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes:${NC}"
    git status --short
    echo ""
    read -p "Do you want to commit these changes before backup? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "chore: commit before refactor backup - $(date)"
        echo -e "${GREEN}✅ Changes committed${NC}"
    else
        echo -e "${YELLOW}⚠️  Continuing without committing. Backup will include uncommitted changes.${NC}"
    fi
fi

echo -e "${GREEN}✅ Git status checked${NC}"
echo ""

# Step 3: Create Git snapshot
echo -e "${YELLOW}[3/5]${NC} Creating Git snapshot branch..."
SNAPSHOT_BRANCH="snapshot/pre-refactor-${TIMESTAMP}"

git checkout -b "$SNAPSHOT_BRANCH"
git add .
git commit -m "chore: snapshot before upstream refactor - $TIMESTAMP" --allow-empty

echo -e "${GREEN}✅ Git snapshot created: ${SNAPSHOT_BRANCH}${NC}"
echo ""

# Step 4: Create tarball backup
echo -e "${YELLOW}[4/5]${NC} Creating tarball backup..."
cd "$BACKUP_DIR"

echo "   Compressing project files..."
tar -czf "${BACKUP_NAME}.tar.gz" \
    --exclude='node_modules' \
    --exclude='.evershop' \
    --exclude='media/*' \
    --exclude='*.log' \
    hapas_ecommerce/

BACKUP_SIZE=$(du -h "${BACKUP_NAME}.tar.gz" | cut -f1)
echo -e "${GREEN}✅ Backup created: ${BACKUP_NAME}.tar.gz (${BACKUP_SIZE})${NC}"
echo ""

# Step 5: Verify backup
echo -e "${YELLOW}[5/5]${NC} Verifying backup integrity..."
if tar -tzf "${BACKUP_NAME}.tar.gz" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backup verified successfully${NC}"
else
    echo -e "${RED}❌ Backup verification failed!${NC}"
    exit 1
fi
echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  BACKUP COMPLETED SUCCESSFULLY                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}📦 Backup Information:${NC}"
echo -e "   Location: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
echo -e "   Size: ${BACKUP_SIZE}"
echo -e "   Git Branch: ${SNAPSHOT_BRANCH}"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo -e "   1. Review the backup location"
echo -e "   2. Run: ./scripts/refactor-step2-preserve-custom.sh"
echo -e "   3. Keep this backup safe until refactor is complete"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# Create backup info file
cat > "${BACKUP_DIR}/${BACKUP_NAME}.info" << EOF
HAPAS ECOMMERCE - BACKUP INFORMATION
====================================

Backup Date: $(date)
Backup File: ${BACKUP_NAME}.tar.gz
Backup Size: ${BACKUP_SIZE}
Git Branch: ${SNAPSHOT_BRANCH}
Git Commit: $(git -C "$PROJECT_ROOT" rev-parse HEAD)

RESTORE INSTRUCTIONS
====================

To restore this backup:

1. Extract the backup:
   cd /Volumes/DoanBHSST9/Outsource
   tar -xzf ${BACKUP_NAME}.tar.gz

2. Or checkout the Git snapshot:
   git checkout ${SNAPSHOT_BRANCH}

IMPORTANT NOTES
===============

- This backup was created before the upstream refactor
- Keep this backup until refactor is verified
- Test the new version thoroughly before deleting this backup
- Backup includes all custom code, configs, and documentation
EOF

echo -e "${GREEN}✅ Backup info saved: ${BACKUP_NAME}.info${NC}"
echo ""

# Return to original branch
cd "$PROJECT_ROOT"
git checkout -

echo -e "${GREEN}🎉 Ready for Step 2!${NC}"

