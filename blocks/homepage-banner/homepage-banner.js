import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    videoLargePosterRow,
    videoLargeSourceRow,
    videoSmallPosterRow,
    videoSmallSourceRow,
    primaryTitleRow,
    secondaryTitleRow, // Primary CTAs are item rows after this
    greetingMorningRow,
    greetingAfternoonRow,
    greetingEveningRow,
    greetingNightRow,
    ...itemRows
  ] = [...block.children];

  // Separate item rows into primary and secondary CTAs
  const primaryCtaItems = [];
  const secondaryCtaItems = [];

  // Determine the split point for primary and secondary CTAs
  // The model doesn't explicitly define the split, so we'll assume
  // primary CTAs come first, then secondary CTAs.
  // We need to infer this from the original HTML or by assuming primaryCtas
  // are the first set of CTA items and secondaryCtas are the second set.
  // Given the original HTML, there's one primary CTA and one secondary CTA.
  // This implies the first item row is for primary, and the second for secondary.
  // However, the EDS structure shows a generic list of "cta-item" rows.
  // Without a clear differentiator in the item row structure, we'll
  // assume the first N items are primary and the rest are secondary.
  // For this specific block, the original HTML shows 1 primary CTA and 1 secondary CTA.
  // So, we'll take the first itemRow as primary and the rest as secondary.
  // If there are more than 2 itemRows, this logic might need adjustment based on content.
  if (itemRows.length > 0) {
    primaryCtaItems.push(itemRows[0]);
    secondaryCtaItems.push(...itemRows.slice(1));
  }

  // Main wrapper
  const section = document.createElement('section');
  section.classList.add('grid-container', 'homepage-banner-wrapper', 'variation--banner', 'bg--paper-white');
  section.setAttribute('data-is-banner', 'true');
  moveInstrumentation(block, section);

  const homepageBanner = document.createElement('div');
  homepageBanner.classList.add('homepage-banner', 'reveal-effect-container');
  section.append(homepageBanner);

  // Media Container
  const mediaContainer = document.createElement('div');
  mediaContainer.classList.add('media-container');
  homepageBanner.append(mediaContainer);

  // Large Video
  const largeVideo = document.createElement('video');
  largeVideo.classList.add('video--large', 'show-for-large');
  largeVideo.muted = true;
  largeVideo.playsInline = true;
  largeVideo.preload = 'none';

  const largePosterImg = videoLargePosterRow?.querySelector('picture img');
  if (largePosterImg) {
    largeVideo.poster = largePosterImg.src;
    largeVideo.setAttribute('data-poster', largePosterImg.src);
  }

  const largeVideoSourceLink = videoLargeSourceRow?.querySelector('picture img');
  if (largeVideoSourceLink) {
    const source = document.createElement('source');
    source.src = largeVideoSourceLink.src;
    source.type = 'video/mp4';
    source.setAttribute('data-src', largeVideoSourceLink.src);
    largeVideo.append(source);
  }
  mediaContainer.append(largeVideo);

  // Small Video
  const smallVideo = document.createElement('video');
  smallVideo.classList.add('video--small', 'hide-for-large');
  smallVideo.muted = true;
  smallVideo.playsInline = true;
  smallVideo.preload = 'none';

  const smallPosterImg = smallVideoPosterRow?.querySelector('picture img');
  if (smallPosterImg) {
    smallVideo.poster = smallPosterImg.src;
    smallVideo.setAttribute('data-poster', smallPosterImg.src);
  }

  const smallVideoSourceLink = smallVideoSourceRow?.querySelector('picture img');
  if (smallVideoSourceLink) {
    const source = document.createElement('source');
    source.src = smallVideoSourceLink.src;
    source.type = 'video/mp4';
    source.setAttribute('data-src', smallVideoSourceLink.src);
    smallVideo.append(source);
  }
  mediaContainer.append(smallVideo);

  // Content Container
  const contentContainer = document.createElement('div');
  contentContainer.classList.add('content-container', 'animate-enter', 'in-view');
  homepageBanner.append(contentContainer);

  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.classList.add('max-width-container');
  contentContainer.append(maxWidthContainer);

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('content-wrapper');
  maxWidthContainer.append(contentWrapper);

  // Primary Title
  const primaryTitle = document.createElement('h1');
  primaryTitle.classList.add('primary-title');
  primaryTitle.textContent = primaryTitleRow?.textContent.trim() || '';
  moveInstrumentation(primaryTitleRow, primaryTitle);
  contentWrapper.append(primaryTitle);

  // Primary CTAs
  if (primaryCtaItems.length > 0) {
    const primaryCtaContainer = document.createElement('div');
    primaryCtaContainer.classList.add('cta-container', 'primary-title-cta-container');
    primaryCtaItems.forEach((row) => {
      // Corrected: Use content detection instead of index access
      const cells = [...row.children];
      const linkCell = cells.find(cell => cell.querySelector('a'));
      const labelCell = cells.find(cell => !cell.querySelector('a'));

      const link = document.createElement('a');
      link.classList.add('button', 'red');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      }
      const span = document.createElement('span');
      span.classList.add('button-text');
      span.textContent = labelCell?.textContent.trim() || '';
      link.append(span);
      moveInstrumentation(row, link);
      primaryCtaContainer.append(link);
    });
    contentWrapper.append(primaryCtaContainer);
  }

  // Secondary Title and CTAs
  const secondaryTitleDiv = document.createElement('div');
  secondaryTitleDiv.classList.add('secondary-title');
  contentWrapper.append(secondaryTitleDiv);

  const secondaryHeadline = document.createElement('div');
  secondaryHeadline.classList.add('headline-h1', 'font-weight-bold');
  secondaryHeadline.textContent = secondaryTitleRow?.textContent.trim() || '';
  moveInstrumentation(secondaryTitleRow, secondaryHeadline);
  secondaryTitleDiv.append(secondaryHeadline);

  if (secondaryCtaItems.length > 0) {
    const secondaryCtaContainer = document.createElement('div');
    secondaryCtaContainer.classList.add('cta-container');
    secondaryCtaItems.forEach((row) => {
      // Corrected: Use content detection instead of index access
      const cells = [...row.children];
      const linkCell = cells.find(cell => cell.querySelector('a'));
      const labelCell = cells.find(cell => !cell.querySelector('a'));

      const link = document.createElement('a');
      link.classList.add('button', 'red');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      }
      const span = document.createElement('span');
      span.classList.add('button-text');
      span.textContent = labelCell?.textContent.trim() || '';
      link.append(span);
      moveInstrumentation(row, link);
      secondaryCtaContainer.append(link);
    });
    secondaryTitleDiv.append(secondaryCtaContainer);
  }

  // Greeting Container
  const greetingContainer = document.createElement('div');
  greetingContainer.classList.add('greeting-container', 'bodyLargeRegular');
  section.append(greetingContainer);

  const greetingWrapper = document.createElement('div');
  greetingWrapper.classList.add('greeting-wrapper', 'animate');
  greetingContainer.append(greetingWrapper);

  const greetings = [
    { row: greetingMorningRow, className: 'greeting--morning' },
    { row: greetingAfternoonRow, className: 'greeting--afternoon' },
    { row: greetingEveningRow, className: 'greeting--evening' },
    { row: greetingNightRow, className: 'greeting--night' },
  ];

  greetings.forEach(({ row, className }) => {
    const span = document.createElement('span');
    span.classList.add('greeting', className);
    span.textContent = row?.textContent.trim() || '';
    if (row) moveInstrumentation(row, span);
    greetingWrapper.append(span);
  });

  // Replace the original block with the new section
  block.replaceWith(section);

  // Image optimization
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
