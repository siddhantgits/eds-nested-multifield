import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, ...itemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('sustainability-article-carousel', 'grid-container', 'bg--paper-green', 'animate-enter', 'in-view');
  moveInstrumentation(block, section);

  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.classList.add('max-width-container');
  section.appendChild(maxWidthContainer);

  const gridXTitle = document.createElement('div');
  gridXTitle.classList.add('grid-x');
  maxWidthContainer.appendChild(gridXTitle);

  const cellTitle = document.createElement('div');
  cellTitle.classList.add('cell', 'small-12', 'large-10', 'large-offset-1', 'xlarge-8', 'xlarge-offset-2');
  gridXTitle.appendChild(cellTitle);

  const textSection = document.createElement('div');
  textSection.classList.add('sustainability-article-carousel__text-section');
  cellTitle.appendChild(textSection);

  const h2Title = document.createElement('h2');
  h2Title.classList.add('sustainability-article-carousel__title', 'animate-enter-fade-up-short');
  h2Title.textContent = titleRow?.textContent.trim() || '';
  moveInstrumentation(titleRow, h2Title);
  textSection.appendChild(h2Title);

  const gridXWrapper = document.createElement('div');
  gridXWrapper.classList.add('grid-x');
  section.appendChild(gridXWrapper);

  const cellWrapper = document.createElement('div');
  cellWrapper.classList.add('cell', 'small-12', 'large-offset-1', 'large-11', 'sustainability-article-carousel__wrapper');
  gridXWrapper.appendChild(cellWrapper);

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper', 'swipper--full-view-padding', 'sustainability-article-carousel__wrapper--inner'); // Add more swiper classes if needed for styling, but not for JS functionality
  cellWrapper.appendChild(swiperContainer);

  // Previous button
  const prevControl = document.createElement('div');
  prevControl.classList.add('sustainability-article-carousel__btn-control', 'sustainability-article-carousel--prev', 'show-for-large');
  const prevButton = document.createElement('button');
  prevButton.classList.add('swiper-control', 'swiper-button', 'swiper--prev', 'elevation-1');
  prevButton.setAttribute('aria-label', 'Previous slide');
  const prevImg = document.createElement('img');
  prevImg.alt = 'svg file';
  // NOTE: The original HTML has hardcoded SVG paths for buttons.
  // Since the EDS block model does not provide fields for these,
  // we cannot create them from authored content. We omit them
  // to adhere to Rule 16 (no hardcoded asset paths).
  // If the model were extended with button icon fields, we would use them.
  // prevButton.appendChild(prevImg);
  prevControl.appendChild(prevButton);
  swiperContainer.appendChild(prevControl);

  // Next button
  const nextControl = document.createElement('div');
  nextControl.classList.add('sustainability-article-carousel__btn-control', 'sustainability-article-carousel--next', 'show-for-large');
  const nextButton = document.createElement('button');
  nextButton.classList.add('swiper-control', 'swiper-button', 'swiper--next', 'elevation-1');
  nextButton.setAttribute('aria-label', 'Next slide');
  const nextImg = document.createElement('img');
  nextImg.alt = 'svg file';
  // nextButton.appendChild(nextImg); // Omitted for Rule 16
  nextControl.appendChild(nextButton);
  swiperContainer.appendChild(nextControl);

  const swiperList = document.createElement('ul');
  swiperList.classList.add('swiper-wrapper', 'sustainability-article-carousel__list');
  swiperContainer.appendChild(swiperList);

  itemRows.forEach((row) => {
    const [tagCell, imageCell, linkCell, articleTitleCell, descriptionCell, readingDurationCell] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('swiper-slide', 'sustainability-article-carousel__list-item', 'animate-enter-fade-left-short', 'animate-delay-1');
    moveInstrumentation(row, listItem);

    const articleLink = document.createElement('a');
    articleLink.classList.add('sustainability-card', 'elevation-2', 'has-hover');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      articleLink.href = foundLink.href;
      articleLink.setAttribute('aria-label', articleTitleCell?.textContent.trim() || '');
    } else {
      articleLink.href = '#';
    }
    listItem.appendChild(articleLink);

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('sustainability-card__img-container', 'animate-enter-fade', 'animate-delay-5');
    articleLink.appendChild(imgContainer);

    const tagDiv = document.createElement('div');
    tagDiv.classList.add('sustainability-card__tag');
    imgContainer.appendChild(tagDiv);

    const tagInner = document.createElement('div');
    tagInner.classList.add('tag', 'bg--brand-green');
    tagDiv.appendChild(tagInner);

    const tagLabel = document.createElement('span');
    tagLabel.classList.add('tag__label');
    tagLabel.textContent = tagCell?.textContent.trim() || '';
    tagInner.appendChild(tagLabel);

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imgContainer.appendChild(optimizedPic);
    }

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('sustainability-card__content');
    articleLink.appendChild(contentDiv);

    const textContentWrapper = document.createElement('div');
    contentDiv.appendChild(textContentWrapper);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('sustainability-card__title', 'animate-enter-fade-up-short', 'animate-delay-7');
    const titleSpan = document.createElement('span');
    titleSpan.classList.add('labelLargeBold');
    titleSpan.textContent = articleTitleCell?.textContent.trim() || '';
    titleDiv.appendChild(titleSpan);
    textContentWrapper.appendChild(titleDiv);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('sustainability-card__description', 'animate-enter-fade-up-short', 'animate-delay-9');
    const descriptionInner = document.createElement('div');
    descriptionInner.classList.add('bodyMediumRegular');
    descriptionInner.innerHTML = descriptionCell?.innerHTML || '';
    descriptionDiv.appendChild(descriptionInner);
    textContentWrapper.appendChild(descriptionDiv);

    const readingDurationDiv = document.createElement('div');
    readingDurationDiv.classList.add('sustainability-card__reading-duration');
    const durationSpan = document.createElement('span');
    durationSpan.classList.add('labelSmallBold', 'animate-enter-fade-up-short', 'animate-delay-11');
    durationSpan.textContent = readingDurationCell?.textContent.trim() || '';
    readingDurationDiv.appendChild(durationSpan);

    const suffixSpan = document.createElement('span');
    suffixSpan.classList.add('utilityTagHighCaps', 'text-uppercase', 'sustainability-card__reading-duration-suffix', 'animate-enter-fade-up-short', 'animate-delay-13');
    suffixSpan.textContent = ' mins';
    readingDurationDiv.appendChild(suffixSpan);
    contentDiv.appendChild(readingDurationDiv);

    swiperList.appendChild(listItem);
  });

  const paginationDiv = document.createElement('div');
  paginationDiv.classList.add('sustainability-article-carousel__pagination', 'animate-enter-fade-left-short', 'animate-delay-3');
  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'swiper-pagination-clickable', 'swiper-pagination-bullets', 'swiper-pagination-horizontal');
  paginationDiv.appendChild(swiperPagination);
  swiperContainer.appendChild(paginationDiv);

  block.innerHTML = '';
  block.appendChild(section);

  // Initialize Swiper
  import('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js').then((module) => {
    const Swiper = module.default;
    // eslint-disable-next-line no-new
    new Swiper(swiperContainer, {
      slidesPerView: 'auto',
      spaceBetween: 32,
      centeredSlides: true,
      loop: false,
      pagination: {
        el: swiperPagination,
        clickable: true,
      },
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton,
      },
      breakpoints: {
        1024: {
          centeredSlides: false,
          slidesPerView: 3,
          spaceBetween: 32,
        },
      },
    });
  });
}
