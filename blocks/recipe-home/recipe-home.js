import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [iconRow, titleRow, descriptionRow, seeAllRecipesLinkRow, ...recipeRows] = [
    ...block.children,
  ];

  block.innerHTML = '';
  block.classList.add(
    'grid-container',
    'overflow-x-hidden',
    'recipe-home--has-icon',
    'bg--paper-white',
    'animate-enter',
    'in-view',
  );

  // --- Header Section ---
  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('grid-x', 'recipe-home--image-text');
  block.append(headerWrapper);

  const headerContentCell = document.createElement('div');
  headerContentCell.classList.add('cell', 'small-12', 'large-10', 'large-offset-1');
  headerWrapper.append(headerContentCell);

  // Icon
  const iconSection = document.createElement('div');
  iconSection.classList.add(
    'recipe-home--icon-section',
    'animate-enter-fade-left-long',
    'animate-delay-3',
    'text-center',
  );
  const iconPicture = iconRow?.querySelector('picture');
  if (iconPicture) {
    const iconImg = iconPicture.querySelector('img');
    const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: 'auto' }]);
    optimizedIcon.querySelector('img').classList.add('recipe-home--icon-section-img');
    moveInstrumentation(iconRow.firstElementChild, optimizedIcon.querySelector('img'));
    iconSection.append(optimizedIcon);
  }
  headerContentCell.append(iconSection);

  // Text Section (Title & Description)
  const textSection = document.createElement('div');
  textSection.classList.add(
    'recipe-home--text-section',
    'animate-enter-fade-up-short',
    'animate-delay-3',
  );
  headerContentCell.append(textSection);

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

  // --- Recipes Carousel Section ---
  const carouselWrapperCell = document.createElement('div');
  carouselWrapperCell.classList.add('cell', 'small-12', 'recipe-home--wrapper');
  block.append(carouselWrapperCell);

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add(
    'swiper',
    'swipper--full-view-padding',
    'recipe-home--wrapper--in',
    'swiper-initialized',
    'swiper-horizontal',
    'swiper-backface-hidden',
  );
  carouselWrapperCell.append(swiperContainer);

  // Swiper Navigation Buttons (Prev/Next)
  const prevButtonControl = document.createElement('div');
  prevButtonControl.classList.add(
    'recipe-home--btn-control',
    'recipe-home--prev',
    'show-for-large',
  );
  const prevButton = document.createElement('button');
  prevButton.classList.add(
    'swiper-control',
    'swiper--prev',
    'elevation-1',
    'animate-enter-fade-right-short',
    'animate-delay-9',
    'swiper-button-disabled',
  );
  prevButton.setAttribute('aria-label', 'Previous slide');
  prevButton.setAttribute('disabled', '');
  const prevButtonImg = document.createElement('img');
  // Placeholder for previous button image, replace if authored
  prevButtonImg.alt = 'Previous slide';
  prevButtonImg.src = '/icons/previous-arrow.svg';
  prevButton.append(prevButtonImg);
  prevButtonControl.append(prevButton);
  swiperContainer.append(prevButtonControl);

  const nextButtonControl = document.createElement('div');
  nextButtonControl.classList.add(
    'recipe-home--btn-control',
    'recipe-home--next',
    'show-for-large',
  );
  const nextButton = document.createElement('button');
  nextButton.classList.add(
    'swiper-control',
    'swiper--next',
    'elevation-1',
    'animate-enter-fade-left-short',
    'animate-delay-9',
  );
  nextButton.setAttribute('aria-label', 'Next slide');
  const nextButtonImg = document.createElement('img');
  // Placeholder for next button image, replace if authored
  nextButtonImg.alt = 'Next slide';
  nextButtonImg.src = '/icons/next-arrow.svg';
  nextButton.append(nextButtonImg);
  nextButtonControl.append(nextButton);
  swiperContainer.append(nextButtonControl);

  const recipeList = document.createElement('ul');
  recipeList.classList.add('swiper-wrapper', 'recipe-home--list');
  swiperContainer.append(recipeList);

  recipeRows.forEach((row, index) => {
    const [
      cardLinkCell,
      imageCell,
      altTextCell,
      tagCell,
      nameCell,
      descriptionCell,
      stepsCountCell,
      stepsLabelCell,
      ingredientsCountCell,
      ingredientsLabelCell,
    ] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('swiper-slide', 'recipe-home--list-item');
    if (index === 0) {
      listItem.classList.add('swiper-slide-active');
    }
    recipeList.append(listItem);

    const cardLink = document.createElement('a');
    cardLink.classList.add('recipe-card-grid-view--link');
    cardLink.href = cardLinkCell?.querySelector('a')?.href || '#';
    moveInstrumentation(cardLinkCell, cardLink);
    listItem.append(cardLink);

    const recipeCard = document.createElement('div');
    recipeCard.classList.add(
      'grid-x',
      'recipe-card',
      'recipe-card--grid-view-card',
      'elevation-2',
      'has-hover',
      'recipe-card-grid-view',
    );
    cardLink.append(recipeCard);

    const imgContainer = document.createElement('div');
    imgContainer.classList.add(
      'cell',
      'small-12',
      'medium-12',
      'large-6',
      'recipe-img-container',
      'animate-enter-fade',
      'animate-delay-5',
    );
    recipeCard.append(imgContainer);

    const tagMobile = document.createElement('div');
    tagMobile.classList.add(
      'recipe-tag-mobile',
      'animate-enter-fade-up-short',
      'animate-delay-9',
    );
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
      const optimizedPic = createOptimizedPicture(img.src, altTextCell?.textContent.trim() || '', false, [
        { media: '(min-width: 768px)', width: '1066' },
        { width: '750' },
      ]);
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
    recipeName.classList.add(
      'recipe-name',
      'labelLargeBold',
      'animate-enter-fade-up-short',
      'animate-delay-9',
    );
    recipeName.textContent = nameCell?.textContent.trim() || '';
    recipeInfo.append(recipeName);

    const descriptionGrid = document.createElement('div');
    descriptionGrid.classList.add('grid-x');
    const descriptionCellEl = document.createElement('div');
    descriptionCellEl.classList.add(
      'cell',
      'recipe-description',
      'bodySmallRegular',
      'animate-enter-fade-up-short',
      'animate-delay-11',
    );
    descriptionCellEl.textContent = descriptionCell?.textContent.trim() || '';
    descriptionGrid.append(descriptionCellEl);
    recipeInfo.append(descriptionGrid);

    const stepsIngredientsGrid = document.createElement('div');
    stepsIngredientsGrid.classList.add('grid-x');
    const stepsIngredientsCell = document.createElement('div');
    stepsIngredientsCell.classList.add(
      'cell',
      'recipe-steps-and-ingredients',
      'animate-enter-fade-up-short',
      'animate-delay-11',
    );
    stepsIngredientsGrid.append(stepsIngredientsCell);
    recipeInfo.append(stepsIngredientsGrid);

    const stepsContainer = document.createElement('div');
    stepsContainer.classList.add('recipe-steps-container');
    const stepsCount = document.createElement('span');
    stepsCount.classList.add('recipe-steps-count', 'labelSmallBold');
    stepsCount.textContent = stepsCountCell?.textContent.trim() || '';
    const stepsLabel = document.createElement('span');
    stepsLabel.classList.add('recipe-steps-label', 'utilityTagHighCaps');
    stepsLabel.textContent = stepsLabelCell?.textContent.trim() || '';
    stepsContainer.append(stepsCount, stepsLabel);
    stepsIngredientsCell.append(stepsContainer);

    const stepsSeparator = document.createElement('div');
    stepsSeparator.classList.add('recipe-steps-separator');
    stepsIngredientsCell.append(stepsSeparator);

    const ingredientsContainer = document.createElement('div');
    ingredientsContainer.classList.add('recipe-ingredients-container');
    const ingredientsCount = document.createElement('span');
    ingredientsCount.classList.add('recipe-ingredients-count', 'labelSmallBold');
    ingredientsCount.textContent = ingredientsCountCell?.textContent.trim() || '';
    const ingredientsLabel = document.createElement('span');
    ingredientsLabel.classList.add('recipe-ingredients-label', 'utilityTagHighCaps');
    ingredientsLabel.textContent = ingredientsLabelCell?.textContent.trim() || '';
    ingredientsContainer.append(ingredientsCount, ingredientsLabel);
    stepsIngredientsCell.append(ingredientsContainer);

    const tagDesktop = document.createElement('div');
    tagDesktop.classList.add(
      'recipe-tag-desktop',
      'animate-enter-fade-up-short',
      'animate-delay-9',
    );
    const tagDivDesktop = document.createElement('div');
    tagDivDesktop.classList.add('tag', 'bg--brand-green');
    const tagSpanDesktop = document.createElement('span');
    tagSpanDesktop.classList.add('tag__label');
    tagSpanDesktop.textContent = tagCell?.textContent.trim() || '';
    tagDivDesktop.append(tagSpanDesktop);
    tagDesktop.append(tagDivDesktop);
    recipeInfo.append(tagDesktop);
  });

  // Swiper Pagination (Bullets)
  const paginationWrapper = document.createElement('div');
  paginationWrapper.classList.add(
    'recipe-home--pagination',
    'animate-enter-fade-left-long',
    'animate-delay-8',
  );
  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add(
    'swiper-pagination',
    'swiper-pagination-clickable',
    'swiper-pagination-bullets',
    'swiper-pagination-horizontal',
  );
  paginationWrapper.append(swiperPagination);
  swiperContainer.append(paginationWrapper);

  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');
  swiperContainer.append(swiperNotification);

  // --- CTA Section ---
  const ctaContainer = document.createElement('div');
  ctaContainer.classList.add(
    'grid-x',
    'recipe-home--cta-container',
    'text-center',
    'animate-enter-fade-up-short',
    'animate-delay-10',
  );
  block.append(ctaContainer);

  const ctaCell = document.createElement('div');
  ctaCell.classList.add('cell', 'large-10', 'large-offset-1', 'see-all-recipies-cta');
  ctaContainer.append(ctaCell);

  const ctaLink = document.createElement('a');
  ctaLink.classList.add('button', 'transparent-auto');
  ctaLink.href = seeAllRecipesLinkRow?.querySelector('a')?.href || '#';
  ctaLink.title = 'See all recipes'; // Hardcoded in original HTML, so replicated here
  ctaLink.setAttribute('aria-label', 'See all recipes'); // Hardcoded in original HTML
  ctaLink.setAttribute('rel', 'follow');
  const ctaText = document.createElement('span');
  ctaText.classList.add('button-text');
  ctaText.textContent = 'See all recipes'; // Hardcoded in original HTML, so replicated here
  ctaLink.append(ctaText);
  moveInstrumentation(seeAllRecipesLinkRow, ctaLink);
  ctaCell.append(ctaLink);

  // Swiper initialization and event listeners
  // This assumes Swiper.js is loaded globally or imported.
  // If Swiper is not globally available, it needs to be imported or loaded dynamically.
  // For now, adding basic event listeners for navigation buttons.
  let currentSlideIndex = 0; // Track current slide for basic navigation
  const totalSlides = recipeRows.length;

  const updateSwiperButtons = () => {
    prevButton.disabled = currentSlideIndex === 0;
    prevButton.classList.toggle('swiper-button-disabled', currentSlideIndex === 0);
    nextButton.disabled = currentSlideIndex === totalSlides - 1;
    nextButton.classList.toggle('swiper-button-disabled', currentSlideIndex === totalSlides - 1);

    // Update active slide class for basic visual feedback
    recipeList.querySelectorAll('.swiper-slide').forEach((slide, idx) => {
      slide.classList.toggle('swiper-slide-active', idx === currentSlideIndex);
    });
    // For a real Swiper, this would involve calling swiper.slideTo(currentSlideIndex)
  };

  prevButton.addEventListener('click', () => {
    if (currentSlideIndex > 0) {
      currentSlideIndex -= 1;
      updateSwiperButtons();
      // In a real Swiper, you'd call swiper.slidePrev()
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentSlideIndex < totalSlides - 1) {
      currentSlideIndex += 1;
      updateSwiperButtons();
      // In a real Swiper, you'd call swiper.slideNext()
    }
  });

  // Initial button state
  updateSwiperButtons();
}
