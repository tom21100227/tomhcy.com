#!/bin/bash

# Development server script for tomhcy.com
# This script starts Jekyll with development configuration

echo "🚀 Starting Jekyll development server..."
echo "📍 Site will be available at: http://localhost:4000"
echo "🔄 Auto-reload enabled for faster development"
echo ""
echo "ℹ️  Note: Asset optimization is disabled in development"
echo "   The production build (via GitHub Actions) will inline and minify assets"
echo ""

# Start Jekyll with development configuration
bundle exec jekyll serve --config _config.yml,_config_dev.yml --watch --incremental --livereload
