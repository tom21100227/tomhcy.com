var MUSIC_API_URL = 'https://music-api.tomhcy.workers.dev/';

function fetchMusicData(forceRefresh) {
  var url = MUSIC_API_URL;
  if (forceRefresh) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + 'noCache=true';
  }
  return fetch(url, { cache: 'no-store' })
    .then(function (res) { return res.json(); })
    .catch(function () { return { success: false, error: 'Network error' }; });
}

var initialMusicDataPromise = fetchMusicData(false);

document.addEventListener('DOMContentLoaded', function () {
  var statusEl = document.getElementById('music-status');
  if (!statusEl) return;

  var refreshBtn = document.getElementById('music-refresh-button');
  var albumImg = document.querySelector('.profile-icon img[alt="Album Cover"]');
  var albumLink = albumImg ? albumImg.parentElement : null;
  var albumPlaceholder = albumImg ? albumImg.dataset.placeholder || albumImg.src : null;

  var spotifyIcon = '<svg class="d-inline align-text-bottom" width="1.4em" height="1.4em" fill="currentColor"><use xlink:href="/img/bootstrap-icons.svg#spotify"/></svg>';
  var appleMusicIcon = '<svg class="d-inline align-text-bottom" width="1.4em" height="1.4em" fill="currentColor"><use xlink:href="/img/bootstrap-icons.svg#apple-music"/></svg>';

  function setPulseColor(imageElement) {
    try {
      var colorThief = new ColorThief();
      var dominantColor = colorThief.getColor(imageElement);
      imageElement.style.setProperty(
        '--pulse-color',
        'rgba(' + dominantColor[0] + ', ' + dominantColor[1] + ', ' + dominantColor[2] + ', 0.3)'
      );
    } catch (e) {
      console.error('ColorThief error:', e);
    }
  }

  if (albumImg) {
    albumImg.dataset.placeholder = albumPlaceholder || '';
    albumImg.crossOrigin = 'Anonymous';
    albumImg.addEventListener('load', function () {
      if (albumImg.dataset.isPlaying === 'true') {
        setPulseColor(albumImg);
        albumImg.classList.add('pulsing-img');
      } else {
        albumImg.classList.remove('pulsing-img');
        albumImg.style.removeProperty('--pulse-color');
      }
    });
  }

  function setLoadingState() {
    statusEl.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Loading...';
    if (refreshBtn) {
      refreshBtn.disabled = true;
      refreshBtn.classList.add('is-loading');
      refreshBtn.setAttribute('aria-busy', 'true');
    }
    if (albumImg) {
      albumImg.dataset.isPlaying = 'false';
      albumImg.style.removeProperty('--pulse-color');
      if (albumPlaceholder) {
        albumImg.src = albumPlaceholder;
      }
    }
    if (albumLink) {
      albumLink.removeAttribute('href');
    }
  }

  function finishLoading() {
    if (refreshBtn) {
      refreshBtn.disabled = false;
      refreshBtn.classList.remove('is-loading');
      refreshBtn.setAttribute('aria-busy', 'false');
    }
  }

  function renderMusic(data) {
    if (!data || !data.success) {
      if (data && data.error) {
        console.error('Music API Error:', data.error);
      }
      statusEl.textContent = 'Not Listening To Anything :(';
      finishLoading();
      return;
    }

    var prefix = data.isPlaying ? 'Now Listening To' : 'Recently Listened To';
    var songTitle = data.songUrl
      ? '<a href="' + data.songUrl + '" target="_blank" rel="noopener">' + data.title + '</a>'
      : data.title;
    var sourceIcon = data.source === 'Apple Music' ? appleMusicIcon : spotifyIcon;

    statusEl.innerHTML = prefix + ': ' + songTitle + ' by ' + data.artist + ' on ' + data.source + ' ' + sourceIcon;

    if (albumLink) {
      if (data.songUrl) {
        albumLink.href = data.songUrl;
        albumLink.setAttribute('target', '_blank');
        albumLink.setAttribute('rel', 'noopener');
      } else {
        albumLink.removeAttribute('href');
        albumLink.removeAttribute('target');
        albumLink.removeAttribute('rel');
      }
    }

    if (albumImg) {
      albumImg.dataset.isPlaying = data.isPlaying ? 'true' : 'false';
      if (data.albumImageUrl) {
        albumImg.src = data.albumImageUrl;
      } else if (albumPlaceholder) {
        albumImg.src = albumPlaceholder;
      }
    }

    finishLoading();
  }

  function handleError(err) {
    console.error('Music API Error:', err);
    statusEl.textContent = 'Unable to load now playing.';
    finishLoading();
  }

  function requestMusic(forceRefresh, existingPromise) {
    setLoadingState();
    (existingPromise || fetchMusicData(forceRefresh))
      .then(renderMusic)
      .catch(handleError);
  }

  requestMusic(false, initialMusicDataPromise);

  if (refreshBtn) {
    refreshBtn.addEventListener('click', function () {
      if (refreshBtn.disabled) return;
      requestMusic(true);
    });
  }
});
