import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'banner-section__wrapper position-relative boing';

  const videoWrapper = document.createElement('div');
  videoWrapper.className = 'banner-video-wrapper';

  const video = document.createElement('video');
  video.className = 'banner-video w-100 object-fit-cover banner-media';
  video.title = 'Video';
  video.ariaLabel = 'Video';
  video.setAttribute('data-is-autoplay', 'true');
  video.playsInline = true;
  video.preload = 'metadata';
  video.fetchPriority = 'high';
  video.loop = false;
  video.muted = true;
  video.autoplay = true;

  const source = document.createElement('source');
  // Assuming the first cell contains the video source
  const videoSrcCell = block.children[0]?.children[0];
  if (videoSrcCell) {
    const videoLink = videoSrcCell.querySelector('a');
    if (videoLink) {
      source.src = videoLink.href;
      source.type = 'video/mp4';
      video.append(source);
      moveInstrumentation(videoSrcCell, source);
    }
  }

  const playPauseOverlay = document.createElement('div');
  playPauseOverlay.className = 'position-absolute w-100 h-100 start-0 top-0 d-flex justify-content-center align-items-center cursor-pointer';

  const playButton = document.createElement('button');
  playButton.type = 'button';
  playButton.className = 'banner-video-icon icon-play bg-transparent d-flex align-items-center justify-content-center cursor-pointer d-none';
  const playIconCell = block.children[0]?.children[1];
  if (playIconCell) {
    playButton.textContent = playIconCell.textContent.trim();
    moveInstrumentation(playIconCell, playButton);
  }

  const pauseButton = document.createElement('button');
  pauseButton.type = 'button';
  pauseButton.className = 'banner-video-icon icon-pause bg-transparent d-flex align-items-center justify-content-center cursor-pointer d-block';
  const pauseIconCell = block.children[0]?.children[2];
  if (pauseIconCell) {
    pauseButton.textContent = pauseIconCell.textContent.trim();
    moveInstrumentation(pauseIconCell, pauseButton);
  }

  playPauseOverlay.append(playButton, pauseButton);

  const muteOverlay = document.createElement('div');
  muteOverlay.className = 'banner-mute-icon position-absolute z-2 d-flex justify-content-center align-items-center cursor-pointer ';

  const muteButton = document.createElement('button');
  muteButton.type = 'button';
  muteButton.className = 'banner-video-icon-volume icon-mute bg-transparent d-flex align-items-center justify-content-center cursor-pointer d-none';
  const muteIconCell = block.children[0]?.children[3];
  if (muteIconCell) {
    muteButton.textContent = muteIconCell.textContent.trim();
    moveInstrumentation(muteIconCell, muteButton);
  }

  const unmuteButton = document.createElement('button');
  unmuteButton.type = 'button';
  unmuteButton.className = 'banner-video-icon-volume icon-unmute bg-transparent d-flex align-items-center justify-content-center cursor-pointer d-none';
  const unmuteIconCell = block.children[0]?.children[4];
  if (unmuteIconCell) {
    unmuteButton.textContent = unmuteIconCell.textContent.trim();
    moveInstrumentation(unmuteIconCell, unmuteButton);
  }

  const noAudioButton = document.createElement('button');
  noAudioButton.type = 'button';
  noAudioButton.className = 'banner-video-icon-volume no-audio-icon bg-transparent d-flex align-items-center justify-content-center cursor-pointer';
  const noAudioIconCell = block.children[0]?.children[5];
  if (noAudioIconCell) {
    noAudioButton.textContent = noAudioIconCell.textContent.trim();
    moveInstrumentation(noAudioIconCell, noAudioButton);
  }

  muteOverlay.append(muteButton, unmuteButton, noAudioButton);

  videoWrapper.append(video, playPauseOverlay, muteOverlay);

  const ctaSection = document.createElement('div');
  ctaSection.className = 'banner-section__cta position-absolute start-50 translate-middle-x w-100 boing__banner--cta';
  const bannerCta = document.createElement('div');
  bannerCta.className = 'banner-cta';
  // Assuming the second row contains the CTA content
  const ctaContentCell = block.children[1]?.children[0];
  if (ctaContentCell) {
    // Transfer all children of the CTA cell directly
    while (ctaContentCell.firstChild) {
      bannerCta.append(ctaContentCell.firstChild);
    }
    moveInstrumentation(block.children[1], ctaSection);
  }
  ctaSection.append(bannerCta);

  wrapper.append(videoWrapper, ctaSection);

  block.textContent = '';
  block.append(wrapper);
}
