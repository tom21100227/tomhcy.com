module Jekyll
  module ContrastFilter
    # Calculate relative luminance of a color
    def relative_luminance(color)
      # Remove # if present
      hex = color.gsub('#', '')
      
      # Convert hex to RGB
      r = hex[0..1].to_i(16) / 255.0
      g = hex[2..3].to_i(16) / 255.0
      b = hex[4..5].to_i(16) / 255.0
      
      # Apply gamma correction
      r = r <= 0.03928 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4
      g = g <= 0.03928 ? g / 12.92 : ((g + 0.055) / 1.055) ** 2.4
      b = b <= 0.03928 ? b / 12.92 : ((b + 0.055) / 1.055) ** 2.4
      
      # Calculate luminance
      0.2126 * r + 0.7152 * g + 0.0722 * b
    end
    
    # Calculate contrast ratio between two colors
    def contrast_ratio(color1, color2)
      l1 = relative_luminance(color1)
      l2 = relative_luminance(color2)
      
      lighter = [l1, l2].max
      darker = [l1, l2].min
      
      (lighter + 0.05) / (darker + 0.05)
    end
    
    # Adjust color for better contrast against white background
    def ensure_contrast(color, background = "#FFFFFF", target_ratio = 4.0)
      current_ratio = contrast_ratio(color, background)
      
      # If contrast is already sufficient, return original color unchanged
      return color if current_ratio >= target_ratio
      
      # Only adjust if contrast is insufficient
      hex = color.gsub('#', '')
      r = hex[0..1].to_i(16)
      g = hex[2..3].to_i(16)
      b = hex[4..5].to_i(16)
      
      # Use a gentler approach - smaller steps and higher minimum factor
      factor = 0.9
      adjusted_color = color
      
      while contrast_ratio(adjusted_color, background) < target_ratio && factor > 0.5
        r = (r * factor).to_i
        g = (g * factor).to_i
        b = (b * factor).to_i
        adjusted_color = "#%02x%02x%02x" % [r, g, b]
        factor -= 0.02  # Smaller steps for gentler adjustment
      end
      
      adjusted_color
    end
    
    # Check if a color needs contrast adjustment
    def needs_contrast_adjustment(color, background = "#FFFFFF", target_ratio = 4.0)
      contrast_ratio(color, background) < target_ratio
    end
    
    # Check if a color is too dark for dark backgrounds (needs lightening)
    def needs_contrast_adjustment_dark(color, background = "#000000", target_ratio = 4.0)
      contrast_ratio(color, background) < target_ratio
    end
    
    # Adjust color for dark backgrounds by lightening it
    def ensure_contrast_dark(color, background = "#000000", target_ratio = 4.0)
      current_ratio = contrast_ratio(color, background)
      
      # If contrast is already sufficient, return original color unchanged
      return color if current_ratio >= target_ratio
      
      # Only adjust if contrast is insufficient - lighten the color
      hex = color.gsub('#', '')
      r = hex[0..1].to_i(16)
      g = hex[2..3].to_i(16)
      b = hex[4..5].to_i(16)
      
      # Special handling for very dark colors (like pure black)
      if r < 10 && g < 10 && b < 10
        # Start with a base gray and gradually lighten
        r = g = b = 50  # Start with dark gray
      end
      
      # Lighten by increasing RGB values gradually
      factor = 1.2
      adjusted_color = color
      max_iterations = 20
      iteration = 0
      
      while contrast_ratio(adjusted_color, background) < target_ratio && iteration < max_iterations
        r = [255, (r * factor).to_i].min
        g = [255, (g * factor).to_i].min
        b = [255, (b * factor).to_i].min
        adjusted_color = "#%02x%02x%02x" % [r, g, b]
        factor += 0.05
        iteration += 1
      end
      
      adjusted_color
    end
    
    # Expose contrast_ratio as a filter for testing
    def contrast_ratio_filter(color1, color2 = "#FFFFFF")
      contrast_ratio(color1, color2).round(2)
    end
  end
end

Liquid::Template.register_filter(Jekyll::ContrastFilter)
