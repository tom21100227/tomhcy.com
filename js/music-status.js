// Start the API request immediately, even before DOM is ready
var musicDataPromise = fetch('https://music-api.tomhcy.workers.dev/')
  .then(function (res) { return res.json(); })
  .catch(function () { return { success: false, error: 'Network error' }; });

// Update the DOM once it's ready
document.addEventListener('DOMContentLoaded', function () {

  const spotifyIcon = "<svg class=\"d-inline align-text-bottom\" width=\"1.4em\" height=\"1.4em\" fill=\"currentColor\"><use xlink:href=\"/img/bootstrap-icons.svg#spotify\"/></svg>"
  const appleMusicIcon = "<svg class=\"d-inline align-text-bottom\" width=\"1.4em\" height=\"1.4em\" fill=\"currentColor\"><use xlink:href=\"/img/bootstrap-icons.svg#apple-music\"/></svg>";

  var statusEl = document.getElementById('music-status');
  if (!statusEl) return;
  var albumImg = document.querySelector('.profile-icon img[alt="Album Cover"]');
  var albumLink = albumImg ? albumImg.parentElement : null;

  // Show loading state
  statusEl.innerHTML = '<div class="spinner-border spinner-border-sm me-2" role="status"><span class="visually-hidden">Loading...</span></div> Loading...';

  // Use the already-started API request
  musicDataPromise.then(function (data) {
    if (!data.success) {
      console.error('Music API Error:', data.error);
      statusEl.textContent = 'Not Listening To Anything :(';
      return;
    }
    var prefix = data.isPlaying ? 'Now Listening To' : 'Recently Listened To';
    var link = '<a href="' + data.songUrl + '" target="_blank">' + data.title + '</a>';
    var sourceIcon = data.source === 'Apple Music' ? appleMusicIcon : spotifyIcon;
    statusEl.innerHTML = prefix + ': ' + link + ' by ' + data.artist + ' on ' + data.source + ' ' + sourceIcon;
    if (albumImg) albumImg.src = data.albumImageUrl;
    if (albumLink) albumLink.href = data.songUrl;
  });
});
