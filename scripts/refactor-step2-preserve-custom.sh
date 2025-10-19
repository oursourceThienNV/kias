#!/bin/bash

###############################################################################
# HAPAS ECOMMERCE - REFACTOR STEP 2: PRESERVE CUSTOM CODE
# Lưu giữ tất cả custom code vào thư mục tạm
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
CUSTOM_BACKUP="/tmp/hapas_custom_backup_$(date +%Y%m%d_%H%M%S)"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  HAPAS ECOMMERCE - REFACTOR STEP 2: PRESERVE CUSTOM       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verify we're in the right directory
if [ ! -d "$PROJECT_ROOT" ]; then
    echo -e "${RED}❌ Project directory not found: $PROJECT_ROOT${NC}"
    exit 1
fi

cd "$PROJECT_ROOT"

# Create backup directory
echo -e "${YELLOW}[1/10]${NC} Creating custom backup directory..."
mkdir -p "$CUSTOM_BACKUP"
echo -e "${GREEN}✅ Backup directory: $CUSTOM_BACKUP${NC}"
echo ""

# Preserve hidden directories
echo -e "${YELLOW}[2/10]${NC} Preserving hidden directories..."
for dir in .cursor .github .history .husky; do
    if [ -d "$dir" ]; then
        echo "   Copying $dir..."
        cp -r "$dir" "$CUSTOM_BACKUP/"
    fi
done
echo -e "${GREEN}✅ Hidden directories preserved${NC}"
echo ""

# Preserve theme
echo -e "${YELLOW}[3/10]${NC} Preserving HAPAS theme..."
if [ -d "themes/hapas" ]; then
    mkdir -p "$CUSTOM_BACKUP/themes"
    cp -r themes/hapas "$CUSTOM_BACKUP/themes/"
    echo -e "${GREEN}✅ HAPAS theme preserved ($(du -sh themes/hapas | cut -f1))${NC}"
else
    echo -e "${YELLOW}⚠️  HAPAS theme not found${NC}"
fi
echo ""

# Preserve data
echo -e "${YELLOW}[4/10]${NC} Preserving data directory..."
if [ -d "data" ]; then
    cp -r data "$CUSTOM_BACKUP/"
    echo -e "${GREEN}✅ Data preserved ($(du -sh data | cut -f1))${NC}"
else
    echo -e "${YELLOW}⚠️  Data directory not found${NC}"
fi
echo ""

# Preserve analysis
echo -e "${YELLOW}[5/10]${NC} Preserving analysis documents..."
if [ -d "analysis" ]; then
    cp -r analysis "$CUSTOM_BACKUP/"
    echo -e "${GREEN}✅ Analysis documents preserved${NC}"
else
    echo -e "${YELLOW}⚠️  Analysis directory not found${NC}"
fi
echo ""

# Preserve scripts
echo -e "${YELLOW}[6/10]${NC} Preserving deployment scripts..."
if [ -d "scripts" ]; then
    cp -r scripts "$CUSTOM_BACKUP/"
    echo -e "${GREEN}✅ Scripts preserved${NC}"
else
    echo -e "${YELLOW}⚠️  Scripts directory not found${NC}"
fi
echo ""

# Preserve config
echo -e "${YELLOW}[7/10]${NC} Preserving configuration..."
if [ -d "config" ]; then
    cp -r config "$CUSTOM_BACKUP/"
    echo -e "${GREEN}✅ Configuration preserved${NC}"
else
    echo -e "${YELLOW}⚠️  Config directory not found${NC}"
fi
echo ""

# Preserve Docker files
echo -e "${YELLOW}[8/10]${NC} Preserving Docker files..."
mkdir -p "$CUSTOM_BACKUP/docker"
for file in docker-compose*.yml Dockerfile*; do
    if [ -f "$file" ]; then
        echo "   Copying $file..."
        cp "$file" "$CUSTOM_BACKUP/docker/"
    fi
done
echo -e "${GREEN}✅ Docker files preserved${NC}"
echo ""

# Preserve documentation
echo -e "${YELLOW}[9/10]${NC} Preserving custom documentation..."
mkdir -p "$CUSTOM_BACKUP/docs"

# List of custom docs to preserve
CUSTOM_DOCS=(
    "WARP.md"
    "DEPLOYMENT_GUIDE.md"
    "DEPLOYMENT_STATUS.md"
    "README_CI_CD.md"
    "CRITICAL-ISSUES-RESOLUTION-COMPLETE.md"
    "FONT-RENDERING-INVESTIGATION-COMPLETE.md"
    "HAPAS-NAVIGATION-IMPLEMENTATION-COMPLETE.md"
    "HAPAS-THEME-INTEGRATION-TESTING.md"
    "KIAS-COLOR-MAPPING.md"
    "MIGRATION_GUIDE.md"
    "NAVIGATION-CATEGORY-ANALYSIS-COMPLETE.md"
    "PHASE-2A-MIGRATION-REPORT.md"
    "hapas_shop_huong_dan_day_du.md"
    "REFACTOR_PLAN.md"
)

