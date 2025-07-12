require 'fastimage'
require 'yaml'

module Jekyll
  class ImageDimensionsGenerator < Generator
    safe true

    def generate(site)
      project_image_data = {}

      project_files = Dir.glob(File.join(site.source, 'projects', '*.md'))

      project_files.each do |file_path|
        # Skip index.html files as they don't have front matter
        next if File.basename(file_path) == 'index.html'

        content = File.read(file_path)
        
        # Use YAML.safe_load to parse front matter
        begin
          # Split content by '---' to get front matter
          parts = content.split('---', 3)
          if parts.length >= 2
            front_matter = YAML.safe_load(parts[1])
            if front_matter && front_matter['image'] && front_matter['title']
              image_relative_path = front_matter['image']
              project_title = front_matter['title']

              # Construct absolute image path
              # Assuming image paths are relative to the site root, e.g., img/project/image.png
              absolute_image_path = File.join(site.source, image_relative_path)

              if File.exist?(absolute_image_path)
                begin
                  width, height = FastImage.size(absolute_image_path)
                  is_wide = width > height
                  project_image_data[project_title] = { 'is_wide' => is_wide }
                rescue FastImage::UnknownImageType
                  # Ignore unsupported image types
                rescue => e
                  # Handle other errors
                end
              else
                # Handle file not found
              end
            else
              # Handle missing image or title
            end
          else
            # Handle no valid front matter
          end
        rescue Psych::SyntaxError => e
          # Handle YAML parsing error
        end
      end
      site.data['project_image_data'] = project_image_data
    end
  end
end
