#!/bin/bash

# Modern SEO Marketing Site Setup Script
# This script sets up the development environment

set -e

echo "🚀 Setting up Modern SEO Marketing Site..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first:"
    echo "npm install -g pnpm"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. You'll need to install PostgreSQL and Redis manually."
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Create environment files if they don't exist
if [ ! -f "apps/web/.env.local" ]; then
    echo "📝 Creating frontend environment file..."
    cp env.example apps/web/.env.local
    echo "✅ Created apps/web/.env.local - please update with your values"
fi

if [ ! -f "apps/api/.env" ]; then
    echo "📝 Creating backend environment file..."
    cp env.example apps/api/.env
    echo "✅ Created apps/api/.env - please update with your values"
fi

# Start databases with Docker if available
if command -v docker &> /dev/null; then
    echo "🐳 Starting databases with Docker..."
    
    # Start PostgreSQL
    docker run --name modern-seo-postgres \
        -e POSTGRES_PASSWORD=strapi_password \
        -e POSTGRES_USER=strapi \
        -e POSTGRES_DB=modern_seo_site \
        -p 5432:5432 \
        -d postgres:15-alpine || echo "PostgreSQL container already exists"
    
    # Start Redis
    docker run --name modern-seo-redis \
        -p 6379:6379 \
        -d redis:7-alpine || echo "Redis container already exists"
    
    echo "✅ Databases started"
else
    echo "⚠️  Please install and start PostgreSQL and Redis manually"
fi

# Build applications
echo "🔨 Building applications..."
pnpm build

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update environment variables in apps/web/.env.local and apps/api/.env"
echo "2. Start the development servers:"
echo "   pnpm dev"
echo "3. Access the applications:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:1337"
echo ""
echo "Happy coding! 🎉"
