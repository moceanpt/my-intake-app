#!/bin/bash

echo "🔧 AWS S3 Setup for My Intake App"
echo "=================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    touch .env
fi

echo "Please add the following to your .env file:"
echo ""
echo "# AWS S3 Configuration"
echo "AWS_ACCESS_KEY_ID=\"your-aws-access-key-id\""
echo "AWS_SECRET_ACCESS_KEY=\"your-aws-secret-access-key\""
echo "AWS_REGION=\"us-east-1\""
echo "AWS_S3_BUCKET_NAME=\"my-intake-app-uploads\""
echo ""

echo "📋 Next steps:"
echo "1. Add your AWS credentials to .env file"
echo "2. Create S3 bucket: my-intake-app-uploads"
echo "3. Restart your development server"
echo ""

echo "🚀 Ready to test file uploads!" 