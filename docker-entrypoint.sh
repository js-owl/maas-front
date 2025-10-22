#!/bin/sh
set -e

# Generate runtime config from environment variables
cat > /usr/share/nginx/html/config.js <<EOF
window.ENV_CONFIG = {
  API_BASE: "${VITE_API_BASE:-/api/v3}",
  BASE_PATH: "${VITE_BASE_PATH:-/}"
};
EOF

# Start Nginx
exec nginx -g "daemon off;"