for doc in "${CUSTOM_DOCS[@]}"; do
    if [ -f "$doc" ]; then
        cp "$doc" "$CUSTOM_BACKUP/docs/"
    fi
done
echo -e "${GREEN}✅ Documentation preserved${NC}"
echo ""

# Preserve test and SQL scripts
echo -e "${YELLOW}[10/10]${NC} Preserving test and SQL scripts..."
mkdir -p "$CUSTOM_BACKUP/scripts_root"

# Copy test scripts
for file in test-*.js validate-migration-system.js reset-admin-password.js; do
    if [ -f "$file" ]; then
        cp "$file" "$CUSTOM_BACKUP/scripts_root/"
    fi
done

# Copy SQL scripts
for file in *.sql; do
    if [ -f "$file" ]; then
        cp "$file" "$CUSTOM_BACKUP/scripts_root/"
    fi
done

# Copy public custom assets
if [ -d "public/images" ]; then
    mkdir -p "$CUSTOM_BACKUP/public_custom/images"
    cp public/images/kias-placeholder.svg "$CUSTOM_BACKUP/public_custom/images/" 2>/dev/null || true
fi

echo -e "${GREEN}✅ Test and SQL scripts preserved${NC}"
echo ""

# Create manifest
echo -e "${YELLOW}Creating manifest file...${NC}"
cat > "$CUSTOM_BACKUP/MANIFEST.txt" << EOF
HAPAS ECOMMERCE - CUSTOM CODE BACKUP
====================================

Created: $(date)
Source: $PROJECT_ROOT
Backup: $CUSTOM_BACKUP

CONTENTS
========

$(tree -L 2 "$CUSTOM_BACKUP" 2>/dev/null || find "$CUSTOM_BACKUP" -maxdepth 2 -type d)

FILE COUNT
==========

Total files: $(find "$CUSTOM_BACKUP" -type f | wc -l)
Total size: $(du -sh "$CUSTOM_BACKUP" | cut -f1)

RESTORE INSTRUCTIONS
====================

After cleaning the project and cloning upstream:

1. Copy hidden directories:
   cp -r $CUSTOM_BACKUP/.* /path/to/project/

2. Copy theme:
   cp -r $CUSTOM_BACKUP/themes/hapas /path/to/project/themes/

3. Copy other custom files:
   cp -r $CUSTOM_BACKUP/data /path/to/project/
   cp -r $CUSTOM_BACKUP/analysis /path/to/project/
   cp -r $CUSTOM_BACKUP/scripts /path/to/project/
   cp -r $CUSTOM_BACKUP/config /path/to/project/
   
4. Copy Docker files:
   cp $CUSTOM_BACKUP/docker/* /path/to/project/
   
5. Copy documentation:
   cp $CUSTOM_BACKUP/docs/* /path/to/project/
   
6. Copy root scripts:
   cp $CUSTOM_BACKUP/scripts_root/* /path/to/project/

Or use the automated restore script:
   ./scripts/refactor-step4-restore-custom.sh

IMPORTANT
=========

- Review config/default.json before restoring
- Merge package.json manually
- Check for conflicts with upstream files
- Test after restoration
EOF

echo -e "${GREEN}✅ Manifest created${NC}"
echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  CUSTOM CODE PRESERVATION COMPLETED                       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}📦 Backup Information:${NC}"
echo -e "   Location: $CUSTOM_BACKUP"
echo -e "   Total Files: $(find "$CUSTOM_BACKUP" -type f | wc -l)"
echo -e "   Total Size: $(du -sh "$CUSTOM_BACKUP" | cut -f1)"
echo ""
echo -e "${YELLOW}📝 Preserved Items:${NC}"
echo -e "   ✅ Hidden directories (.cursor, .github, .history, .husky)"
echo -e "   ✅ HAPAS theme"
echo -e "   ✅ Data directory"
echo -e "   ✅ Analysis documents"
echo -e "   ✅ Deployment scripts"
echo -e "   ✅ Configuration files"
echo -e "   ✅ Docker files"
echo -e "   ✅ Custom documentation"
echo -e "   ✅ Test & SQL scripts"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo -e "   1. Review the preserved files"
echo -e "   2. Run: ./scripts/refactor-step3-clean-and-clone.sh"
echo ""
echo -e "${GREEN}Backup path saved to: refactor-backup-path.txt${NC}"
echo "$CUSTOM_BACKUP" > "$PROJECT_ROOT/refactor-backup-path.txt"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

