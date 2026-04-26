import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Use content detection instead of fixed index access for robustness
  const cells = [...block.children];

  // Find cells based on their content type
  const imageCell = cells.find(cell => cell.querySelector('picture'));
  const imageAltCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim() !== '' && cells.indexOf(cell) === 1); // Assuming 2nd cell is alt text
  const titleCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim() !== '' && cells.indexOf(cell) === 2); // Assuming 3rd cell is title
  const descriptionCell = cells.find(cell => cell.innerHTML.includes('<p>') || cell.innerHTML.includes('<ul>')); // Richtext detection
  const ctaLinkCell = cells.find(cell => cell.querySelector('a') && cells.indexOf(cell) === 4); // Assuming 5th cell is CTA link
  const ctaLabelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim() !== '' && cells.indexOf(cell) === 5); // Assuming 6th cell is CTA label

  block.classList.add(
    'grid-container',
    'bg--paper-white',
    'homepage-recommended-article',
    'padding',
    'animate-enter',
    'in-view',
  );

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x', 'pos-rel');

  // Image container
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('cell', 'bg-container', 'animate-enter-fade', 'animate-delay-3');
  if (imageCell) {
    moveInstrumentation(imageCell, imageContainer);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, imageAltCell ? imageAltCell.textContent.trim() : '', false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('animate-enter-fade', 'animate-delay-3', 'ls-is-cached', 'lazyloaded');
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageContainer.appendChild(optimizedPic);
      }
    }
  }
  gridX.appendChild(imageContainer);

  // Text content container
  const textCell = document.createElement('div');
  textCell.classList.add('cell');

  const whiteBgPatch = document.createElement('div');
  whiteBgPatch.classList.add('grid-x', 'white-bg-patch');

  const textContainer = document.createElement('div');
  textContainer.classList.add('text-container', 'text-center');

  // Title
  const title = document.createElement('h2');
  title.classList.add('title', 'headline-h2', 'animate-enter-fade-up-short', 'animate-delay-3');
  if (titleCell) {
    title.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, title);
  }
  textContainer.appendChild(title);

  // Description
  const description = document.createElement('div');
  description.classList.add('description', 'bodyMediumRegular', 'animate-enter-fade-up-short', 'animate-delay-5');
  if (descriptionCell) {
    description.innerHTML = descriptionCell.innerHTML;
    moveInstrumentation(descriptionCell, description);
  }
  textContainer.appendChild(description);

  // CTA Link
  const ctaLink = document.createElement('a');
  ctaLink.classList.add('button', 'transparent-black', 'see-all-products', 'animate-enter-fade-up-short', 'animate-delay-7');

  if (ctaLinkCell) {
    const foundCtaLink = ctaLinkCell.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href; // Correctly read href from the anchor
    }
    moveInstrumentation(ctaLinkCell, ctaLink);
  }

  if (ctaLabelCell) {
    ctaLink.title = ctaLabelCell.textContent.trim();
    ctaLink.setAttribute('aria-label', ctaLabelCell.textContent.trim());
    moveInstrumentation(ctaLabelCell, ctaLink);
  }
  ctaLink.rel = 'follow';

  const ctaSpan = document.createElement('span');
  ctaSpan.classList.add('button-text');
  if (ctaLabelCell) {
    ctaSpan.textContent = ctaLabelCell.textContent.trim();
  }
  ctaLink.appendChild(ctaSpan);

  textContainer.appendChild(ctaLink);

  whiteBgPatch.appendChild(textContainer);
  textCell.appendChild(whiteBgPatch);
  gridX.appendChild(textCell);

  block.innerHTML = '';
  block.appendChild(gridX);
}
