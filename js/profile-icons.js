document.addEventListener('DOMContentLoaded', function() {
  var wrapper = document.querySelector('.profile-wrapper');
  if (!wrapper) return;

  var profileImg = wrapper.querySelector('img.rounded-circle');
  var iconElements = wrapper.querySelectorAll('.profile-icon');
  if (!profileImg || iconElements.length === 0) return;

  var orbitRadius = profileImg.offsetWidth / 2 + 10;

  // Reduced motion: fall back to CSS-only instant placement
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    iconElements.forEach(function(icon) {
      icon.style.setProperty('--radius', orbitRadius + 'px');
      var scale = icon.getAttribute('data-scale');
      if (scale) icon.style.setProperty('--end-scale', scale);
    });
    setTimeout(function() { wrapper.classList.add('loaded'); }, 300);
    return;
  }

  // --- Physics simulation ---

  // Parse each icon into a physics body
  var bodies = [];
  iconElements.forEach(function(icon) {
    var angleDeg = parseFloat(icon.style.getPropertyValue('--angle')) || 0;
    var angleRad = angleDeg * Math.PI / 180;
    var scale = parseFloat(icon.getAttribute('data-scale')) || 1;
    var delayStr = icon.style.animationDelay || '0s';
    var delay = parseFloat(delayStr) * 1000; // to ms
    var endOpacity = parseFloat(icon.style.getPropertyValue('--end-opacity')) || 1;

    var targetDist = orbitRadius * 0.95;
    var targetX = targetDist * Math.cos(angleRad);
    var targetY = targetDist * Math.sin(angleRad);

    bodies.push({
      el: icon,
      x: 0, y: 0,           // start at profile center
      vx: 0, vy: 0,
      targetX: targetX,
      targetY: targetY,
      scale: scale,
      collisionR: 30 * scale, // half of 60px icon width, scaled
      endOpacity: endOpacity,
      delay: delay,
      launched: false,
      settled: false,
      opacity: 0
    });
  });

  // Tuning constants
  var SPRING       = 0.012;  // pull toward target position
  var DAMPING      = 0.93;   // velocity decay per frame
  var LAUNCH_SPEED = 14;     // base launch velocity (px/frame)
  var OVERSHOOT    = 1.5;    // launch speed multiplier so icons overshoot target
  var DEFLECTION   = 0.35;   // gentle push strength on collision
  var FADE_RATE    = 0.07;   // opacity increase per frame
  var SETTLE_DIST  = 0.5;    // snap-to-target distance threshold (px)
  var SETTLE_VEL   = 0.2;    // snap-to-target speed threshold (px/frame)
  var START_DELAY  = 300;    // ms before first icon launches

  var startTime = null;

  function simulate(timestamp) {
    if (!startTime) startTime = timestamp;
    var elapsed = timestamp - startTime;
    var allDone = true;

    // 1. Launch icons when their staggered delay has passed
    for (var i = 0; i < bodies.length; i++) {
      var b = bodies[i];
      if (!b.launched && elapsed >= b.delay + START_DELAY) {
        b.launched = true;
        var dist = Math.sqrt(b.targetX * b.targetX + b.targetY * b.targetY);
        if (dist > 0) {
          b.vx = (b.targetX / dist) * LAUNCH_SPEED * OVERSHOOT;
          b.vy = (b.targetY / dist) * LAUNCH_SPEED * OVERSHOOT;
        }
      }
    }

    // 2. Spring force + damping
    for (var i = 0; i < bodies.length; i++) {
      var b = bodies[i];
      if (!b.launched || b.settled) continue;

      var dx = b.targetX - b.x;
      var dy = b.targetY - b.y;
      b.vx = (b.vx + dx * SPRING) * DAMPING;
      b.vy = (b.vy + dy * SPRING) * DAMPING;
    }

    // 3. Collision detection — gentle deflection between overlapping icons
    for (var i = 0; i < bodies.length; i++) {
      if (!bodies[i].launched) continue;
      for (var j = i + 1; j < bodies.length; j++) {
        if (!bodies[j].launched) continue;

        var dx = bodies[j].x - bodies[i].x;
        var dy = bodies[j].y - bodies[i].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var minDist = bodies[i].collisionR + bodies[j].collisionR;

        if (dist < minDist && dist > 0.001) {
          // Overlap → push apart softly along the collision normal
          var overlap = minDist - dist;
          var nx = dx / dist;
          var ny = dy / dist;
          var push = overlap * DEFLECTION;

          if (!bodies[i].settled) {
            bodies[i].vx -= nx * push;
            bodies[i].vy -= ny * push;
          }
          if (!bodies[j].settled) {
            bodies[j].vx += nx * push;
            bodies[j].vy += ny * push;
          }
        }
      }
    }

    // 4. Integrate positions, fade in, settle check, render
    for (var i = 0; i < bodies.length; i++) {
      var b = bodies[i];

      if (!b.launched) {
        allDone = false;
        continue;
      }

      if (!b.settled) {
        b.x += b.vx;
        b.y += b.vy;
        b.opacity = Math.min(b.endOpacity, b.opacity + FADE_RATE);

        // Check if close enough to target with low velocity
        var dx = b.targetX - b.x;
        var dy = b.targetY - b.y;
        var distToTarget = Math.sqrt(dx * dx + dy * dy);
        var speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);

        if (distToTarget < SETTLE_DIST && speed < SETTLE_VEL) {
          b.x = b.targetX;
          b.y = b.targetY;
          b.opacity = b.endOpacity;
          b.settled = true;
        } else {
          allDone = false;
        }
      }

      // Write to DOM
      b.el.style.opacity = b.opacity;
      b.el.style.transform =
        'translate(-50%, -50%) ' +
        'translate(' + b.x.toFixed(1) + 'px, ' + b.y.toFixed(1) + 'px) ' +
        'scale(' + b.scale + ')';
    }

    if (!allDone) {
      requestAnimationFrame(simulate);
    }
  }

  requestAnimationFrame(simulate);
});
