#!/bin/bash

# Fresh Development Server Script
# This script ensures a clean start every time

echo "🧹 Cleaning up previous processes and cache..."

# Kill any existing Next.js processes
pkill -f "next dev" || true

# Remove build artifacts and cache
rm -rf .next
rm -rf node_modules/.cache
rm -rf .swc

echo "🚀 Starting fresh development server..."

# Start development server
npm run dev 