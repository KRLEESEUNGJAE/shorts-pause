/**
 * Shorts Pause - Content Script
 * Prevents YouTube Shorts from auto-looping and auto-advancing
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'pauseEnabled';
  const END_THRESHOLD = 0.3; // seconds before end to trigger pause
  const CHECK_INTERVAL = 200; // ms

  let isEnabled = false;
  let observer = null;
  let intervalId = null;

  // Initialize from storage
  chrome.storage.sync.get([STORAGE_KEY], (result) => {
    isEnabled = result[STORAGE_KEY] === true;
    if (isEnabled) startWatching();
  });

  // Listen for toggle messages from popup
  chrome.runtime.onMessage.addListener(({ type, enabled }) => {
    if (type === 'PAUSE_TOGGLE') {
      isEnabled = enabled;
      isEnabled ? startWatching() : stopWatching();
    }
  });

  // Listen for storage changes (sync across tabs)
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes[STORAGE_KEY]) {
      isEnabled = changes[STORAGE_KEY].newValue === true;
      isEnabled ? startWatching() : stopWatching();
    }
  });

  function startWatching() {
    if (intervalId) return;

    intervalId = setInterval(handleVideos, CHECK_INTERVAL);
    observer = new MutationObserver(handleVideos);
    observer.observe(document.body, { childList: true, subtree: true });
    handleVideos();
  }

  function stopWatching() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    document.querySelectorAll('video').forEach(cleanupVideo);
  }

  function handleVideos() {
    if (!isEnabled) return;

    document.querySelectorAll('video').forEach((video) => {
      const visible = isInViewport(video);

      // Reset videos that scrolled out of view
      if (!visible) {
        if (video._onTimeUpdate) cleanupVideo(video);
        return;
      }

      // Re-pause if video was ended but started playing again
      if (video._hasEnded && !video.paused) {
        video.pause();
        return;
      }

      // Skip if already watching this video
      if (video._onTimeUpdate) return;

      // Start watching for video end
      video._onTimeUpdate = () => checkVideoEnd(video);
      video.addEventListener('timeupdate', video._onTimeUpdate);
    });
  }

  function checkVideoEnd(video) {
    if (!isEnabled || !video.duration || video._hasEnded) return;

    if (video.currentTime >= video.duration - END_THRESHOLD) {
      video.pause();
      video._hasEnded = true;
    }
  }

  function isInViewport(video) {
    const rect = video.getBoundingClientRect();
    return rect.top >= -100 && rect.top <= window.innerHeight;
  }

  function cleanupVideo(video) {
    if (video._onTimeUpdate) {
      video.removeEventListener('timeupdate', video._onTimeUpdate);
      delete video._onTimeUpdate;
    }
    delete video._hasEnded;
  }

  window.addEventListener('beforeunload', stopWatching);
})();
