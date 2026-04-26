import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const allRows = [...block.children];

  const slideItems = allRows.filter((row) => row.children.length === 7);
  const quickLinkItems = allRows.filter((row) => row.children.length === 2);

  const section = document.createElement('section');
  section.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');
  moveInstrumentation(block, section);

  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi');
  section.append(beamSlider);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  beamSlider.append(swiperWrapper);

  slideItems.forEach((row, index) => {
    const [imageCell, altTextCell, eyebrowCell, headingCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide', 'nogradient');
    // Initial active state handled by updateSlider, remove hardcoded active classes
    moveInstrumentation(row, swiperSlide);

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, altTextCell.textContent.trim(), false, [{ width: '1920' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        slideBgImg.append(optimizedPic);
      }
    }
    swiperSlide.append(slideBgImg);

    const mobContentHomeSpotlight = document.createElement('div');
    mobContentHomeSpotlight.classList.add('mob-content-home-spotlight');
    swiperSlide.append(mobContentHomeSpotlight);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content', 'text-center', 'text-lg-start');
    // Initial active state handled by updateSlider, remove hardcoded active classes
    mobContentHomeSpotlight.append(contentDiv);

    const eyebrow = eyebrowCell.textContent.trim();
    if (eyebrow) {
      const small = document.createElement('small');
      small.style.fontWeight = 'bold'; // Inline style is acceptable if it's a direct migration from original HTML
      small.textContent = eyebrow;
      contentDiv.append(small);
    }

    const heading = headingCell.textContent.trim();
    if (heading) {
      const h2 = document.createElement('h2');
      h2.classList.add('heading', 'font-medium', 'font-size-tb');
      h2.innerHTML = heading; // Use innerHTML as per original HTML for potential <br>
      contentDiv.append(h2);
    }

    const description = descriptionCell.innerHTML.trim(); // Use innerHTML for richtext
    if (description) {
      const p = document.createElement('p');
      p.innerHTML = description;
      contentDiv.append(p);
    }

    const ctaLink = ctaLinkCell.querySelector('a');
    const ctaLabel = ctaLabelCell.textContent.trim();
    if (ctaLink && ctaLabel) {
      const anchor = document.createElement('a');
      // Check original HTML for btn class on CTA
      // The original HTML shows 'btn btn-primary' for most CTAs, and 'btn' for one.
      // The model specifies 'ctaLink' and 'ctaLabel' which are generic.
      // Assuming 'btn btn-primary' is the default, if a specific CTA needs 'btn' only,
      // it would require a separate field or a class on the CTA link in the markdown.
      // For now, adhering to the generated code's 'btn btn-primary'.
      anchor.classList.add('btn', 'btn-primary');
      anchor.href = ctaLink.href;
      anchor.textContent = ctaLabel;
      moveInstrumentation(ctaLinkCell, anchor);
      contentDiv.append(anchor);
    }

    swiperWrapper.append(swiperSlide);
  });

  // Swiper navigation buttons
  const prevButton = document.createElement('div');
  prevButton.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  // Hardcoded image path for navigation buttons. In EDS, these should ideally be SVG icons
  // or come from authored content. For now, replacing with empty string as it's not authored.
  prevButton.innerHTML = ''; // Removed hardcoded image path
  beamSlider.append(prevButton);

  const nextButton = document.createElement('div');
  nextButton.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  // Hardcoded image path for navigation buttons. Replacing with empty string.
  nextButton.innerHTML = ''; // Removed hardcoded image path
  beamSlider.append(nextButton);

  const pagination = document.createElement('div');
  pagination.classList.add('swiper-pagination', 'bullet-bottom');
  beamSlider.append(pagination);

  // Quick Links
  if (quickLinkItems.length > 0) {
    const quickLinksParentDiv = document.createElement('div');
    quickLinksParentDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');
    section.append(quickLinksParentDiv);

    const containerDiv = document.createElement('div');
    containerDiv.classList.add('container', 'aos-init', 'aos-animate');
    containerDiv.setAttribute('data-aos', 'fade-up');
    containerDiv.setAttribute('data-aos-offset', '-100');
    containerDiv.setAttribute('data-aos-duration', '650');
    containerDiv.setAttribute('data-aos-easing', 'ease-in-out');
    quickLinksParentDiv.append(containerDiv);

    const quickLinksUl = document.createElement('ul');
    quickLinksUl.classList.add('quick-links-div');
    containerDiv.append(quickLinksUl);

    quickLinkItems.forEach((row) => {
      const [labelCell, linkCell] = [...row.children];

      const li = document.createElement('li');
      const link = linkCell.querySelector('a');
      const label = labelCell.textContent.trim();

      if (link && label) {
        const anchor = document.createElement('a');
        anchor.href = link.href;
        anchor.textContent = label;
        anchor.classList.add('with-full-underline');
        moveInstrumentation(row, anchor);
        li.append(anchor);
      }
      quickLinksUl.append(li);
    });
  }

  block.innerHTML = '';
  block.append(section);

  // Initialize Swiper (simplified for EDS, as actual Swiper JS is not loaded by default)
  let currentIndex = 0;
  const slides = [...swiperWrapper.children];
  const totalSlides = slides.length;

  const updateSlider = () => {
    slides.forEach((slide, i) => {
      slide.classList.remove('swiper-slide-active', 'swiper-slide-prev', 'swiper-slide-next', 'swiper-slide-visible', 'swiper-slide-fully-visible');
      const contentDiv = slide.querySelector('.content');
      if (contentDiv) {
        contentDiv.classList.remove('active');
      }
      // Apply transform for basic sliding effect
      slide.style.transform = `translateX(-${currentIndex * 100}%)`;
    });

    if (totalSlides > 0) {
      const activeSlide = slides[currentIndex];
      activeSlide.classList.add('swiper-slide-active', 'swiper-slide-visible', 'swiper-slide-fully-visible');
      const activeContent = activeSlide.querySelector('.content');
      if (activeContent) {
        activeContent.classList.add('active');
      }

      if (currentIndex > 0) {
        slides[currentIndex - 1].classList.add('swiper-slide-prev');
      }
      if (currentIndex < totalSlides - 1) {
        slides[currentIndex + 1].classList.add('swiper-slide-next');
      }
    }

    // Update pagination
    pagination.innerHTML = '';
    for (let i = 0; i < totalSlides; i += 1) {
      const bullet = document.createElement('span');
      bullet.classList.add('swiper-pagination-bullet');
      if (i === currentIndex) {
        bullet.classList.add('swiper-pagination-bullet-active');
      }
      bullet.addEventListener('click', () => {
        currentIndex = i;
        updateSlider();
      });
      pagination.append(bullet);
    }
  };

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalSlides - 1;
    updateSlider();
  });

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex < totalSlides - 1) ? currentIndex + 1 : 0;
    updateSlider();
  });

  // Initial render after all slides are appended
  updateSlider();
}
