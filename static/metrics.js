// Client-side visitor metrics collector.
// Computes a per-device signature once per session, then beacons it (plus the
// current path) to the analytics worker on every page view.
//
// To swap in CreepJS (or any external collector), set before this script runs:
//   window.__fpCollector = function () {
//     return Promise.resolve({ fpHash, creepHash, trust, lies, bot, components });
//   };
// When present it fully replaces the built-in baseline collector below.
(function () {
  'use strict';

  var ENDPOINT = 'https://analytics.tomhcy.workers.dev/collect';
  var CACHE_KEY = 'fp-cache-v1';

  function safe(fn, fallback) {
    try { return fn(); } catch (e) { return fallback; }
  }

  function canvasFingerprint() {
    return safe(function () {
      var canvas = document.createElement('canvas');
      canvas.width = 240; canvas.height = 60;
      var ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.textBaseline = 'top';
      ctx.font = "16px 'Arial'";
      ctx.fillStyle = '#f60';
      ctx.fillRect(10, 10, 100, 30);
      ctx.fillStyle = '#069';
      ctx.fillText('tomhcy.com ✨⚛', 12, 18);
      ctx.fillStyle = 'rgba(102, 200, 0, 0.7)';
      ctx.fillText('fingerprint', 14, 34);
      return canvas.toDataURL();
    }, null);
  }

  function webglInfo() {
    return safe(function () {
      var canvas = document.createElement('canvas');
      var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return null;
      var dbg = gl.getExtension('WEBGL_debug_renderer_info');
      return {
        vendor: dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
        renderer: dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
        version: gl.getParameter(gl.VERSION),
        shading: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
      };
    }, null);
  }

  function detectBot() {
    return safe(function () {
      var n = navigator;
      var flags = [];
      if (n.webdriver) flags.push('webdriver');
      if (!n.languages || n.languages.length === 0) flags.push('no-languages');
      if (/HeadlessChrome/.test(n.userAgent)) flags.push('headless-ua');
      if (window.callPhantom || window._phantom) flags.push('phantom');
      if (n.plugins && n.plugins.length === 0 && /Chrome/.test(n.userAgent)) flags.push('no-plugins');
      return flags;
    }, []);
  }

  function collectComponents() {
    var n = navigator;
    var s = window.screen;
    return {
      ua: n.userAgent,
      lang: n.language,
      langs: safe(function () { return (n.languages || []).join(','); }, null),
      platform: n.platform,
      vendor: n.vendor,
      cores: n.hardwareConcurrency || null,
      memory: n.deviceMemory || null,
      touch: n.maxTouchPoints || 0,
      cookies: n.cookieEnabled,
      dnt: n.doNotTrack || window.doNotTrack || null,
      screen: safe(function () {
        return { w: s.width, h: s.height, depth: s.colorDepth, dpr: window.devicePixelRatio || 1 };
      }, null),
      tz: safe(function () { return Intl.DateTimeFormat().resolvedOptions().timeZone; }, null),
      tzOffset: new Date().getTimezoneOffset(),
      canvas: canvasFingerprint(),
      webgl: webglInfo()
    };
  }

  function sha256Hex(input) {
    var data = new TextEncoder().encode(input);
    return crypto.subtle.digest('SHA-256', data).then(function (digest) {
      return Array.prototype.map.call(new Uint8Array(digest), function (b) {
        return b.toString(16).padStart(2, '0');
      }).join('');
    });
  }

  // Stable subset: signals unlikely to change between visits on the same device.
  function stableString(c) {
    return JSON.stringify([c.platform, c.vendor, c.cores, c.memory, c.screen, c.tz, c.webgl, c.canvas]);
  }

  function buildFingerprint() {
    var components = collectComponents();
    var botFlags = detectBot();
    return Promise.all([
      sha256Hex(stableString(components)),
      sha256Hex(JSON.stringify(components))
    ]).then(function (hashes) {
      components.botFlags = botFlags;
      return {
        fpHash: hashes[0],
        creepHash: hashes[1],
        bot: botFlags.length > 0,
        lies: botFlags.length,
        trust: Math.max(0, 100 - botFlags.length * 25),
        components: components
      };
    });
  }

  function getFingerprint() {
    if (typeof window.__fpCollector === 'function') {
      return Promise.resolve().then(window.__fpCollector);
    }
    var cached = safe(function () { return sessionStorage.getItem(CACHE_KEY); }, null);
    if (cached) {
      var parsed = safe(function () { return JSON.parse(cached); }, null);
      if (parsed) return Promise.resolve(parsed);
    }
    return buildFingerprint().then(function (fp) {
      safe(function () { sessionStorage.setItem(CACHE_KEY, JSON.stringify(fp)); });
      return fp;
    });
  }

  function send(fp) {
    var payload = JSON.stringify({
      fpHash: fp.fpHash,
      creepHash: fp.creepHash,
      trust: fp.trust,
      lies: fp.lies,
      bot: fp.bot,
      components: fp.components,
      path: location.pathname + location.search,
      referrer: document.referrer || null
    });
    var sent = false;
    if (navigator.sendBeacon) {
      // text/plain Blob keeps this a "simple" request (no CORS preflight).
      sent = navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: 'text/plain' }));
    }
    if (!sent) {
      fetch(ENDPOINT, {
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'text/plain' },
        keepalive: true,
        mode: 'cors'
      }).catch(function () {});
    }
  }

  function run() {
    getFingerprint().then(send).catch(function () {});
  }

  // Let the app trigger a page view after client-side navigation.
  window.__metricsPageview = run;

  var schedule = window.requestIdleCallback || function (cb) { return setTimeout(cb, 800); };
  if (document.readyState === 'complete') {
    schedule(run);
  } else {
    window.addEventListener('load', function () { schedule(run); });
  }
})();
