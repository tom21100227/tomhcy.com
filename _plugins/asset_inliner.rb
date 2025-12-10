# Asset Inliner Plugin for Jekyll
# This plugin processes files after Jekyll build to inline CSS and JS assets

require 'fileutils'
require 'pathname'

Jekyll::Hooks.register :site, :post_write do |site|
  next unless ENV['JEKYLL_ENV'] == 'production'
  
  puts "🚀 Starting asset inlining process..."
  
  site_dir = site.dest
  base_url = site.config['baseurl'] || ''
  
  # Get the current theme and rouge theme from config
  theme_file = site.config['techfolio-theme'] || 'default.css'
  rouge_file = site.config['rouge-theme'] || 'github.css'
  
  # Read CSS files to inline
  css_files_to_inline = [
    "css/techfolio-theme/#{theme_file}",
    "css/profile-icons.css", 
    "css/contrast-utils.css",
    "css/rouge/#{rouge_file}"
  ]
  
  # Read JS files to inline
  js_files_to_inline = [
    "js/profile-icons.js",
    "js/project-cards.js",
    "js/name-cycler.js",
    "js/tagline-cycler.js",
    "js/music-status.js"
  ]
  
  # Process all HTML files
  Dir.glob(File.join(site_dir, "**", "*.html")).each do |html_file|
    process_html_file(html_file, site_dir, base_url, css_files_to_inline, js_files_to_inline)
  end
  
  puts "✅ Asset inlining completed!"
end

def process_html_file(html_file, site_dir, base_url, css_files, js_files)
  puts "  📑: #{html_file}"
  content = File.read(html_file)
  original_size = content.bytesize
  
  # Inline CSS files
  css_files.each do |css_path|
    full_css_path = File.join(site_dir, css_path)
    next unless File.exist?(full_css_path)
    
    css_content = File.read(full_css_path)
    # Skip minification - already handled by pre-build CSSO step
    # css_content = minify_css(css_content)
    
    # Replace the link tag with inline style
    link_pattern = /<link[^>]*href=["\']#{Regexp.escape(base_url)}\/#{Regexp.escape(css_path)}["\'][^>]*>/
    if content.match(link_pattern)
      content.gsub!(link_pattern, "<style>#{css_content}</style>")
      puts "  \t✓ Inlined: #{css_path} (#{css_content.bytesize} bytes)"
    end
  end
  
  # Inline JS files  
  js_files.each do |js_path|
    full_js_path = File.join(site_dir, js_path)
    next unless File.exist?(full_js_path)
    
    js_content = File.read(full_js_path)
    # Skip minification - already handled by pre-build Terser step
    # js_content = minify_js(js_content)
    
    # Replace the script tag with inline script
    script_pattern = /<script[^>]*src=["\']#{Regexp.escape(base_url)}\/#{Regexp.escape(js_path)}["\'][^>]*><\/script>/
    if content.match(script_pattern)
      content.gsub!(script_pattern, "<script>#{js_content}</script>")
      puts "  \t✓ Inlined: #{js_path} (#{js_content.bytesize} bytes)"
    end
  end
  
  # Write back the modified content
  File.write(html_file, content)
  new_size = content.bytesize
  
  if new_size != original_size
    puts "  📄 #{original_size} → #{new_size} bytes"
  end
end
