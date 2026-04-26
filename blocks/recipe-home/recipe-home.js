import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [
    iconRow,
    titleRow,
    descriptionRow,
    ctaLinkRow,
    ctaLabelRow,
    ...recipeCardRows
  ] = children;

  block.classList.add('grid-container', 'overflow-x-hidden', 'recipe-home--has-icon', 'bg--paper-white', 'animate-enter', 'in-view');

  const mainWrapper = document.createElement('div');
  mainWrapper.classList.add('grid-x');
  moveInstrumentation(block, mainWrapper);

  const imageTextWrapper = document.createElement('div');
  imageTextWrapper.classList.add('grid-x', 'recipe-home--image-text');
  mainWrapper.append(imageTextWrapper);

  const contentCell = document.createElement('div');
  contentCell.classList.add('cell', 'small-12', 'large-10', 'large-offset-1');
  imageTextWrapper.append(contentCell);

  // Icon Section
  const iconSection = document.createElement('div');
  iconSection.classList.add('recipe-home--icon-section', 'animate-enter-fade-left-long', 'animate-delay-3', 'text-center');
  if (iconRow) {
    const picture = iconRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('recipe-home--icon-section-img');
      moveInstrumentation(iconRow, optimizedPic);
      iconSection.append(optimizedPic);
    }
  }
  contentCell.append(iconSection);

  // Text Section
  const textSection = document.createElement('div');
  textSection.classList.add('recipe-home--text-section', 'animate-enter-fade-up-short', 'animate-delay-3');
  contentCell.append(textSection);

  // Title
  if (titleRow) {
    const title = document.createElement('h2');
    title.classList.add('recipe-home--title');
    moveInstrumentation(titleRow, title);
    title.textContent = titleRow.textContent.trim();
    textSection.append(title);
  }

  // Description
  if (descriptionRow) {
    const description = document.createElement('div');
    description.classList.add('recipe-home--desc', 'bodyMediumRegular');
    moveInstrumentation(descriptionRow, description);
    description.innerHTML = descriptionRow.innerHTML;
    textSection.append(description);
  }

  // Recipe Cards Wrapper
  const recipeWrapperCell = document.createElement('div');
  recipeWrapperCell.classList.add('cell', 'small-12', 'recipe-home--wrapper');
  mainWrapper.append(recipeWrapperCell);

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper', 'swipper--full-view-padding', 'recipe-home--wrapper--in', 'swiper-initialized', 'swiper-horizontal', 'swiper-backface-hidden');
  recipeWrapperCell.append(swiperContainer);

  // Swiper Controls (Prev)
  const prevControl = document.createElement('div');
  prevControl.classList.add('recipe-home--btn-control', 'recipe-home--prev', 'show-for-large');
  const prevButton = document.createElement('button');
  prevButton.classList.add('swiper-control', 'swiper--prev', 'elevation-1', 'animate-enter-fade-right-short', 'animate-delay-9', 'swiper-button-disabled');
  prevButton.setAttribute('aria-label', 'Previous slide');
  prevButton.setAttribute('aria-disabled', 'true');
  prevButton.disabled = true;
  const prevIcon = document.createElement('img');
  // Placeholder for icon, as it's not in the block model
  prevIcon.alt = 'Previous slide icon';
  prevButton.append(prevIcon);
  prevControl.append(prevButton);
  swiperContainer.append(prevControl);


  // Swiper Controls (Next)
  const nextControl = document.createElement('div');
  nextControl.classList.add('recipe-home--btn-control', 'recipe-home--next', 'show-for-large');
  const nextButton = document.createElement('button');
  nextButton.classList.add('swiper-control', 'swiper--next', 'elevation-1', 'animate-enter-fade-left-short', 'animate-delay-9');
  nextButton.setAttribute('aria-label', 'Next slide');
  const nextIcon = document.createElement('img');
  // Placeholder for icon, as it's not in the block model
  nextIcon.alt = 'Next slide icon';
  nextButton.append(nextIcon);
  nextControl.append(nextButton);
  swiperContainer.append(nextControl);

  const recipeList = document.createElement('ul');
  recipeList.classList.add('swiper-wrapper', 'recipe-home--list');
  swiperContainer.append(recipeList);

  recipeCardRows.forEach((row) => {
    const [
      linkCell,
      imageCell,
      altTextCell,
      tagCell,
      nameCell,
      descCell,
      stepsCountCell,
      ingredientsCountCell,
    ] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('swiper-slide', 'recipe-home--list-item');
    moveInstrumentation(row, listItem);

    const recipeLink = document.createElement('a');
    recipeLink.classList.add('recipe-card-grid-view--link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      recipeLink.href = foundLink.href;
      recipeLink.title = nameCell?.textContent.trim() || '';
      recipeLink.setAttribute('aria-label', nameCell?.textContent.trim() || '');
    }
    listItem.append(recipeLink);

    const recipeCard = document.createElement('div');
    recipeCard.classList.add('grid-x', 'recipe-card', 'recipe-card--grid-view-card', 'elevation-2', 'has-hover', 'recipe-card-grid-view');
    recipeLink.append(recipeCard);

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('cell', 'small-12', 'medium-12', 'large-6', 'recipe-img-container', 'animate-enter-fade', 'animate-delay-5');
    recipeCard.append(imgContainer);

    // Tag (Mobile)
    if (tagCell && tagCell.textContent.trim()) {
      const tagMobile = document.createElement('div');
      tagMobile.classList.add('recipe-tag-mobile', 'animate-enter-fade-up-short', 'animate-delay-9');
      const tagDiv = document.createElement('div');
      tagDiv.classList.add('tag', 'bg--brand-green');
      const tagLabel = document.createElement('span');
      tagLabel.classList.add('tag__label');
      tagLabel.textContent = tagCell.textContent.trim();
      tagDiv.append(tagLabel);
      tagMobile.append(tagDiv);
      imgContainer.append(tagMobile);
    }

    // Image
    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, altTextCell?.textContent.trim() || img.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        optimizedImg.classList.add('lazyloaded');
        moveInstrumentation(imageCell, optimizedPic);
        imgContainer.append(optimizedPic);
      }
    }

    const recipeDetails = document.createElement('div');
    recipeDetails.classList.add('cell', 'small-12', 'medium-12', 'large-6', 'recipe-details');
    recipeCard.append(recipeDetails);

    const recipeInfo = document.createElement('div');
    recipeInfo.classList.add('recipe-info');
    recipeDetails.append(recipeInfo);

    // Recipe Name
    if (nameCell) {
      const recipeName = document.createElement('div');
      recipeName.classList.add('recipe-name', 'labelLargeBold', 'animate-enter-fade-up-short', 'animate-delay-9');
      recipeName.textContent = nameCell.textContent.trim();
      recipeInfo.append(recipeName);
    }

    // Recipe Description
    if (descCell) {
      const descGrid = document.createElement('div');
      descGrid.classList.add('grid-x');
      const descDiv = document.createElement('div');
      descDiv.classList.add('cell', 'recipe-description', 'bodySmallRegular', 'animate-enter-fade-up-short', 'animate-delay-11');
      descDiv.textContent = descCell.textContent.trim();
      descGrid.append(descDiv);
      recipeInfo.append(descGrid);
    }

    // Steps and Ingredients
    const stepsIngredientsGrid = document.createElement('div');
    stepsIngredientsGrid.classList.add('grid-x');
    const stepsIngredientsCell = document.createElement('div');
    stepsIngredientsCell.classList.add('cell', 'recipe-steps-and-ingredients', 'animate-enter-fade-up-short', 'animate-delay-11');
    stepsIngredientsGrid.append(stepsIngredientsCell);

    if (stepsCountCell && stepsCountCell.textContent.trim()) {
      const stepsContainer = document.createElement('div');
      stepsContainer.classList.add('recipe-steps-container');
      const stepsCount = document.createElement('span');
      stepsCount.classList.add('recipe-steps-count', 'labelSmallBold');
      stepsCount.textContent = stepsCountCell.textContent.trim();
      const stepsLabel = document.createElement('span');
      stepsLabel.classList.add('recipe-steps-label', 'utilityTagHighCaps');
      stepsLabel.textContent = 'Steps';
      stepsContainer.append(stepsCount, stepsLabel);
      stepsIngredientsCell.append(stepsContainer);
    }

    if (stepsCountCell && stepsCountCell.textContent.trim() && ingredientsCountCell && ingredientsCountCell.textContent.trim()) {
      const separator = document.createElement('div');
      separator.classList.add('recipe-steps-separator');
      stepsIngredientsCell.append(separator);
    }

    if (ingredientsCountCell && ingredientsCountCell.textContent.trim()) {
      const ingredientsContainer = document.createElement('div');
      ingredientsContainer.classList.add('recipe-ingredients-container');
      const ingredientsCount = document.createElement('span');
      ingredientsCount.classList.add('recipe-ingredients-count', 'labelSmallBold');
      ingredientsCount.textContent = ingredientsCountCell.textContent.trim();
      const ingredientsLabel = document.createElement('span');
      ingredientsLabel.classList.add('recipe-ingredients-label', 'utilityTagHighCaps');
      ingredientsLabel.textContent = 'Ingredients';
      ingredientsContainer.append(ingredientsCount, ingredientsLabel);
      stepsIngredientsCell.append(ingredientsContainer);
    }
    recipeInfo.append(stepsIngredientsGrid);

    // Tag (Desktop)
    if (tagCell && tagCell.textContent.trim()) {
      const tagDesktop = document.createElement('div');
      tagDesktop.classList.add('recipe-tag-desktop', 'animate-enter-fade-up-short', 'animate-delay-9');
      const tagDiv = document.createElement('div');
      tagDiv.classList.add('tag', 'bg--brand-green');
      const tagLabel = document.createElement('span');
      tagLabel.classList.add('tag__label');
      tagLabel.textContent = tagCell.textContent.trim();
      tagDiv.append(tagLabel);
      tagDesktop.append(tagDiv);
      recipeInfo.append(tagDesktop);
    }

    recipeList.append(listItem);
  });

  // Swiper Pagination
  const pagination = document.createElement('div');
  pagination.classList.add('recipe-home--pagination', 'animate-enter-fade-left-long', 'animate-delay-8');
  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'swiper-pagination-clickable', 'swiper-pagination-bullets', 'swiper-pagination-horizontal');
  pagination.append(swiperPagination);
  swiperContainer.append(pagination);

  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');
  swiperContainer.append(swiperNotification);

  // CTA Container
  const ctaContainer = document.createElement('div');
  ctaContainer.classList.add('grid-x', 'recipe-home--cta-container', 'text-center', 'animate-enter-fade-up-short', 'animate-delay-10');
  mainWrapper.append(ctaContainer);

  const ctaCell = document.createElement('div');
  ctaCell.classList.add('cell', 'large-10', 'large-offset-1', 'see-all-recipies-cta');
  ctaContainer.append(ctaCell);

  if (ctaLinkRow && ctaLabelRow) {
    const ctaLink = document.createElement('a');
    ctaLink.classList.add('button', 'transparent-auto');
    const foundCtaLink = ctaLinkRow.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href;
      ctaLink.title = ctaLabelRow.textContent.trim();
      ctaLink.setAttribute('aria-label', ctaLabelRow.textContent.trim());
      ctaLink.setAttribute('rel', 'follow');
    }
    const ctaText = document.createElement('span');
    ctaText.classList.add('button-text');
    ctaText.textContent = ctaLabelRow.textContent.trim();
    ctaLink.append(ctaText);
    moveInstrumentation(ctaLinkRow, ctaLink);
    ctaCell.append(ctaLink);
  }

  block.innerHTML = '';
  block.append(mainWrapper);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Swiper initialization (simplified for EDS, no actual swiper JS loaded)
  let currentIndex = 0;
  const totalSlides = recipeCardRows.length;
  const slides = recipeList.querySelectorAll('.swiper-slide');
  const paginationBullets = [];

  for (let i = 0; i < totalSlides; i += 1) {
    const bullet = document.createElement('span');
    bullet.classList.add('swiper-pagination-bullet');
    bullet.setAttribute('tabindex', '0');
    bullet.setAttribute('role', 'button');
    bullet.setAttribute('aria-label', `Go to slide ${i + 1}`);
    bullet.addEventListener('click', () => {
      updateSwiper(i);
    });
    swiperPagination.append(bullet);
    paginationBullets.push(bullet);
  }

  const updateSwiper = (newIndex) => {
    slides[currentIndex].classList.remove('swiper-slide-active');
    paginationBullets[currentIndex].classList.remove('swiper-pagination-bullet-active');
    paginationBullets[currentIndex].removeAttribute('aria-current');

    currentIndex = (newIndex + totalSlides) % totalSlides;

    slides[currentIndex].classList.add('swiper-slide-active');
    paginationBullets[currentIndex].classList.add('swiper-pagination-bullet-active');
    paginationBullets[currentIndex].setAttribute('aria-current', 'true');


    // Simple horizontal scroll for demonstration
    recipeList.style.transform = `translateX(-${currentIndex * (slides[0]?.offsetWidth || 0)}px)`;

    prevButton.disabled = currentIndex === 0;
    prevButton.setAttribute('aria-disabled', currentIndex === 0);
    nextButton.disabled = currentIndex === totalSlides - 1;
    nextButton.setAttribute('aria-disabled', currentIndex === totalSlides - 1);
  };

  prevButton.addEventListener('click', () => updateSwiper(currentIndex - 1));
  nextButton.addEventListener('click', () => updateSwiper(currentIndex + 1));

  if (totalSlides > 0) {
    updateSwiper(0); // Initialize first slide
  } else {
    prevButton.disabled = true;
    nextButton.disabled = true;
    prevButton.setAttribute('aria-disabled', 'true');
    nextButton.setAttribute('aria-disabled', 'true');
  }
}
