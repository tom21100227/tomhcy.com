(function() {
  function applyCrop() {
    var mq = window.matchMedia('(min-width: 768px)');
    document.querySelectorAll('.project-image-container').forEach(function(c) {
      var img = c.querySelector('img');
      if (!img) return;
      if (mq.matches) {
        img.classList.add('rounded-start');
        img.classList.remove('rounded-top', 'rounded');
      } else {
        img.classList.add('rounded-top');
        img.classList.remove('rounded-start', 'rounded');
      }
    });
  }

  function parseLabels(card) {
    if (!card) {
      return [];
    }
    var joined = card.getAttribute('data-labels');
    if (joined && joined.length) {
      return joined.split('||').map(function(label) {
        return label.trim();
      }).filter(function(label) {
        return label.length > 0;
      });
    }
    var jsonAttr = card.getAttribute('data-labels-json');
    if (jsonAttr) {
      try {
        var parsed = JSON.parse(jsonAttr);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (err) {
        console.warn('Unable to parse project labels', err);
      }
    }
    return [];
  }

  function setupFiltering() {
    var toolbar = document.querySelector('[data-project-filter]');
    if (!toolbar) {
      return;
    }

    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-project-card]'));
    if (!cards.length) {
      return;
    }

    var filterButtons = Array.prototype.slice.call(toolbar.querySelectorAll('[data-filter-button]'));
    if (!filterButtons.length) {
      return;
    }

    var clearButton = toolbar.querySelector('[data-filter-clear]');
    var statusEl = toolbar.querySelector('[data-filter-status]');
    var totalProjectsAttr = toolbar.getAttribute('data-total-projects');
    var totalProjects = parseInt(totalProjectsAttr, 10);
    if (isNaN(totalProjects) || totalProjects < 0) {
      totalProjects = cards.length;
    }

    var labelNameMap = Object.create(null);
    filterButtons.forEach(function(button) {
      var labelDisplay = button.getAttribute('data-label-display') || button.textContent.trim();
      var normalized = (button.getAttribute('data-label') || labelDisplay).toLowerCase();
      button.setAttribute('data-label', normalized);
      labelNameMap[normalized] = labelDisplay;
    });

    var activeFilters = [];

    function isActive(label) {
      return activeFilters.indexOf(label) !== -1;
    }

    function addFilter(label) {
      if (!label) {
        return;
      }
      if (!isActive(label)) {
        activeFilters.push(label);
      }
    }

    function removeFilter(label) {
      var index = activeFilters.indexOf(label);
      if (index !== -1) {
        activeFilters.splice(index, 1);
      }
    }

    function clearFilters() {
      activeFilters.length = 0;
    }

    function updateControls(matchedCount) {
      filterButtons.forEach(function(button) {
        var label = button.getAttribute('data-label');
        var active = isActive(label);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
        button.classList.toggle('is-active', active);
      });

      if (clearButton) {
        clearButton.hidden = activeFilters.length === 0;
      }

      if (!statusEl) {
        return;
      }

      if (activeFilters.length === 0) {
        statusEl.textContent = totalProjects + ' project' + (totalProjects === 1 ? '' : 's') + ' available';
      } else {
        var readable = [];
        for (var idx = 0; idx < activeFilters.length; idx += 1) {
          var activeLabel = activeFilters[idx];
          readable.push(labelNameMap[activeLabel] || activeLabel);
        }
        statusEl.textContent = matchedCount + ' match' + (matchedCount === 1 ? '' : 'es') + ' for ' + readable.join(', ');
      }
    }

    function filterCards() {
      var matchedCount = 0;
      cards.forEach(function(card) {
        var labels = parseLabels(card).map(function(label) {
          return String(label).toLowerCase();
        });
        var matches = true;
        if (activeFilters.length > 0) {
          for (var idx = 0; idx < activeFilters.length; idx += 1) {
            var required = activeFilters[idx];
            if (labels.indexOf(required) === -1) {
              matches = false;
              break;
            }
          }
        }
        card.classList.toggle('is-hidden', !matches);
        if (matches) {
          matchedCount += 1;
        }
      });

      updateControls(matchedCount);
    }

    function toggleFilter(label) {
      if (!label) {
        return;
      }
      if (isActive(label)) {
        removeFilter(label);
      } else {
        addFilter(label);
      }
      filterCards();
    }

    function setSingleFilter(label) {
      if (!label) {
        return;
      }
      if (activeFilters.length === 1 && isActive(label)) {
        clearFilters();
      } else {
        clearFilters();
        addFilter(label);
      }
      filterCards();
    }

    filterButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        toggleFilter(button.getAttribute('data-label'));
      });
    });

    if (clearButton) {
      clearButton.addEventListener('click', function() {
        if (activeFilters.length === 0) {
          return;
        }
        clearFilters();
        filterCards();
        var firstButton = filterButtons[0];
        if (firstButton) {
          firstButton.focus();
        }
      });
    }

    var badgeButtons = Array.prototype.slice.call(document.querySelectorAll('[data-project-badge]'));
    badgeButtons.forEach(function(button) {
      var normalized = (button.getAttribute('data-label') || '').toLowerCase();
      var displayLabel = button.getAttribute('data-label-display') || button.textContent.trim();
      if (normalized) {
        labelNameMap[normalized] = displayLabel;
      }
      button.addEventListener('click', function() {
        if (!normalized) {
          return;
        }
        setSingleFilter(normalized);
        var targetButton = null;
        for (var idx = 0; idx < filterButtons.length; idx += 1) {
          if (filterButtons[idx].getAttribute('data-label') === normalized) {
            targetButton = filterButtons[idx];
            break;
          }
        }
        if (targetButton) {
          targetButton.focus();
        }
      });
    });

    filterCards();
  }

  function initialize() {
    applyCrop();
    setupFiltering();
  }

  if (document.readyState === 'complete') {
    initialize();
  } else {
    window.addEventListener('load', initialize);
  }
  window.matchMedia('(min-width: 768px)').addEventListener('change', applyCrop);
})();
