document.addEventListener('DOMContentLoaded', function() {
  var wrapper = document.querySelector('.profile-wrapper');
  if (wrapper) {
    setTimeout(function() {
      wrapper.classList.add('loaded');
    }, 300);
  }
});
