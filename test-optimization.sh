#!/bin/bash

# Test script for asset optimization
# This script tests the asset inlining process locally

echo "🧪 Testing asset optimization process..."

# Clean previous builds
rm -rf _site

# Build with production environment
echo "📦 Building with production settings..."
JEKYLL_ENV=production bundle exec jekyll build

# Check if inlining worked
echo "🔍 Checking optimization results..."

# Check for inlined CSS
if grep -q "<style>" _site/index.html; then
    echo "✅ CSS inlining: SUCCESS"
else
    echo "❌ CSS inlining: FAILED"
fi

# Check for inlined JS
if grep -q "document.addEventListener('DOMContentLoaded'" _site/index.html; then
    echo "✅ JS inlining: SUCCESS"
else
    echo "❌ JS inlining: FAILED"
fi

# Check file sizes
echo "📊 File size analysis:"
echo "  index.html: $(wc -c < _site/index.html) bytes"

# Count HTTP requests saved
css_links=$(grep -c 'href.*\.css' _site/index.html | grep -v cdn || echo 0)
js_scripts=$(grep -c 'src.*\.js' _site/index.html | grep -v cdn || echo 0)

echo "🚀 Optimization summary:"
echo "  HTTP requests saved: $((4 - css_links + 4 - js_scripts)) requests"
echo "  Remaining external CSS: $css_links"
echo "  Remaining external JS: $js_scripts"

echo "✅ Test completed!"
