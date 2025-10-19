#!/bin/bash

###############################################################################
# HAPAS ECOMMERCE - COMPLETE REFACTOR AUTOMATION
# Chạy tất cả các bước refactor tự động
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="/Volumes/DoanBHSST9/Outsource/hapas_ecommerce"
SCRIPTS_DIR="$PROJECT_ROOT/scripts"

clear

echo -e "${CYAN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   HAPAS ECOMMERCE - UPSTREAM REFACTOR AUTOMATION             ║
║                                                               ║
║   Tự động đồng bộ với EverShop upstream                      ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"
echo ""

# Verify we're in the right directory
if [ ! -d "$PROJECT_ROOT" ]; then
    echo -e "${RED}❌ Project directory not found: $PROJECT_ROOT${NC}"
    exit 1
fi

if [ ! -f "$PROJECT_ROOT/package.json" ]; then
    echo -e "${RED}❌ package.json not found. Are you in the right directory?${NC}"
    exit 1
fi

echo -e "${BLUE}Project Root:${NC} $PROJECT_ROOT"
echo -e "${BLUE}Scripts Directory:${NC} $SCRIPTS_DIR"
echo ""

# Show what will be done
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  REFACTOR PROCESS OVERVIEW${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}Step 1:${NC} Create full backup of project"
echo -e "        - Git snapshot branch"
echo -e "        - Tarball backup"
echo ""
echo -e "${GREEN}Step 2:${NC} Preserve custom code"
echo -e "        - HAPAS theme"
echo -e "        - Docker configs"
echo -e "        - CI/CD workflows"
echo -e "        - Deployment scripts"
echo -e "        - Documentation"
echo ""
echo -e "${GREEN}Step 3:${NC} Clean and clone upstream"
echo -e "        - Remove old core packages"
echo -e "        - Add EverShop upstream remote"
echo -e "        - Merge latest upstream code"
echo ""
echo -e "${GREEN}Step 4:${NC} Restore custom code"
echo -e "        - Restore all HAPAS customizations"
echo -e "        - Merge configurations"
echo ""
echo -e "${GREEN}Step 5:${NC} Build and test"
echo -e "        - Install dependencies"
echo -e "        - Compile TypeScript"
echo -e "        - Build project"
echo -e "        - Verify integrity"
echo ""
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Warning
echo -e "${RED}⚠️  WARNING:${NC} This process will:"
echo -e "   • Create a new Git branch"
echo -e "   • Remove all current EverShop core code"
echo -e "   • Download latest code from upstream"
echo -e "   • May take 15-30 minutes to complete"
echo ""
echo -e "${GREEN}✅ Safety measures:${NC}"
echo -e "   • Full backup will be created first"
echo -e "   • Git snapshot branch for rollback"
echo -e "   • Can rollback at any time"
echo ""

read -p "Do you want to proceed? (type 'yes' to confirm): " -r
echo ""
if [ "$REPLY" != "yes" ]; then
    echo -e "${YELLOW}Aborted by user${NC}"
    exit 0
fi

# Make all scripts executable
chmod +x "$SCRIPTS_DIR"/refactor-step*.sh

# Track start time
START_TIME=$(date +%s)

# Step 1: Backup
echo ""
echo -e "${MAGENTA}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║  STEP 1 OF 5: BACKUP                                     ║${NC}"
echo -e "${MAGENTA}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
if [ -f "$SCRIPTS_DIR/refactor-step1-backup.sh" ]; then
    "$SCRIPTS_DIR/refactor-step1-backup.sh"
else
    echo -e "${RED}❌ Step 1 script not found!${NC}"
    exit 1
fi

echo ""
read -p "Press Enter to continue to Step 2..." -r
echo ""

