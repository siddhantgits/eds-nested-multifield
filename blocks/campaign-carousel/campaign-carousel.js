import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundImageRow,
    titleRow,
    descriptionRow,
    ...itemRows
  ] = [...block.children];

  block.classList.add('grid-container', 'bg--paper-white');

  // Background Image
  const parallaxBg = document.createElement('div');
  parallaxBg.classList.add('parallax-bg', 'js-parallax-bg', 'lazyLoadedImage');
  const bgImg = backgroundImageRow.querySelector('img');
  if (bgImg) {
    parallaxBg.style.backgroundImage = `url(${bgImg.src})`;
    moveInstrumentation(backgroundImageRow, parallaxBg);
  }
  block.prepend(parallaxBg);
  backgroundImageRow.remove(); // Remove the original row after processing

  const contentWrapper = document.createElement('div');
  block.append(contentWrapper);

  // Header
  const headerGrid = document.createElement('div');
  headerGrid.classList.add('grid-x', 'campaign-carousel__header-grid');
  contentWrapper.append(headerGrid);

  const emptyCell1 = document.createElement('div');
  emptyCell1.classList.add('cell', 'large-2', 'xlarge-3');
  headerGrid.append(emptyCell1);

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('cell', 'small-12', 'large-8', 'xlarge-6', 'campaign-carousel__header-wrapper');
  headerGrid.append(headerWrapper);

  const title = document.createElement('h2');
  title.classList.add('campaign-carousel__title');
  title.textContent = titleRow.textContent.trim();
  moveInstrumentation(titleRow, title);
  headerWrapper.append(title);

  const description = document.createElement('div');
  description.classList.add('campaign-carousel__description', 'bodyMediumRegular');
  description.innerHTML = descriptionRow.innerHTML;
  moveInstrumentation(descriptionRow, description);
  headerWrapper.append(description);

  const emptyCell2 = document.createElement('div');
  emptyCell2.classList.add('cell', 'large-2', 'xlarge-3');
  headerGrid.append(emptyCell2);

  // Swiper Container
  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper', 'campaign-carousel__swiper', 'swiper-initialized', 'swiper-horizontal', 'swiper-backface-hidden');
  contentWrapper.append(swiperContainer);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper', 'campaign-carousel__swiper-wrapper');
  swiperWrapper.setAttribute('aria-live', 'polite');
  swiperContainer.append(swiperWrapper);

  itemRows.forEach((row) => {
    const cells = [...row.children];
    let slide;

    if (cells.length === 3) { // Quotation Slide
      const [textCell, authorCell, bgImageCell] = cells; // Corrected: using destructuring
      slide = document.createElement('div');
      slide.classList.add('swiper-slide', 'campaign-carousel__swiper__quotation-slide');
      moveInstrumentation(row, slide);

      const quotation = document.createElement('div');
      quotation.classList.add('campaign-quotation');
      slide.append(quotation);

      const blockquote = document.createElement('blockquote');
      blockquote.classList.add('campaign-quotation__text', 'headline-h4');
      blockquote.innerHTML = textCell.innerHTML;
      quotation.append(blockquote);

      const quoteIconWrapper = document.createElement('span');
      quoteIconWrapper.classList.add('campaign-quotation__quote-icon-wrapper');
      const quoteIcon = document.createElement('i');
      quoteIcon.classList.add('icon', 'quote-start-brown');
      quoteIconWrapper.append(quoteIcon);
      blockquote.append(quoteIconWrapper);

      const authorWrapper = document.createElement('div');
      authorWrapper.classList.add('campaign-quotation__author-and-location-wrapper');
      const author = document.createElement('div');
      author.classList.add('labelSmallBold', 'campaign-quotation__author');
      author.textContent = authorCell.textContent.trim();
      authorWrapper.append(author);
      quotation.append(authorWrapper);

      const bgImageWrapper = document.createElement('div');
      bgImageWrapper.classList.add('campaign-quotation__background-image-wrapper');
      const picture = bgImageCell.querySelector('picture');
      if (picture) {
        bgImageWrapper.append(picture);
      }
      quotation.append(bgImageWrapper);
    } else if (cells.length === 7) { // Recipe Card Slide
      const [linkCell, imageCell, tagCell, nameCell, descriptionCell, stepsCell, ingredientsCell] = cells; // Corrected: using destructuring
      slide = document.createElement('div');
      slide.classList.add('swiper-slide', 'campaign-carousel__swiper__recipe-card-slide');
      moveInstrumentation(row, slide);

      const link = document.createElement('a');
      link.classList.add('campaign-recipe-card', 'elevation-4');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.setAttribute('aria-label', `${nameCell.textContent.trim()} - Read More`);
      }
      slide.append(link);

      const imgContainer = document.createElement('div');
      imgContainer.classList.add('campaign-recipe-card__img-container');
      const img = imageCell.querySelector('img');
      if (img) {
        imgContainer.append(img);
      }
      link.append(imgContainer);

      const details = document.createElement('div');
      details.classList.add('campaign-recipe-card__details');
      link.append(details);

      const tagWrapper = document.createElement('div');
      tagWrapper.classList.add('campaign-recipe-card__tag');
      const tag = document.createElement('div');
      tag.classList.add('tag', 'bg--brand-green');
      const tagLabel = document.createElement('span');
      tagLabel.classList.add('tag__label');
      tagLabel.textContent = tagCell.textContent.trim();
      tag.append(tagLabel);
      tagWrapper.append(tag);
      details.append(tagWrapper);

      const name = document.createElement('div');
      name.classList.add('labelLargeBold', 'campaign-recipe-card__name');
      name.textContent = nameCell.textContent.trim();
      details.append(name);

      const description = document.createElement('div');
      description.classList.add('bodySmallRegular', 'campaign-recipe-card__description');
      description.textContent = descriptionCell.textContent.trim();
      details.append(description);

      const stepsAndIngredients = document.createElement('div');
      stepsAndIngredients.classList.add('campaign-recipe-card__steps-and-ingredients');
      details.append(stepsAndIngredients);

      const stepsContainer = document.createElement('div');
      stepsContainer.classList.add('campaign-recipe-card__steps-container');
      const stepsCount = document.createElement('span');
      stepsCount.classList.add('labelSmallBold', 'campaign-recipe-card__steps-count');
      stepsCount.textContent = stepsCell.textContent.trim();
      const stepsLabel = document.createElement('span');
      stepsLabel.classList.add('utilityTagHighCaps', 'campaign-recipe-card__steps-label');
      stepsLabel.textContent = 'Steps ';
      stepsContainer.append(stepsCount, stepsLabel);
      stepsAndIngredients.append(stepsContainer);

      const separator = document.createElement('div');
      separator.classList.add('campaign-recipe-card__steps-separator');
      stepsAndIngredients.append(separator);

      const ingredientsContainer = document.createElement('div');
      ingredientsContainer.classList.add('campaign-recipe-card__ingredients-container');
      const ingredientsCount = document.createElement('span');
      ingredientsCount.classList.add('labelSmallBold', 'campaign-recipe-card__ingredients-count');
      ingredientsCount.textContent = ingredientsCell.textContent.trim();
      const ingredientsLabel = document.createElement('span');
      ingredientsLabel.classList.add('utilityTagHighCaps', 'campaign-recipe-card__ingredients-label');
      ingredientsLabel.textContent = 'Ingredients';
      ingredientsContainer.append(ingredientsCount, ingredientsLabel);
      stepsAndIngredients.append(ingredientsContainer);
    } else if (cells.length === 5) { // Fact Card Slide
      const [imageCell, nameCell, descriptionCell, ctaLinkCell, ctaLabelCell] = cells; // Corrected: using destructuring
      slide = document.createElement('div');
      slide.classList.add('swiper-slide', 'campaign-carousel__swiper__fact-card-slide');
      moveInstrumentation(row, slide);

      const factCard = document.createElement('div');
      factCard.classList.add('campaign-fact-card', 'campaign-fact', 'elevation-4', 'bg--paper-green'); // Default bg
      if (nameCell.textContent.trim().toLowerCase().includes('difference')) {
        factCard.classList.remove('bg--paper-green');
        factCard.classList.add('campaign-make-difference', 'bg--paper-brown');
      }
      slide.append(factCard);

      const imgContainer = document.createElement('div');
      imgContainer.classList.add('campaign-fact-card__img-container');
      const img = imageCell.querySelector('img');
      if (img) {
        imgContainer.append(img);
      }
      factCard.append(imgContainer);

      const details = document.createElement('div');
      details.classList.add('campaign-fact-card__details');
      factCard.append(details);

      const name = document.createElement('div');
      name.classList.add('campaign-fact-card__name', 'utilityScriptLarge');
      name.textContent = nameCell.textContent.trim();
      details.append(name);

      const description = document.createElement('div');
      description.classList.add('bodyMediumRegular', 'campaign-fact-card__description');
      description.innerHTML = descriptionCell.innerHTML;
      details.append(description);

      const cta = document.createElement('div');
      cta.classList.add('campaign-fact-card__cta');
      const ctaLink = document.createElement('a');
      ctaLink.classList.add('link', 'link-auto', 'labelSmallBold');
      const foundCtaLink = ctaLinkCell.querySelector('a');
      if (foundCtaLink) {
        ctaLink.href = foundCtaLink.href;
        ctaLink.title = ctaLabelCell.textContent.trim();
        ctaLink.setAttribute('aria-label', ctaLabelCell.textContent.trim());
        ctaLink.setAttribute('rel', 'follow');
      }
      const buttonText = document.createElement('span');
      buttonText.classList.add('button-text');
      buttonText.textContent = ctaLabelCell.textContent.trim();
      ctaLink.append(buttonText);
      cta.append(ctaLink);
      details.append(cta);
    }

    if (slide) {
      swiperWrapper.append(slide);
    }
  });

  // Swiper controls (buttons)
  const prevControl = document.createElement('div');
  prevControl.classList.add('campaign-carousel__btn-control', 'campaign-carousel--prev', 'show-for-large');
  const prevButton = document.createElement('button');
  prevButton.classList.add('swiper-control', 'swiper-button', 'swiper--prev', 'elevation-1', 'swiper-button-disabled', 'swiper-button-lock');
  prevButton.setAttribute('disabled', '');
  prevButton.setAttribute('tabindex', '-1');
  prevButton.setAttribute('aria-label', 'Previous slide');
  const prevImg = document.createElement('img');
  prevImg.alt = 'svg file';
  prevImg.src = '/content/dam/aemigrate/uploaded-folder/image/1777158291548.svg+xml'; // Example path, ideally from block data
  prevButton.append(prevImg);
  prevControl.append(prevButton);
  swiperContainer.append(prevControl);

  const nextControl = document.createElement('div');
  nextControl.classList.add('campaign-carousel__btn-control', 'campaign-carousel--next', 'show-for-large');
  const nextButton = document.createElement('button');
  nextButton.classList.add('swiper-control', 'swiper-button', 'swiper--next', 'elevation-1', 'swiper-button-disabled', 'swiper-button-lock');
  nextButton.setAttribute('disabled', '');
  nextButton.setAttribute('tabindex', '-1');
  nextButton.setAttribute('aria-label', 'Next slide');
  const nextImg = document.createElement('img');
  nextImg.alt = 'svg file';
  nextImg.src = '/content/dam/aemigrate/uploaded-folder/image/1777158291564.svg+xml'; // Example path, ideally from block data
  nextButton.append(nextImg);
  nextControl.append(nextButton);
  swiperContainer.append(nextControl);

  // Swiper pagination
  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'campaign-carousel__swiper-pagination', 'swiper-pagination-clickable', 'swiper-pagination-bullets', 'swiper-pagination-horizontal', 'swiper-pagination-lock');
  swiperContainer.append(swiperPagination);

  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');
  swiperContainer.append(swiperNotification);

  // Add event listeners for swiper controls (assuming Swiper.js is initialized elsewhere)
  // These buttons would typically interact with a Swiper instance.
  // For this review, we ensure the listeners are present.
  prevButton.addEventListener('click', () => {
    // Logic to navigate to previous slide, e.g., swiper.slidePrev();
    console.log('Previous button clicked');
  });

  nextButton.addEventListener('click', () => {
    // Logic to navigate to next slide, e.g., swiper.slideNext();
    console.log('Next button clicked');
  });

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
