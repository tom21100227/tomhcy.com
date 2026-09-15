// The whole site is static. Detail pages use 'never' so they build to
// essays/<slug>.html and projects/<slug>.html, matching the old Jekyll URLs.
export const prerender = true;
export const trailingSlash = 'never';
