import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  container.append(sectionHeader);

  // Heading
  const headingRow = children[0];
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow?.firstElementChild?.textContent.trim() || '';
  moveInstrumentation(headingRow, heading);
  sectionHeader.append(heading);

  // Description
  const descriptionRow = children[1];
  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.textContent = descriptionRow?.firstElementChild?.textContent.trim() || '';
  moveInstrumentation(descriptionRow, description);
  sectionHeader.append(description);

  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');
  section.append(ourBusinessVerticals);

  // Desktop view
  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  ourBusinessVerticals.append(desktopContainer);

  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');
  desktopContainer.append(desktopRow);

  // Mobile view (for Flickity)
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  ourBusinessVerticals.append(mobileContainer);

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider', 'flickity-enabled', 'is-draggable');
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileContainer.append(mobileSlider);

  const flickityViewport = document.createElement('div');
  flickityViewport.classList.add('flickity-viewport');
  mobileSlider.append(flickityViewport);

  const flickitySlider = document.createElement('div');
  flickitySlider.classList.add('flickity-slider');
  flickityViewport.append(flickitySlider);

  const mobileSlides = [];
  let currentMobileSlide = document.createElement('div');
  currentMobileSlide.classList.add('slides');
  flickitySlider.append(currentMobileSlide);
  mobileSlides.push(currentMobileSlide);

  let mobileRowCounter = 0;
  let mobileSlideRow = document.createElement('div');
  mobileSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
  currentMobileSlide.append(mobileSlideRow);

  // Business Vertical Items (start from index 2 in children array)
  children.slice(2).forEach((row) => {
    // Destructure cells for business-vertical-item
    const [imageCell, imageAltCell, imageTitleCell, iconCell, iconAltCell, titleCell, linkCell] = [...row.children];

    // Desktop item
    const col = document.createElement('div');
    col.classList.add('col', 'aos-init', 'aos-animate');
    desktopRow.append(col);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');
    col.append(wrap);

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    wrap.append(imageDiv);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, imageAltCell?.textContent.trim() || img.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
      optimizedPic.querySelector('img').classList.add('img-fluid');
      optimizedPic.querySelector('img').setAttribute('title', imageTitleCell?.textContent.trim() || '');
      moveInstrumentation(picture, optimizedPic.querySelector('img'));
      imageDiv.append(optimizedPic);
    }

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = titleCell?.textContent.trim() || '';
    wrap.append(titleDiv);

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const optimizedIcon = createOptimizedPicture(iconImg.src, iconAltCell?.textContent.trim() || iconImg.alt, false, [{ width: '10' }]);
      moveInstrumentation(iconPicture, optimizedIcon.querySelector('img'));
      titleDiv.append(optimizedIcon);
    }

    const link = document.createElement('a');
    link.classList.add('stretched-link');
    link.href = linkCell?.querySelector('a')?.href || '#';
    link.setAttribute('aria-label', `Learn more about ${titleCell?.textContent.trim() || ''}`);
    moveInstrumentation(linkCell, link);
    wrap.append(link);

    moveInstrumentation(row, col);

    // Mobile item (3 items per slide)
    if (mobileRowCounter >= 3) {
      currentMobileSlide = document.createElement('div');
      currentMobileSlide.classList.add('slides');
      flickitySlider.append(currentMobileSlide);
      mobileSlides.push(currentMobileSlide);

      mobileSlideRow = document.createElement('div');
      mobileSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentMobileSlide.append(mobileSlideRow);
      mobileRowCounter = 0;
    }

    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');
    mobileSlideRow.append(mobileCol);

    const mobileWrap = document.createElement('div');
    mobileWrap.classList.add('wrap');
    mobileCol.append(mobileWrap);

    const mobileImageDiv = document.createElement('div');
    mobileImageDiv.classList.add('image');
    mobileWrap.append(mobileImageDiv);

    const mobilePicture = imageCell.querySelector('picture');
    if (mobilePicture) {
      const mobileImg = mobilePicture.querySelector('img');
      const mobileOptimizedPic = createOptimizedPicture(mobileImg.src, imageAltCell?.textContent.trim() || mobileImg.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
      mobileOptimizedPic.querySelector('img').classList.add('img-fluid');
      mobileOptimizedPic.querySelector('img').setAttribute('title', imageTitleCell?.textContent.trim() || '');
      mobileImageDiv.append(mobileOptimizedPic);
    }

    const mobileTitleDiv = document.createElement('div');
    mobileTitleDiv.classList.add('title');
    mobileTitleDiv.textContent = titleCell?.textContent.trim() || '';
    mobileWrap.append(mobileTitleDiv);

    const mobileIconPicture = iconCell.querySelector('picture');
    if (mobileIconPicture) {
      const mobileIconImg = mobileIconPicture.querySelector('img');
      const mobileOptimizedIcon = createOptimizedPicture(mobileIconImg.src, iconAltCell?.textContent.trim() || mobileIconImg.alt, false, [{ width: '10' }]);
      mobileTitleDiv.append(mobileOptimizedIcon);
    }

    const mobileLink = document.createElement('a');
    mobileLink.classList.add('stretched-link');
    mobileLink.href = linkCell?.querySelector('a')?.href || '#';
    mobileLink.setAttribute('aria-label', `Learn more about ${titleCell?.textContent.trim() || ''}`);
    mobileWrap.append(mobileLink);

    mobileRowCounter += 1;
  });

  // Add Flickity page dots
  const flickityPageDots = document.createElement('ol');
  flickityPageDots.classList.add('flickity-page-dots');
  mobileSlider.append(flickityPageDots);

  mobileSlides.forEach((_, i) => {
    const dot = document.createElement('li');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Page dot ${i + 1}`);
    if (i === 0) {
      dot.classList.add('is-selected');
      dot.setAttribute('aria-current', 'step');
    }
    flickityPageDots.append(dot);
  });

  block.innerHTML = '';
  block.append(section);
}
