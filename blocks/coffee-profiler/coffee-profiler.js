import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    bgImageRow,
    headingRow,
    greetingMorningRow,
    greetingAfternoonRow,
    greetingEveningRow,
    greetingNightRow,
    introTextRow,
    errorMessageRow,
    ...itemRows
  ] = [...block.children];

  block.innerHTML = '';
  block.classList.add('grid-container', 'animate-enter', 'in-view');

  // Background Image
  const parallaxBgImgContainer = document.createElement('div');
  parallaxBgImgContainer.classList.add('parallax-bg-img-container');
  const parallaxImg = document.createElement('div');
  parallaxImg.classList.add('parallax-img', 'lazyLoadedImage');
  const bgImage = bgImageRow.querySelector('picture img');
  if (bgImage) {
    parallaxImg.style.backgroundImage = `url(${bgImage.src})`;
    moveInstrumentation(bgImageRow, parallaxImg);
  }
  parallaxBgImgContainer.append(parallaxImg);
  block.append(parallaxBgImgContainer);

  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.classList.add('max-width-container', 'grid-x');
  block.append(maxWidthContainer);

  const contentCellWrapper = document.createElement('div');
  contentCellWrapper.classList.add(
    'cell',
    'small-12',
    'medium-offset-1',
    'medium-10',
    'xlarge-offset-2',
    'xlarge-8',
    'padding-x',
  );
  maxWidthContainer.append(contentCellWrapper);

  // Heading
  const heading = document.createElement('h2');
  heading.classList.add(
    'heading',
    'animate-enter-fade-up-short',
    'animate-delay-3',
  );
  heading.textContent = headingRow.textContent.trim();
  moveInstrumentation(headingRow, heading);
  contentCellWrapper.append(heading);

  const introInfo = document.createElement('div');
  introInfo.classList.add(
    'intro-info',
    'animate-enter-fade',
    'animate-delay-1',
    'no-avatar-image',
  );
  contentCellWrapper.append(introInfo);

  // Greetings Container
  const greetingsContainer = document.createElement('div');
  greetingsContainer.classList.add(
    'greetings-container',
    'headline-h4',
    'animate-enter-fade-up-short',
    'animate-delay-3',
    'stagger-1',
  );
  introInfo.append(greetingsContainer);

  const createGreetingSpan = (text, className) => {
    const span = document.createElement('span');
    span.classList.add(className);
    span.textContent = text;
    return span;
  };

  const greetingMorning = createGreetingSpan(
    greetingMorningRow.textContent.trim(),
    'greeting--morning',
  );
  moveInstrumentation(greetingMorningRow, greetingMorning);
  greetingsContainer.append(greetingMorning);

  const greetingAfternoon = createGreetingSpan(
    greetingAfternoonRow.textContent.trim(),
    'greeting--afternoon',
  );
  greetingAfternoon.classList.add('hide');
  moveInstrumentation(greetingAfternoonRow, greetingAfternoon);
  greetingsContainer.append(greetingAfternoon);

  const greetingEvening = createGreetingSpan(
    greetingEveningRow.textContent.trim(),
    'greeting--evening',
  );
  greetingEvening.classList.add('hide');
  moveInstrumentation(greetingEveningRow, greetingEvening);
  greetingsContainer.append(greetingEvening);

  const greetingNight = createGreetingSpan(
    greetingNightRow.textContent.trim(),
    'greeting--night',
  );
  greetingNight.classList.add('hide');
  moveInstrumentation(greetingNightRow, greetingNight);
  greetingsContainer.append(greetingNight);

  const guideText = document.createElement('div');
  guideText.classList.add(
    'guide-text',
    'labelMediumRegular',
    'animate-enter-fade-up-short',
    'animate-delay-6',
  );
  guideText.textContent = introTextRow.textContent.trim();
  moveInstrumentation(introTextRow, guideText);
  introInfo.append(guideText);

  // Swiper Pagination Container
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
  swiperPagination.classList.add(
    'swiper-pagination',
    'swiper-pagination-progressbar',
    'swiper-pagination-horizontal',
  );
  swiperPaginationContainer.append(swiperPagination);

  const swiperPaginationFill = document.createElement('span');
  swiperPaginationFill.classList.add('swiper-pagination-progressbar-fill');
  swiperPagination.append(swiperPaginationFill);

  // Swiper Container
  const swiperCell = document.createElement('div');
  swiperCell.classList.add('cell', 'small-12');
  maxWidthContainer.append(swiperCell);

  const swiper = document.createElement('div');
  swiper.classList.add(
    'swiper',
    'coffee-profiler-swiper',
    'swiper-initialized',
    'swiper-horizontal',
    'swiper-backface-hidden',
  );
  swiperCell.append(swiper);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiper.append(swiperWrapper);

  // Process slides and options
  const slides = [];
  const options = [];

  // Separate slides and options based on content detection
  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 2 && cells[0].textContent.trim() && cells[1].textContent.trim()) {
      // This is a coffee-profiler-slide item (question and options container placeholder)
      slides.push(row);
    } else if (cells.length === 2 && cells[0].querySelector('picture') && cells[1].textContent.trim()) {
      // This is a slide-option item (icon and label)
      options.push(row);
    }
  });

  slides.forEach((slideRow, index) => {
    const [questionCell] = [...slideRow.children]; // Only question cell is directly used from slideRow

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide');
    if (index === 0) {
      swiperSlide.classList.add('initial-slide', 'swiper-slide-active');
    } else if (index === 1) {
      swiperSlide.classList.add('swiper-slide-next');
    }
    swiperSlide.setAttribute('data-slide-index', index);
    swiperSlide.setAttribute('aria-label', `${index + 1} / ${slides.length}`);
    moveInstrumentation(slideRow, swiperSlide);
    swiperWrapper.append(swiperSlide);

    const slideTypeNo = document.createElement('div');
    slideTypeNo.classList.add('slide-type--no');
    swiperSlide.append(slideTypeNo);

    const coffeeProfilerSlide = document.createElement('div');
    coffeeProfilerSlide.classList.add(
      'coffee-profiler-slide',
      'animate-enter-fade-up-short',
      'animate-delay-7',
    );
    slideTypeNo.append(coffeeProfilerSlide);

    const questionLabel = document.createElement('h3');
    questionLabel.classList.add('question-label');
    questionLabel.textContent = questionCell.textContent.trim();
    coffeeProfilerSlide.append(questionLabel);

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');
    // The options-count--X class should reflect the actual number of options for *this* slide.
    // Since options are currently global, we'll use the global count, but ideally this would be per slide.
    optionsContainer.classList.add(`options-count--${options.length}`);
    coffeeProfilerSlide.append(optionsContainer);

    options.forEach((optionRow) => {
      const [iconCell, labelCell] = [...optionRow.children];

      const optionButton = document.createElement('button');
      optionButton.classList.add(
        'option',
        'elevation-2',
        'has-hover',
        'bg--paper-white',
      );
      optionButton.setAttribute('role', 'radio');
      optionButton.setAttribute('aria-checked', 'false');
      optionButton.setAttribute('disabled', 'disabled'); // Default state as per original HTML
      moveInstrumentation(optionRow, optionButton);
      optionsContainer.append(optionButton);

      const optionIconPicture = iconCell.querySelector('picture');
      if (optionIconPicture) {
        const optionIconImg = optionIconPicture.querySelector('img');
        if (optionIconImg) {
          const optimizedPic = createOptimizedPicture(
            optionIconImg.src,
            optionIconImg.alt,
            false,
            [{ width: '750' }],
          );
          const newImg = optimizedPic.querySelector('img');
          newImg.classList.add('option-icon', 'lazyload');
          optionButton.append(optimizedPic);
          moveInstrumentation(optionIconImg, newImg);
        }
      }

      const optionLabel = document.createElement('span');
      optionLabel.classList.add('option-label', 'labelMediumRegular');
      optionLabel.textContent = labelCell.textContent.trim();
      optionButton.append(optionLabel);

      // Add event listener for option buttons
      optionButton.addEventListener('click', () => {
        // Deselect all other options in this container
        optionsContainer.querySelectorAll('.option').forEach((btn) => {
          btn.setAttribute('aria-checked', 'false');
          btn.classList.remove('selected'); // Assuming a 'selected' class for styling
        });
        // Select this option
        optionButton.setAttribute('aria-checked', 'true');
        optionButton.classList.add('selected');
        // Enable next button if an option is selected
        nextButton.removeAttribute('disabled');
        nextButton.setAttribute('aria-disabled', 'false');
      });
    });

    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid-container');
    swiperSlide.append(gridContainer);

    const gridX = document.createElement('div');
    gridX.classList.add('grid-x');
    gridContainer.append(gridX);
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
  swiperControls.append(prevButton);

  const prevImg = document.createElement('img');
  prevImg.src = '/content/dam/aemigrate/uploaded-folder/image/1777158291586.svg+xml';
  prevImg.alt = 'svg file';
  prevButton.append(prevImg);

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
  nextButton.setAttribute('disabled', 'disabled'); // Default state as per original HTML
  swiperControls.append(nextButton);

  const nextImg = document.createElement('img');
  nextImg.src = '/content/dam/aemigrate/uploaded-folder/image/1777158291645.svg+xml';
  nextImg.alt = 'svg file';
  nextButton.append(nextImg);

  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');
  swiper.append(swiperNotification);

  // Error Message
  const errorMessageDiv = document.createElement('div');
  errorMessageDiv.classList.add('error-message');
  errorMessageDiv.setAttribute('data-default-message', 'Error! Please try again.');
  block.append(errorMessageDiv);

  const errorMessageText = document.createElement('span');
  errorMessageText.classList.add('error-message-text', 'bodyLargeRegular');
  errorMessageText.textContent = errorMessageRow.textContent.trim();
  moveInstrumentation(errorMessageRow, errorMessageText);
  errorMessageDiv.append(errorMessageText);

  // Form
  const form = document.createElement('form');
  form.classList.add('hide', 'coffee-profiler-form');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', 'https://www.nescafe.com/in/coffee-profiler/result');
  block.append(form);

  const createHiddenInput = (name) => {
    const input = document.createElement('input');
    input.setAttribute('name', name);
    input.setAttribute('value', '');
    input.setAttribute('type', 'hidden');
    return input;
  };

  form.append(createHiddenInput('type'));
  form.append(createHiddenInput('intensity'));
  form.append(createHiddenInput('format'));
  form.append(createHiddenInput('features'));
  form.append(createHiddenInput('exc-type'));
  form.append(createHiddenInput('exc-intensity'));
  form.append(createHiddenInput('exc-format'));
  form.append(createHiddenInput('exc-features'));

  // Dummy elements to load background images
  const dummyBgPaperBlue = document.createElement('div');
  dummyBgPaperBlue.classList.add('bg--paper-blue', 'dummy-to-load-bg');
  block.prepend(dummyBgPaperBlue);

  const dummyBgPaperWhiteHeavy = document.createElement('div');
  dummyBgPaperWhiteHeavy.classList.add('bg--paper-white-heavy', 'dummy-to-load-bg');
  block.prepend(dummyBgPaperWhiteHeavy);

  // Swiper navigation logic (simplified for review, full Swiper integration would be more complex)
  let currentSlideIndex = 0;

  const updateSwiperControls = () => {
    prevButton.disabled = currentSlideIndex === 0;
    prevButton.setAttribute('aria-disabled', currentSlideIndex === 0);
    prevButton.classList.toggle('swiper-button-disabled', currentSlideIndex === 0);

    nextButton.disabled = currentSlideIndex === slides.length - 1;
    nextButton.setAttribute('aria-disabled', currentSlideIndex === slides.length - 1);
    nextButton.classList.toggle('swiper-button-disabled', currentSlideIndex === slides.length - 1);

    // Disable next button if no option is selected on the current slide
    const currentSlideElement = swiperWrapper.querySelector(`[data-slide-index="${currentSlideIndex}"]`);
    const selectedOption = currentSlideElement?.querySelector('.option[aria-checked="true"]');
    if (!selectedOption && currentSlideIndex < slides.length - 1) {
      nextButton.disabled = true;
      nextButton.setAttribute('aria-disabled', 'true');
      nextButton.classList.add('swiper-button-disabled');
    }
  };

  const goToSlide = (index) => {
    if (index >= 0 && index < slides.length) {
      currentSlideIndex = index;
      swiperWrapper.style.transform = `translate3d(-${currentSlideIndex * 100}%, 0px, 0px)`; // Simplified transform
      swiperWrapper.querySelectorAll('.swiper-slide').forEach((slide, i) => {
        slide.classList.remove('swiper-slide-active', 'swiper-slide-next');
        if (i === currentSlideIndex) {
          slide.classList.add('swiper-slide-active');
        } else if (i === currentSlideIndex + 1) {
          slide.classList.add('swiper-slide-next');
        }
      });
      updateSwiperControls();
    }
  };

  prevButton.addEventListener('click', () => {
    goToSlide(currentSlideIndex - 1);
  });

  nextButton.addEventListener('click', () => {
    goToSlide(currentSlideIndex + 1);
  });

  // Initialize controls state
  updateSwiperControls();
}
