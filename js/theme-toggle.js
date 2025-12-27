/**
 * Theme toggle functionality
 * Supports three modes: system (default), light, dark
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'theme-preference';
  const THEME_SYSTEM = 'system';
  const THEME_LIGHT = 'light';
  const THEME_DARK = 'dark';

  // Known-safe base URL for SimpleIcons CDN
  const SIMPLEICONS_BASE = 'https://cdn.simpleicons.org/';

  // Pattern for valid icon names (alphanumeric, hyphens, dots)
  const ICON_PATTERN = /^[a-zA-Z0-9.\-]+$/;

  // Pattern for valid hex colors (6 hex chars, no #)
  const COLOR_PATTERN = /^[a-fA-F0-9]{6}$/;

  /**
   * Validate and construct a safe SimpleIcons URL
   * @param {string} icon - The icon name
   * @param {string} color - The hex color (without #)
   * @returns {string|null} The constructed URL or null if invalid
   */
  function buildIconUrl(icon, color) {
    if (!icon || !color) {
      return null;
    }

    // Validate icon name contains only safe characters
    if (!ICON_PATTERN.test(icon)) {
      return null;
    }

    // Validate color is a valid 6-char hex
    if (!COLOR_PATTERN.test(color)) {
      return null;
    }

    // Construct URL from known-safe base and validated parts
    return SIMPLEICONS_BASE + encodeURIComponent(icon) + '/' + encodeURIComponent(color);
  }

  /**
   * Get the stored theme preference
   * @returns {string} 'system', 'light', or 'dark'
   */
  function getStoredPreference() {
    try {
      return localStorage.getItem(STORAGE_KEY) || THEME_SYSTEM;
    } catch (e) {
      return THEME_SYSTEM;
    }
  }

  /**
   * Store the theme preference
   * @param {string} theme - 'system', 'light', or 'dark'
   */
  function setStoredPreference(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // localStorage not available
    }
  }

  /**
   * Get the system's color scheme preference
   * @returns {string} 'light' or 'dark'
   */
  function getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME_DARK : THEME_LIGHT;
  }

  /**
   * Get the effective theme (resolves 'system' to actual theme)
   * @param {string} preference - The stored preference
   * @returns {string} 'light' or 'dark'
   */
  function getEffectiveTheme(preference) {
    if (preference === THEME_SYSTEM) {
      return getSystemPreference();
    }
    return preference;
  }

  /**
   * Apply the theme to the document
   * @param {string} preference - 'system', 'light', or 'dark'
   */
  function applyTheme(preference) {
    const effectiveTheme = getEffectiveTheme(preference);
    const root = document.documentElement;

    // Set data-theme for CSS selectors
    if (preference === THEME_SYSTEM) {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', preference);
    }

    // Set data-effective-theme for JS consumers (like badge icons)
    root.setAttribute('data-effective-theme', effectiveTheme);

    // Update badge icons that use picture elements
    updateBadgeIcons(effectiveTheme);

    // Update toggle button states
    updateToggleState(preference);
  }

  /**
   * Update badge icons for the current theme
   * Picture elements can't respond to data attributes, so we need JS
   * @param {string} theme - 'light' or 'dark'
   */
  function updateBadgeIcons(theme) {
    const pictures = document.querySelectorAll('.badge picture, .project-filter-button picture');
    pictures.forEach(function(picture) {
      const img = picture.querySelector('img');
      if (!img) return;

      // Get icon name and colors from data attributes (set by Jekyll)
      var icon = img.getAttribute('data-icon');
      var color = theme === THEME_DARK
        ? img.getAttribute('data-color-dark')
        : img.getAttribute('data-color-light');

      // Build URL from validated parts (returns null if invalid)
      var newSrc = buildIconUrl(icon, color);

      // Only update if we have a valid URL that differs from current
      if (newSrc && img.src !== newSrc) {
        img.src = newSrc;
      }
    });
  }

  /**
   * Update the toggle button to reflect current state
   * @param {string} preference - 'system', 'light', or 'dark'
   */
  function updateToggleState(preference) {
    const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
    toggleButtons.forEach(function(button) {
      const buttonTheme = button.getAttribute('data-theme-toggle');
      button.classList.toggle('is-active', buttonTheme === preference);
      button.setAttribute('aria-pressed', buttonTheme === preference);
    });
  }

  /**
   * Initialize the theme toggle
   */
  function init() {
    const preference = getStoredPreference();
    applyTheme(preference);

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', function() {
      const currentPref = getStoredPreference();
      if (currentPref === THEME_SYSTEM) {
        applyTheme(THEME_SYSTEM);
      }
    });

    // Set up toggle button event listeners
    document.addEventListener('click', function(e) {
      const button = e.target.closest('[data-theme-toggle]');
      if (button) {
        const newTheme = button.getAttribute('data-theme-toggle');
        setStoredPreference(newTheme);
        applyTheme(newTheme);
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for external use
  window.themeToggle = {
    getPreference: getStoredPreference,
    setPreference: function(theme) {
      setStoredPreference(theme);
      applyTheme(theme);
    },
    getEffectiveTheme: function() {
      return getEffectiveTheme(getStoredPreference());
    }
  };
})();
