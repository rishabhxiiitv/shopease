#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# ShopEase — EC2 Bootstrap & Deployment Script
# Run this as user-data on a fresh Amazon Linux 2023 / Ubuntu 22.04 EC2 instance
# or SSH in and execute manually.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

AWS_REGION=${AWS_REGION:-us-east-1}
ECR_REGISTRY=${ECR_REGISTRY:-"123456789012.dkr.ecr.us-east-1.amazonaws.com"}
IMAGE_TAG=${IMAGE_TAG:-latest}

# ── 1. System updates ─────────────────────────────────────────────────────────
echo ">>> Installing system dependencies..."
if command -v apt-get &>/dev/null; then
  apt-get update -y
  apt-get install -y docker.io docker-compose-plugin awscli curl git
  systemctl enable --now docker
  usermod -aG docker ubuntu
elif command -v dnf &>/dev/null; then
  dnf update -y
  dnf install -y docker docker-compose-plugin awscli curl git
  systemctl enable --now docker
  usermod -aG docker ec2-user
fi

# ── 2. Authenticate Docker with ECR ──────────────────────────────────────────
echo ">>> Logging in to ECR..."
aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$ECR_REGISTRY"

# ── 3. Pull latest images ─────────────────────────────────────────────────────
echo ">>> Pulling Docker images..."
docker pull "${ECR_REGISTRY}/shopease-backend:${IMAGE_TAG}"
docker pull "${ECR_REGISTRY}/shopease-frontend:${IMAGE_TAG}"

# ── 4. Clone repo / update compose file ──────────────────────────────────────
APP_DIR="/opt/shopease"
mkdir -p "$APP_DIR"
cd "$APP_DIR"

if [ ! -f "docker-compose.yml" ]; then
  echo ">>> Copying docker-compose files..."
  # In real deployments, clone from git or pull from S3
  # git clone https://github.com/your-org/shopease.git .
  # aws s3 cp s3://your-bucket/docker-compose.prod.yml .
  echo "Place your docker-compose files in $APP_DIR"
fi

# ── 5. Write .env from environment variables ──────────────────────────────────
cat > .env <<EOF
JWT_SECRET=${JWT_SECRET}
AWS_REGION=${AWS_REGION}
AWS_ACCESS_KEY=${AWS_ACCESS_KEY}
AWS_SECRET_KEY=${AWS_SECRET_KEY}
AWS_S3_BUCKET=${AWS_S3_BUCKET}
RDS_HOST=${RDS_HOST}
RDS_DB=${RDS_DB:-shopease}
RDS_USER=${RDS_USER}
RDS_PASSWORD=${RDS_PASSWORD}
ECR_REGISTRY=${ECR_REGISTRY}
IMAGE_TAG=${IMAGE_TAG}
FRONTEND_URL=${FRONTEND_URL:-http://localhost}
EOF

chmod 600 .env

# ── 6. Start services ─────────────────────────────────────────────────────────
echo ">>> Starting ShopEase..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --remove-orphans

echo ""
echo "✅ ShopEase deployed successfully!"
echo "   Frontend: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo "   Backend:  http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8080/api"
