document.addEventListener('DOMContentLoaded', function() {
  var wrapper = document.querySelector('.profile-wrapper');
  if (!wrapper) return;

  var profileImg = wrapper.querySelector('img.rounded-circle');
  var icons = wrapper.querySelectorAll('.profile-icon');
  if (!profileImg || icons.length === 0) return;

  var radius = profileImg.offsetWidth / 2 + 10; // orbit just outside the rim

  icons.forEach(function(icon) {
    icon.style.setProperty('--radius', radius + 'px');
    var scale = icon.getAttribute('data-scale');
    if (scale) {
      icon.style.setProperty('--end-scale', scale);
    }
  });

  setTimeout(function() {
    wrapper.classList.add('loaded');
  }, 300);
});
