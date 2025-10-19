#!/bin/bash
# GitHub Actions Self-hosted Runner Setup Script
# Must be run as hapas user

set -e

# Configuration
RUNNER_NAME="hapas-production-server"
RUNNER_LABELS="self-hosted,Linux,X64,hapas,production"
RUNNER_DIR="/home/hapas/actions-runner"
RUNNER_USER="hapas"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as correct user
if [ "$(whoami)" != "$RUNNER_USER" ]; then
    error "This script must be run as $RUNNER_USER user"
fi

log "Setting up GitHub Actions self-hosted runner..."

# Create runner directory
mkdir -p "$RUNNER_DIR"
cd "$RUNNER_DIR"

# Download latest runner
log "Downloading GitHub Actions runner..."
RUNNER_VERSION=$(curl -s https://api.github.com/repos/actions/runner/releases/latest | grep -o '"tag_name": "[^"]*' | cut -d'"' -f4 | sed 's/v//')

if [ -z "$RUNNER_VERSION" ]; then
    error "Failed to get latest runner version"
fi

log "Latest runner version: $RUNNER_VERSION"

# Download and extract runner
RUNNER_PACKAGE="actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz"
if [ ! -f "$RUNNER_PACKAGE" ]; then
    curl -O -L "https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/${RUNNER_PACKAGE}"
fi

# Verify hash (optional but recommended)
log "Extracting runner package..."
tar xzf "$RUNNER_PACKAGE"

success "Runner downloaded and extracted"

# Install dependencies
log "Installing runner dependencies..."
sudo apt-get update > /dev/null 2>&1
sudo apt-get install -y libicu-dev > /dev/null 2>&1

# Runner configuration instructions
log "GitHub Runner setup completed!"
echo ""
echo "=================================================================="
echo "NEXT STEPS - Manual Configuration Required:"
echo "=================================================================="
echo ""
echo "1. Go to your GitHub repository: https://github.com/xingcorp/hapas_ecommerce"
echo "2. Navigate to: Settings → Actions → Runners → New self-hosted runner"
echo "3. Select Linux as the operating system"
echo "4. Copy the configuration command and run it in this directory:"
echo "   cd $RUNNER_DIR"
echo "   # Paste the ./config.sh command from GitHub here"
echo ""
echo "5. When prompted for runner name, use: $RUNNER_NAME"
echo "6. When prompted for labels, use: $RUNNER_LABELS"
echo "7. When prompted for work folder, press Enter (use default)"
echo ""
echo "8. After configuration, start the runner as a service:"
echo "   sudo ./svc.sh install $RUNNER_USER"
echo "   sudo ./svc.sh start"
echo ""
echo "=================================================================="
echo "Runner directory: $RUNNER_DIR"
echo "Runner user: $RUNNER_USER"
echo "=================================================================="

# Create service management script
cat > "$RUNNER_DIR/manage-runner.sh" << 'EOMANAGE'
#!/bin/bash
# GitHub Runner Service Management Script

RUNNER_DIR="/home/hapas/actions-runner"
RUNNER_USER="hapas"

case "$1" in
    start)
        echo "Starting GitHub Actions runner..."
        cd "$RUNNER_DIR" && sudo ./svc.sh start
        ;;
    stop)
        echo "Stopping GitHub Actions runner..."
        cd "$RUNNER_DIR" && sudo ./svc.sh stop
        ;;
    status)
        echo "GitHub Actions runner status:"
        cd "$RUNNER_DIR" && sudo ./svc.sh status
        ;;
    restart)
        echo "Restarting GitHub Actions runner..."
        cd "$RUNNER_DIR" && sudo ./svc.sh stop
        sleep 2
        cd "$RUNNER_DIR" && sudo ./svc.sh start
        ;;
    logs)
        echo "GitHub Actions runner logs:"
        sudo journalctl -u actions.runner.xingcorp-hapas_ecommerce.hapas-production-server.service -f
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs}"
        exit 1
        ;;
esac
EOMANAGE

chmod +x "$RUNNER_DIR/manage-runner.sh"
success "Runner management script created at $RUNNER_DIR/manage-runner.sh"

# Create systemd service helper
cat > /tmp/runner-service-setup.sh << 'EOSERVICE'
#!/bin/bash
# Run this script as root after configuring the runner

RUNNER_DIR="/home/hapas/actions-runner"
RUNNER_USER="hapas"

if [ "$(whoami)" != "root" ]; then
    echo "This script must be run as root (sudo)"
    exit 1
fi

cd "$RUNNER_DIR"

# Install as service
./svc.sh install "$RUNNER_USER"

# Start service
./svc.sh start

# Enable auto-start
systemctl enable actions.runner.xingcorp-hapas_ecommerce.hapas-production-server.service

echo "GitHub Actions runner service installed and started"
echo "Service status:"
./svc.sh status
EOSERVICE

chmod +x /tmp/runner-service-setup.sh
success "Service setup script created at /tmp/runner-service-setup.sh"

log "Setup complete! Follow the instructions above to complete runner configuration."
