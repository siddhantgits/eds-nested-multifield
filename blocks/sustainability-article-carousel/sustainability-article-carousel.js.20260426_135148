import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, ...cardRows] = [...block.children];

  block.classList.add('grid-container', 'bg--paper-green', 'animate-enter', 'in-view');

  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.classList.add('max-width-container');
  block.append(maxWidthContainer);

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x');
  maxWidthContainer.append(gridX);

  const cell = document.createElement('div');
  cell.classList.add('cell', 'small-12', 'large-10', 'large-offset-1', 'xlarge-8', 'xlarge-offset-2');
  gridX.append(cell);

  const textSection = document.createElement('div');
  textSection.classList.add('sustainability-article-carousel__text-section');
  cell.append(textSection);

  const title = document.createElement('h2');
  title.classList.add('sustainability-article-carousel__title', 'animate-enter-fade-up-short');
  moveInstrumentation(titleRow, title);
  // FIX: titleRow is the div containing the title text, not a row of cells.
  // The title text is directly inside titleRow.
  title.textContent = titleRow.textContent.trim();
  textSection.append(title);

  const carouselWrapperGridX = document.createElement('div');
  carouselWrapperGridX.classList.add('grid-x');
  block.append(carouselWrapperGridX);

  const carouselWrapperCell = document.createElement('div');
  carouselWrapperCell.classList.add('cell', 'small-12', 'large-offset-1', 'large-11', 'sustainability-article-carousel__wrapper');
  carouselWrapperGridX.append(carouselWrapperCell);

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper', 'swipper--full-view-padding', 'sustainability-article-carousel__wrapper--inner');
  carouselWrapperCell.append(swiperContainer);

  const prevButtonControl = document.createElement('div');
  prevButtonControl.classList.add('sustainability-article-carousel__btn-control', 'sustainability-article-carousel--prev', 'show-for-large');
  swiperContainer.append(prevButtonControl);

  const prevButton = document.createElement('button');
  prevButton.classList.add('swiper-control', 'swiper-button', 'swiper--prev', 'elevation-1');
  prevButton.setAttribute('aria-label', 'Previous slide');
  prevButtonControl.append(prevButton);

  const nextButtonControl = document.createElement('div');
  nextButtonControl.classList.add('sustainability-article-carousel__btn-control', 'sustainability-article-carousel--next', 'show-for-large');
  swiperContainer.append(nextButtonControl);

  const nextButton = document.createElement('button');
  nextButton.classList.add('swiper-control', 'swiper-button', 'swiper--next', 'elevation-1');
  nextButton.setAttribute('aria-label', 'Next slide');
  nextButtonControl.append(nextButton);

  const swiperWrapper = document.createElement('ul');
  swiperWrapper.classList.add('swiper-wrapper', 'sustainability-article-carousel__list');
  swiperContainer.append(swiperWrapper);

  cardRows.forEach((row) => {
    const [
      linkCell,
      tagCell,
      imageCell,
      cardTitleCell,
      descriptionCell,
      readingDurationCell,
      readingDurationSuffixCell,
    ] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('swiper-slide', 'sustainability-article-carousel__list-item', 'animate-enter-fade-left-short', 'animate-delay-1');
    moveInstrumentation(row, listItem);

    const cardLink = document.createElement('a');
    cardLink.classList.add('sustainability-card', 'elevation-2', 'has-hover');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.setAttribute('aria-label', cardTitleCell.textContent.trim());
    }
    listItem.append(cardLink);

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('sustainability-card__img-container', 'animate-enter-fade', 'animate-delay-5');
    cardLink.append(imgContainer);

    const tagDiv = document.createElement('div');
    tagDiv.classList.add('sustainability-card__tag');
    imgContainer.append(tagDiv);

    const tagInnerDiv = document.createElement('div');
    tagInnerDiv.classList.add('tag', 'bg--brand-green');
    tagDiv.append(tagInnerDiv);

    const tagLabel = document.createElement('span');
    tagLabel.classList.add('tag__label');
    tagLabel.textContent = tagCell.textContent.trim();
    tagInnerDiv.append(tagLabel);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imgContainer.append(optimizedPic);
    }

    const cardContent = document.createElement('div');
    cardContent.classList.add('sustainability-card__content');
    cardLink.append(cardContent);

    const contentDiv = document.createElement('div');
    cardContent.append(contentDiv);

    const cardTitleDiv = document.createElement('div');
    cardTitleDiv.classList.add('sustainability-card__title', 'animate-enter-fade-up-short', 'animate-delay-7');
    contentDiv.append(cardTitleDiv);

    const cardTitleSpan = document.createElement('span');
    cardTitleSpan.classList.add('labelLargeBold');
    cardTitleSpan.textContent = cardTitleCell.textContent.trim();
    cardTitleDiv.append(cardTitleSpan);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('sustainability-card__description', 'animate-enter-fade-up-short', 'animate-delay-9');
    contentDiv.append(descriptionDiv);

    const bodyMediumRegular = document.createElement('div');
    bodyMediumRegular.classList.add('bodyMediumRegular');
    bodyMediumRegular.textContent = descriptionCell.textContent.trim();
    descriptionDiv.append(bodyMediumRegular);

    const signInInfoTooltip = document.createElement('div');
    signInInfoTooltip.classList.add('signIn-Info-Tooltip', 'animate-enter-fade-up-short', 'animate-delay-9');
    cardContent.append(signInInfoTooltip);

    const readingDurationDiv = document.createElement('div');
    readingDurationDiv.classList.add('sustainability-card__reading-duration');
    cardContent.append(readingDurationDiv);

    const durationSpan = document.createElement('span');
    durationSpan.classList.add('labelSmallBold', 'animate-enter-fade-up-short', 'animate-delay-11');
    durationSpan.textContent = readingDurationCell.textContent.trim();
    readingDurationDiv.append(durationSpan);

    const suffixSpan = document.createElement('span');
    suffixSpan.classList.add('utilityTagHighCaps', 'text-uppercase', 'sustainability-card__reading-duration-suffix', 'animate-enter-fade-up-short', 'animate-delay-13');
    suffixSpan.textContent = readingDurationSuffixCell.textContent.trim();
    readingDurationDiv.append(suffixSpan);

    swiperWrapper.append(listItem);
  });

  const paginationDiv = document.createElement('div');
  paginationDiv.classList.add('sustainability-article-carousel__pagination', 'animate-enter-fade-left-short', 'animate-delay-3');
  swiperContainer.append(paginationDiv);

  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'swiper-pagination-clickable', 'swiper-pagination-bullets', 'swiper-pagination-horizontal');
  paginationDiv.append(swiperPagination);

  // Swiper initialization (simplified, as EDS does not load Swiper JS)
  // These buttons and pagination elements are for visual structure only.
  // Full Swiper functionality would require an external library.
  let currentSlide = 0;
  const slides = swiperWrapper.children;

  const updateCarousel = () => {
    [...slides].forEach((slide, i) => {
      slide.classList.remove('swiper-slide-active', 'swiper-slide-next');
      if (i === currentSlide) {
        slide.classList.add('swiper-slide-active');
      } else if (i === currentSlide + 1) {
        slide.classList.add('swiper-slide-next');
      }
      // Simple transform for visual effect without full Swiper
      slide.style.transform = `translateX(-${currentSlide * 100}%)`;
    });

    // Update pagination bullets
    swiperPagination.innerHTML = '';
    for (let i = 0; i < slides.length; i += 1) {
      const bullet = document.createElement('span');
      bullet.classList.add('swiper-pagination-bullet');
      if (i === currentSlide) {
        bullet.classList.add('swiper-pagination-bullet-active');
      }
      bullet.setAttribute('tabindex', '0');
      bullet.setAttribute('role', 'button');
      bullet.setAttribute('aria-label', `Go to slide ${i + 1}`);
      bullet.addEventListener('click', () => {
        currentSlide = i;
        updateCarousel();
      });
      swiperPagination.append(bullet);
    }

    // Update button states
    prevButton.disabled = currentSlide === 0;
    prevButton.classList.toggle('swiper-button-disabled', currentSlide === 0);
    nextButton.disabled = currentSlide === slides.length - 1;
    nextButton.classList.toggle('swiper-button-disabled', currentSlide === slides.length - 1);
  };

  prevButton.addEventListener('click', () => {
    if (currentSlide > 0) {
      currentSlide -= 1;
      updateCarousel();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentSlide < slides.length - 1) {
      currentSlide += 1;
      updateCarousel();
    }
  });

  if (slides.length > 0) {
    updateCarousel();
  }
}
