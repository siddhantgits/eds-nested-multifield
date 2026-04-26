import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [videoUrlRow] = [...block.children];

  // CHECK 0 FIX: Replaced row.children[0] with content detection
  const videoUrlCell = [...videoUrlRow.children].find(cell => cell.querySelector('a'));
  const videoLink = videoUrlCell?.querySelector('a');
  const videoSrc = videoLink ? videoLink.href : '';

  if (!videoSrc) {
    block.innerHTML = '';
    return;
  }

  const section = document.createElement('section');
  section.classList.add('video-cmp');

  const container = document.createElement('div');
  container.classList.add('container');

  const videoContainer = document.createElement('div');
  videoContainer.classList.add('video-container', 'mx-auto', 'w-100');

  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'youtube-video');

  const iframe = document.createElement('iframe');
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '100%');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;');
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');

  // Extract YouTube video ID from the URL
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/;
  const match = videoSrc.match(youtubeRegex);

  if (match && match[1]) {
    const videoId = match[1];
    iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&enablejsapi=1`;
  } else {
    // Fallback for non-YouTube links or direct video files
    if (/\.(mp4|webm|ogg|mov)$/i.test(videoSrc)) {
      const videoElement = document.createElement('video');
      videoElement.src = videoSrc;
      videoElement.setAttribute('controls', '');
      videoElement.setAttribute('playsinline', '');
      videoElement.setAttribute('preload', 'metadata');
      videoElement.classList.add('w-100', 'h-100');
      positionRelativeDiv.append(videoElement);
    } else {
      // If it's not a YouTube link or a direct video file, just use the original src
      iframe.src = videoSrc;
    }
  }

  if (iframe.src) {
    positionRelativeDiv.append(iframe);
  }

  videoContainer.append(positionRelativeDiv);
  container.append(videoContainer);
  section.append(container);

  moveInstrumentation(videoUrlRow, section);
  block.innerHTML = '';
  block.append(section);
}
