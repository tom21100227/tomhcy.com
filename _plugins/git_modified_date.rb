module Jekyll
  module GitModifiedDate
    # Get the last git commit date for a file
    def git_modified_date(file_path)
      # Remove leading slash if present
      file_path = file_path.sub(/^\//, '')

      # Get the last commit date for this file
      command = "git log -1 --format=%cd --date=format:'%B %e, %Y' -- #{file_path}"
      date_string = `#{command}`.strip

      # If git command fails or file has no commits, return nil
      return nil if date_string.empty?

      # Remove quotes and normalize spacing
      date_string.gsub("'", '').squeeze(' ')
    end

    # Get the last git commit date in a custom format
    def git_modified_date_format(file_path, format)
      # Remove leading slash if present
      file_path = file_path.sub(/^\//, '')

      # Get the last commit date for this file
      command = "git log -1 --format=%cd --date=format:'#{format}' -- #{file_path}"
      date_string = `#{command}`.strip

      # If git command fails or file has no commits, return nil
      return nil if date_string.empty?

      # Remove quotes and normalize spacing
      date_string.gsub("'", '').squeeze(' ')
    end
  end
end

Liquid::Template.register_filter(Jekyll::GitModifiedDate)

# Hook to add git modified date to page data
Jekyll::Hooks.register :pages, :post_init do |page|
  if page.path && File.exist?(page.path)
    command = "git log -1 --format=%cd --date=format:'%B %e, %Y' -- #{page.path}"
    date_string = `#{command}`.strip

    unless date_string.empty?
      # Remove quotes and normalize spacing
      page.data['git_modified_date'] = date_string.gsub("'", '').squeeze(' ')
    end
  end
end

# Hook to add git modified date to document data (for collections)
Jekyll::Hooks.register :documents, :post_init do |doc|
  if doc.path && File.exist?(doc.path)
    command = "git log -1 --format=%cd --date=format:'%B %e, %Y' -- #{doc.path}"
    date_string = `#{command}`.strip

    unless date_string.empty?
      # Remove quotes and normalize spacing
      doc.data['git_modified_date'] = date_string.gsub("'", '').squeeze(' ')
    end
  end
end