# Step 2: Preserve
echo ""
echo -e "${MAGENTA}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║  STEP 2 OF 5: PRESERVE CUSTOM CODE                       ║${NC}"
echo -e "${MAGENTA}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
if [ -f "$SCRIPTS_DIR/refactor-step2-preserve-custom.sh" ]; then
    "$SCRIPTS_DIR/refactor-step2-preserve-custom.sh"
else
    echo -e "${RED}❌ Step 2 script not found!${NC}"
    exit 1
fi

echo ""
read -p "Press Enter to continue to Step 3..." -r
echo ""

# Step 3: Clean and Clone
echo ""
echo -e "${MAGENTA}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║  STEP 3 OF 5: CLEAN AND CLONE UPSTREAM                   ║${NC}"
echo -e "${MAGENTA}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
if [ -f "$SCRIPTS_DIR/refactor-step3-clean-and-clone.sh" ]; then
    "$SCRIPTS_DIR/refactor-step3-clean-and-clone.sh"
else
    echo -e "${RED}❌ Step 3 script not found!${NC}"
    exit 1
fi

echo ""
read -p "Press Enter to continue to Step 4..." -r
echo ""

# Step 4: Restore
echo ""
echo -e "${MAGENTA}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║  STEP 4 OF 5: RESTORE CUSTOM CODE                        ║${NC}"
echo -e "${MAGENTA}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
if [ -f "$SCRIPTS_DIR/refactor-step4-restore-custom.sh" ]; then
    "$SCRIPTS_DIR/refactor-step4-restore-custom.sh"
else
    echo -e "${RED}❌ Step 4 script not found!${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Manual merge required${NC}"
echo ""
echo -e "${BLUE}Before continuing to Step 5, you need to:${NC}"
echo -e "   1. Open package.json"
echo -e "   2. Add HAPAS custom scripts:"
echo -e '      "migrate:categories": "node ./scripts/migrate-kias-data.js",'
echo -e '      "import:kias-products": "node ./scripts/importKiasProducts.mjs",'
echo -e '      "download:product-images": "node ./scripts/downloadProductImages.mjs",'
echo -e '      "verify:products": "node ./scripts/verifyProducts.mjs"'
echo -e "   3. Review config/default.json"
echo -e "   4. Commit the changes"
echo ""
read -p "Have you completed the manual merge? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Please complete the manual merge and run:${NC}"
    echo -e "   ./scripts/refactor-step5-build-test.sh"
    exit 0
fi

# Step 5: Build and Test
echo ""
echo -e "${MAGENTA}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║  STEP 5 OF 5: BUILD AND TEST                             ║${NC}"
echo -e "${MAGENTA}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
if [ -f "$SCRIPTS_DIR/refactor-step5-build-test.sh" ]; then
    "$SCRIPTS_DIR/refactor-step5-build-test.sh"
else
    echo -e "${RED}❌ Step 5 script not found!${NC}"
    exit 1
fi

# Calculate duration
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

# Final summary
echo ""
echo -e "${CYAN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🎉 REFACTOR PROCESS COMPLETED SUCCESSFULLY! 🎉              ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"
echo ""
echo -e "${GREEN}✅ All steps completed in ${MINUTES}m ${SECONDS}s${NC}"
echo ""
echo -e "${BLUE}What was done:${NC}"
echo -e "   ✅ Full backup created"
echo -e "   ✅ Custom code preserved"
echo -e "   ✅ Upstream merged"
echo -e "   ✅ Custom code restored"
echo -e "   ✅ Project built and verified"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo -e "   1. Run manual tests:"
echo -e "      $ npm run dev"
echo -e "      $ open http://localhost:3000"
echo ""
echo -e "   2. Test Docker deployment:"
echo -e "      $ docker-compose up -d"
echo ""
echo -e "   3. If all tests pass, push changes:"
echo -e "      $ git push origin refactor/upstream-sync"
echo ""
echo -e "   4. Create Pull Request to merge into main"
echo ""
echo -e "${GREEN}📄 Check REFACTOR_SUMMARY.md for detailed report${NC}"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"

