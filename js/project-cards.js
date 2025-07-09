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

      if (mq.matches && img.naturalWidth > img.naturalHeight) {
        c.classList.add('wide');
      } else {
        c.classList.remove('wide');
      }
    });
  }
  if (document.readyState === 'complete') {
    applyCrop();
  } else {
    window.addEventListener('load', applyCrop);
  }
  window.matchMedia('(min-width: 768px)').addEventListener('change', applyCrop);
})();
