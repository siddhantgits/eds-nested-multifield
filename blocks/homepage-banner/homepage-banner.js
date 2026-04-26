import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('section');
  wrapper.classList.add('grid-container', 'homepage-banner-wrapper', 'variation--banner', 'bg--paper-white');
  wrapper.setAttribute('data-is-banner', 'true');

  const homepageBanner = document.createElement('div');
  homepageBanner.classList.add('homepage-banner', 'reveal-effect-container');
  moveInstrumentation(block, homepageBanner);

  const [
    videoLargePosterRow,
    videoLargeSrcRow,
    videoSmallPosterRow,
    videoSmallSrcRow,
    primaryTitleRow,
    primaryCtaLinkRow,
    primaryCtaTextRow,
    secondaryTitleRow,
    secondaryHeadlineRow,
    secondaryCtaLinkRow,
    secondaryCtaTextRow,
    ...greetingRows
  ] = [...block.children];

  // Media Container
  const mediaContainer = document.createElement('div');
  mediaContainer.classList.add('media-container');

  const createVideoElement = (srcRow, posterRow, classes) => {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'none';
    video.classList.add(...classes);

    const posterImg = posterRow?.querySelector('img');
    if (posterImg) {
      video.poster = posterImg.src;
      video.setAttribute('data-poster', posterImg.src);
    }

    const sourceLink = srcRow?.querySelector('img');
    if (sourceLink) {
      const source = document.createElement('source');
      source.src = sourceLink.src;
      source.setAttribute('data-src', sourceLink.src);
      source.type = 'video/mp4';
      video.appendChild(source);
    }
    return video;
  };

  const videoLarge = createVideoElement(
    videoLargeSrcRow,
    videoLargePosterRow,
    ['video--large', 'show-for-large'],
  );
  mediaContainer.appendChild(videoLarge);

  const videoSmall = createVideoElement(
    videoSmallSrcRow,
    videoSmallPosterRow,
    ['video--small', 'hide-for-large'],
  );
  mediaContainer.appendChild(videoSmall);

  homepageBanner.appendChild(mediaContainer);

  // Content Container
  const contentContainer = document.createElement('div');
  contentContainer.classList.add('content-container', 'animate-enter', 'in-view');

  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.classList.add('max-width-container');

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('content-wrapper');

  // Primary Title
  const primaryTitle = document.createElement('h1');
  primaryTitle.classList.add('primary-title');
  primaryTitle.textContent = primaryTitleRow?.textContent.trim() || '';
  contentWrapper.appendChild(primaryTitle);

  // Primary CTA
  const primaryCtaContainer = document.createElement('div');
  primaryCtaContainer.classList.add('cta-container', 'primary-title-cta-container');

  const primaryCtaLink = document.createElement('a');
  primaryCtaLink.classList.add('button', 'red');
  const foundPrimaryLink = primaryCtaLinkRow?.querySelector('a');
  if (foundPrimaryLink) {
    primaryCtaLink.href = foundPrimaryLink.href;
  }
  primaryCtaLink.setAttribute('aria-label', '');
  primaryCtaLink.setAttribute('rel', 'follow');

  const primaryCtaTextSpan = document.createElement('span');
  primaryCtaTextSpan.classList.add('button-text');
  primaryCtaTextSpan.textContent = primaryCtaTextRow?.textContent.trim() || '';
  primaryCtaLink.appendChild(primaryCtaTextSpan);
  primaryCtaContainer.appendChild(primaryCtaLink);
  contentWrapper.appendChild(primaryCtaContainer);

  // Secondary Title
  const secondaryTitleDiv = document.createElement('div');
  secondaryTitleDiv.classList.add('secondary-title');

  const secondaryHeadline = document.createElement('div');
  secondaryHeadline.classList.add('headline-h1', 'font-weight-bold');
  secondaryHeadline.textContent = secondaryHeadlineRow?.textContent.trim() || '';
  secondaryTitleDiv.appendChild(secondaryHeadline);

  // Secondary CTA
  const secondaryCtaContainer = document.createElement('div');
  secondaryCtaContainer.classList.add('cta-container');

  const secondaryCtaLink = document.createElement('a');
  secondaryCtaLink.classList.add('button', 'red');
  const foundSecondaryLink = secondaryCtaLinkRow?.querySelector('a');
  if (foundSecondaryLink) {
    secondaryCtaLink.href = foundSecondaryLink.href;
  }
  secondaryCtaLink.setAttribute('aria-label', '');
  secondaryCtaLink.setAttribute('rel', 'follow');

  const secondaryCtaTextSpan = document.createElement('span');
  secondaryCtaTextSpan.classList.add('button-text');
  secondaryCtaTextSpan.textContent = secondaryCtaTextRow?.textContent.trim() || '';
  secondaryCtaLink.appendChild(secondaryCtaTextSpan);
  secondaryCtaContainer.appendChild(secondaryCtaLink);
  secondaryTitleDiv.appendChild(secondaryCtaContainer);
  contentWrapper.appendChild(secondaryTitleDiv);

  maxWidthContainer.appendChild(contentWrapper);
  contentContainer.appendChild(maxWidthContainer);
  homepageBanner.appendChild(contentContainer);

  wrapper.appendChild(homepageBanner);

  // Greeting Container
  const greetingContainer = document.createElement('div');
  greetingContainer.classList.add('greeting-container', 'bodyLargeRegular');

  const greetingWrapper = document.createElement('div');
  greetingWrapper.classList.add('greeting-wrapper', 'animate');

  greetingRows.forEach((row) => {
    const greetingText = row.querySelector('div')?.textContent.trim();
    if (greetingText) {
      const span = document.createElement('span');
      span.classList.add('greeting');
      if (greetingText.toLowerCase().includes('morning')) {
        span.classList.add('greeting--morning');
      } else if (greetingText.toLowerCase().includes('afternoon')) {
        span.classList.add('greeting--afternoon');
      } else if (greetingText.toLowerCase().includes('evening')) {
        span.classList.add('greeting--evening');
      } else if (greetingText.toLowerCase().includes('night')) {
        span.classList.add('greeting--night');
      }
      span.textContent = greetingText;
      greetingWrapper.appendChild(span);
      moveInstrumentation(row, span);
    }
  });

  greetingContainer.appendChild(greetingWrapper);
  wrapper.appendChild(greetingContainer);

  block.innerHTML = '';
  block.appendChild(wrapper);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Interactivity: Video play/pause based on visibility
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play();
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.5 }); // Play when 50% of the video is visible

  observer.observe(videoLarge);
  observer.observe(videoSmall);

  // Interactivity: Handle video source updates on window resize
  const updateVideoSources = () => {
    const isLargeScreen = window.matchMedia('(min-width: 1024px)').matches; // Example breakpoint
    const currentLargeVideoSrc = videoLarge.querySelector('source')?.getAttribute('data-src');
    const currentSmallVideoSrc = videoSmall.querySelector('source')?.getAttribute('data-src');

    if (isLargeScreen) {
      if (videoLarge.paused && currentLargeVideoSrc) {
        videoLarge.querySelector('source').src = currentLargeVideoSrc;
        videoLarge.load();
      }
      videoLarge.style.display = 'block';
      videoSmall.style.display = 'none';
    } else {
      if (videoSmall.paused && currentSmallVideoSrc) {
        videoSmall.querySelector('source').src = currentSmallVideoSrc;
        videoSmall.load();
      }
      videoSmall.style.display = 'block';
      videoLarge.style.display = 'none';
    }
  };

  // Initial call and event listener for resize
  updateVideoSources();
  window.addEventListener('resize', updateVideoSources);
}
