#!/bin/bash
# DNS Check Script for kias.phongdoan.com

DOMAIN="kias.phongdoan.com"
EXPECTED_IP="160.30.113.193"

echo "🔍 Checking DNS for $DOMAIN..."
echo "Expected IP: $EXPECTED_IP"
echo ""

# Check DNS with multiple servers
echo "=== Google DNS (8.8.8.8) ==="
CURRENT_IP=$(nslookup $DOMAIN 8.8.8.8 2>/dev/null | grep "Address:" | tail -1 | awk '{print $2}')
echo "Current IP: $CURRENT_IP"

if [ "$CURRENT_IP" == "$EXPECTED_IP" ]; then
    echo "✅ DNS is correct!"
else
    echo "❌ DNS mismatch! Please update DNS record at Tino.vn"
    echo ""
    echo "Steps to fix:"
    echo "1. Login to https://tino.vn/"
    echo "2. Go to DNS management for phongdoan.com"
    echo "3. Update A record: kias -> $EXPECTED_IP"
    echo "4. Wait 5-15 minutes for propagation"
fi

echo ""
echo "=== Local DNS Cache ==="
dig $DOMAIN +short 2>/dev/null || echo "dig not available"

echo ""
echo "=== Test HTTP Access ==="
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN 2>/dev/null || echo "000")
echo "HTTP Status: $HTTP_STATUS"

if [ "$HTTP_STATUS" == "200" ]; then
    echo "✅ Website accessible!"
elif [ "$HTTP_STATUS" == "000" ]; then
    echo "❌ Cannot connect (DNS not resolved or server not reachable)"
else
    echo "⚠️ Website returned status: $HTTP_STATUS"
fi
