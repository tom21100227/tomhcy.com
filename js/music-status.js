// Start the API request immediately, even before DOM is ready
// Protect API URL from minification
var API_URL = 'https://your-api-endpoint.com/music-status';
var musicDataPromise = fetch(API_URL)
  .then(function(res) { return res.json(); })
  .catch(function() { return { success: false, error: 'Network error' }; });

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
    if (albumLink) albumLink.href = data.songUrl;
    // 1. Define the function to set the pulse color
    function setPulseColor(imageElement) {
      // Use a try-catch to prevent errors if ColorThief fails
      try {
        const colorThief = new ColorThief();
        const dominantColor = colorThief.getColor(imageElement);
        imageElement.style.setProperty(
          '--pulse-color', 
          `rgba(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]}, 0.3)`
        );
      } catch (e) {
        console.error("ColorThief error:", e);
      }
    }
    
    // 2. Set up an event listener for when the album image loads
    if (albumImg) {
      albumImg.crossOrigin = 'Anonymous'; 
      if (albumImg) albumImg.src = data.albumImageUrl;
      albumImg.addEventListener('load', function() {
        // Only add the pulsing class and set the color if the song is playing
        if (data.isPlaying) {
          setPulseColor(albumImg);
          albumImg.classList.add('pulsing-img');
        } else {
          // Ensure pulsing is removed if the song is not playing
          albumImg.classList.remove('pulsing-img');
        }
      });
    }
  });
});
