document.addEventListener('DOMContentLoaded', function() {
  var statusEl = document.getElementById('music-status');
  if (!statusEl) return;
  statusEl.innerHTML = '<div class="spinner-border spinner-border-sm me-2" role="status"><span class="visually-hidden">Loading...</span></div> Loading...';

  fetch('https://music-api.tomhcy.workers.dev/')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (!data.success) {
        statusEl.textContent = 'Not Listening To Anything :(';
        return;
      }
      var prefix = data.isPlaying ? 'Now Listening To' : 'Recently Listened To';
      var link = '<a href="' + data.songUrl + '" target="_blank">' + data.title + '</a>';
      statusEl.innerHTML = prefix + ': ' + link + ' by ' + data.artist + ' on ' + data.source + '.';
    })
    .catch(function() {
      statusEl.textContent = 'Not Listening To Anything :(';
    });
});
