#!/bin/bash
cd /home/ec2-user/cloud_resource_management

# Fix Prisma provider to MySQL
sed -i 's/provider = "sqlite"/provider = "mysql"/g' backend/prisma/schema.prisma

# Fix frontend API URL for production (use relative /api)
sed -i "s|'http://localhost:5000/api'|'/api'|g" frontend/src/config.js

# Verify
echo "=== Prisma provider ==="
grep 'provider' backend/prisma/schema.prisma
echo "=== Frontend config ==="
cat frontend/src/config.js

# Generate Prisma client and push schema
cd backend
npx prisma generate
npx prisma db push
cd ..

# Install frontend deps and build
cd frontend
npm install
npm run build
cd ..

# Copy build to nginx root
sudo cp -r frontend/dist/* /var/www/cloud/

# Restart backend
pm2 restart backend --update-env

# Test backend health
sleep 2
echo "=== Backend Health ==="
curl -s http://127.0.0.1:5000/health

echo ""
echo "=== Deploy Complete ==="
