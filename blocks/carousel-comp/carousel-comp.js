import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('cmp-carousel__content');
  carouselWrapper.setAttribute('aria-atomic', 'false');
  carouselWrapper.setAttribute('aria-live', 'polite');

  const indicators = document.createElement('ol');
  indicators.classList.add('cmp-carousel__indicators');
  indicators.setAttribute('role', 'tablist');
  indicators.setAttribute('aria-label', 'Choose a slide to display');

  const slides = [...block.children];
  let currentSlide = 0;
  const totalSlides = slides.length;

  slides.forEach((slide, index) => {
    const cells = [...slide.children];

    // Content detection for image cells
    const desktopImageCell = cells.find(cell => cell.querySelector('picture') && cell.querySelector('.desktop-image'));
    const tabletImageCell = cells.find(cell => cell.querySelector('picture') && cell.querySelector('.tablet-image'));
    const mobileImageCell = cells.find(cell => cell.querySelector('picture') && cell.querySelector('.mobile-image'));
    const imageLinkCell = cells.find(cell => cell.querySelector('a') && cell.textContent.includes('/content/site/imageLink')); // Specific for aem-content type
    
    // Text and Richtext cells are more straightforward if their content is unique or they are at fixed positions after images/links
    // Based on the EDS structure, these are at fixed positions after the image/link cells.
    const bannerEyebrowTextCell = cells[4];
    const bannerPriceInfoCell = cells[5];
    const bannerTitleCell = cells[6];
    const bannerSubtitleCell = cells[7];
    const bannerDescriptionCell = cells[8];
    // The 'bannerCtas' is a container field, its items are separate rows, not a single cell here.
    // The remaining cells are CTA rows.
    const ctaRows = cells.slice(9);


    const item = document.createElement('div');
    item.classList.add('cmp-carousel__item');
    if (index === 0) {
      item.classList.add('cmp-carousel__item--active');
    }
    item.setAttribute('role', 'tabpanel');
    item.setAttribute('aria-roledescription', 'slide');
    item.setAttribute('aria-label', `Slide ${index + 1} of ${totalSlides}`);
    item.setAttribute('aria-hidden', index !== 0);

    const bannerComp = document.createElement('div');
    bannerComp.classList.add('banner', 'hero-banner', 'content-opacity', 'banner-height-auto', 'content-hpos-left', 'content-vpos-bottom', 'text-alignment-left', 'desktop-large-text', 'banner-comp');

    const bannerImageDiv = document.createElement('div');
    bannerImageDiv.classList.add('banner-image');
    const populateBannerImageDiv = document.createElement('div');
    populateBannerImageDiv.classList.add('populate-banner-image');

    const picture = document.createElement('picture');
    const mobileSource = document.createElement('source');
    mobileSource.classList.add('mobile-image');
    mobileSource.setAttribute('media', '(max-width:767px)');
    const mobileImg = mobileImageCell?.querySelector('img');
    if (mobileImg) mobileSource.setAttribute('srcset', createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '767' }]).querySelector('img').src);

    const tabletSource = document.createElement('source');
    tabletSource.classList.add('tablet-image');
    tabletSource.setAttribute('media', '(max-width:992px)');
    const tabletImg = tabletImageCell?.querySelector('img');
    if (tabletImg) tabletSource.setAttribute('srcset', createOptimizedPicture(tabletImg.src, tabletImg.alt, false, [{ width: '992' }]).querySelector('img').src);

    const desktopImg = desktopImageCell?.querySelector('img');
    const img = document.createElement('img');
    img.classList.add('desktop-image', 'show-img');
    if (desktopImg) {
      img.src = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '1920' }]).querySelector('img').src;
      img.alt = desktopImg.alt;
      img.title = desktopImg.title || desktopImg.alt;
    }

    picture.append(mobileSource, tabletSource, img);

    const imageLink = imageLinkCell?.querySelector('a');
    if (imageLink) {
      const linkWrapper = document.createElement('a');
      linkWrapper.setAttribute('data-url', imageLink.href);
      linkWrapper.appendChild(picture);
      populateBannerImageDiv.appendChild(linkWrapper);
    } else {
      populateBannerImageDiv.appendChild(picture);
    }

    bannerImageDiv.appendChild(populateBannerImageDiv);

    const bannerTextContainer = document.createElement('div');
    bannerTextContainer.classList.add('banner-text-container', 'content-bg-black', 'mob-content-bg-black', 'hc-opacity');

    const bannerContent = document.createElement('div');
    bannerContent.classList.add('banner-content');

    const bannerIndexDiv = document.createElement('div');
    bannerIndexDiv.classList.add('banner-index');

    const eyebrowText = bannerEyebrowTextCell?.textContent.trim();
    if (eyebrowText) {
      const h6Eyebrow = document.createElement('h6');
      h6Eyebrow.classList.add('banner-eyebrow-text');
      h6Eyebrow.textContent = eyebrowText;
      bannerIndexDiv.appendChild(h6Eyebrow);
    }

    const priceInfo = bannerPriceInfoCell?.textContent.trim();
    if (priceInfo) {
      const h5Price = document.createElement('h5');
      h5Price.classList.add('banner-price-info');
      h5Price.textContent = priceInfo;
      bannerIndexDiv.appendChild(h5Price);
    }

    const title = bannerTitleCell?.textContent.trim();
    if (title) {
      const h5Title = document.createElement('h5');
      h5Title.classList.add('banner-title');
      h5Title.textContent = title;
      bannerIndexDiv.appendChild(h5Title);
    }

    const subtitle = bannerSubtitleCell?.textContent.trim();
    if (subtitle) {
      const h3Subtitle = document.createElement('h3');
      h3Subtitle.classList.add('banner-subtitle', 'banner-solid');
      h3Subtitle.textContent = subtitle;
      bannerIndexDiv.appendChild(h3Subtitle);
    }

    const description = bannerDescriptionCell?.innerHTML.trim();
    if (description) {
      const descriptionDiv = document.createElement('div');
      descriptionDiv.classList.add('banner-description');
      descriptionDiv.innerHTML = description;
      bannerIndexDiv.appendChild(descriptionDiv);
    }

    bannerContent.appendChild(bannerIndexDiv);

    const ctaGroup = document.createElement('div');
    ctaGroup.classList.add('banner-cta-group', 'cta');

    // Process CTA rows
    ctaRows.forEach((ctaRow) => {
      const ctaCells = [...ctaRow.children];
      const ctaLinkCell = ctaCells.find(cell => cell.querySelector('a'));
      const ctaLabelCell = ctaCells.find(cell => !cell.querySelector('a') && cell.textContent.trim() !== '' && cell.textContent.trim().toLowerCase() !== 'button' && cell.textContent.trim().toLowerCase() !== 'link');
      const ctaTypeCell = ctaCells.find(cell => cell.textContent.trim().toLowerCase() === 'button' || cell.textContent.trim().toLowerCase() === 'link');

      const ctaLink = ctaLinkCell?.querySelector('a');
      const ctaLabel = ctaLabelCell?.textContent.trim();
      const ctaType = ctaTypeCell?.textContent.trim();

      if (ctaLink && ctaLabel) {
        const ctaAnchor = document.createElement('a');
        ctaAnchor.href = ctaLink.href;
        ctaAnchor.classList.add('banner-index');
        ctaAnchor.setAttribute('aria-label', ctaLabel);

        const ctaButton = document.createElement('button');
        ctaButton.classList.add('cta-btn', 'right-icon');
        ctaButton.setAttribute('tabindex', '-1');

        const ctaSpan = document.createElement('span');
        ctaSpan.classList.add('cta-label');
        ctaSpan.textContent = ctaLabel;
        ctaButton.appendChild(ctaSpan);

        const arrowIcon = document.createElement('span');
        arrowIcon.classList.add('icon-Arrow-Right');
        ctaButton.appendChild(arrowIcon);

        if (ctaType?.toLowerCase() === 'button') {
          ctaAnchor.classList.add('cta-to-button', 'cta1');
          ctaButton.classList.add('blue');
          ctaAnchor.setAttribute('role', 'button');
        } else {
          ctaAnchor.classList.add('cta-to-link', 'cta2');
          ctaButton.classList.add('white');
        }

        ctaAnchor.appendChild(ctaButton);
        ctaGroup.appendChild(ctaAnchor);
        moveInstrumentation(ctaRow, ctaAnchor);
      }
    });

    if (ctaGroup.children.length > 0) {
      bannerContent.appendChild(ctaGroup);
    }

    bannerTextContainer.appendChild(bannerContent);
    bannerComp.append(bannerImageDiv, bannerTextContainer);
    item.appendChild(bannerComp);
    carouselWrapper.appendChild(item);
    moveInstrumentation(slide, item);

    // Create indicator
    const indicator = document.createElement('li');
    indicator.classList.add('cmp-carousel__indicator');
    if (index === 0) {
      indicator.classList.add('cmp-carousel__indicator--active');
      indicator.setAttribute('aria-selected', 'true');
      indicator.setAttribute('tabindex', '0');
    } else {
      indicator.setAttribute('aria-selected', 'false');
      indicator.setAttribute('tabindex', '-1');
    }
    indicator.setAttribute('role', 'tab');
    indicator.setAttribute('aria-label', `Slide ${index + 1}`);
    indicator.textContent = title || `Slide ${index + 1}`;
    indicators.appendChild(indicator);

    indicator.addEventListener('click', () => {
      const activeItem = carouselWrapper.querySelector('.cmp-carousel__item--active');
      const activeIndicator = indicators.querySelector('.cmp-carousel__indicator--active');

      if (activeItem) {
        activeItem.classList.remove('cmp-carousel__item--active');
        activeItem.setAttribute('aria-hidden', 'true');
      }
      if (activeIndicator) {
        activeIndicator.classList.remove('cmp-carousel__indicator--active');
        activeIndicator.setAttribute('aria-selected', 'false');
        activeIndicator.setAttribute('tabindex', '-1');
      }

      item.classList.add('cmp-carousel__item--active');
      item.setAttribute('aria-hidden', 'false');
      indicator.classList.add('cmp-carousel__indicator--active');
      indicator.setAttribute('aria-selected', 'true');
      indicator.setAttribute('tabindex', '0');
      currentSlide = index;
      updateCarouselControls();
    });
  });

  const actions = document.createElement('div');
  actions.classList.add('cmp-carousel__actions');

  const prevButton = document.createElement('button');
  prevButton.classList.add('cmp-carousel__action', 'cmp-carousel__action--previous');
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('aria-label', 'Previous');
  const prevIconSpan = document.createElement('span');
  prevIconSpan.classList.add('cmp-carousel__action-icon');
  const prevIcon = document.createElement('i');
  prevIcon.classList.add('icon-Arrow-Left');
  prevIconSpan.appendChild(prevIcon);
  prevButton.appendChild(prevIconSpan);
  actions.appendChild(prevButton);

  const backgroundClickArea = document.createElement('span');
  backgroundClickArea.classList.add('background-click-area');
  actions.appendChild(backgroundClickArea);

  const nextButton = document.createElement('button');
  nextButton.classList.add('cmp-carousel__action', 'cmp-carousel__action--next');
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('aria-label', 'Next');
  const nextIconSpan = document.createElement('span');
  nextIconSpan.classList.add('cmp-carousel__action-icon');
  const nextIcon = document.createElement('i');
  nextIcon.classList.add('icon-Arrow-Right');
  nextIconSpan.appendChild(nextIcon);
  nextButton.appendChild(nextIconSpan);
  actions.appendChild(nextButton);

  const slidesCount = document.createElement('span');
  slidesCount.classList.add('slides-count');
  actions.appendChild(slidesCount);

  function updateCarouselControls() {
    slidesCount.textContent = `${currentSlide + 1}/${totalSlides}`;

    if (currentSlide === 0) {
      prevButton.classList.add('arrow-disabled');
      prevIcon.classList.add('arrow-disabled');
    } else {
      prevButton.classList.remove('arrow-disabled');
      prevIcon.classList.remove('arrow-disabled');
    }

    if (currentSlide === totalSlides - 1) {
      nextButton.classList.add('arrow-disabled');
      nextIcon.classList.add('arrow-disabled');
    } else {
      nextButton.classList.remove('arrow-disabled');
      nextIcon.classList.remove('arrow-disabled');
    }
  }

  prevButton.addEventListener('click', () => {
    if (currentSlide > 0) {
      const nextSlideIndex = currentSlide - 1;
      indicators.children[nextSlideIndex].click();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentSlide < totalSlides - 1) {
      const nextSlideIndex = currentSlide + 1;
      indicators.children[nextSlideIndex].click();
    }
  });

  block.innerHTML = ''; // Clear original block content
  block.classList.add('cmp-carousel');
  block.setAttribute('role', 'group');
  block.setAttribute('aria-live', 'polite');
  block.setAttribute('aria-roledescription', 'carousel');

  block.append(carouselWrapper, actions, indicators);
  updateCarouselControls();

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
