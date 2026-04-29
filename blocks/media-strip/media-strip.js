import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [imageRow, altTextRow] = [...block.children];

  const imageCell = imageRow?.firstElementChild;
  const altTextCell = altTextRow?.firstElementChild;

  const picture = imageCell?.querySelector('picture');
  const img = picture?.querySelector('img');
  const altText = altTextCell?.textContent.trim() || img?.alt || '';

  const innerDiv = document.createElement('div');
  innerDiv.classList.add('uol-c-media-strip__inner');

  if (img) {
    const mediaDiv = document.createElement('div');
    mediaDiv.classList.add('uol-c-picture', 'uol-c-media-strip__media');
    mediaDiv.setAttribute('data-testid', 'uol-c-media-strip-image');

    const optimizedPic = createOptimizedPicture(img.src, altText, false, [{ width: '2000' }]);
    optimizedPic.classList.add('uol-c-picture__picture');
    optimizedPic.setAttribute('data-testid', 'uol-c-picture-picture');

    const optimizedImg = optimizedPic.querySelector('img');
    if (optimizedImg) {
      optimizedImg.classList.add('uol-c-picture__image');
      optimizedImg.setAttribute('data-testid', 'uol-c-picture-image');
      optimizedImg.setAttribute('loading', 'eager');
      optimizedImg.setAttribute('decoding', 'auto');
      optimizedImg.setAttribute('fetchpriority', 'high');
      optimizedImg.alt = altText;
    }

    moveInstrumentation(imageCell, optimizedPic.querySelector('img'));
    mediaDiv.append(optimizedPic);
    innerDiv.append(mediaDiv);
  }

  block.innerHTML = '';
  block.classList.add(
    'uol-c-media-strip',
    'uol-u-bleed-full',
    'uol-l-stack-item--gap-none-sibling',
    'uol-c-media-strip--crop-lg',
    'uol-c-media-strip--fixed',
    'uol-c-media-strip--rounded',
    'is-mounted',
  );
  block.setAttribute('data-testid', 'uol-c-media-strip');
  block.append(innerDiv);
}
