import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container', 'slick-initialized', 'slick-slider', 'slick-dotted');
  moveInstrumentation(block, carouselContainer);

  const prevButton = document.createElement('button');
  prevButton.classList.add('slick-prev', 'slick-arrow', 'slick-disabled');
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('aria-disabled', 'true');
  prevButton.textContent = 'Previous';
  carouselContainer.append(prevButton);

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');
  carouselContainer.append(slickList);

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');
  slickList.append(slickTrack);

  const nextButton = document.createElement('button');
  nextButton.classList.add('slick-next', 'slick-arrow');
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('aria-disabled', 'false');
  nextButton.textContent = 'Next';
  carouselContainer.append(nextButton);

  const slickDots = document.createElement('ul');
  slickDots.classList.add('slick-dots');
  slickDots.setAttribute('role', 'tablist');
  carouselContainer.append(slickDots);

  const slides = [...block.children];
  block.innerHTML = ''; // Clear the block content
  block.classList.add('carousel', 'panelcontainer', 'cmp-carousel');
  block.append(carouselContainer);

  slides.forEach((row, index) => {
    const cells = [...row.children];

    // Use content detection instead of index access for image cells
    const desktopImageCell = cells.find(cell => cell.querySelector('picture') && cell.querySelector('img')?.alt === 'Background Image Desktop');
    const mobileImageCell = cells.find(cell => cell.querySelector('picture') && cell.querySelector('img')?.alt === 'Background Image Mobile');
    
    // Remaining cells can be accessed by index if their content is distinct and fixed
    // Based on the BlockJson and EDS structure, the order is fixed for these.
    const titleCell = cells[2];
    const descriptionCell = cells[3];
    const buttonLinkCell = cells[4];
    const buttonLabelCell = cells[5];

    const item = document.createElement('div');
    item.classList.add('cmp-carousel__item', 'slick-slide');
    if (index === 0) {
      item.classList.add('cmp-carousel__item--active', 'slick-current', 'slick-active');
      item.setAttribute('aria-hidden', 'false');
      item.setAttribute('tabindex', '0');
    } else {
      item.setAttribute('aria-hidden', 'true');
      item.setAttribute('tabindex', '-1');
    }
    item.setAttribute('role', 'tabpanel');
    item.setAttribute('aria-roledescription', 'slide');
    item.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
    item.setAttribute('data-slick-index', index);
    moveInstrumentation(row, item); // Move instrumentation from row to item

    const teaser = document.createElement('div');
    teaser.classList.add('teaser', 'cmp-teaser--carousel-teaser', 'cmp-teaser');
    item.append(teaser);

    const desktopPicture = desktopImageCell?.querySelector('picture');
    const desktopImg = desktopPicture ? desktopPicture.querySelector('img') : null;
    // const mobilePicture = mobileImageCell?.querySelector('picture'); // Not used for background-image
    // const mobileImg = mobilePicture ? mobilePicture.querySelector('img') : null; // Not used for background-image

    if (desktopImg) {
      teaser.style.backgroundImage = `url(${desktopImg.src})`;
    }

    const teaserContent = document.createElement('div');
    teaserContent.classList.add('cmp-teaser__content');
    teaser.append(teaserContent);

    const title = document.createElement('h2');
    title.classList.add('cmp-teaser__title');
    title.textContent = titleCell?.textContent.trim() || '';
    teaserContent.append(title);

    const description = document.createElement('div');
    description.classList.add('cmp-teaser__description');
    description.innerHTML = descriptionCell?.innerHTML || '';
    teaserContent.append(description);

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('cmp-teaser__action-container');
    teaserContent.append(actionContainer);

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button', 'cmp-button--primary-anchor');
    actionContainer.append(buttonDiv);

    const buttonLink = document.createElement('a');
    buttonLink.classList.add('cmp-button');
    buttonLink.href = buttonLinkCell?.querySelector('a')?.href || '#';
    
    const buttonTextSpan = document.createElement('span');
    buttonTextSpan.classList.add('cmp-button__text'); // Added from ORIGINAL HTML
    buttonTextSpan.textContent = buttonLabelCell?.textContent.trim() || '';
    buttonLink.append(buttonTextSpan);

    buttonDiv.append(buttonLink);

    slickTrack.append(item);

    const dotListItem = document.createElement('li');
    dotListItem.setAttribute('role', 'presentation');
    if (index === 0) {
      dotListItem.classList.add('slick-active');
    }
    const dotButton = document.createElement('button');
    dotButton.setAttribute('type', 'button');
    dotButton.setAttribute('role', 'tab');
    dotButton.setAttribute('aria-label', `${index + 1} of ${slides.length}`);
    dotButton.setAttribute('tabindex', index === 0 ? '0' : '-1');
    dotButton.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    dotButton.textContent = index + 1;
    dotListItem.append(dotButton);
    slickDots.append(dotListItem);
  });

  // Basic carousel logic (no Slick library)
  let currentIndex = 0;

  function updateCarousel() {
    [...slickTrack.children].forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add('cmp-carousel__item--active', 'slick-current', 'slick-active');
        slide.setAttribute('aria-hidden', 'false');
        slide.setAttribute('tabindex', '0');
      } else {
        slide.classList.remove('cmp-carousel__item--active', 'slick-current', 'slick-active');
        slide.setAttribute('aria-hidden', 'true');
        slide.setAttribute('tabindex', '-1');
      }
      slide.style.transform = `translateX(-${currentIndex * 100}%)`;
    });

    [...slickDots.children].forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add('slick-active');
        dot.querySelector('button').setAttribute('aria-selected', 'true');
        dot.querySelector('button').setAttribute('tabindex', '0');
      } else {
        dot.classList.remove('slick-active');
        dot.querySelector('button').setAttribute('aria-selected', 'false');
        dot.querySelector('button').setAttribute('tabindex', '-1');
      }
    });

    if (currentIndex === 0) {
      prevButton.classList.add('slick-disabled');
      prevButton.setAttribute('aria-disabled', 'true');
    } else {
      prevButton.classList.remove('slick-disabled');
      prevButton.setAttribute('aria-disabled', 'false');
    }

    if (currentIndex === slides.length - 1) {
      nextButton.classList.add('slick-disabled');
      nextButton.setAttribute('aria-disabled', 'true');
    } else {
      nextButton.classList.remove('slick-disabled');
      nextButton.setAttribute('aria-disabled', 'false');
    }
  }

  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  slickDots.querySelectorAll('button').forEach((dotButton, i) => {
    dotButton.addEventListener('click', () => {
      currentIndex = i;
      updateCarousel();
    });
  });

  updateCarousel();

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
