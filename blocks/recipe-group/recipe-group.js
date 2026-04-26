import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [
    titleRow,
    subtitleRow,
    ctaLabelRow,
    ...itemRows
  ] = children;

  const title = titleRow?.firstElementChild?.textContent?.trim();
  const subtitle = subtitleRow?.firstElementChild?.textContent?.trim();
  const ctaLabel = ctaLabelRow?.firstElementChild?.textContent?.trim();

  const tabRows = itemRows.filter((row) => row.children.length === 1);
  const recipeCardRows = itemRows.filter((row) => row.children.length === 6);

  block.innerHTML = '';
  block.classList.add('cmp-recipe-group');

  const headerSection = document.createElement('div');
  headerSection.classList.add('cmp-recipe-group__header-section');
  block.append(headerSection);

  if (title) {
    const titleElement = document.createElement('h2');
    titleElement.classList.add('cmp-recipe-group__title');
    titleElement.textContent = title;
    moveInstrumentation(titleRow, titleElement);
    headerSection.append(titleElement);
  }

  if (subtitle) {
    const subtitleElement = document.createElement('div');
    subtitleElement.classList.add('cmp-recipe-group__subtitle');
    subtitleElement.textContent = subtitle;
    moveInstrumentation(subtitleRow, subtitleElement);
    headerSection.append(subtitleElement);
  }

  const tabButtons = [];
  if (tabRows.length > 0) {
    const tabsSection = document.createElement('div');
    tabsSection.classList.add('cmp-recipe-group__tabs');
    block.append(tabsSection);

    const tabGroup = document.createElement('div');
    tabGroup.classList.add('tab-group', 'cmp-tab-group');
    tabsSection.append(tabGroup);

    const tabCarouselItem = document.createElement('div');
    tabCarouselItem.classList.add('cmp-tab-group__carousel-item', 'cmp-carousel__item', 'scrollbar-style-h', 'scrollbar-style-w');
    tabGroup.append(tabCarouselItem);

    tabRows.forEach((row, index) => {
      const [labelCell] = [...row.children];
      const tabLabel = labelCell?.textContent?.trim();

      if (tabLabel) {
        const tabGroupItem = document.createElement('div');
        tabGroupItem.classList.add('cmp-tab-group__tab-item');
        tabCarouselItem.append(tabGroupItem);

        const tabDiv = document.createElement('div');
        tabDiv.classList.add('tab', 'cmp-tab--primary');
        tabGroupItem.append(tabDiv);

        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('cmp-tab');
        if (index === 0) {
          button.classList.add('selected');
        }
        button.dataset.tabIndex = index; // Add data attribute for easier event handling
        tabDiv.append(button);

        const span = document.createElement('span');
        span.classList.add('cmp-tab__text');
        span.textContent = tabLabel;
        button.append(span);
        moveInstrumentation(row, button);
        tabButtons.push(button);
      }
    });

    // Add event listener for tab buttons
    tabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        tabButtons.forEach((btn) => btn.classList.remove('selected'));
        button.classList.add('selected');
        // TODO: Implement logic to show/hide corresponding recipe cards based on tab selection
        // This would likely involve filtering recipeCardRows based on a 'tab' property
        // and then re-rendering or showing/hiding carousel items.
        // For now, this just handles the visual 'selected' state.
      });
    });
  }

  if (recipeCardRows.length > 0) {
    const contentSection = document.createElement('div');
    contentSection.classList.add('cmp-recipe-group__content');
    block.append(contentSection);

    const recipeCarousel = document.createElement('div');
    recipeCarousel.classList.add('cmp-recipe-group__carousel', 'slickcarousel', 'carousel', 'panelcontainer');
    contentSection.append(recipeCarousel);

    const carouselContainer = document.createElement('div');
    carouselContainer.classList.add('cmp-carousel', 'cmp-carousel__container', 'slick-initialized', 'slick-slider');
    recipeCarousel.append(carouselContainer);

    const prevButton = document.createElement('button');
    prevButton.classList.add('slick-prev', 'slick-arrow', 'slick-disabled');
    prevButton.setAttribute('aria-label', 'Previous');
    prevButton.type = 'button';
    prevButton.setAttribute('aria-disabled', 'true');
    prevButton.textContent = 'Previous';
    carouselContainer.append(prevButton);

    const slickList = document.createElement('div');
    slickList.classList.add('slick-list', 'draggable');
    carouselContainer.append(slickList);

    const slickTrack = document.createElement('div');
    slickTrack.classList.add('slick-track');
    slickList.append(slickTrack);

    recipeCardRows.forEach((row, index) => {
      const [linkCell, imageCell, tagCell, titleCell, timeCell, difficultyCell] = [...row.children];

      const link = linkCell?.querySelector('a');
      const image = imageCell?.querySelector('picture');
      const tag = tagCell?.textContent?.trim();
      const recipeTitle = titleCell?.textContent?.trim();
      const time = timeCell?.textContent?.trim();
      const difficulty = difficultyCell?.textContent?.trim();

      const carouselItem = document.createElement('div');
      carouselItem.classList.add('cmp-recipe-group__carousel-item', 'cmp-carousel__item', 'slick-slide');
      if (index === 0) {
        carouselItem.classList.add('slick-current', 'slick-active');
      }
      carouselItem.setAttribute('data-slick-index', index);
      carouselItem.setAttribute('aria-hidden', index !== 0);
      slickTrack.append(carouselItem);

      const cardLink = document.createElement('a');
      cardLink.classList.add('card', 'cmp-card--recipe', 'cmp-card--aashirvaad-recipe', 'color-background-background-2');
      cardLink.href = link?.href || '#';
      cardLink.tabIndex = index === 0 ? 0 : -1;
      carouselItem.append(cardLink);
      moveInstrumentation(linkCell, cardLink);

      const cardDiv = document.createElement('div');
      cardDiv.classList.add('cmp-card');
      cardLink.append(cardDiv);

      const cardContent = document.createElement('div');
      cardContent.classList.add('cmp-card__content');
      cardDiv.append(cardContent);

      const cardMedia = document.createElement('div');
      cardMedia.classList.add('cmp-card__media');
      cardContent.append(cardMedia);

      const cardOptions = document.createElement('div');
      cardOptions.classList.add('cmp-card__options');
      cardMedia.append(cardOptions);

      const threeDots = document.createElement('div');
      threeDots.classList.add('cmp-card__three-dots', 'icon-open-card-popup');
      cardOptions.append(threeDots);

      const cardImage = document.createElement('div');
      cardImage.classList.add('cmp-card__image');
      cardMedia.append(cardImage);

      const lazyImageContainer = document.createElement('div');
      lazyImageContainer.classList.add('lazy-image-container');
      cardImage.append(lazyImageContainer);

      if (image) {
        const img = image.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        lazyImageContainer.append(optimizedPic);
      }

      const cardInfo = document.createElement('div');
      cardInfo.classList.add('cmp-card__info');
      cardContent.append(cardInfo);

      if (tag) {
        const cardTag = document.createElement('div');
        cardTag.classList.add('cmp-card__tag', 'cmp-card__tag--with-heart');
        cardInfo.append(cardTag);

        const tagWrapper = document.createElement('div');
        tagWrapper.classList.add('cmp-card__tag-wrapper');
        cardTag.append(tagWrapper);

        const tagP = document.createElement('p');
        tagP.textContent = tag;
        tagWrapper.append(tagP);
        moveInstrumentation(tagCell, tagP);

        const heartsWrapper = document.createElement('div');
        heartsWrapper.classList.add('cmp-card__hearts-wrapper', 'hidden');
        cardTag.append(heartsWrapper);

        const favoriteIcon = document.createElement('div');
        favoriteIcon.classList.add('cmp-card__icon', 'icon-favorite_FILL1_wght400_GRAD0_opsz20');
        heartsWrapper.append(favoriteIcon);

        heartsWrapper.append(document.createElement('p'));
      }

      if (recipeTitle) {
        const cardTitle = document.createElement('div');
        cardTitle.classList.add('cmp-card__title');
        cardInfo.append(cardTitle);

        const titleH4 = document.createElement('h4');
        titleH4.textContent = recipeTitle;
        cardTitle.append(titleH4);
        moveInstrumentation(titleCell, titleH4);
      }

      if (time || difficulty) {
        const recipeFooter = document.createElement('div');
        recipeFooter.classList.add('cmp-card__recipe_footer');
        cardInfo.append(recipeFooter);

        if (time) {
          const timeInMinutes = document.createElement('div');
          timeInMinutes.classList.add('cmp-card__time-in-minutes');
          recipeFooter.append(timeInMinutes);

          const timeIcon = document.createElement('div');
          timeIcon.classList.add('cmp-card__icon', 'icon-Group-21690');
          timeInMinutes.append(timeIcon);

          const timeP = document.createElement('p');
          timeP.textContent = time;
          timeInMinutes.append(timeP);
          moveInstrumentation(timeCell, timeP);
        }

        if (difficulty) {
          const difficultyLevel = document.createElement('div');
          difficultyLevel.classList.add('cmp-card__difficulty-level', 'icon-chef-cap');
          recipeFooter.append(difficultyLevel);

          const difficultyIcon = document.createElement('div');
          difficultyIcon.classList.add('cmp-card__icon', 'path1');
          difficultyLevel.append(difficultyIcon);

          const difficultyP = document.createElement('p');
          difficultyP.textContent = difficulty;
          difficultyLevel.append(difficultyP);
          moveInstrumentation(difficultyCell, difficultyP);
        }
      }
    });

    const nextButton = document.createElement('button');
    nextButton.classList.add('slick-next', 'slick-arrow');
    nextButton.setAttribute('aria-label', 'Next');
    nextButton.type = 'button';
    nextButton.setAttribute('aria-disabled', 'false');
    nextButton.textContent = 'Next';
    carouselContainer.append(nextButton);

    // Add event listeners for carousel navigation
    let currentIndex = 0;
    const totalItems = recipeCardRows.length;
    const itemsPerSlide = 3; // Assuming 3 items per slide based on ORIGINAL HTML data-item-count-per-slide="3"

    const updateCarousel = () => {
      const slickSlides = slickTrack.querySelectorAll('.slick-slide');
      slickSlides.forEach((slide, idx) => {
        if (idx >= currentIndex && idx < currentIndex + itemsPerSlide) {
          slide.classList.add('slick-active');
          slide.setAttribute('aria-hidden', 'false');
          slide.tabIndex = 0;
        } else {
          slide.classList.remove('slick-active');
          slide.setAttribute('aria-hidden', 'true');
          slide.tabIndex = -1;
        }
      });

      // Update slick-current for the first active item
      slickSlides.forEach((slide, idx) => {
        if (idx === currentIndex) {
          slide.classList.add('slick-current');
        } else {
          slide.classList.remove('slick-current');
        }
      });

      // Update button states
      prevButton.classList.toggle('slick-disabled', currentIndex === 0);
      prevButton.setAttribute('aria-disabled', currentIndex === 0);
      nextButton.classList.toggle('slick-disabled', currentIndex >= totalItems - itemsPerSlide);
      nextButton.setAttribute('aria-disabled', currentIndex >= totalItems - itemsPerSlide);

      // Update transform for slick-track (simplified for basic movement)
      const itemWidth = slickSlides[0]?.offsetWidth || 0; // Assuming all items have same width
      slickTrack.style.transform = `translate3d(-${currentIndex * itemWidth}px, 0px, 0px)`;
    };

    prevButton.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex = Math.max(0, currentIndex - itemsPerSlide);
        updateCarousel();
      }
    });

    nextButton.addEventListener('click', () => {
      if (currentIndex < totalItems - itemsPerSlide) {
        currentIndex = Math.min(totalItems - itemsPerSlide, currentIndex + itemsPerSlide);
        updateCarousel();
      }
    });

    // Initial carousel state
    updateCarousel();
  }

  if (ctaLabel) {
    const actionSection = document.createElement('div');
    actionSection.classList.add('cmp-recipe-group__action');
    block.append(actionSection);

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button', 'cmp-button--primary', 'cmp-button--primary-light');
    actionSection.append(buttonDiv);

    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('cmp-button');
    buttonDiv.append(button);

    const span = document.createElement('span');
    span.classList.add('cmp-button__text');
    span.textContent = ctaLabel;
    button.append(span);
    moveInstrumentation(ctaLabelRow, button);
  }

  const shareDiv = document.createElement('div');
  shareDiv.classList.add('share');
  block.append(shareDiv);
}
