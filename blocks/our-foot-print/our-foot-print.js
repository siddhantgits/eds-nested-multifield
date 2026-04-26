import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  const [titleRow, ...cardRows] = rows;

  const footprint = document.createElement('div');
  footprint.classList.add('footprint');

  const cmpOurFootPrint = document.createElement('div');
  cmpOurFootPrint.classList.add('cmp-our-foot-print');
  footprint.append(cmpOurFootPrint);

  // Section Title
  const cmpOurFootPrintHeader = document.createElement('div');
  cmpOurFootPrintHeader.classList.add('cmp-our-foot-print__header');
  cmpOurFootPrint.append(cmpOurFootPrintHeader);

  const cmpOurFootPrintTitle = document.createElement('h2');
  cmpOurFootPrintTitle.classList.add('cmp-our-foot-print__title');
  // FIX: Replaced titleRow.children[0] with content detection
  cmpOurFootPrintTitle.textContent = titleRow.querySelector('div')?.textContent.trim();
  cmpOurFootPrintHeader.append(cmpOurFootPrintTitle);
  moveInstrumentation(titleRow, cmpOurFootPrintTitle);

  // Cards Container
  const cmpOurFootPrintContent = document.createElement('div');
  cmpOurFootPrintContent.classList.add('cmp-our-foot-print__content');
  cmpOurFootPrint.append(cmpOurFootPrintContent);

  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('slickcarousel', 'carousel', 'panelcontainer');
  cmpOurFootPrintContent.append(carouselWrapper);

  const cmpCarousel = document.createElement('div');
  cmpCarousel.classList.add('cmp-carousel');
  carouselWrapper.append(cmpCarousel);

  const cmpCarouselContainer = document.createElement('div');
  cmpCarouselContainer.classList.add('cmp-carousel__container', 'slick-initialized', 'slick-slider');
  cmpCarousel.append(cmpCarouselContainer);

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');
  cmpCarouselContainer.append(slickList);

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');
  slickList.append(slickTrack);

  cardRows.forEach((row, index) => {
    // This destructuring is correct as per BlockJson model for 'footprint-card'
    const [videoCell, titleCell, descriptionCell] = [...row.children];

    const carouselItem = document.createElement('div');
    carouselItem.classList.add(
      'cmp-our-foot-print__carousel-item',
      'cmp-carousel__item',
      `cmp-our-foot-print-carouselcard-index-${index}`,
      'slick-slide',
    );
    if (index === 0) {
      carouselItem.classList.add('slick-current', 'slick-active');
    }
    slickTrack.append(carouselItem);

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');
    carouselItem.append(itemDiv);

    const card = document.createElement('div');
    card.classList.add('card', 'cmp-card--foot-print');
    // Apply different highlight classes based on index or other logic if needed
    if (index % 2 === 0) {
      card.classList.add('cmp-card--foot-print-highlighted', 'color-background-background-2');
    } else {
      card.classList.add('cmp-card--foot-print-default', 'color-background-primary-6');
    }
    itemDiv.append(card);

    const cmpCard = document.createElement('div');
    cmpCard.classList.add('cmp-card');
    card.append(cmpCard);

    const cmpCardContent = document.createElement('div');
    cmpCardContent.classList.add('cmp-card__content');
    cmpCard.append(cmpCardContent);

    // Video/Image
    const picture = videoCell.querySelector('picture');
    if (picture) {
      const cmpCardMedia = document.createElement('div');
      cmpCardMedia.classList.add('cmp-card__media');
      cmpCardContent.append(cmpCardMedia);

      const cmpCardImage = document.createElement('div');
      cmpCardImage.classList.add('cmp-card__image');
      cmpCardMedia.append(cmpCardImage);

      const videoDiv = document.createElement('div');
      videoDiv.classList.add('video', 'cmp-video--foot-print-card');
      cmpCardImage.append(videoDiv);

      const cmpVideo = document.createElement('div');
      cmpVideo.classList.add('cmp-video');
      videoDiv.append(cmpVideo);

      const cmpVideoYoutubeWrapper = document.createElement('div');
      cmpVideoYoutubeWrapper.classList.add('cmp-video__youtube-wrapper');
      cmpVideo.append(cmpVideoYoutubeWrapper);

      const cmpVideoIframeWrapper = document.createElement('div');
      cmpVideoIframeWrapper.classList.add('cmp-video__iframe-wrapper');
      cmpVideoYoutubeWrapper.append(cmpVideoIframeWrapper);

      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cmpVideoIframeWrapper.append(optimizedPic);
      }
    }

    // Card Info
    const cmpCardInfo = document.createElement('div');
    cmpCardInfo.classList.add('cmp-card__info');
    cmpCardContent.append(cmpCardInfo);

    const cmpCardTitle = document.createElement('div');
    cmpCardTitle.classList.add('cmp-card__title');
    cmpCardTitle.textContent = titleCell?.textContent.trim();
    cmpCardInfo.append(cmpCardTitle);

    const cmpCardDesc = document.createElement('div');
    cmpCardDesc.classList.add('cmp-card__desc');
    cmpCardDesc.textContent = descriptionCell?.textContent.trim();
    cmpCardInfo.append(cmpCardDesc);

    moveInstrumentation(row, carouselItem);
  });

  block.innerHTML = '';
  block.append(footprint);
}
