import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [
    backgroundImageRow,
    headingRow,
    greetingEveningRow,
    greetingMorningRow,
    greetingAfternoonRow,
    greetingNightRow,
    guideTextRow,
    errorMessageRow,
    ...itemRows
  ] = children;

  block.innerHTML = '';
  block.classList.add('grid-container', 'animate-enter', 'in-view');

  // Background Image
  const parallaxBgImgContainer = document.createElement('div');
  parallaxBgImgContainer.classList.add('parallax-bg-img-container');
  const parallaxImg = document.createElement('div');
  parallaxImg.classList.add('parallax-img', 'lazyLoadedImage');

  const bgPicture = backgroundImageRow.querySelector('picture');
  if (bgPicture) {
    const bgImg = bgPicture.querySelector('img');
    if (bgImg) {
      const optimizedPic = createOptimizedPicture(bgImg.src, bgImg.alt, false, [{ width: '2000' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      parallaxImg.style.backgroundImage = `url(${optimizedImg.src})`;
      moveInstrumentation(bgImg, optimizedImg);
    }
  }
  parallaxBgImgContainer.append(parallaxImg);
  block.append(parallaxBgImgContainer);

  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.classList.add('max-width-container', 'grid-x');
  block.append(maxWidthContainer);

  const contentCell = document.createElement('div');
  contentCell.classList.add(
    'cell',
    'small-12',
    'medium-offset-1',
    'medium-10',
    'xlarge-offset-2',
    'xlarge-8',
    'padding-x',
  );
  maxWidthContainer.append(contentCell);

  // Heading
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'animate-enter-fade-up-short', 'animate-delay-3');
  heading.textContent = headingRow.textContent.trim();
  contentCell.append(heading);

  const introInfo = document.createElement('div');
  introInfo.classList.add('intro-info', 'animate-enter-fade', 'animate-delay-1', 'no-avatar-image');
  contentCell.append(introInfo);

  // Greetings
  const greetingsContainer = document.createElement('div');
  greetingsContainer.classList.add(
    'greetings-container',
    'headline-h4',
    'animate-enter-fade-up-short',
    'animate-delay-3',
    'stagger-1',
  );
  introInfo.append(greetingsContainer);

  const createGreetingSpan = (className, textContent) => {
    const span = document.createElement('span');
    span.classList.add('hide', className);
    span.textContent = textContent;
    return span;
  };

  greetingsContainer.append(
    createGreetingSpan('greeting--morning', greetingMorningRow.textContent.trim()),
    createGreetingSpan('greeting--afternoon', greetingAfternoonRow.textContent.trim()),
    createGreetingSpan('greeting--evening', greetingEveningRow.textContent.trim()),
    createGreetingSpan('greeting--night', greetingNightRow.textContent.trim()),
  );

  // Guide Text
  const guideText = document.createElement('div');
  guideText.classList.add('guide-text', 'labelMediumRegular', 'animate-enter-fade-up-short', 'animate-delay-6');
  guideText.textContent = guideTextRow.textContent.trim();
  introInfo.append(guideText);

  // Swiper Pagination
  const swiperPaginationContainer = document.createElement('div');
  swiperPaginationContainer.classList.add(
    'cell',
    'small-12',
    'medium-offset-1',
    'medium-10',
    'xlarge-offset-2',
    'xlarge-8',
    'swiper-pagination-container',
    'padding-x',
    'animate-enter-fade-up-short',
    'animate-delay-15',
  );
  maxWidthContainer.append(swiperPaginationContainer);

  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'swiper-pagination-progressbar', 'swiper-pagination-horizontal');
  swiperPaginationContainer.append(swiperPagination);

  const swiperPaginationFill = document.createElement('span');
  swiperPaginationFill.classList.add('swiper-pagination-progressbar-fill');
  swiperPagination.append(swiperPaginationFill);

  // Swiper Container
  const swiperCell = document.createElement('div');
  swiperCell.classList.add('cell', 'small-12');
  maxWidthContainer.append(swiperCell);

  const swiper = document.createElement('div');
  swiper.classList.add('swiper', 'coffee-profiler-swiper');
  swiperCell.append(swiper);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiper.append(swiperWrapper);

  const questions = [];
  const options = [];

  // Separate questions and options
  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 4) { // Profiler-Question
      questions.push(row);
    } else if (cells.length === 7) { // Profiler-Option
      options.push(row);
    }
  });

  questions.forEach((questionRow, qIndex) => {
    const [questionIdCell, slideTypeCell, questionLabelCell, optionsContainerCell] = [...questionRow.children];

    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    slide.setAttribute('data-slide-index', qIndex);
    slide.setAttribute('aria-label', `${qIndex + 1} / ${questions.length}`);
    if (qIndex === 0) {
      slide.classList.add('initial-slide', 'swiper-slide-active');
    } else if (qIndex === 1) {
      slide.classList.add('swiper-slide-next');
    }
    swiperWrapper.append(slide);

    // Determine slide type (no or yes) based on slideTypeCell content
    const isSlideTypeYes = slideTypeCell.textContent.trim().toLowerCase() === 'yes';

    const slideTypeNo = document.createElement('div');
    slideTypeNo.classList.add('slide-type--no');
    if (isSlideTypeYes) {
      slideTypeNo.classList.add('hide');
    }
    slide.append(slideTypeNo);

    const profilerSlideNo = document.createElement('div');
    profilerSlideNo.classList.add('coffee-profiler-slide', 'animate-enter-fade-up-short', 'animate-delay-7');
    profilerSlideNo.setAttribute('data-q-id', questionIdCell.textContent.trim());
    profilerSlideNo.setAttribute('data-slide-index', qIndex);
    profilerSlideNo.setAttribute('data-q-filter', ''); // Placeholder, needs to be derived from options
    slideTypeNo.append(profilerSlideNo);

    const questionLabel = document.createElement('h3');
    questionLabel.classList.add('question-label');
    questionLabel.textContent = questionLabelCell.textContent.trim();
    profilerSlideNo.append(questionLabel);

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');
    profilerSlideNo.append(optionsContainer);

    // Filter options for this question
    const questionOptions = options.filter(
      (optionRow) => optionRow.querySelector('div:first-child').textContent.trim().startsWith(questionIdCell.textContent.trim()),
    );
    optionsContainer.classList.add(`options-count--${questionOptions.length}`);

    questionOptions.forEach((optionRow) => {
      const [
        optionIdCell,
        isYesCell,
        optionIconCell,
        optionLabelCell,
        optFilterValsCell,
        optFilterCell,
        optExcFilterCell,
      ] = [...optionRow.children];

      const optionButton = document.createElement('button');
      optionButton.classList.add('option', 'elevation-2', 'has-hover', 'bg--paper-white');
      optionButton.setAttribute('data-opt-id', optionIdCell.textContent.trim());
      optionButton.setAttribute('data-q-id', questionIdCell.textContent.trim());
      optionButton.setAttribute('data-opt-filter-vals', optFilterValsCell.textContent.trim());
      optionButton.setAttribute('data-opt-filter', optFilterCell.textContent.trim());
      optionButton.setAttribute('data-opt-exc-filter', optExcFilterCell.textContent.trim());
      optionButton.setAttribute('aria-label', optionLabelCell.textContent.trim());
      optionButton.setAttribute('role', 'radio');
      optionButton.setAttribute('aria-checked', 'false');
      if (isYesCell.textContent.trim() === '1') {
        optionButton.setAttribute('data-is-yes', '1');
      }

      const optionIconPicture = optionIconCell.querySelector('picture');
      if (optionIconPicture) {
        const optionIconImg = optionIconPicture.querySelector('img');
        if (optionIconImg) {
          const optimizedPic = createOptimizedPicture(optionIconImg.src, optionIconImg.alt, false, [{ width: '100' }]);
          const optimizedImg = optimizedPic.querySelector('img');
          optimizedImg.classList.add('option-icon', 'lazyload');
          optionButton.append(optimizedImg);
          moveInstrumentation(optionIconImg, optimizedImg);
        }
      }

      const optionLabel = document.createElement('span');
      optionLabel.classList.add('option-label', 'labelMediumRegular');
      optionLabel.textContent = optionLabelCell.textContent.trim();
      optionButton.append(optionLabel);

      optionsContainer.append(optionButton);
    });

    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid-container');
    slide.append(gridContainer);
    const gridX = document.createElement('div');
    gridX.classList.add('grid-x');
    gridContainer.append(gridX);

    // For slide-type--yes, if applicable (based on original HTML structure)
    const slideTypeYes = document.createElement('div');
    slideTypeYes.classList.add('slide-type--yes');
    if (!isSlideTypeYes) {
      slideTypeYes.classList.add('hide');
    }
    slide.append(slideTypeYes);

    // Add content similar to slideTypeNo if needed for 'yes' type
    // This part is highly dependent on the actual logic of 'slide-type--yes' in the original site.
    // Based on the original HTML, it contains a profiler-slide with similar structure.
    if (isSlideTypeYes) {
      const profilerSlideYes = document.createElement('div');
      profilerSlideYes.classList.add('coffee-profiler-slide', 'animate-enter-fade-up-short', 'animate-delay-7');
      // The original HTML shows different data-q-id for slide-type--yes,
      // but the block model only provides one questionIdCell per questionRow.
      // For now, we'll use the same questionIdCell.textContent.trim() for data-q-id.
      // If the model supported separate IDs for 'no' and 'yes' slides, we would use that.
      profilerSlideYes.setAttribute('data-q-id', questionIdCell.textContent.trim());
      profilerSlideYes.setAttribute('data-slide-index', qIndex);
      profilerSlideYes.setAttribute('data-q-filter', ''); // Placeholder, needs to be derived from options
      slideTypeYes.append(profilerSlideYes);

      const questionLabelYes = document.createElement('h3');
      questionLabelYes.classList.add('question-label');
      questionLabelYes.textContent = questionLabelCell.textContent.trim(); // Assuming same label for now
      profilerSlideYes.append(questionLabelYes);

      const optionsContainerYes = document.createElement('div');
      optionsContainerYes.classList.add('options-container');
      profilerSlideYes.append(optionsContainerYes);

      // Filter options for this question (same options for both slide types for now)
      optionsContainerYes.classList.add(`options-count--${questionOptions.length}`);

      questionOptions.forEach((optionRow) => {
        const [
          optionIdCell,
          isYesCell,
          optionIconCell,
          optionLabelCell,
          optFilterValsCell,
          optFilterCell,
          optExcFilterCell,
        ] = [...optionRow.children];

        const optionButton = document.createElement('button');
        optionButton.classList.add('option', 'elevation-2', 'has-hover', 'bg--paper-white');
        optionButton.setAttribute('data-opt-id', optionIdCell.textContent.trim());
        optionButton.setAttribute('data-q-id', questionIdCell.textContent.trim());
        optionButton.setAttribute('data-opt-filter-vals', optFilterValsCell.textContent.trim());
        optionButton.setAttribute('data-opt-filter', optFilterCell.textContent.trim());
        optionButton.setAttribute('data-opt-exc-filter', optExcFilterCell.textContent.trim());
        optionButton.setAttribute('aria-label', optionLabelCell.textContent.trim());
        optionButton.setAttribute('role', 'radio');
        optionButton.setAttribute('aria-checked', 'false');
        if (isYesCell.textContent.trim() === '1') {
          optionButton.setAttribute('data-is-yes', '1');
        }

        const optionIconPicture = optionIconCell.querySelector('picture');
        if (optionIconPicture) {
          const optionIconImg = optionIconPicture.querySelector('img');
          if (optionIconImg) {
            const optimizedPic = createOptimizedPicture(optionIconImg.src, optionIconImg.alt, false, [{ width: '100' }]);
            const optimizedImg = optimizedPic.querySelector('img');
            optimizedImg.classList.add('option-icon', 'lazyload');
            optionButton.append(optimizedImg);
            moveInstrumentation(optionIconImg, optimizedImg);
          }
        }

        const optionLabel = document.createElement('span');
        optionLabel.classList.add('option-label', 'labelMediumRegular');
        optionLabel.textContent = optionLabelCell.textContent.trim();
        optionButton.append(optionLabel);

        optionsContainerYes.append(optionButton);
      });
    }
  });

  // Swiper Controls
  const swiperControls = document.createElement('div');
  swiperControls.classList.add('swiper-controls', 'animate-enter-fade', 'animate-delay-15');
  swiper.append(swiperControls);

  const prevButton = document.createElement('button');
  prevButton.classList.add(
    'swiper-control',
    'swiper-button',
    'swiper-control--prev',
    'elevation-1',
    'animate-enter-fade-right-short',
    'animate-delay-15',
    'swiper-button-disabled',
  );
  prevButton.setAttribute('disabled', '');
  prevButton.setAttribute('tabindex', '-1');
  prevButton.setAttribute('aria-label', 'Previous slide');
  prevButton.setAttribute('aria-disabled', 'true');
  const prevIcon = document.createElement('img');
  // Hardcoded src from original HTML, as there's no model field for it.
  prevIcon.src = '/content/dam/aemigrate/uploaded-folder/image/1777213390123.svg';
  prevIcon.alt = 'Previous icon';
  prevButton.append(prevIcon);
  swiperControls.append(prevButton);

  const nextButton = document.createElement('button');
  nextButton.classList.add(
    'swiper-control',
    'swiper-button',
    'swiper-control--next',
    'elevation-1',
    'animate-enter-fade-left-short',
    'animate-delay-15',
  );
  nextButton.setAttribute('tabindex', '0');
  nextButton.setAttribute('aria-label', 'Next slide');
  nextButton.setAttribute('aria-disabled', 'false');
  nextButton.setAttribute('disabled', 'disabled');
  const nextIcon = document.createElement('img');
  // Hardcoded src from original HTML, as there's no model field for it.
  nextIcon.src = '/content/dam/aemigrate/uploaded-folder/image/1777213390221.svg';
  nextIcon.alt = 'Next icon';
  nextButton.append(nextIcon);
  swiperControls.append(nextButton);

  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');
  swiper.append(swiperNotification);

  // Error Message
  const errorMessageDiv = document.createElement('div');
  errorMessageDiv.classList.add('error-message');
  errorMessageDiv.setAttribute('data-default-message', errorMessageRow.textContent.trim());
  block.append(errorMessageDiv);

  const errorMessageText = document.createElement('span');
  errorMessageText.classList.add('error-message-text', 'bodyLargeRegular');
  errorMessageText.textContent = errorMessageRow.textContent.trim();
  errorMessageDiv.append(errorMessageText);

  // Form (hidden)
  const form = document.createElement('form');
  form.classList.add('hide', 'coffee-profiler-form');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', 'https://www.nescafe.com/in/coffee-profiler/result'); // Hardcoded action from original HTML
  block.append(form);

  const createHiddenInput = (name) => {
    const input = document.createElement('input');
    input.setAttribute('name', name);
    input.setAttribute('value', '');
    input.setAttribute('type', 'hidden');
    return input;
  };

  form.append(
    createHiddenInput('type'),
    createHiddenInput('intensity'),
    createHiddenInput('format'),
    createHiddenInput('features'),
    createHiddenInput('exc-type'),
    createHiddenInput('exc-intensity'),
    createHiddenInput('exc-format'),
    createHiddenInput('exc-features'),
  );

  // Optimized pictures for all images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
