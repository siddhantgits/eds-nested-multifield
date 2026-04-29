import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('uol-c-logo-strip__inner', 'keen-slider');

  [...block.children].forEach((row) => {
    const [logoImageCell, altTextCell] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('uol-c-logo-strip__slide', 'keen-slider__slide');

    const logoDiv = document.createElement('div');
    logoDiv.classList.add('uol-c-logo-strip__logo');

    const pictureDiv = document.createElement('div');
    pictureDiv.classList.add('uol-c-picture');
    pictureDiv.setAttribute('data-testid', 'uol-c-picture');

    const pictureEl = logoImageCell.querySelector('picture');
    const imgEl = pictureEl ? pictureEl.querySelector('img') : null;

    if (imgEl) {
      const altText = altTextCell?.textContent.trim() || imgEl.alt;
      const optimizedPic = createOptimizedPicture(imgEl.src, altText, false, [{ width: '150' }]);
      optimizedPic.classList.add('uol-c-picture__picture');
      optimizedPic.setAttribute('data-testid', 'uol-c-picture-picture');

      const newImg = optimizedPic.querySelector('img');
      newImg.classList.add('uol-c-picture__image');
      newImg.setAttribute('loading', 'lazy');
      newImg.setAttribute('decoding', 'async');
      newImg.setAttribute('data-testid', 'uol-c-picture-image');
      newImg.setAttribute('width', '150'); // Set width as per original HTML
      newImg.setAttribute('height', '150'); // Set height as per original HTML

      // Move instrumentation from the original image to the optimized one
      moveInstrumentation(imgEl, newImg);

      pictureDiv.append(optimizedPic);
    }

    logoDiv.append(pictureDiv);
    slide.append(logoDiv);
    moveInstrumentation(row, slide);
    wrapper.append(slide);
  });

  block.innerHTML = '';
  block.classList.add('uol-l-contain-space--default', 'uol-l-contain--extra-wide');
  block.setAttribute('data-testid', 'uol-c-logo-strip');
  block.setAttribute('aria-hidden', 'true');
  block.append(wrapper);
}
