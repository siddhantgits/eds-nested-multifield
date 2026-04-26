import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import Swiper from '../../scripts/swiper-bundle.min.js';

export default function decorate(block) {
  const children = [...block.children];

  const [
    backgroundImageRow,
    headingRow,
    descriptionRow,
    ...itemRows
  ] = children;

  block.classList.add('grid-container', 'bg--paper-white');

  // Background Image
  const parallaxBg = document.createElement('div');
  parallaxBg.classList.add('parallax-bg', 'js-parallax-bg', 'lazyLoadedImage');
  const bgPicture = backgroundImageRow.querySelector('picture');
  if (bgPicture) {
    const img = bgPicture.querySelector('img');
    if (img) {
      parallaxBg.style.backgroundImage = `url(${img.src})`;
      moveInstrumentation(img, parallaxBg);
    }
  }
  block.prepend(parallaxBg);
  backgroundImageRow.remove(); // Remove the original row after processing

  const contentWrapper = document.createElement('div');
  const headerGrid = document.createElement('div');
  headerGrid.classList.add('grid-x', 'campaign-carousel__header-grid');

  const emptyCellLeft = document.createElement('div');
  emptyCellLeft.classList.add('cell', 'large-2', 'xlarge-3');
  headerGrid.append(emptyCellLeft);

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add(
    'cell',
    'small-12',
    'large-8',
    'xlarge-6',
    'campaign-carousel__header-wrapper',
  );

  // Heading
  const heading = document.createElement('h2');
  heading.classList.add('campaign-carousel__title');
  heading.textContent = headingRow.textContent.trim();
  moveInstrumentation(headingRow, heading);
  headerWrapper.append(heading);
  headingRow.remove();

  // Description
  const description = document.createElement('div');
  description.classList.add('campaign-carousel__description', 'bodyMediumRegular');
  description.innerHTML = descriptionRow.innerHTML;
  moveInstrumentation(descriptionRow, description);
  headerWrapper.append(description);
  descriptionRow.remove();

  headerGrid.append(headerWrapper);

  const emptyCellRight = document.createElement('div');
  emptyCellRight.classList.add('cell', 'large-2', 'xlarge-3');
  headerGrid.append(emptyCellRight);

  contentWrapper.append(headerGrid);

  // Swiper container
  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper', 'campaign-carousel__swiper');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper', 'campaign-carousel__swiper-wrapper');
  swiperContainer.append(swiperWrapper);

  itemRows.forEach((row) => {
    const cells = [...row.children];
    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide');

    if (cells.length === 3) {
      // Quotation Slide
      swiperSlide.classList.add('campaign-carousel__swiper__quotation-slide');
      const [quoteTextCell, authorCell, bgImageCell] = cells;

      const campaignQuotation = document.createElement('div');
      campaignQuotation.classList.add('campaign-quotation');

      const blockquote = document.createElement('blockquote');
      blockquote.classList.add('campaign-quotation__text', 'headline-h4');
      blockquote.innerHTML = quoteTextCell.innerHTML;

      const quoteIconWrapper = document.createElement('span');
      quoteIconWrapper.classList.add('campaign-quotation__quote-icon-wrapper');
      const quoteIcon = document.createElement('i');
      quoteIcon.classList.add('icon', 'quote-start-brown');
      quoteIconWrapper.append(quoteIcon);
      blockquote.append(quoteIconWrapper);
      campaignQuotation.append(blockquote);

      const authorWrapper = document.createElement('div');
      authorWrapper.classList.add('campaign-quotation__author-and-location-wrapper');
      const author = document.createElement('div');
      author.classList.add('labelSmallBold', 'campaign-quotation__author');
      author.textContent = authorCell.textContent.trim();
      authorWrapper.append(author);
      campaignQuotation.append(authorWrapper);

      const bgImageWrapper = document.createElement('div');
      bgImageWrapper.classList.add('campaign-quotation__background-image-wrapper');
      const picture = bgImageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
            { width: '794' },
          ]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          bgImageWrapper.append(optimizedPic);
        }
      }
      campaignQuotation.append(bgImageWrapper);
      swiperSlide.append(campaignQuotation);
    } else if (cells.length === 7) {
      // Recipe Card Slide
      swiperSlide.classList.add('campaign-carousel__swiper__recipe-card-slide');
      const [
        linkCell,
        imageCell,
        tagCell,
        nameCell,
        descriptionCell,
        stepsCountCell,
        ingredientsCountCell,
      ] = cells;

      const recipeLink = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        recipeLink.href = foundLink.href;
        recipeLink.setAttribute('aria-label', `${nameCell.textContent.trim()} - Read More`);
      }
      recipeLink.classList.add('campaign-recipe-card', 'elevation-4');

      const imgContainer = document.createElement('div');
      imgContainer.classList.add('campaign-recipe-card__img-container');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
            { width: '566' },
          ]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          imgContainer.append(optimizedPic);
        }
      }
      recipeLink.append(imgContainer);

      const details = document.createElement('div');
      details.classList.add('campaign-recipe-card__details');

      const tagWrapper = document.createElement('div');
      tagWrapper.classList.add('campaign-recipe-card__tag');
      const tagDiv = document.createElement('div');
      tagDiv.classList.add('tag', 'bg--brand-green');
      const tagLabel = document.createElement('span');
      tagLabel.classList.add('tag__label');
      tagLabel.textContent = tagCell.textContent.trim();
      tagDiv.append(tagLabel);
      tagWrapper.append(tagDiv);
      details.append(tagWrapper);

      const recipeName = document.createElement('div');
      recipeName.classList.add('labelLargeBold', 'campaign-recipe-card__name');
      recipeName.textContent = nameCell.textContent.trim();
      details.append(recipeName);

      const recipeDescription = document.createElement('div');
      recipeDescription.classList.add('bodySmallRegular', 'campaign-recipe-card__description');
      recipeDescription.textContent = descriptionCell.textContent.trim();
      details.append(recipeDescription);

      const stepsAndIngredients = document.createElement('div');
      stepsAndIngredients.classList.add('campaign-recipe-card__steps-and-ingredients');

      const stepsContainer = document.createElement('div');
      stepsContainer.classList.add('campaign-recipe-card__steps-container');
      const stepsCount = document.createElement('span');
      stepsCount.classList.add('labelSmallBold', 'campaign-recipe-card__steps-count');
      stepsCount.textContent = stepsCountCell.textContent.trim();
      const stepsLabel = document.createElement('span');
      stepsLabel.classList.add('utilityTagHighCaps', 'campaign-recipe-card__steps-label');
      stepsLabel.textContent = 'Steps';
      stepsContainer.append(stepsCount, stepsLabel);
      stepsAndIngredients.append(stepsContainer);

      const separator = document.createElement('div');
      separator.classList.add('campaign-recipe-card__steps-separator');
      stepsAndIngredients.append(separator);

      const ingredientsContainer = document.createElement('div');
      ingredientsContainer.classList.add('campaign-recipe-card__ingredients-container');
      const ingredientsCount = document.createElement('span');
      ingredientsCount.classList.add('labelSmallBold', 'campaign-recipe-card__ingredients-count');
      ingredientsCount.textContent = ingredientsCountCell.textContent.trim();
      const ingredientsLabel = document.createElement('span');
      ingredientsLabel.classList.add('utilityTagHighCaps', 'campaign-recipe-card__ingredients-label');
      ingredientsLabel.textContent = 'Ingredients';
      ingredientsContainer.append(ingredientsCount, ingredientsLabel);
      stepsAndIngredients.append(ingredientsContainer);

      details.append(stepsAndIngredients);
      recipeLink.append(details);
      swiperSlide.append(recipeLink);
    } else if (cells.length === 5) {
      // Fact Card Slide
      swiperSlide.classList.add('campaign-carousel__swiper__fact-card-slide');
      const [imageCell, nameCell, descriptionCell, ctaLinkCell, ctaLabelCell] = cells;

      const factCard = document.createElement('div');
      // Check for 'campaign-make-difference' class from original HTML
      const isMakeDifference = row.classList.contains('campaign-make-difference');
      factCard.classList.add('campaign-fact-card', 'campaign-fact', 'elevation-4');
      if (isMakeDifference) {
        factCard.classList.add('campaign-make-difference', 'bg--paper-brown');
      } else {
        factCard.classList.add('bg--paper-green');
      }

      const imgContainer = document.createElement('div');
      imgContainer.classList.add('campaign-fact-card__img-container');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
            { width: '630' },
          ]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          imgContainer.append(optimizedPic);
        }
      }
      factCard.append(imgContainer);

      const details = document.createElement('div');
      details.classList.add('campaign-fact-card__details');

      const factName = document.createElement('div');
      factName.classList.add('campaign-fact-card__name', 'utilityScriptLarge');
      factName.textContent = nameCell.textContent.trim();
      details.append(factName);

      const factDescription = document.createElement('div');
      factDescription.classList.add('bodyMediumRegular', 'campaign-fact-card__description');
      factDescription.innerHTML = descriptionCell.innerHTML;
      details.append(factDescription);

      const cta = document.createElement('div');
      cta.classList.add('campaign-fact-card__cta');
      const ctaLink = document.createElement('a');
      const foundLink = ctaLinkCell.querySelector('a');
      if (foundLink) {
        ctaLink.href = foundLink.href;
        ctaLink.setAttribute('aria-label', ctaLabelCell.textContent.trim());
        ctaLink.setAttribute('title', ctaLabelCell.textContent.trim());
        if (foundLink.getAttribute('rel')) {
          ctaLink.setAttribute('rel', foundLink.getAttribute('rel'));
        }
      }
      ctaLink.classList.add('link', 'link-auto', 'labelSmallBold');
      const ctaSpan = document.createElement('span');
      ctaSpan.classList.add('button-text');
      ctaSpan.textContent = ctaLabelCell.textContent.trim();
      ctaLink.append(ctaSpan);
      cta.append(ctaLink);
      details.append(cta);

      factCard.append(details);
      swiperSlide.append(factCard);
    }
    moveInstrumentation(row, swiperSlide);
    swiperWrapper.append(swiperSlide);
    row.remove();
  });

  contentWrapper.append(swiperContainer);
  block.append(contentWrapper);

  // Swiper controls (buttons and pagination)
  const prevButton = document.createElement('div');
  prevButton.classList.add(
    'campaign-carousel__btn-control',
    'campaign-carousel--prev',
    'show-for-large',
  );
  const prevBtn = document.createElement('button');
  prevBtn.classList.add(
    'swiper-control',
    'swiper-button',
    'swiper--prev',
    'elevation-1',
  );
  prevBtn.setAttribute('aria-label', 'Previous slide');
  const prevIcon = document.createElement('img');
  prevIcon.alt = 'svg file';
  prevIcon.src = '/content/dam/aemigrate/uploaded-folder/image/1777190876804.svg+xml'; // Example path, ensure this is correct
  prevBtn.append(prevIcon);
  prevButton.append(prevBtn);
  swiperContainer.append(prevButton);

  const nextButton = document.createElement('div');
  nextButton.classList.add(
    'campaign-carousel__btn-control',
    'campaign-carousel--next',
    'show-for-large',
  );
  const nextBtn = document.createElement('button');
  nextBtn.classList.add(
    'swiper-control',
    'swiper-button',
    'swiper--next',
    'elevation-1',
  );
  nextBtn.setAttribute('aria-label', 'Next slide');
  const nextIcon = document.createElement('img');
  nextIcon.alt = 'svg file';
  nextIcon.src = '/content/dam/aemigrate/uploaded-folder/image/1777190876838.svg+xml'; // Example path, ensure this is correct
  nextBtn.append(nextIcon);
  nextButton.append(nextBtn);
  swiperContainer.append(nextButton);

  const pagination = document.createElement('div');
  pagination.classList.add('swiper-pagination', 'campaign-carousel__swiper-pagination');
  swiperContainer.append(pagination);

  // Initialize Swiper
  // eslint-disable-next-line no-unused-vars
  const swiper = new Swiper(swiperContainer, {
    slidesPerView: 'auto',
    spaceBetween: 20,
    centeredSlides: true,
    initialSlide: 0,
    loop: false,
    navigation: {
      nextEl: nextBtn,
      prevEl: prevBtn,
    },
    pagination: {
      el: pagination,
      clickable: true,
    },
    breakpoints: {
      1024: {
        spaceBetween: 40,
        centeredSlides: false,
        loop: false,
      },
    },
    on: {
      init: (s) => {
        // Update button states on init
        if (s.isBeginning) {
          prevBtn.setAttribute('disabled', '');
          prevBtn.classList.add('swiper-button-disabled', 'swiper-button-lock');
        }
        if (s.isEnd) {
          nextBtn.setAttribute('disabled', '');
          nextBtn.classList.add('swiper-button-disabled', 'swiper-button-lock');
        }
      },
      slideChange: (s) => {
        // Update button states on slide change
        if (s.isBeginning) {
          prevBtn.setAttribute('disabled', '');
          prevBtn.classList.add('swiper-button-disabled', 'swiper-button-lock');
        } else {
          prevBtn.removeAttribute('disabled');
          prevBtn.classList.remove('swiper-button-disabled', 'swiper-button-lock');
        }

        if (s.isEnd) {
          nextBtn.setAttribute('disabled', '');
          nextBtn.classList.add('swiper-button-disabled', 'swiper-button-lock');
        } else {
          nextBtn.removeAttribute('disabled');
          nextBtn.classList.remove('swiper-button-disabled', 'swiper-button-lock');
        }
      },
    },
  });

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
