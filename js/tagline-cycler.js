document.addEventListener('DOMContentLoaded', function() {
    const taglineElement = document.getElementById('tagline');
    if (!taglineElement) return;

    // Parse taglines from data attribute
    let taglines;
    try {
        taglines = JSON.parse(taglineElement.dataset.taglines);
    } catch (e) {
        console.error('Failed to parse taglines:', e);
        return;
    }

    if (!taglines || taglines.length === 0) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Pick a random starting index
    let currentIndex = Math.floor(Math.random() * taglines.length);

    // Animation configuration
    const ANIMATION_DURATION = prefersReducedMotion ? 0 : 300; // ms
    const EASING = 'cubic-bezier(0.33, 1, 0.68, 1)'; // ease-out-cubic for smooth deceleration

    // Apply base styles for animation (skip if reduced motion)
    if (!prefersReducedMotion) {
        taglineElement.style.cssText = `
            cursor: pointer;
            display: inline-block;
            transition: transform ${ANIMATION_DURATION}ms ${EASING},
                        opacity ${ANIMATION_DURATION}ms ${EASING};
            transform-origin: center center;
        `;
    } else {
        taglineElement.style.cursor = 'pointer';
    }

    // Set initial random tagline
    taglineElement.innerHTML = taglines[currentIndex];

    let isAnimating = false;

    function cycleTagline() {
        if (isAnimating || taglines.length <= 1) return;

        // Calculate next index (avoid showing same tagline)
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * taglines.length);
        } while (nextIndex === currentIndex && taglines.length > 1);

        // If reduced motion, just swap content immediately
        if (prefersReducedMotion) {
            currentIndex = nextIndex;
            taglineElement.innerHTML = taglines[currentIndex];
            return;
        }

        isAnimating = true;

        // Exit animation: slide up and fade out
        taglineElement.style.transform = 'translateY(-20px)';
        taglineElement.style.opacity = '0';

        // After exit animation, swap content and animate in
        setTimeout(() => {
            currentIndex = nextIndex;
            taglineElement.innerHTML = taglines[currentIndex];

            // Position for enter: start below
            taglineElement.style.transition = 'none';
            taglineElement.style.transform = 'translateY(20px)';

            // Force reflow to apply the transform before animating
            taglineElement.offsetHeight;

            // Enter animation: slide up into place and fade in
            taglineElement.style.transition = `transform ${ANIMATION_DURATION}ms ${EASING},
                                               opacity ${ANIMATION_DURATION}ms ${EASING}`;
            taglineElement.style.transform = 'translateY(0)';
            taglineElement.style.opacity = '1';

            // Reset animation lock after enter completes
            setTimeout(() => {
                isAnimating = false;
            }, ANIMATION_DURATION);
        }, ANIMATION_DURATION);
    }

    // Auto-cycle every 10 seconds (skip if reduced motion to avoid distraction)
    if (!prefersReducedMotion) {
        setInterval(cycleTagline, 10000);
    }

    taglineElement.addEventListener('click', function(e) {
        // Allow links inside taglines to work normally
        if (e.target.tagName === 'A' || e.target.closest('a')) return;
        cycleTagline();
    });
});
