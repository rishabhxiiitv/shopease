#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# Creates ECR repositories, S3 bucket, and builds + pushes Docker images
# Prerequisites: aws cli configured, docker running
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

AWS_REGION=${AWS_REGION:-us-east-1}
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
IMAGE_TAG=${IMAGE_TAG:-latest}

echo "AWS Account: $AWS_ACCOUNT_ID"
echo "ECR Registry: $ECR_REGISTRY"

# ── Create ECR repositories ───────────────────────────────────────────────────
for repo in shopease-backend shopease-frontend; do
  aws ecr describe-repositories --repository-names "$repo" --region "$AWS_REGION" 2>/dev/null \
    || aws ecr create-repository --repository-name "$repo" \
         --image-scanning-configuration scanOnPush=true \
         --region "$AWS_REGION"
  echo "Repository ready: $repo"
done

# ── Create S3 bucket for product images ──────────────────────────────────────
BUCKET="shopease-images"
aws s3api head-bucket --bucket "$BUCKET" 2>/dev/null \
  || aws s3api create-bucket --bucket "$BUCKET" --region "$AWS_REGION" \
       --create-bucket-configuration LocationConstraint="$AWS_REGION"

# Apply public-read policy for product images
aws s3api put-bucket-policy --bucket "$BUCKET" \
  --policy file://s3-bucket-policy.json

# Block public access except for object ACLs (allow our policy)
aws s3api put-public-access-block --bucket "$BUCKET" \
  --public-access-block-configuration \
    BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false

echo "S3 bucket ready: $BUCKET"

# ── Login to ECR ─────────────────────────────────────────────────────────────
aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$ECR_REGISTRY"

# ── Build & push backend ──────────────────────────────────────────────────────
echo ">>> Building backend..."
docker build -f docker/Dockerfile.backend -t shopease-backend ./backend
docker tag  shopease-backend:latest "${ECR_REGISTRY}/shopease-backend:${IMAGE_TAG}"
docker push "${ECR_REGISTRY}/shopease-backend:${IMAGE_TAG}"
echo "Backend pushed: ${ECR_REGISTRY}/shopease-backend:${IMAGE_TAG}"

# ── Build & push frontend ─────────────────────────────────────────────────────
echo ">>> Building frontend..."
docker build -f docker/Dockerfile.frontend -t shopease-frontend ./frontend
docker tag  shopease-frontend:latest "${ECR_REGISTRY}/shopease-frontend:${IMAGE_TAG}"
docker push "${ECR_REGISTRY}/shopease-frontend:${IMAGE_TAG}"
echo "Frontend pushed: ${ECR_REGISTRY}/shopease-frontend:${IMAGE_TAG}"

echo ""
echo "✅ All images pushed to ECR!"
echo ""
echo "Update your k8s manifests with:"
echo "  image: ${ECR_REGISTRY}/shopease-backend:${IMAGE_TAG}"
echo "  image: ${ECR_REGISTRY}/shopease-frontend:${IMAGE_TAG}"
