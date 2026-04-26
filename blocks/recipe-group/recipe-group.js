import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Root fields: title, subtitle, cta-label
  // Item rows for 'tabs' and 'recipes' follow these.
  const [titleRow, subtitleRow, ctaLabelRow, ...itemRows] = children;

  const titleText = titleRow?.firstElementChild?.textContent?.trim();
  const subtitleText = subtitleRow?.firstElementChild?.textContent?.trim();
  const ctaLabelText = ctaLabelRow?.firstElementChild?.textContent?.trim();

  // Distinguish item rows based on cell count as per BlockJson model
  const tabItems = itemRows.filter((row) => row.children.length === 1); // recipe-tab has 1 field
  const recipeCards = itemRows.filter((row) => row.children.length === 6); // recipe-card has 6 fields

  block.innerHTML = '';
  block.classList.add('cmp-recipe-group');

  // Header Section
  const headerSection = document.createElement('div');
  headerSection.classList.add('cmp-recipe-group__header-section');
  moveInstrumentation(titleRow, headerSection); // Instrument titleRow as the primary source for header

  if (titleText) {
    const titleElement = document.createElement('h2');
    titleElement.classList.add('cmp-recipe-group__title');
    titleElement.textContent = titleText;
    headerSection.appendChild(titleElement);
  }

  if (subtitleText) {
    const subtitleElement = document.createElement('div');
    subtitleElement.classList.add('cmp-recipe-group__subtitle');
    subtitleElement.textContent = subtitleText;
    headerSection.appendChild(subtitleElement);
  }
  block.appendChild(headerSection);

  // Tabs Section
  if (tabItems.length > 0) {
    const tabsSection = document.createElement('div');
    tabsSection.classList.add('cmp-recipe-group__tabs');

    const tabGroup = document.createElement('div');
    tabGroup.classList.add('tab-group', 'cmp-tab-group');

    const carouselItem = document.createElement('div');
    carouselItem.classList.add(
      'cmp-tab-group__carousel-item',
      'cmp-carousel__item',
      'scrollbar-style-h',
      'scrollbar-style-w'
    );

    tabItems.forEach((row, index) => {
      // CORRECT: Accessing the single cell for 'recipe-tab'
      const tabLabelCell = [...row.children][0];
      const tabLabel = tabLabelCell?.textContent?.trim();

      if (tabLabel) {
        const tabItem = document.createElement('div');
        tabItem.classList.add('cmp-tab-group__tab-item');

        const tabDiv = document.createElement('div');
        tabDiv.classList.add('tab', 'cmp-tab--primary');

        const button = document.createElement('button');
        button.classList.add('cmp-tab');
        if (index === 0) {
          button.classList.add('selected');
        }
        button.type = 'button';

        const span = document.createElement('span');
        span.classList.add('cmp-tab__text');
        span.textContent = tabLabel;

        button.appendChild(span);
        tabDiv.appendChild(button);
        tabItem.appendChild(tabDiv);
        carouselItem.appendChild(tabItem);
        moveInstrumentation(row, tabItem);

        button.addEventListener('click', () => {
          carouselItem
            .querySelectorAll('.cmp-tab')
            .forEach((btn) => btn.classList.remove('selected'));
          button.classList.add('selected');
          // TODO: Implement actual tab switching logic for recipe cards
          // This would involve showing/hiding recipe card carousels based on the selected tab.
          // For now, only the tab button styling changes.
        });
      }
    });

    tabGroup.appendChild(carouselItem);
    tabsSection.appendChild(tabGroup);
    block.appendChild(tabsSection);
  }

  // Recipe Cards Content Section
  if (recipeCards.length > 0) {
    const contentSection = document.createElement('div');
    contentSection.classList.add('cmp-recipe-group__content');

    const carouselWrapper = document.createElement('div');
    carouselWrapper.classList.add('cmp-recipe-group__carousel', 'undefined'); // 'undefined' from original HTML

    const slickCarousel = document.createElement('div');
    slickCarousel.classList.add(
      'slickcarousel',
      'carousel',
      'panelcontainer'
    );

    const cmpCarousel = document.createElement('div');
    cmpCarousel.classList.add('cmp-carousel');
    cmpCarousel.setAttribute('data-component', 'carousel');
    cmpCarousel.setAttribute('data-show-infinite-scroll', 'false');
    cmpCarousel.setAttribute('data-show-arrows', 'true');
    cmpCarousel.setAttribute('data-show-dots', 'false');
    cmpCarousel.setAttribute('data-item-count-per-slide', '3');
    cmpCarousel.setAttribute('data-auto-play-is-enabled', 'false');
    cmpCarousel.setAttribute('data-auto-play-speed-in-ms', '500');
    cmpCarousel.setAttribute('data-reveal-next-item-partially', 'false');
    cmpCarousel.setAttribute('data-show-center-zoom', 'false');
    cmpCarousel.setAttribute('data-slides-to-scroll', '3');
    cmpCarousel.setAttribute('data-initialized', 'true');

    const carouselContainer = document.createElement('div');
    carouselContainer.classList.add(
      'cmp-carousel__container',
      'slick-initialized',
      'slick-slider'
    );

    const slickList = document.createElement('div');
    slickList.classList.add('slick-list', 'draggable');

    const slickTrack = document.createElement('div');
    slickTrack.classList.add('slick-track');

    recipeCards.forEach((row, index) => {
      // CORRECT: Destructuring for 'recipe-card' item rows with 6 fields
      const [linkCell, imageCell, tagCell, titleCell, timeCell, difficultyCell] = [...row.children];

      const link = linkCell?.querySelector('a');
      const image = imageCell?.querySelector('picture');
      const tag = tagCell?.textContent?.trim();
      const title = titleCell?.textContent?.trim();
      const time = timeCell?.textContent?.trim();
      const difficulty = difficultyCell?.textContent?.trim();

      const carouselItem = document.createElement('div');
      carouselItem.classList.add(
        'cmp-recipe-group__carousel-item',
        'cmp-carousel__item',
        'slick-slide'
      );
      if (index === 0) {
        carouselItem.classList.add('slick-current', 'slick-active');
      }
      carouselItem.setAttribute('data-slick-index', index);
      carouselItem.setAttribute('aria-hidden', index !== 0);
      carouselItem.setAttribute('tabindex', index === 0 ? '0' : '-1');

      const cardLink = document.createElement('a');
      cardLink.classList.add(
        'card',
        'cmp-card--recipe',
        'cmp-card--aashirvaad-recipe',
        'color-background-background-2'
      );
      cardLink.setAttribute('tabindex', index === 0 ? '0' : '-1');
      if (link) {
        cardLink.href = link.href;
      }

      const cardDiv = document.createElement('div');
      cardDiv.classList.add('cmp-card');

      const cardContent = document.createElement('div');
      cardContent.classList.add('cmp-card__content');

      const cardMedia = document.createElement('div');
      cardMedia.classList.add('cmp-card__media');

      const cardOptions = document.createElement('div');
      cardOptions.classList.add('cmp-card__options');
      const threeDots = document.createElement('div');
      threeDots.classList.add('cmp-card__three-dots', 'icon-open-card-popup');
      cardOptions.appendChild(threeDots);
      cardMedia.appendChild(cardOptions);

      const cardImage = document.createElement('div');
      cardImage.classList.add('cmp-card__image');
      const lazyImageContainer = document.createElement('div');
      lazyImageContainer.classList.add('lazy-image-container');
      if (image) {
        const img = image.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        lazyImageContainer.appendChild(optimizedPic);
      }
      cardImage.appendChild(lazyImageContainer);
      cardMedia.appendChild(cardImage);
      cardContent.appendChild(cardMedia);

      const cardInfo = document.createElement('div');
      cardInfo.classList.add('cmp-card__info');

      if (tag) {
        const cardTag = document.createElement('div');
        cardTag.classList.add('cmp-card__tag', 'cmp-card__tag--with-heart');
        const tagWrapper = document.createElement('div');
        tagWrapper.classList.add('cmp-card__tag-wrapper');
        const pTag = document.createElement('p');
        pTag.textContent = tag;
        tagWrapper.appendChild(pTag);
        cardTag.appendChild(tagWrapper);
        const heartsWrapper = document.createElement('div');
        heartsWrapper.classList.add('cmp-card__hearts-wrapper', 'hidden');
        const heartIcon = document.createElement('div');
        heartIcon.classList.add('cmp-card__icon', 'icon-favorite_FILL1_wght400_GRAD0_opsz20');
        heartsWrapper.appendChild(heartIcon);
        heartsWrapper.appendChild(document.createElement('p')); // Empty p tag from original
        cardTag.appendChild(heartsWrapper);
        cardInfo.appendChild(cardTag);
      }

      if (title) {
        const cardTitle = document.createElement('div');
        cardTitle.classList.add('cmp-card__title');
        const h4Title = document.createElement('h4');
        h4Title.textContent = title;
        cardTitle.appendChild(h4Title);
        cardInfo.appendChild(cardTitle);
      }

      if (time || difficulty) {
        const recipeFooter = document.createElement('div');
        recipeFooter.classList.add('cmp-card__recipe_footer');

        if (time) {
          const timeInMinutes = document.createElement('div');
          timeInMinutes.classList.add('cmp-card__time-in-minutes');
          const timeIcon = document.createElement('div');
          timeIcon.classList.add('cmp-card__icon', 'icon-Group-21690');
          const pTime = document.createElement('p');
          pTime.textContent = time;
          timeInMinutes.appendChild(timeIcon);
          timeInMinutes.appendChild(pTime);
          recipeFooter.appendChild(timeInMinutes);
        }

        if (difficulty) {
          const difficultyLevel = document.createElement('div');
          difficultyLevel.classList.add('cmp-card__difficulty-level', 'icon-chef-cap');
          const difficultyIcon = document.createElement('div');
          difficultyIcon.classList.add('cmp-card__icon', 'path1'); // 'path1' from original
          const pDifficulty = document.createElement('p');
          pDifficulty.textContent = difficulty;
          difficultyLevel.appendChild(difficultyIcon);
          difficultyLevel.appendChild(pDifficulty);
          recipeFooter.appendChild(difficultyLevel);
        }
        cardInfo.appendChild(recipeFooter);
      }

      cardContent.appendChild(cardInfo);
      cardDiv.appendChild(cardContent);
      cardLink.appendChild(cardDiv);
      carouselItem.appendChild(cardLink);
      slickTrack.appendChild(carouselItem);
      moveInstrumentation(row, carouselItem);
    });

    slickList.appendChild(slickTrack);
    carouselContainer.appendChild(slickList);

    // Add navigation buttons (slick-prev, slick-next)
    const prevButton = document.createElement('button');
    prevButton.classList.add('slick-prev', 'slick-arrow', 'slick-disabled');
    prevButton.setAttribute('aria-label', 'Previous');
    prevButton.setAttribute('type', 'button');
    prevButton.setAttribute('aria-disabled', 'true');
    prevButton.textContent = 'Previous';
    carouselContainer.prepend(prevButton);

    const nextButton = document.createElement('button');
    nextButton.classList.add('slick-next', 'slick-arrow');
    nextButton.setAttribute('aria-label', 'Next');
    nextButton.setAttribute('type', 'button');
    nextButton.setAttribute('aria-disabled', 'false');
    nextButton.textContent = 'Next';
    carouselContainer.appendChild(nextButton);

    // Basic carousel functionality (simplified for EDS, no full slick.js)
    let currentIndex = 0;
    const itemsPerSlide = parseInt(cmpCarousel.getAttribute('data-item-count-per-slide'), 10) || 3;
    const totalItems = recipeCards.length;

    const updateCarousel = () => {
      // Calculate track width based on item width (assuming 316px per card as per original HTML)
      const itemWidth = 316;
      const trackWidth = totalItems * itemWidth;
      slickTrack.style.width = `${trackWidth}px`;
      slickTrack.style.transform = `translate3d(-${currentIndex * itemWidth}px, 0px, 0px)`;

      prevButton.classList.toggle('slick-disabled', currentIndex === 0);
      prevButton.setAttribute('aria-disabled', currentIndex === 0);

      nextButton.classList.toggle('slick-disabled', currentIndex >= totalItems - itemsPerSlide);
      nextButton.setAttribute('aria-disabled', currentIndex >= totalItems - itemsPerSlide);

      [...slickTrack.children].forEach((item, idx) => {
        item.classList.remove('slick-current', 'slick-active');
        item.setAttribute('aria-hidden', 'true');
        item.setAttribute('tabindex', '-1');
        item.querySelector('a').setAttribute('tabindex', '-1');

        if (idx >= currentIndex && idx < currentIndex + itemsPerSlide) {
          item.classList.add('slick-active');
          item.setAttribute('aria-hidden', 'false');
          item.setAttribute('tabindex', '0');
          item.querySelector('a').setAttribute('tabindex', '0');
          if (idx === currentIndex) {
            item.classList.add('slick-current');
          }
        }
      });
    };

    prevButton.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex -= 1;
        updateCarousel();
      }
    });

    nextButton.addEventListener('click', () => {
      if (currentIndex < totalItems - itemsPerSlide) {
        currentIndex += 1;
        updateCarousel();
      }
    });

    cmpCarousel.appendChild(carouselContainer);
    slickCarousel.appendChild(cmpCarousel);
    carouselWrapper.appendChild(slickCarousel);
    contentSection.appendChild(carouselWrapper);
    block.appendChild(contentSection);
    updateCarousel(); // Initial update
  }

  // CTA Action Section
  if (ctaLabelText) {
    const actionSection = document.createElement('div');
    actionSection.classList.add('cmp-recipe-group__action');
    moveInstrumentation(ctaLabelRow, actionSection);

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add(
      'button',
      'cmp-button--primary',
      'cmp-button--primary-light'
    );

    const button = document.createElement('button');
    button.classList.add('cmp-button');
    button.type = 'button';

    const span = document.createElement('span');
    span.classList.add('cmp-button__text');
    span.textContent = ctaLabelText;

    button.appendChild(span);
    buttonDiv.appendChild(button);
    actionSection.appendChild(buttonDiv);
    block.appendChild(actionSection);
  }

  const shareDiv = document.createElement('div');
  shareDiv.classList.add('share');
  block.appendChild(shareDiv);
}
