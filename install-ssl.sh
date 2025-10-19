#!/bin/bash
# SSL Certificate Installation Script for kias.phongdoan.com

DOMAIN="kias.phongdoan.com"
EMAIL="admin@phongdoan.com"  # Change this to your email

echo "🔒 Installing SSL Certificate for $DOMAIN"
echo ""

# Check if DNS is correct
echo "Step 1: Checking DNS..."
CURRENT_IP=$(nslookup $DOMAIN 8.8.8.8 2>/dev/null | grep "Address:" | tail -1 | awk '{print $2}')
EXPECTED_IP="160.30.113.193"

if [ "$CURRENT_IP" != "$EXPECTED_IP" ]; then
    echo "❌ DNS not pointing to correct IP!"
    echo "Current: $CURRENT_IP"
    echo "Expected: $EXPECTED_IP"
    echo ""
    echo "Please fix DNS first before installing SSL."
    exit 1
fi

echo "✅ DNS is correct"
echo ""

# Install SSL certificate
echo "Step 2: Installing SSL certificate..."
echo "This will:"
echo "- Obtain certificate from Let's Encrypt"
echo "- Configure Nginx automatically"
echo "- Enable HTTPS redirect"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

# Run certbot
certbot --nginx -d $DOMAIN \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    --redirect \
    --hsts \
    --staple-ocsp

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SSL Certificate installed successfully!"
    echo ""
    echo "Your website is now accessible at:"
    echo "🌐 https://$DOMAIN"
    echo ""
    echo "Testing HTTPS..."
    sleep 2
    curl -I https://$DOMAIN 2>&1 | head -5
else
    echo ""
    echo "❌ SSL installation failed!"
    echo "Check logs: /var/log/letsencrypt/letsencrypt.log"
fi
