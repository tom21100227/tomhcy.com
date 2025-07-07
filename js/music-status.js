document.addEventListener('DOMContentLoaded', function() {
  var statusEl = document.getElementById('music-status');
  if (!statusEl) return;
  var albumImg = document.querySelector('.profile-icon img[alt="Album Cover"]');
  var albumLink = albumImg ? albumImg.parentElement : null;
  statusEl.innerHTML = '<div class="spinner-border spinner-border-sm me-2" role="status"><span class="visually-hidden">Loading...</span></div> Loading...';

  fetch('https://music-api.tomhcy.workers.dev/?noCache=true')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (!data.success) {
        console.error('Music API Error:', data.error);
        statusEl.textContent = 'Not Listening To Anything :(';
        return;
      }
      var prefix = data.isPlaying ? 'Now Listening To' : 'Recently Listened To';
      var link = '<a href="' + data.songUrl + '" target="_blank">' + data.title + '</a>';
      statusEl.innerHTML = prefix + ': ' + link + ' by ' + data.artist + ' on ' + data.source + '.';
      if (albumImg) albumImg.src = data.albumImageUrl;
      if (albumLink) albumLink.href = data.songUrl;
    })
    .catch(function() {
      statusEl.textContent = 'Not Listening To Anything :(';
    });
});
