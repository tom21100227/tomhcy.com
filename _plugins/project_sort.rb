module Jekyll
  module ProjectSortFilter
    require 'date'

    def project_sort(pages)
      pages.sort { |a, b| compare_projects(a, b) }
    end

    private

    def parse_date(value)
      return Date.new(9999, 12, 31) if value.to_s.strip.downcase == 'present'
      Date.parse(value.to_s)
    rescue ArgumentError
      begin
        Date.strptime(value.to_s, '%Y')
      rescue ArgumentError
        Date.new(0)
      end
    end

    def compare_projects(a, b)
      date_a = parse_date(a['date'])
      date_b = parse_date(b['date'])
      cmp = date_b <=> date_a
      return cmp unless cmp.zero?

      start_a = a['startDate'] ? parse_date(a['startDate']) : Date.new(0)
      start_b = b['startDate'] ? parse_date(b['startDate']) : Date.new(0)
      start_b <=> start_a
    end
  end
end

Liquid::Template.register_filter(Jekyll::ProjectSortFilter)
