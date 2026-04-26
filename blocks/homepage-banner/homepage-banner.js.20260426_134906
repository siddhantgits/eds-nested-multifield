import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Extract root fields
  const videoLargePosterCell = children[0];
  const videoLargeSrcCell = children[1];
  const videoSmallPosterCell = children[2];
  const videoSmallSrcCell = children[3];
  const primaryTitleCell = children[4];
  const primaryCtaLinkCell = children[5];
  const primaryCtaTextCell = children[6];
  const secondaryTitleCell = children[7];
  const secondaryCtaLinkCell = children[8];
  const secondaryCtaTextCell = children[9];

  // Remaining children are greeting item cells
  const greetingItemCells = children.slice(10);

  // Create the main wrapper section
  const section = document.createElement('section');
  section.classList.add('grid-container', 'homepage-banner-wrapper', 'variation--banner', 'bg--paper-white');
  section.setAttribute('data-is-banner', 'true');

  // Create the homepage-banner div
  const homepageBanner = document.createElement('div');
  homepageBanner.classList.add('homepage-banner', 'reveal-effect-container');
  moveInstrumentation(block, homepageBanner);

  // Media Container
  const mediaContainer = document.createElement('div');
  mediaContainer.classList.add('media-container');

  const createVideoElement = (srcCell, posterCell, large = true) => {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'none';

    if (large) {
      video.classList.add('video--large', 'show-for-large');
    } else {
      video.classList.add('video--small', 'hide-for-large');
    }

    const posterImg = posterCell?.querySelector('img');
    if (posterImg) {
      const optimizedPoster = createOptimizedPicture(posterImg.src, posterImg.alt, false, [{ width: '750' }]);
      video.poster = optimizedPoster.querySelector('img').src;
      video.setAttribute('data-poster', optimizedPoster.querySelector('img').src);
    }

    const sourceLink = srcCell?.querySelector('a');
    if (sourceLink && /\.(mp4|webm|ogg|mov)$/i.test(sourceLink.href)) {
      const source = document.createElement('source');
      source.src = sourceLink.href;
      source.type = `video/${sourceLink.href.split('.').pop()}`;
      source.setAttribute('data-src', sourceLink.href);
      video.appendChild(source);
    }
    return video;
  };

  const largeVideo = createVideoElement(videoLargeSrcCell, videoLargePosterCell, true);
  mediaContainer.appendChild(largeVideo);

  const smallVideo = createVideoElement(videoSmallSrcCell, videoSmallPosterCell, false);
  mediaContainer.appendChild(smallVideo);

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
  primaryTitle.textContent = primaryTitleCell?.textContent.trim() || '';
  contentWrapper.appendChild(primaryTitle);

  // Primary CTA
  const primaryCtaContainer = document.createElement('div');
  primaryCtaContainer.classList.add('cta-container', 'primary-title-cta-container');
  const primaryCtaLink = document.createElement('a');
  primaryCtaLink.classList.add('button', 'red');
  const primaryCtaHref = primaryCtaLinkCell?.querySelector('a')?.href;
  if (primaryCtaHref) {
    primaryCtaLink.href = primaryCtaHref;
  }
  primaryCtaLink.setAttribute('aria-label', '');
  primaryCtaLink.setAttribute('rel', 'follow');
  const primaryCtaSpan = document.createElement('span');
  primaryCtaSpan.classList.add('button-text');
  primaryCtaSpan.textContent = primaryCtaTextCell?.textContent.trim() || '';
  primaryCtaLink.appendChild(primaryCtaSpan);
  primaryCtaContainer.appendChild(primaryCtaLink);
  contentWrapper.appendChild(primaryCtaContainer);

  // Secondary Title
  const secondaryTitleDiv = document.createElement('div');
  secondaryTitleDiv.classList.add('secondary-title');
  const secondaryHeadline = document.createElement('div');
  secondaryHeadline.classList.add('headline-h1', 'font-weight-bold');
  secondaryHeadline.textContent = secondaryTitleCell?.textContent.trim() || '';
  secondaryTitleDiv.appendChild(secondaryHeadline);

  // Secondary CTA
  const secondaryCtaContainer = document.createElement('div');
  secondaryCtaContainer.classList.add('cta-container');
  const secondaryCtaLink = document.createElement('a');
  secondaryCtaLink.classList.add('button', 'red');
  const secondaryCtaHref = secondaryCtaLinkCell?.querySelector('a')?.href;
  if (secondaryCtaHref) {
    secondaryCtaLink.href = secondaryCtaHref;
  }
  secondaryCtaLink.setAttribute('aria-label', '');
  secondaryCtaLink.setAttribute('rel', 'follow');
  const secondaryCtaSpan = document.createElement('span');
  secondaryCtaSpan.classList.add('button-text');
  secondaryCtaSpan.textContent = secondaryCtaTextCell?.textContent.trim() || '';
  secondaryCtaLink.appendChild(secondaryCtaSpan);
  secondaryCtaContainer.appendChild(secondaryCtaLink);
  secondaryTitleDiv.appendChild(secondaryCtaContainer);
  contentWrapper.appendChild(secondaryTitleDiv);

  maxWidthContainer.appendChild(contentWrapper);
  contentContainer.appendChild(maxWidthContainer);
  homepageBanner.appendChild(contentContainer);

  // Greeting Container
  const greetingContainer = document.createElement('div');
  greetingContainer.classList.add('greeting-container', 'bodyLargeRegular');

  const greetingWrapper = document.createElement('div');
  greetingWrapper.classList.add('greeting-wrapper', 'animate');

  greetingItemCells.forEach((row, index) => {
    // FIXED: Using content detection instead of index access
    const cells = [...row.children];
    const greetingTextCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a')) || cells[0];
    const greetingSpan = document.createElement('span');
    greetingSpan.classList.add('greeting');
    if (index === 0) {
      greetingSpan.classList.add('greeting--morning'); // Default for the first greeting
    } else if (index === 1) {
      greetingSpan.classList.add('greeting--afternoon');
    } else if (index === 2) {
      greetingSpan.classList.add('greeting--evening');
    } else if (index === 3) {
      greetingSpan.classList.add('greeting--night');
    }
    greetingSpan.textContent = greetingTextCell.textContent.trim();
    greetingWrapper.appendChild(greetingSpan);
    moveInstrumentation(greetingTextCell, greetingSpan);
  });

  greetingContainer.appendChild(greetingWrapper);
  section.appendChild(homepageBanner);
  section.appendChild(greetingContainer);

  block.replaceWith(section);

  // Image optimization
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Video interactivity
  const videos = section.querySelectorAll('video');
  videos.forEach((video) => {
    // Autoplay videos when they are in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play().catch((e) => console.error('Video autoplay failed:', e));
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.5 }); // Trigger when 50% of the video is in view
    observer.observe(video);
  });
}
