#!/bin/bash

###############################################################################
# HAPAS ECOMMERCE - REFACTOR STEP 4: RESTORE CUSTOM CODE
# Khôi phục lại custom code vào project đã merge upstream
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

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  HAPAS ECOMMERCE - REFACTOR STEP 4: RESTORE CUSTOM        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verify custom backup exists
if [ ! -f "$PROJECT_ROOT/refactor-backup-path.txt" ]; then
    echo -e "${RED}❌ Backup path not found!${NC}"
    exit 1
fi

CUSTOM_BACKUP=$(cat "$PROJECT_ROOT/refactor-backup-path.txt")

if [ ! -d "$CUSTOM_BACKUP" ]; then
    echo -e "${RED}❌ Custom backup not found: $CUSTOM_BACKUP${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Using backup: $CUSTOM_BACKUP${NC}"
echo ""

cd "$PROJECT_ROOT"

# Restore hidden directories
echo -e "${YELLOW}[1/10]${NC} Restoring hidden directories..."
for dir in .cursor .github .history .husky; do
    if [ -d "$CUSTOM_BACKUP/$dir" ]; then
        echo "   Restoring $dir..."
        rm -rf "$dir"
        cp -r "$CUSTOM_BACKUP/$dir" .
    fi
done
echo -e "${GREEN}✅ Hidden directories restored${NC}"
echo ""

# Restore theme
echo -e "${YELLOW}[2/10]${NC} Restoring HAPAS theme..."
if [ -d "$CUSTOM_BACKUP/themes/hapas" ]; then
    mkdir -p themes
    rm -rf themes/hapas
    cp -r "$CUSTOM_BACKUP/themes/hapas" themes/
    echo -e "${GREEN}✅ HAPAS theme restored${NC}"
else
    echo -e "${YELLOW}⚠️  HAPAS theme not found in backup${NC}"
fi
echo ""

# Restore data
echo -e "${YELLOW}[3/10]${NC} Restoring data directory..."
if [ -d "$CUSTOM_BACKUP/data" ]; then
    rm -rf data
    cp -r "$CUSTOM_BACKUP/data" .
    echo -e "${GREEN}✅ Data restored${NC}"
else
    echo -e "${YELLOW}⚠️  Data directory not found in backup${NC}"
fi
echo ""

# Restore analysis
echo -e "${YELLOW}[4/10]${NC} Restoring analysis documents..."
if [ -d "$CUSTOM_BACKUP/analysis" ]; then
    rm -rf analysis
    cp -r "$CUSTOM_BACKUP/analysis" .
    echo -e "${GREEN}✅ Analysis documents restored${NC}"
else
    echo -e "${YELLOW}⚠️  Analysis directory not found in backup${NC}"
fi
echo ""

# Restore scripts (careful not to overwrite)
echo -e "${YELLOW}[5/10]${NC} Restoring deployment scripts..."
if [ -d "$CUSTOM_BACKUP/scripts" ]; then
    mkdir -p scripts
    for script in "$CUSTOM_BACKUP/scripts"/*; do
        filename=$(basename "$script")
        if [[ "$filename" != refactor-step* ]]; then
            cp "$script" scripts/
        fi
    done
    echo -e "${GREEN}✅ Deployment scripts restored${NC}"
else
    echo -e "${YELLOW}⚠️  Scripts directory not found in backup${NC}"
fi
echo ""

# Restore Docker files
echo -e "${YELLOW}[6/10]${NC} Restoring Docker files..."
if [ -d "$CUSTOM_BACKUP/docker" ]; then
    cp "$CUSTOM_BACKUP/docker"/* .
    echo -e "${GREEN}✅ Docker files restored${NC}"
else
    echo -e "${YELLOW}⚠️  Docker files not found in backup${NC}"
fi
echo ""

# Restore documentation
echo -e "${YELLOW}[7/10]${NC} Restoring custom documentation..."
if [ -d "$CUSTOM_BACKUP/docs" ]; then
    cp "$CUSTOM_BACKUP/docs"/* .
    echo -e "${GREEN}✅ Documentation restored${NC}"
else
    echo -e "${YELLOW}⚠️  Documentation not found in backup${NC}"
fi
echo ""

# Restore test and SQL scripts
echo -e "${YELLOW}[8/10]${NC} Restoring test and SQL scripts..."
if [ -d "$CUSTOM_BACKUP/scripts_root" ]; then
    cp "$CUSTOM_BACKUP/scripts_root"/* .
    echo -e "${GREEN}✅ Test and SQL scripts restored${NC}"
else
    echo -e "${YELLOW}⚠️  Root scripts not found in backup${NC}"
fi
echo ""

# Restore public custom assets
echo -e "${YELLOW}[9/10]${NC} Restoring public custom assets..."
if [ -d "$CUSTOM_BACKUP/public_custom" ]; then
    mkdir -p public/images
    cp -r "$CUSTOM_BACKUP/public_custom"/* public/
    echo -e "${GREEN}✅ Public assets restored${NC}"
else
    echo -e "${YELLOW}⚠️  Public custom assets not found${NC}"
fi
echo ""

# Handle config merge
echo -e "${YELLOW}[10/10]${NC} Handling configuration merge..."
if [ -f "$CUSTOM_BACKUP/config/default.json" ]; then
    # Save upstream config
    if [ -f "config/default.json" ]; then
        cp config/default.json config/default.upstream.json
    fi
    
    # Copy custom config
    mkdir -p config
    cp "$CUSTOM_BACKUP/config/default.json" config/default.hapas.json
    cp "$CUSTOM_BACKUP/config/default.json" config/default.json
    
    echo -e "${GREEN}✅ Configuration restored${NC}"
    echo -e "${YELLOW}⚠️  Note: Review config/default.json for any needed upstream settings${NC}"
    echo -e "    Upstream config saved as: config/default.upstream.json"
    echo -e "    HAPAS config saved as: config/default.hapas.json"
else
    echo -e "${YELLOW}⚠️  Config not found in backup${NC}"
fi
echo ""

# Commit restored state
echo -e "${YELLOW}Committing restored custom code...${NC}"
git add .
git commit -m "chore: restore HAPAS custom code and configurations" --allow-empty
echo -e "${GREEN}✅ Changes committed${NC}"
echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  CUSTOM CODE RESTORATION COMPLETED                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ Restored Items:${NC}"
echo -e "   ✅ Hidden directories"
echo -e "   ✅ HAPAS theme"
echo -e "   ✅ Data directory"
echo -e "   ✅ Analysis documents"
echo -e "   ✅ Deployment scripts"
echo -e "   ✅ Docker files"
echo -e "   ✅ Documentation"
echo -e "   ✅ Test & SQL scripts"
echo -e "   ✅ Public assets"
echo -e "   ✅ Configuration"
echo ""
echo -e "${YELLOW}⚠️  Manual Steps Required:${NC}"
echo -e "   1. Review and merge package.json"
echo -e "      - Keep upstream dependencies"
echo -e "      - Add HAPAS custom scripts:"
echo -e "        • migrate:categories"
echo -e "        • import:kias-products"
echo -e "        • download:product-images"
echo -e "        • verify:products"
echo ""
echo -e "   2. Review config/default.json"
echo -e "      - Compare with config/default.upstream.json"
echo -e "      - Merge any new upstream settings"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo -e "   1. Manually merge package.json"
echo -e "   2. Run: npm install"
echo -e "   3. Run: ./scripts/refactor-step5-build-test.sh"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

