import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Fixed fields
  const [
    backgroundImageRow,
    headingRow,
    greetingMorningRow,
    greetingAfternoonRow,
    greetingEveningRow,
    greetingNightRow,
    guideTextRow,
    errorMessageRow,
  ] = children.slice(0, 8);

  const backgroundImage = backgroundImageRow.querySelector('picture');
  const heading = headingRow.textContent.trim();
  const greetingMorning = greetingMorningRow.textContent.trim();
  const greetingAfternoon = greetingAfternoonRow.textContent.trim();
  const greetingEvening = greetingEveningRow.textContent.trim();
  const greetingNight = greetingNightRow.textContent.trim();
  const guideText = guideTextRow.textContent.trim();
  const errorMessage = errorMessageRow.textContent.trim();

  // Item rows
  const itemRows = children.slice(8);

  const slides = [];
  const options = [];

  itemRows.forEach((row) => {
    if (row.children.length === 4) { // profiler-slide
      const [questionIdCell, questionLabelCell, questionFilterCell] = [...row.children];
      slides.push({
        questionId: questionIdCell.textContent.trim(),
        questionLabel: questionLabelCell.textContent.trim(),
        questionFilter: questionFilterCell.textContent.trim(),
        options: [], // Will be populated later
      });
      moveInstrumentation(row, document.createElement('div')); // Move instrumentation for profiler-slide row
    } else if (row.children.length === 8) { // profiler-option
      const [
        optionIdCell,
        questionIdCell,
        optionLabelCell,
        optionIconCell,
        optionFilterValsCell,
        optionFilterCell,
        optionExcFilterCell,
        optionAriaLabelCell,
      ] = [...row.children];

      const optionIconPicture = optionIconCell.querySelector('picture');
      const optionIconImg = optionIconPicture ? optionIconPicture.querySelector('img') : null;

      options.push({
        optionId: optionIdCell.textContent.trim(),
        questionId: questionIdCell.textContent.trim(),
        optionLabel: optionLabelCell.textContent.trim(),
        optionIcon: optionIconImg ? createOptimizedPicture(optionIconImg.src, optionIconImg.alt, false, [{ width: '750' }]) : null,
        optionFilterVals: optionFilterValsCell.textContent.trim(),
        optionFilter: optionFilterCell.textContent.trim(),
        optionExcFilter: optionExcFilterCell.textContent.trim(),
        optionAriaLabel: optionAriaLabelCell.textContent.trim(),
      });
      moveInstrumentation(row, document.createElement('div')); // Move instrumentation for profiler-option row
    }
  });

  // Populate options into slides
  slides.forEach((slide) => {
    slide.options = options.filter((option) => option.questionId === slide.questionId);
  });

  block.innerHTML = ''; // Clear the block

  const section = document.createElement('section');
  section.classList.add('grid-container', 'coffee-profiler', 'animate-enter', 'in-view');
  section.setAttribute('data-api-url', 'https://www.nescafe.com/in/nc/cprofiler-status'); // Hardcoded as per original HTML

  const bgPaperBlue = document.createElement('div');
  bgPaperBlue.classList.add('bg--paper-blue', 'dummy-to-load-bg');
  section.append(bgPaperBlue);

  const bgPaperWhiteHeavy = document.createElement('div');
  bgPaperWhiteHeavy.classList.add('bg--paper-white-heavy', 'dummy-to-load-bg');
  section.append(bgPaperWhiteHeavy);

  const parallaxBgImgContainer = document.createElement('div');
  parallaxBgImgContainer.classList.add('parallax-bg-img-container');
  const parallaxImg = document.createElement('div');
  parallaxImg.classList.add('parallax-img', 'lazyLoadedImage');
  if (backgroundImage) {
    const optimizedPic = createOptimizedPicture(backgroundImage.querySelector('img').src, backgroundImage.querySelector('img').alt, false, [{ width: '2000' }]);
    parallaxImg.style.backgroundImage = `url(${optimizedPic.querySelector('img').src})`;
    moveInstrumentation(backgroundImage, optimizedPic.querySelector('img'));
  }
  parallaxBgImgContainer.append(parallaxImg);
  section.append(parallaxBgImgContainer);

  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.classList.add('max-width-container', 'grid-x');

  const headerCell = document.createElement('div');
  headerCell.classList.add('cell', 'small-12', 'medium-offset-1', 'medium-10', 'xlarge-offset-2', 'xlarge-8', 'padding-x');

  const h2 = document.createElement('h2');
  h2.classList.add('heading', 'animate-enter-fade-up-short', 'animate-delay-3');
  h2.textContent = heading;
  headerCell.append(h2);

  const introInfo = document.createElement('div');
  introInfo.classList.add('intro-info', 'animate-enter-fade', 'animate-delay-1', 'no-avatar-image');

  const greetingsContainer = document.createElement('div');
  greetingsContainer.classList.add('greetings-container', 'headline-h4', 'animate-enter-fade-up-short', 'animate-delay-3', 'stagger-1');

  const greetingMorningSpan = document.createElement('span');
  greetingMorningSpan.classList.add('hide', 'greeting--morning');
  greetingMorningSpan.textContent = greetingMorning;
  greetingsContainer.append(greetingMorningSpan);

  const greetingAfternoonSpan = document.createElement('span');
  greetingAfternoonSpan.classList.add('greeting--afternoon');
  greetingAfternoonSpan.textContent = greetingAfternoon;
  greetingsContainer.append(greetingAfternoonSpan);

  const greetingEveningSpan = document.createElement('span');
  greetingEveningSpan.classList.add('hide', 'greeting--evening');
  greetingEveningSpan.textContent = greetingEvening;
  greetingsContainer.append(greetingEveningSpan);

  const greetingNightSpan = document.createElement('span');
  greetingNightSpan.classList.add('hide', 'greeting--night');
  greetingNightSpan.textContent = greetingNight;
  greetingsContainer.append(greetingNightSpan);

  introInfo.append(greetingsContainer);

  const guideTextDiv = document.createElement('div');
  guideTextDiv.classList.add('guide-text', 'labelMediumRegular', 'animate-enter-fade-up-short', 'animate-delay-6');
  guideTextDiv.textContent = guideText;
  introInfo.append(guideTextDiv);

  headerCell.append(introInfo);
  maxWidthContainer.append(headerCell);

  const paginationCell = document.createElement('div');
  paginationCell.classList.add('cell', 'small-12', 'medium-offset-1', 'medium-10', 'xlarge-offset-2', 'xlarge-8', 'swiper-pagination-container', 'padding-x', 'animate-enter-fade-up-short', 'animate-delay-15');
  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'swiper-pagination-progressbar', 'swiper-pagination-horizontal');
  const swiperPaginationFill = document.createElement('span');
  swiperPaginationFill.classList.add('swiper-pagination-progressbar-fill');
  swiperPagination.append(swiperPaginationFill);
  paginationCell.append(swiperPagination);
  maxWidthContainer.append(paginationCell);

  const swiperWrapperCell = document.createElement('div');
  swiperWrapperCell.classList.add('cell', 'small-12');
  const swiper = document.createElement('div');
  swiper.classList.add('swiper', 'coffee-profiler-swiper', 'swiper-initialized', 'swiper-horizontal', 'swiper-backface-hidden');
  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperWrapper.setAttribute('aria-live', 'polite');

  slides.forEach((slide, index) => {
    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide');
    if (index === 0) {
      swiperSlide.classList.add('initial-slide', 'swiper-slide-active');
    } else if (index === 1) {
      swiperSlide.classList.add('swiper-slide-next');
    }
    if (index === slides.length - 1) {
      swiperSlide.classList.add('last-slide');
    }
    swiperSlide.setAttribute('data-slide-index', index);
    swiperSlide.setAttribute('aria-label', `${index + 1} / ${slides.length}`);

    const slideTypeNo = document.createElement('div');
    slideTypeNo.classList.add('slide-type--no');
    const coffeeProfilerSlideNo = document.createElement('div');
    coffeeProfilerSlideNo.classList.add('coffee-profiler-slide', 'animate-enter-fade-up-short', 'animate-delay-7');
    coffeeProfilerSlideNo.setAttribute('data-q-id', slide.questionId);
    coffeeProfilerSlideNo.setAttribute('data-slide-index', index);
    coffeeProfilerSlideNo.setAttribute('data-q-filter', slide.questionFilter);

    const questionLabelNo = document.createElement('h3');
    questionLabelNo.classList.add('question-label');
    questionLabelNo.textContent = slide.questionLabel;
    coffeeProfilerSlideNo.append(questionLabelNo);

    const optionsContainerNo = document.createElement('div');
    optionsContainerNo.classList.add('options-container', `options-count--${slide.options.length}`);

    slide.options.forEach((option) => {
      const button = document.createElement('button');
      button.classList.add('option', 'elevation-2', 'has-hover', 'bg--paper-white');
      button.setAttribute('data-opt-id', option.optionId);
      button.setAttribute('data-q-id', option.questionId);
      button.setAttribute('data-opt-filter-vals', option.optionFilterVals);
      button.setAttribute('data-opt-filter', option.optionFilter);
      button.setAttribute('data-opt-exc-filter', option.optionExcFilter);
      button.setAttribute('aria-label', option.optionAriaLabel);
      button.setAttribute('role', 'radio');
      button.setAttribute('aria-checked', 'false');

      if (option.optionIcon) {
        const optionIconImg = option.optionIcon.querySelector('img');
        if (optionIconImg) {
          optionIconImg.classList.add('option-icon', 'lazyloaded');
          button.append(optionIconImg);
        }
      }

      const optionLabelSpan = document.createElement('span');
      optionLabelSpan.classList.add('option-label', 'labelMediumRegular');
      optionLabelSpan.textContent = option.optionLabel;
      button.append(optionLabelSpan);
      optionsContainerNo.append(button);
    });
    coffeeProfilerSlideNo.append(optionsContainerNo);
    slideTypeNo.append(coffeeProfilerSlideNo);
    swiperSlide.append(slideTypeNo);

    // Add slide-type--yes div as per original HTML, initially hidden
    const slideTypeYes = document.createElement('div');
    slideTypeYes.classList.add('slide-type--yes', 'hide');
    // For simplicity, we are duplicating the slide content for 'yes' type for now.
    // In a real scenario, this would likely involve different content based on the model.
    const coffeeProfilerSlideYes = coffeeProfilerSlideNo.cloneNode(true); // Clone for now
    slideTypeYes.append(coffeeProfilerSlideYes);
    swiperSlide.append(slideTypeYes);

    swiperWrapper.append(swiperSlide);
  });

  swiper.append(swiperWrapper);

  const swiperControls = document.createElement('div');
  swiperControls.classList.add('swiper-controls', 'animate-enter-fade', 'animate-delay-15');

  const prevButton = document.createElement('button');
  prevButton.classList.add('swiper-control', 'swiper-button', 'swiper-control--prev', 'elevation-1', 'animate-enter-fade-right-short', 'animate-delay-15', 'swiper-button-disabled');
  prevButton.setAttribute('disabled', '');
  prevButton.setAttribute('tabindex', '-1');
  prevButton.setAttribute('aria-label', 'Previous slide');
  prevButton.setAttribute('aria-controls', 'swiper-wrapper-ca5cea13d5f9a0d3'); // Placeholder ID
  prevButton.setAttribute('aria-disabled', 'true');
  const prevImg = document.createElement('img');
  prevImg.alt = 'svg file';
  prevImg.src = '/content/dam/aemigrate/uploaded-folder/image/1777190876865.svg+xml'; // Placeholder src
  prevButton.append(prevImg);
  swiperControls.append(prevButton);

  const nextButton = document.createElement('button');
  nextButton.classList.add('swiper-control', 'swiper-button', 'swiper-control--next', 'elevation-1', 'animate-enter-fade-left-short', 'animate-delay-15');
  nextButton.setAttribute('tabindex', '0');
  nextButton.setAttribute('aria-label', 'Next slide');
  nextButton.setAttribute('aria-controls', 'swiper-wrapper-ca5cea13d5f9a0d3'); // Placeholder ID
  nextButton.setAttribute('aria-disabled', 'false');
  nextButton.setAttribute('disabled', 'disabled'); // Initially disabled
  const nextImg = document.createElement('img');
  nextImg.alt = 'svg file';
  nextImg.src = '/content/dam/aemigrate/uploaded-folder/image/1777190876910.svg+xml'; // Placeholder src
  nextButton.append(nextImg);
  swiperControls.append(nextButton);

  swiper.append(swiperControls);

  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');
  swiper.append(swiperNotification);

  swiperWrapperCell.append(swiper);
  maxWidthContainer.append(swiperWrapperCell);
  section.append(maxWidthContainer);

  const errorMessageDiv = document.createElement('div');
  errorMessageDiv.classList.add('error-message');
  errorMessageDiv.setAttribute('data-default-message', errorMessage);
  const errorMessageText = document.createElement('span');
  errorMessageText.classList.add('error-message-text', 'bodyLargeRegular');
  errorMessageText.textContent = errorMessage;
  errorMessageDiv.append(errorMessageText);
  section.append(errorMessageDiv);

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://www.nescafe.com/in/coffee-profiler/result'; // Hardcoded as per original HTML
  form.classList.add('hide', 'coffee-profiler-form');

  const inputType = document.createElement('input');
  inputType.name = 'type';
  inputType.value = '';
  inputType.type = 'hidden';
  form.append(inputType);

  const inputIntensity = document.createElement('input');
  inputIntensity.name = 'intensity';
  inputIntensity.value = '';
  inputIntensity.type = 'hidden';
  form.append(inputIntensity);

  const inputFormat = document.createElement('input');
  inputFormat.name = 'format';
  inputFormat.value = '';
  inputFormat.type = 'hidden';
  form.append(inputFormat);

  const inputFeatures = document.createElement('input');
  inputFeatures.name = 'features';
  inputFeatures.value = '';
  inputFeatures.type = 'hidden';
  form.append(inputFeatures);

  const inputExcType = document.createElement('input');
  inputExcType.name = 'exc-type';
  inputExcType.value = '';
  inputExcType.type = 'hidden';
  form.append(inputExcType);

  const inputExcIntensity = document.createElement('input');
  inputExcIntensity.name = 'exc-intensity';
  inputExcIntensity.value = '';
  inputExcIntensity.type = 'hidden';
  form.append(inputExcIntensity);

  const inputExcFormat = document.createElement('input');
  inputExcFormat.name = 'exc-format';
  inputExcFormat.value = '';
  inputExcFormat.type = 'hidden';
  form.append(inputExcFormat);

  const inputExcFeatures = document.createElement('input');
  inputExcFeatures.name = 'exc-features';
  inputExcFeatures.value = '';
  inputExcFeatures.type = 'hidden';
  form.append(inputExcFeatures);

  section.append(form);

  block.append(section);

  // Swiper initialization (simplified for EDS)
  let currentSlideIndex = 0;
  const allSlides = swiperWrapper.querySelectorAll('.swiper-slide');

  const updateSwiper = () => {
    allSlides.forEach((slide, idx) => {
      slide.classList.remove('swiper-slide-active', 'swiper-slide-next');
      if (idx === currentSlideIndex) {
        slide.classList.add('swiper-slide-active');
      } else if (idx === currentSlideIndex + 1) {
        slide.classList.add('swiper-slide-next');
      }
      slide.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    });

    prevButton.classList.toggle('swiper-button-disabled', currentSlideIndex === 0);
    prevButton.disabled = currentSlideIndex === 0;
    prevButton.setAttribute('aria-disabled', currentSlideIndex === 0);

    nextButton.classList.toggle('swiper-button-disabled', currentSlideIndex === allSlides.length - 1);
    nextButton.disabled = currentSlideIndex === allSlides.length - 1;
    nextButton.setAttribute('aria-disabled', currentSlideIndex === allSlides.length - 1);

    const progress = (currentSlideIndex + 1) / allSlides.length;
    swiperPaginationFill.style.transform = `translate3d(0px, 0px, 0px) scaleX(${progress}) scaleY(1)`;
  };

  prevButton.addEventListener('click', () => {
    if (currentSlideIndex > 0) {
      currentSlideIndex--;
      updateSwiper();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentSlideIndex < allSlides.length - 1) {
      currentSlideIndex++;
      updateSwiper();
    }
  });

  // Initial update
  updateSwiper();

  // Handle option selection
  block.querySelectorAll('.option').forEach((optionButton) => {
    optionButton.addEventListener('click', () => {
      // Remove 'aria-checked' from all options for the current question
      const currentQuestionId = optionButton.getAttribute('data-q-id');
      block.querySelectorAll(`button[data-q-id="${currentQuestionId}"]`).forEach((btn) => {
        btn.setAttribute('aria-checked', 'false');
      });

      // Set 'aria-checked' for the selected option
      optionButton.setAttribute('aria-checked', 'true');

      // Enable next button if an option is selected for the current slide
      const currentSlideOptions = allSlides[currentSlideIndex].querySelectorAll('.option');
      const anyOptionSelected = Array.from(currentSlideOptions).some(
        (btn) => btn.getAttribute('aria-checked') === 'true',
      );
      if (anyOptionSelected) {
        nextButton.disabled = false;
        nextButton.classList.remove('swiper-button-disabled');
        nextButton.setAttribute('aria-disabled', 'false');
      } else {
        nextButton.disabled = true;
        nextButton.classList.add('swiper-button-disabled');
        nextButton.setAttribute('aria-disabled', 'true');
      }
    });
  });

  // Example of greeting logic (based on current time)
  const updateGreeting = () => {
    const now = new Date();
    const hour = now.getHours();

    block.querySelectorAll('.greetings-container span').forEach((span) => span.classList.add('hide'));

    if (hour >= 5 && hour < 12) {
      greetingMorningSpan.classList.remove('hide');
    } else if (hour >= 12 && hour < 17) {
      greetingAfternoonSpan.classList.remove('hide');
    } else if (hour >= 17 && hour < 21) {
      greetingEveningSpan.classList.remove('hide');
    } else {
      greetingNightSpan.classList.remove('hide');
    }
  };

  updateGreeting();
}
