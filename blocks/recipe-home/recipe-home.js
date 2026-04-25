import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    iconRow,
    titleRow,
    descriptionRow,
    ...itemAndCtaRows
  ] = [...block.children];

  block.innerHTML = '';
  block.classList.add('grid-container', 'overflow-x-hidden', 'recipe-home--has-icon', 'bg--paper-white', 'animate-enter', 'in-view');

  const mainGrid = document.createElement('div');
  mainGrid.classList.add('grid-x');
  block.append(mainGrid);

  const imageTextGrid = document.createElement('div');
  imageTextGrid.classList.add('grid-x', 'recipe-home--image-text');
  mainGrid.append(imageTextGrid);

  const imageTextCell = document.createElement('div');
  imageTextCell.classList.add('cell', 'small-12', 'large-10', 'large-offset-1');
  imageTextGrid.append(imageTextCell);

  // Icon Section
  const iconSection = document.createElement('div');
  iconSection.classList.add('recipe-home--icon-section', 'animate-enter-fade-left-long', 'animate-delay-3', 'text-center');
  imageTextCell.append(iconSection);

  const iconPicture = iconRow?.querySelector('picture');
  if (iconPicture) {
    const iconImg = iconPicture.querySelector('img');
    const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '750' }]);
    optimizedIcon.querySelector('img').classList.add('recipe-home--icon-section-img');
    moveInstrumentation(iconRow.firstElementChild, optimizedIcon.querySelector('img'));
    iconSection.append(optimizedIcon);
  }

  // Text Section
  const textSection = document.createElement('div');
  textSection.classList.add('recipe-home--text-section', 'animate-enter-fade-up-short', 'animate-delay-3');
  imageTextCell.append(textSection);

  const title = document.createElement('h2');
  title.classList.add('recipe-home--title');
  title.textContent = titleRow?.textContent.trim() || '';
  textSection.append(title);

  const description = document.createElement('div');
  description.classList.add('recipe-home--desc', 'bodyMediumRegular');
  if (descriptionRow) {
    moveInstrumentation(descriptionRow.firstElementChild, description);
    description.innerHTML = descriptionRow.firstElementChild.innerHTML;
  }
  textSection.append(description);

  // Recipes Wrapper
  const recipesWrapperCell = document.createElement('div');
  recipesWrapperCell.classList.add('cell', 'small-12', 'recipe-home--wrapper');
  mainGrid.append(recipesWrapperCell);

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper', 'swipper--full-view-padding', 'recipe-home--wrapper--in', 'swiper-initialized', 'swiper-horizontal', 'swiper-backface-hidden');
  recipesWrapperCell.append(swiperContainer);

  const prevButtonControl = document.createElement('div');
  prevButtonControl.classList.add('recipe-home--btn-control', 'recipe-home--prev', 'show-for-large');
  swiperContainer.append(prevButtonControl);

  const prevButton = document.createElement('button');
  prevButton.classList.add('swiper-control', 'swiper--prev', 'elevation-1', 'animate-enter-fade-right-short', 'animate-delay-9', 'swiper-button-disabled');
  prevButton.setAttribute('disabled', '');
  prevButton.setAttribute('aria-label', 'Previous slide');
  prevButton.setAttribute('aria-controls', 'swiper-wrapper-a9fcc3103e2441643');
  prevButton.setAttribute('aria-disabled', 'true');
  const prevButtonImg = document.createElement('img');
  // The original HTML uses a hardcoded SVG path here. Since we cannot hardcode,
  // we will leave this image source empty. If the block model had a field for it,
  // we would read it from there.
  prevButtonImg.alt = 'svg file';
  prevButton.append(prevButtonImg);
  prevButtonControl.append(prevButton);

  const nextButtonControl = document.createElement('div');
  nextButtonControl.classList.add('recipe-home--btn-control', 'recipe-home--next', 'show-for-large');
  swiperContainer.append(nextButtonControl);

  const nextButton = document.createElement('button');
  nextButton.classList.add('swiper-control', 'swiper--next', 'elevation-1', 'animate-enter-fade-left-short', 'animate-delay-9');
  nextButton.setAttribute('aria-label', 'Next slide');
  nextButton.setAttribute('aria-controls', 'swiper-wrapper-a9fcc3103e2441643');
  const nextButtonImg = document.createElement('img');
  // The original HTML uses a hardcoded SVG path here. Since we cannot hardcode,
  // we will leave this image source empty. If the block model had a field for it,
  // we would read it from there.
  nextButtonImg.alt = 'svg file';
  nextButton.append(nextButtonImg);
  nextButtonControl.append(nextButton);

  const recipeList = document.createElement('ul');
  recipeList.classList.add('swiper-wrapper', 'recipe-home--list');
  recipeList.id = 'swiper-wrapper-a9fcc3103e2441643';
  recipeList.setAttribute('aria-live', 'polite');
  swiperContainer.append(recipeList);

  const recipeItemRows = [];
  let ctaLinkRow;
  let ctaLabelRow;

  // Separate item rows from CTA rows (last two rows)
  if (itemAndCtaRows.length >= 2) {
    ctaLinkRow = itemAndCtaRows[itemAndCtaRows.length - 2];
    ctaLabelRow = itemAndCtaRows[itemAndCtaRows.length - 1];
    recipeItemRows.push(...itemAndCtaRows.slice(0, itemAndCtaRows.length - 2));
  } else {
    recipeItemRows.push(...itemAndCtaRows);
  }

  recipeItemRows.forEach((row, i) => {
    // Correctly destructure item row children based on BlockJson model
    const [
      linkCell,
      imageCell,
      nameCell,
      descriptionCell,
      tagCell,
      stepsCountCell,
      ingredientsCountCell,
    ] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('swiper-slide', 'recipe-home--list-item');
    listItem.setAttribute('aria-label', `${i + 1} / ${recipeItemRows.length}`);
    recipeList.append(listItem);

    const recipeLink = document.createElement('a');
    recipeLink.classList.add('recipe-card-grid-view--link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      recipeLink.href = foundLink.href;
      recipeLink.title = nameCell?.textContent.trim() || '';
      recipeLink.setAttribute('aria-label', nameCell?.textContent.trim() || '');
    }
    moveInstrumentation(linkCell, recipeLink);
    listItem.append(recipeLink);

    const recipeCard = document.createElement('div');
    recipeCard.classList.add('grid-x', 'recipe-card', 'recipe-card--grid-view-card', 'elevation-2', 'has-hover', 'recipe-card-grid-view');
    recipeLink.append(recipeCard);

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('cell', 'small-12', 'medium-12', 'large-6', 'recipe-img-container', 'animate-enter-fade', 'animate-delay-5');
    recipeCard.append(imgContainer);

    const tagMobile = document.createElement('div');
    tagMobile.classList.add('recipe-tag-mobile', 'animate-enter-fade-up-short', 'animate-delay-9');
    const tagDiv = document.createElement('div');
    tagDiv.classList.add('tag', 'bg--brand-green');
    const tagSpan = document.createElement('span');
    tagSpan.classList.add('tag__label');
    tagSpan.textContent = tagCell?.textContent.trim() || '';
    tagDiv.append(tagSpan);
    tagMobile.append(tagDiv);
    imgContainer.append(tagMobile);

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 768px)', width: '1066' }, { width: '750' }]);
      optimizedPic.querySelector('img').classList.add('ls-is-cached', 'lazyloaded');
      moveInstrumentation(imageCell, optimizedPic.querySelector('img'));
      imgContainer.append(optimizedPic);
    }

    const recipeDetails = document.createElement('div');
    recipeDetails.classList.add('cell', 'small-12', 'medium-12', 'large-6', 'recipe-details');
    recipeCard.append(recipeDetails);

    const recipeInfo = document.createElement('div');
    recipeInfo.classList.add('recipe-info');
    recipeDetails.append(recipeInfo);

    const recipeName = document.createElement('div');
    recipeName.classList.add('recipe-name', 'labelLargeBold', 'animate-enter-fade-up-short', 'animate-delay-9');
    recipeName.textContent = nameCell?.textContent.trim() || '';
    recipeInfo.append(recipeName);

    const descGrid = document.createElement('div');
    descGrid.classList.add('grid-x');
    const descCell = document.createElement('div');
    descCell.classList.add('cell', 'recipe-description', 'bodySmallRegular', 'animate-enter-fade-up-short', 'animate-delay-11');
    descCell.textContent = descriptionCell?.textContent.trim() || '';
    descGrid.append(descCell);
    recipeInfo.append(descGrid);

    const stepsIngredientsGrid = document.createElement('div');
    stepsIngredientsGrid.classList.add('grid-x');
    const stepsIngredientsCell = document.createElement('div');
    stepsIngredientsCell.classList.add('cell', 'recipe-steps-and-ingredients', 'animate-enter-fade-up-short', 'animate-delay-11');
    stepsIngredientsGrid.append(stepsIngredientsCell);
    recipeInfo.append(stepsIngredientsGrid);

    const stepsContainer = document.createElement('div');
    stepsContainer.classList.add('recipe-steps-container');
    const stepsCount = document.createElement('span');
    stepsCount.classList.add('recipe-steps-count', 'labelSmallBold');
    stepsCount.textContent = stepsCountCell?.textContent.trim() || '';
    const stepsLabel = document.createElement('span');
    stepsLabel.classList.add('recipe-steps-label', 'utilityTagHighCaps');
    stepsLabel.textContent = 'Steps';
    stepsContainer.append(stepsCount, stepsLabel);
    stepsIngredientsCell.append(stepsContainer);

    const separator = document.createElement('div');
    separator.classList.add('recipe-steps-separator');
    stepsIngredientsCell.append(separator);

    const ingredientsContainer = document.createElement('div');
    ingredientsContainer.classList.add('recipe-ingredients-container');
    const ingredientsCount = document.createElement('span');
    ingredientsCount.classList.add('recipe-ingredients-count', 'labelSmallBold');
    ingredientsCount.textContent = ingredientsCountCell?.textContent.trim() || '';
    const ingredientsLabel = document.createElement('span');
    ingredientsLabel.classList.add('recipe-ingredients-label', 'utilityTagHighCaps');
    ingredientsLabel.textContent = 'Ingredients';
    ingredientsContainer.append(ingredientsCount, ingredientsLabel);
    stepsIngredientsCell.append(ingredientsContainer);

    const tagDesktop = document.createElement('div');
    tagDesktop.classList.add('recipe-tag-desktop', 'animate-enter-fade-up-short', 'animate-delay-9');
    const tagDivDesktop = document.createElement('div');
    tagDivDesktop.classList.add('tag', 'bg--brand-green');
    const tagSpanDesktop = document.createElement('span');
    tagSpanDesktop.classList.add('tag__label');
    tagSpanDesktop.textContent = tagCell?.textContent.trim() || '';
    tagDivDesktop.append(tagSpanDesktop);
    tagDesktop.append(tagDivDesktop);
    recipeInfo.append(tagDesktop);
  });

  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('recipe-home--pagination', 'animate-enter-fade-left-long', 'animate-delay-8');
  const paginationDiv = document.createElement('div');
  paginationDiv.classList.add('swiper-pagination', 'swiper-pagination-clickable', 'swiper-pagination-bullets', 'swiper-pagination-horizontal');
  swiperPagination.append(paginationDiv);
  swiperContainer.append(swiperPagination);

  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');
  swiperContainer.append(swiperNotification);

  // CTA Container
  const ctaContainer = document.createElement('div');
  ctaContainer.classList.add('grid-x', 'recipe-home--cta-container', 'text-center', 'animate-enter-fade-up-short', 'animate-delay-10');
  mainGrid.append(ctaContainer);

  const ctaCell = document.createElement('div');
  ctaCell.classList.add('cell', 'large-10', 'large-offset-1', 'see-all-recipies-cta');
  ctaContainer.append(ctaCell);

  const ctaLink = document.createElement('a');
  ctaLink.classList.add('button', 'transparent-auto');
  const foundCtaLink = ctaLinkRow?.querySelector('a');
  const ctaLabelText = ctaLabelRow?.textContent.trim() || '';

  if (foundCtaLink) {
    ctaLink.href = foundCtaLink.href;
    ctaLink.title = ctaLabelText;
    ctaLink.setAttribute('aria-label', ctaLabelText);
    ctaLink.setAttribute('rel', 'follow');
  }
  moveInstrumentation(ctaLinkRow, ctaLink);
  ctaCell.append(ctaLink);

  const ctaSpan = document.createElement('span');
  ctaSpan.classList.add('button-text');
  ctaSpan.textContent = ctaLabelText;
  ctaLink.append(ctaSpan);

  // Initialize Swiper (simplified, as actual Swiper JS is not available in EDS)
  // This just adds the active class to the first slide and pagination bullet
  const firstSlide = recipeList.querySelector('.swiper-slide');
  if (firstSlide) {
    firstSlide.classList.add('swiper-slide-active');
    // Ensure bullets are created if they don't exist
    if (paginationDiv.children.length === 0) {
      const firstBullet = document.createElement('span');
      firstBullet.classList.add('swiper-pagination-bullet', 'swiper-pagination-bullet-active');
      firstBullet.setAttribute('tabindex', '0');
      firstBullet.setAttribute('role', 'button');
      firstBullet.setAttribute('aria-label', 'Go to slide 1');
      firstBullet.setAttribute('aria-current', 'true');
      paginationDiv.append(firstBullet);
    } else {
      // If bullets exist, ensure the first one is active
      const firstBullet = paginationDiv.querySelector('.swiper-pagination-bullet');
      if (firstBullet) {
        firstBullet.classList.add('swiper-pagination-bullet-active');
        firstBullet.setAttribute('aria-current', 'true');
      }
    }
  }

  // Basic Swiper-like navigation (without full Swiper.js)
  let currentSlideIndex = 0;
  const slides = [...recipeList.children];
  let bullets = [...paginationDiv.children]; // Re-read bullets after potential creation

  const updateSwiper = () => {
    slides.forEach((slide, index) => {
      slide.classList.toggle('swiper-slide-active', index === currentSlideIndex);
      slide.style.display = index === currentSlideIndex ? 'block' : 'none'; // Simple visibility toggle
    });
    bullets.forEach((bullet, index) => {
      bullet.classList.toggle('swiper-pagination-bullet-active', index === currentSlideIndex);
      bullet.setAttribute('aria-current', index === currentSlideIndex ? 'true' : 'false');
    });

    prevButton.classList.toggle('swiper-button-disabled', currentSlideIndex === 0);
    prevButton.setAttribute('aria-disabled', currentSlideIndex === 0 ? 'true' : 'false');
    nextButton.classList.toggle('swiper-button-disabled', currentSlideIndex === slides.length - 1);
    nextButton.setAttribute('aria-disabled', currentSlideIndex === slides.length - 1 ? 'true' : 'false');
  };

  if (slides.length > 0) {
    // Create bullets if they don't exist or if there are fewer bullets than slides
    while (bullets.length < slides.length) {
      const newBullet = document.createElement('span');
      newBullet.classList.add('swiper-pagination-bullet'); // Use the exact class name
      newBullet.setAttribute('tabindex', '0');
      newBullet.setAttribute('role', 'button');
      newBullet.setAttribute('aria-label', `Go to slide ${bullets.length + 1}`);
      paginationDiv.append(newBullet);
      bullets.push(newBullet); // Add to the bullets array
    }

    // Add event listeners for navigation
    prevButton.addEventListener('click', () => {
      if (currentSlideIndex > 0) {
        currentSlideIndex--;
        updateSwiper();
      }
    });

    nextButton.addEventListener('click', () => {
      if (currentSlideIndex < slides.length - 1) {
        currentSlideIndex++;
        updateSwiper();
      }
    });

    bullets.forEach((bullet, index) => {
      bullet.addEventListener('click', () => {
        currentSlideIndex = index;
        updateSwiper();
      });
    });

    updateSwiper(); // Initial update
  }
}
