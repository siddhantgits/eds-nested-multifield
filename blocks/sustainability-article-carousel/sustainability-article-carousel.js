import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, ...cardRows] = [...block.children];

  block.classList.add('grid-container', 'bg--paper-green', 'animate-enter', 'in-view');

  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.classList.add('max-width-container');

  const gridXTitle = document.createElement('div');
  gridXTitle.classList.add('grid-x');

  const cellTitle = document.createElement('div');
  cellTitle.classList.add('cell', 'small-12', 'large-10', 'large-offset-1', 'xlarge-8', 'xlarge-offset-2');

  const textSection = document.createElement('div');
  textSection.classList.add('sustainability-article-carousel__text-section');

  const titleElement = document.createElement('h2');
  titleElement.classList.add('sustainability-article-carousel__title', 'animate-enter-fade-up-short');
  moveInstrumentation(titleRow.firstElementChild, titleElement);
  titleElement.textContent = titleRow.firstElementChild.textContent.trim();

  textSection.append(titleElement);
  cellTitle.append(textSection);
  gridXTitle.append(cellTitle);
  maxWidthContainer.append(gridXTitle);
  block.prepend(maxWidthContainer);

  const gridXWrapper = document.createElement('div');
  gridXWrapper.classList.add('grid-x');

  const cellWrapper = document.createElement('div');
  cellWrapper.classList.add('cell', 'small-12', 'large-offset-1', 'large-11', 'sustainability-article-carousel__wrapper');

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper', 'swipper--full-view-padding', 'sustainability-article-carousel__wrapper--inner', 'swiper-initialized', 'swiper-horizontal', 'swiper-backface-hidden');

  const prevButtonControl = document.createElement('div');
  prevButtonControl.classList.add('sustainability-article-carousel__btn-control', 'sustainability-article-carousel--prev', 'show-for-large');
  const prevButton = document.createElement('button');
  prevButton.classList.add('swiper-control', 'swiper-button', 'swiper--prev', 'elevation-1', 'swiper-button-disabled', 'swiper-button-lock');
  prevButton.setAttribute('aria-label', 'Previous slide');
  prevButton.setAttribute('aria-disabled', 'true');
  const prevImg = document.createElement('img');
  prevImg.alt = 'svg file';
  // Placeholder for icon, as it's not present in the block structure.
  // In a real scenario, this would come from a dedicated icon field if present in the model.
  // For now, it will be empty as per rule 16.
  prevButton.append(prevImg);
  prevButtonControl.append(prevButton);

  const nextButtonControl = document.createElement('div');
  nextButtonControl.classList.add('sustainability-article-carousel__btn-control', 'sustainability-article-carousel--next', 'show-for-large');
  const nextButton = document.createElement('button');
  nextButton.classList.add('swiper-control', 'swiper-button', 'swiper--next', 'elevation-1', 'swiper-button-disabled', 'swiper-button-lock');
  nextButton.setAttribute('aria-label', 'Next slide');
  nextButton.setAttribute('aria-disabled', 'true');
  const nextImg = document.createElement('img');
  nextImg.alt = 'svg file';
  // Placeholder for icon, as it's not present in the block structure.
  // In a real scenario, this would come from a dedicated icon field if present in the model.
  // For now, it will be empty as per rule 16.
  nextButton.append(nextImg);
  nextButtonControl.append(nextButton);

  const swiperList = document.createElement('ul');
  swiperList.classList.add('swiper-wrapper', 'sustainability-article-carousel__list');
  swiperList.id = 'swiper-wrapper-101efc08551c9ab4'; // Keep ID from original HTML if it's for styling/JS interaction

  cardRows.forEach((row, index) => {
    // Use content detection instead of index access for robustness
    const cells = [...row.children];
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const descriptionCell = cells.find(cell => cell.innerHTML.includes('<p>')); // Richtext detection
    const tagCell = cells.find(cell => cell !== imageCell && cell !== linkCell && cell !== descriptionCell && !/\d+/.test(cell.textContent.trim()) && cell.textContent.trim().length > 0);
    const readingDurationCell = cells.find(cell => cell !== imageCell && cell !== linkCell && cell !== descriptionCell && cell !== tagCell && /\d+/.test(cell.textContent.trim()));
    const cardTitleCell = cells.find(cell => cell !== imageCell && cell !== linkCell && cell !== descriptionCell && cell !== tagCell && cell !== readingDurationCell);

    const listItem = document.createElement('li');
    listItem.classList.add('swiper-slide', 'sustainability-article-carousel__list-item', 'animate-enter-fade-left-short', 'animate-delay-1');
    if (index === 0) {
      listItem.classList.add('swiper-slide-active');
    } else if (index === 1) {
      listItem.classList.add('swiper-slide-next');
    }
    listItem.setAttribute('aria-label', `${index + 1} / ${cardRows.length}`);
    listItem.style.marginRight = '32px';

    const cardLink = document.createElement('a');
    cardLink.classList.add('sustainability-card', 'elevation-2', 'has-hover');
    const authoredLink = linkCell?.querySelector('a');
    if (authoredLink) {
      cardLink.href = authoredLink.href;
      cardLink.setAttribute('aria-label', cardTitleCell?.textContent.trim() || '');
    }

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('sustainability-card__img-container', 'animate-enter-fade', 'animate-delay-5');

    const tagDiv = document.createElement('div');
    tagDiv.classList.add('sustainability-card__tag');
    const tagInnerDiv = document.createElement('div');
    tagInnerDiv.classList.add('tag', 'bg--brand-green');
    const tagLabel = document.createElement('span');
    tagLabel.classList.add('tag__label');
    tagLabel.textContent = tagCell?.textContent.trim() || '';
    tagInnerDiv.append(tagLabel);
    tagDiv.append(tagInnerDiv);
    imgContainer.append(tagDiv);

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imgContainer.append(optimizedPic);
    }

    cardLink.append(imgContainer);

    const cardContent = document.createElement('div');
    cardContent.classList.add('sustainability-card__content');

    const cardTitleDiv = document.createElement('div');
    const cardTitleInnerDiv = document.createElement('div');
    cardTitleInnerDiv.classList.add('sustainability-card__title', 'animate-enter-fade-up-short', 'animate-delay-7');
    const cardTitleSpan = document.createElement('span');
    cardTitleSpan.classList.add('labelLargeBold');
    cardTitleSpan.textContent = cardTitleCell?.textContent.trim() || '';
    cardTitleInnerDiv.append(cardTitleSpan);
    cardTitleDiv.append(cardTitleInnerDiv);
    cardContent.append(cardTitleDiv);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('sustainability-card__description', 'animate-enter-fade-up-short', 'animate-delay-9');
    const descriptionInnerDiv = document.createElement('div');
    descriptionInnerDiv.classList.add('bodyMediumRegular');
    descriptionInnerDiv.innerHTML = descriptionCell?.innerHTML || ''; // Use innerHTML for richtext
    descriptionDiv.append(descriptionInnerDiv);
    cardContent.append(descriptionDiv);

    const signInTooltip = document.createElement('div');
    signInTooltip.classList.add('signIn-Info-Tooltip', 'animate-enter-fade-up-short', 'animate-delay-9');
    cardContent.append(signInTooltip);

    const readingDurationDiv = document.createElement('div');
    readingDurationDiv.classList.add('sustainability-card__reading-duration');
    const durationSpan = document.createElement('span');
    durationSpan.classList.add('labelSmallBold', 'animate-enter-fade-up-short', 'animate-delay-11');
    durationSpan.textContent = readingDurationCell?.textContent.trim() || '';
    const suffixSpan = document.createElement('span');
    suffixSpan.classList.add('utilityTagHighCaps', 'text-uppercase', 'sustainability-card__reading-duration-suffix', 'animate-enter-fade-up-short', 'animate-delay-13');
    suffixSpan.textContent = 'mins';
    readingDurationDiv.append(durationSpan, suffixSpan);
    cardContent.append(readingDurationDiv);

    cardLink.append(cardContent);
    moveInstrumentation(row, listItem);
    listItem.append(cardLink);
    swiperList.append(listItem);
  });

  swiperContainer.append(prevButtonControl, nextButtonControl, swiperList);

  const pagination = document.createElement('div');
  pagination.classList.add('sustainability-article-carousel__pagination', 'animate-enter-fade-left-short', 'animate-delay-3');
  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'swiper-pagination-clickable', 'swiper-pagination-bullets', 'swiper-pagination-horizontal', 'swiper-pagination-lock');
  pagination.append(swiperPagination);
  swiperContainer.append(pagination);

  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');
  swiperContainer.append(swiperNotification);

  cellWrapper.append(swiperContainer);
  gridXWrapper.append(cellWrapper);
  block.append(gridXWrapper);

  // Remove original rows
  titleRow.remove();
  cardRows.forEach((row) => row.remove());

  // Initialize Swiper (simplified for EDS, full Swiper JS not included)
  // This is a minimal example to show how buttons/pagination would interact.
  // Full Swiper functionality would require loading Swiper JS.
  let currentSlide = 0;
  const updateCarousel = () => {
    const slides = swiperList.children;
    if (slides.length === 0) return;

    // Remove active/next classes from all slides
    [...slides].forEach((slide) => {
      slide.classList.remove('swiper-slide-active', 'swiper-slide-next');
    });

    // Set active class for current slide
    slides[currentSlide].classList.add('swiper-slide-active');

    // Set next class for the next slide, if it exists
    if (currentSlide + 1 < slides.length) {
      slides[currentSlide + 1].classList.add('swiper-slide-next');
    }

    // Update pagination bullets
    swiperPagination.innerHTML = '';
    [...slides].forEach((_, idx) => {
      const bullet = document.createElement('span');
      bullet.classList.add('swiper-pagination-bullet');
      if (idx === currentSlide) {
        bullet.classList.add('swiper-pagination-bullet-active');
        bullet.setAttribute('aria-current', 'true');
      }
      bullet.setAttribute('tabindex', '0');
      bullet.setAttribute('role', 'button');
      bullet.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      bullet.addEventListener('click', () => {
        currentSlide = idx;
        updateCarousel();
      });
      swiperPagination.append(bullet);
    });

    // Update button states
    prevButton.disabled = currentSlide === 0;
    prevButton.classList.toggle('swiper-button-disabled', currentSlide === 0);
    nextButton.disabled = currentSlide === slides.length - 1;
    nextButton.classList.toggle('swiper-button-disabled', currentSlide === slides.length - 1);

    // Simulate slide transform (simplified)
    const slideWidth = slides[0].offsetWidth + 32; // slide width + margin-right
    swiperList.style.transform = `translate3d(-${currentSlide * slideWidth}px, 0px, 0px)`;
  };

  prevButton.addEventListener('click', () => {
    if (currentSlide > 0) {
      currentSlide -= 1;
      updateCarousel();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentSlide < swiperList.children.length - 1) {
      currentSlide += 1;
      updateCarousel();
    }
  });

  // Initial carousel update
  updateCarousel();

  // Handle resize to re-calculate slide positions if needed
  window.addEventListener('resize', updateCarousel);
}
