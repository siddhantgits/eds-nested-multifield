import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const slides = [...block.children];

  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container', 'slick-initialized', 'slick-slider', 'slick-dotted');
  carouselContainer.setAttribute('data-slick', slides.length);
  carouselContainer.setAttribute('aria-atomic', 'false');

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');
  slickTrack.style.opacity = '1';

  slides.forEach((slideRow, i) => {
    const cells = [...slideRow.children];

    // Find cells based on content type, not index
    const backgroundImageDesktopCell = cells.find(cell => cell.querySelector('picture') && cell.textContent.includes('Background Image (Desktop)'));
    const backgroundImageMobileCell = cells.find(cell => cell.querySelector('picture') && cell.textContent.includes('Background Image (Mobile)'));
    const titleCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.includes('Title label text'));
    const descriptionCell = cells.find(cell => cell.innerHTML.includes('<p>Description text content</p>'));
    const buttonLabelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.includes('Button Label label text'));
    const buttonLinkCell = cells.find(cell => cell.querySelector('a') && cell.textContent.includes('/content/site/button-link'));

    const slideItem = document.createElement('div');
    slideItem.classList.add('cmp-carousel__item', 'slick-slide');
    if (i === 0) {
      slideItem.classList.add('cmp-carousel__item--active', 'slick-current', 'slick-active');
      slideItem.setAttribute('aria-hidden', 'false');
      slideItem.setAttribute('tabindex', '0');
    } else {
      slideItem.setAttribute('aria-hidden', 'true');
      slideItem.setAttribute('tabindex', '-1');
    }
    slideItem.setAttribute('id', `slick-slide1${i}`);
    slideItem.setAttribute('role', 'tabpanel');
    slideItem.setAttribute('aria-labelledby', `slickcarousel-0f817c55a9-item-${i}-tab`);
    slideItem.setAttribute('aria-roledescription', 'slide');
    slideItem.setAttribute('aria-label', `Slide ${i + 1} of ${slides.length}`);
    slideItem.setAttribute('data-slick-index', i);
    slideItem.setAttribute('aria-describedby', `slick-slide-control1${i}`);

    const teaserDiv = document.createElement('div');
    teaserDiv.classList.add('teaser', 'cmp-teaser--carousel-teaser');

    const cmpTeaserDiv = document.createElement('div');
    cmpTeaserDiv.classList.add('cmp-teaser');
    cmpTeaserDiv.setAttribute('data-component', 'teaser');
    cmpTeaserDiv.setAttribute('data-show-media-url', 'false');
    cmpTeaserDiv.setAttribute('data-initialized', 'true');

    const desktopImg = backgroundImageDesktopCell?.querySelector('img');
    const mobileImg = backgroundImageMobileCell?.querySelector('img');

    if (desktopImg) {
      cmpTeaserDiv.setAttribute('data-background-image-desktop', desktopImg.src);
      cmpTeaserDiv.style.backgroundImage = `url("${desktopImg.src}")`;
    }
    if (mobileImg) {
      cmpTeaserDiv.setAttribute('data-background-image-mobile', mobileImg.src);
    }

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('cmp-teaser__content');

    const titleH2 = document.createElement('h2');
    titleH2.classList.add('cmp-teaser__title');
    titleH2.textContent = titleCell?.textContent.trim() || '';

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('cmp-teaser__description');
    descriptionDiv.innerHTML = descriptionCell?.innerHTML || '';

    const actionContainerDiv = document.createElement('div');
    actionContainerDiv.classList.add('cmp-teaser__action-container');

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button', 'cmp-button--primary-anchor');

    const buttonLink = document.createElement('a');
    buttonLink.classList.add('cmp-button');
    buttonLink.setAttribute('data-request', 'true');
    buttonLink.setAttribute('target', '_blank');
    if (i === 0) {
      buttonLink.setAttribute('tabindex', '0');
    } else {
      buttonLink.setAttribute('tabindex', '-1');
    }

    const foundLink = buttonLinkCell?.querySelector('a');
    if (foundLink) {
      buttonLink.href = foundLink.href;
    }

    const buttonSpan = document.createElement('span');
    buttonSpan.classList.add('cmp-button__text');
    buttonSpan.textContent = buttonLabelCell?.textContent.trim() || '';
    buttonLink.append(buttonSpan);
    buttonDiv.append(buttonLink);
    actionContainerDiv.append(buttonDiv);

    contentDiv.append(titleH2, descriptionDiv, actionContainerDiv);
    cmpTeaserDiv.append(contentDiv);
    teaserDiv.append(cmpTeaserDiv);
    slideItem.append(teaserDiv);
    slickTrack.append(slideItem);
    moveInstrumentation(slideRow, slideItem);
  });

  slickList.append(slickTrack);
  carouselContainer.append(slickList);

  const prevButton = document.createElement('button');
  prevButton.classList.add('slick-prev', 'slick-arrow', 'slick-disabled');
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('aria-disabled', 'true');
  prevButton.textContent = 'Previous';

  const nextButton = document.createElement('button');
  nextButton.classList.add('slick-next', 'slick-arrow');
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('aria-disabled', 'false');
  nextButton.textContent = 'Next';

  const slickDots = document.createElement('ul');
  slickDots.classList.add('slick-dots');
  slickDots.setAttribute('role', 'tablist');

  slides.forEach((_, i) => {
    const dotLi = document.createElement('li');
    dotLi.setAttribute('role', 'presentation');
    if (i === 0) {
      dotLi.classList.add('slick-active');
    }
    const dotButton = document.createElement('button');
    dotButton.setAttribute('type', 'button');
    dotButton.setAttribute('role', 'tab');
    dotButton.setAttribute('id', `slick-slide-control1${i}`);
    dotButton.setAttribute('aria-controls', `slick-slide1${i}`);
    dotButton.setAttribute('aria-label', `${i + 1} of ${slides.length}`);
    if (i === 0) {
      dotButton.setAttribute('tabindex', '0');
      dotButton.setAttribute('aria-selected', 'true');
    } else {
      dotButton.setAttribute('tabindex', '-1');
    }
    dotButton.textContent = i + 1;
    dotLi.append(dotButton);
    slickDots.append(dotLi);
  });

  carouselContainer.prepend(prevButton);
  carouselContainer.append(nextButton, slickDots);

  block.innerHTML = '';
  block.classList.add('carousel', 'panelcontainer');
  block.setAttribute('id', 'slickcarousel-0f817c55a9'); // Example ID, might need to be dynamic
  block.setAttribute('data-placeholder-text', 'false');
  block.setAttribute('data-cmp-is', 'carousel');
  block.setAttribute('data-show-infinite-scroll', 'false');
  block.setAttribute('data-show-arrows', 'true');
  block.setAttribute('data-show-dots', 'true');
  block.setAttribute('data-item-count-per-slide', '1');
  block.setAttribute('data-auto-play-is-enabled', 'false');
  block.setAttribute('data-auto-play-speed-in-ms', '5000');
  block.setAttribute('data-reveal-next-item-partially', 'false');
  block.setAttribute('data-component', 'carousel');

  block.append(carouselContainer);

  // Initialize Slick Carousel
  // This is a placeholder for the actual Slick initialization logic
  // In a real scenario, you'd load Slick JS and call its init method
  // For EDS, we only provide the structure and classes.
  let currentSlide = 0;

  const updateCarousel = () => {
    slickTrack.style.transform = `translate3d(-${currentSlide * 100}%, 0px, 0px)`;
    [...slickTrack.children].forEach((slide, idx) => {
      if (idx === currentSlide) {
        slide.classList.add('cmp-carousel__item--active', 'slick-current', 'slick-active');
        slide.setAttribute('aria-hidden', 'false');
        slide.setAttribute('tabindex', '0');
        slide.querySelector('.cmp-button').setAttribute('tabindex', '0');
      } else {
        slide.classList.remove('cmp-carousel__item--active', 'slick-current', 'slick-active');
        slide.setAttribute('aria-hidden', 'true');
        slide.setAttribute('tabindex', '-1');
        // Ensure the button exists before trying to set its tabindex
        const button = slide.querySelector('.cmp-button');
        if (button) {
          button.setAttribute('tabindex', '-1');
        }
      }
    });

    [...slickDots.children].forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.add('slick-active');
        dot.querySelector('button').setAttribute('tabindex', '0');
        dot.querySelector('button').setAttribute('aria-selected', 'true');
      } else {
        dot.classList.remove('slick-active');
        dot.querySelector('button').setAttribute('tabindex', '-1');
        dot.querySelector('button').setAttribute('aria-selected', 'false');
      }
    });

    if (currentSlide === 0) {
      prevButton.classList.add('slick-disabled');
      prevButton.setAttribute('aria-disabled', 'true');
    } else {
      prevButton.classList.remove('slick-disabled');
      prevButton.setAttribute('aria-disabled', 'false');
    }

    if (currentSlide === slides.length - 1) {
      nextButton.classList.add('slick-disabled');
      nextButton.setAttribute('aria-disabled', 'true');
    } else {
      nextButton.classList.remove('slick-disabled');
      nextButton.setAttribute('aria-disabled', 'false');
    }
  };

  prevButton.addEventListener('click', () => {
    if (currentSlide > 0) {
      currentSlide--;
      updateCarousel();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentSlide < slides.length - 1) {
      currentSlide++;
      updateCarousel();
    }
  });

  slickDots.querySelectorAll('button').forEach((dotButton, idx) => {
    dotButton.addEventListener('click', () => {
      currentSlide = idx;
      updateCarousel();
    });
  });

  updateCarousel(); // Initial state

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
