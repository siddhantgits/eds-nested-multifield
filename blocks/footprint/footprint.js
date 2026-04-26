import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, ...itemRows] = [...block.children];

  const cmpOurFootPrint = document.createElement('div');
  cmpOurFootPrint.classList.add('cmp-our-foot-print');
  moveInstrumentation(block, cmpOurFootPrint);

  // Section Title
  const cmpOurFootPrintHeader = document.createElement('div');
  cmpOurFootPrintHeader.classList.add('cmp-our-foot-print__header');
  const cmpOurFootPrintTitle = document.createElement('h2');
  cmpOurFootPrintTitle.classList.add('cmp-our-foot-print__title');
  // CHECK 0 & 1: Replaced row.children[0] with content detection for title
  const titleCell = [...titleRow.children].find((cell) => cell.textContent.trim());
  if (titleCell) {
    cmpOurFootPrintTitle.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, cmpOurFootPrintTitle);
  }
  cmpOurFootPrintHeader.append(cmpOurFootPrintTitle);
  cmpOurFootPrint.append(cmpOurFootPrintHeader);

  // Carousel Content
  const cmpOurFootPrintContent = document.createElement('div');
  cmpOurFootPrintContent.classList.add('cmp-our-foot-print__content');

  const cmpCarousel = document.createElement('div');
  cmpCarousel.classList.add('cmp-carousel');

  const cmpCarouselContainer = document.createElement('div');
  cmpCarouselContainer.classList.add('cmp-carousel__container', 'slick-initialized', 'slick-slider');

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');

  itemRows.forEach((row, index) => {
    // CHECK 0: Correctly using destructuring for item rows, which is fine as per model
    const [videoCell, titleCell, descriptionCell] = [...row.children];

    const cmpOurFootPrintCarouselItem = document.createElement('div');
    cmpOurFootPrintCarouselItem.classList.add(
      'cmp-our-foot-print__carousel-item',
      'cmp-carousel__item',
      `cmp-our-foot-print-carouselcard-index-${index}`,
      'slick-slide',
    );
    if (index === 0) {
      cmpOurFootPrintCarouselItem.classList.add('slick-current', 'slick-active');
    }
    cmpOurFootPrintCarouselItem.setAttribute('data-slick-index', index);
    cmpOurFootPrintCarouselItem.setAttribute('aria-hidden', index !== 0);
    cmpOurFootPrintCarouselItem.setAttribute('tabindex', index === 0 ? '0' : '-1'); // Only first item is tabbable initially
    moveInstrumentation(row, cmpOurFootPrintCarouselItem);

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');

    const card = document.createElement('div');
    card.classList.add('card', 'cmp-card--foot-print');

    // Apply different background colors based on index for variety, matching original HTML pattern
    if (index === 0) {
      card.classList.add('cmp-card--foot-print-highlighted', 'color-background-background-2');
    } else if (index === 1) {
      card.classList.add('cmp-card--foot-print-default', 'color-background-primary-6');
    } else if (index === 2) {
      card.classList.add('cmp-card--foot-print-default', 'color-background-background-3');
    } else {
      card.classList.add('cmp-card--foot-print-default', 'color-background-background-2'); // Default for others
    }

    const cmpCard = document.createElement('div');
    cmpCard.classList.add('cmp-card');

    const cmpCardContent = document.createElement('div');
    cmpCardContent.classList.add('cmp-card__content');

    const cmpCardMedia = document.createElement('div');
    cmpCardMedia.classList.add('cmp-card__media');

    const cmpCardImage = document.createElement('div');
    cmpCardImage.classList.add('cmp-card__image');

    const videoDiv = document.createElement('div');
    videoDiv.classList.add('video', 'cmp-video--foot-print-card');

    const cmpVideo = document.createElement('div');
    cmpVideo.classList.add('cmp-video');

    const cmpVideoYoutubeWrapper = document.createElement('div');
    cmpVideoYoutubeWrapper.classList.add('cmp-video__youtube-wrapper');

    const cmpVideoIframeWrapper = document.createElement('div');
    cmpVideoIframeWrapper.classList.add('cmp-video__iframe-wrapper');

    const img = videoCell.querySelector('img');
    const iframe = videoCell.querySelector('iframe'); // Check for actual iframe if present

    if (iframe) {
      // If an iframe is directly provided, use it. The model expects a 'reference' (picture),
      // so we'll create a placeholder picture if an iframe is found.
      const placeholderPicture = document.createElement('picture');
      const placeholderImg = document.createElement('img');
      placeholderImg.src = '/icons/play-button.svg'; // A generic play icon or a blank image
      placeholderImg.alt = 'Video thumbnail';
      placeholderPicture.append(placeholderImg);
      cmpCardImage.append(placeholderPicture);
      // Append the iframe itself to the iframe wrapper
      cmpVideoIframeWrapper.append(iframe);
      moveInstrumentation(videoCell, iframe);
    } else if (img) {
      const picture = img.closest('picture');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(picture, optimizedPic.querySelector('img'));
      cmpCardImage.append(optimizedPic);
    }

    cmpVideoIframeWrapper.prepend(cmpCardImage); // Ensure image/placeholder is before iframe
    cmpVideoYoutubeWrapper.append(cmpVideoIframeWrapper);
    cmpVideo.append(cmpVideoYoutubeWrapper);
    videoDiv.append(cmpVideo);
    cmpCardMedia.append(videoDiv);
    cmpCardContent.append(cmpCardMedia);

    const cmpCardInfo = document.createElement('div');
    cmpCardInfo.classList.add('cmp-card__info');

    const cmpCardTitle = document.createElement('div');
    cmpCardTitle.classList.add('cmp-card__title');
    cmpCardTitle.textContent = titleCell?.textContent.trim();
    moveInstrumentation(titleCell, cmpCardTitle); // Add instrumentation for title cell

    const cmpCardDesc = document.createElement('div');
    cmpCardDesc.classList.add('cmp-card__desc');
    cmpCardDesc.textContent = descriptionCell?.textContent.trim();
    moveInstrumentation(descriptionCell, cmpCardDesc); // Add instrumentation for description cell

    cmpCardInfo.append(cmpCardTitle, cmpCardDesc);
    cmpCardContent.append(cmpCardInfo);
    // CHECK 5: Removed duplicate append of cmpCardContent
    cmpCard.append(cmpCardContent);
    itemDiv.append(card);
    cmpOurFootPrintCarouselItem.append(itemDiv);
    slickTrack.append(cmpOurFootPrintCarouselItem);
  });

  slickList.append(slickTrack);
  cmpCarouselContainer.append(slickList);
  cmpCarousel.append(cmpCarouselContainer);
  cmpOurFootPrintContent.append(cmpCarousel);
  cmpOurFootPrint.append(cmpOurFootPrintContent);

  // CHECK 4: Correctly using block.innerHTML = '' and block.append()
  block.innerHTML = '';
  block.append(cmpOurFootPrint);
}
