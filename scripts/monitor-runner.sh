#!/bin/bash
# Monitor GitHub Actions Runner

RUNNER_DIR="/var/www/hapas_ecommerce/actions-runner"
LOGFILE="/home/hapas/logs/runner-monitor.log"

# Check if runner is running
check_runner() {
    if pgrep -f "Runner.Listener" > /dev/null; then
        echo "[$(date)] ✅ Runner is running" | tee -a "$LOGFILE"
        return 0
    else
        echo "[$(date)] ❌ Runner is not running" | tee -a "$LOGFILE"
        return 1
    fi
}

# Restart runner if needed
restart_runner() {
    echo "[$(date)] 🔄 Restarting runner..." | tee -a "$LOGFILE"
    
    # Kill existing process
    pkill -f "Runner.Listener" || true
    sleep 5
    
    # Start runner
    cd "$RUNNER_DIR"
    su - hapas -c "cd $RUNNER_DIR && nohup ./run.sh > runner.log 2>&1 &"
    
    sleep 10
    if check_runner; then
        echo "[$(date)] ✅ Runner restarted successfully" | tee -a "$LOGFILE"
    else
        echo "[$(date)] ❌ Failed to restart runner" | tee -a "$LOGFILE"
    fi
}

# Main monitoring
if ! check_runner; then
    restart_runner
fi
