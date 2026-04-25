import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Check 0 & 1: Replace direct index access for root rows with content detection
  // The block.children are the root rows, each containing a single cell.
  // We need to map these to the model fields based on their content type.
  const rootRows = [...block.children];

  const imageRow = rootRows[0]; // First row is always image
  const imageAltRow = rootRows[1]; // Second row is always image alt
  const titleRow = rootRows[2]; // Third row is always title
  const descriptionRow = rootRows[3]; // Fourth row is always description
  const ctaLinkRow = rootRows[4]; // Fifth row is always CTA link
  const ctaLabelRow = rootRows[5]; // Sixth row is always CTA label

  // Extract the actual cells from these rows
  const imageCell = imageRow ? imageRow.children[0] : null;
  const imageAltCell = imageAltRow ? imageAltRow.children[0] : null;
  const titleCell = titleRow ? titleRow.children[0] : null;
  const descriptionCell = descriptionRow ? descriptionRow.children[0] : null;
  const ctaLinkCell = ctaLinkRow ? ctaLinkRow.children[0] : null;
  const ctaLabelCell = ctaLabelRow ? ctaLabelRow.children[0] : null;

  block.classList.add('grid-container', 'bg--paper-white', 'homepage-recommended-article', 'padding', 'animate-enter', 'in-view');

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x', 'pos-rel');

  // Image Container
  const bgContainer = document.createElement('div');
  bgContainer.classList.add('cell', 'bg-container', 'animate-enter-fade', 'animate-delay-3');

  if (imageCell) {
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img && imageAltCell) { // Ensure imageAltCell exists before using it
        const optimizedPic = createOptimizedPicture(img.src, imageAltCell.textContent.trim(), false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        picture.replaceWith(optimizedPic);
      }
      moveInstrumentation(imageCell, picture);
      bgContainer.append(picture);
    }
  }
  gridX.append(bgContainer);

  // Text Content Container
  const textCellWrapper = document.createElement('div');
  textCellWrapper.classList.add('cell');

  const whiteBgPatch = document.createElement('div');
  whiteBgPatch.classList.add('grid-x', 'white-bg-patch');

  const textContainer = document.createElement('div');
  textContainer.classList.add('text-container', 'text-center');

  // Title
  if (titleCell) {
    const title = document.createElement('h2');
    title.classList.add('title', 'headline-h2', 'animate-enter-fade-up-short', 'animate-delay-3');
    title.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, title);
    textContainer.append(title);
  }

  // Description (richtext)
  if (descriptionCell) {
    const description = document.createElement('div');
    description.classList.add('description', 'bodyMediumRegular', 'animate-enter-fade-up-short', 'animate-delay-5');
    // Check 1.5: Use innerHTML for richtext fields
    description.innerHTML = descriptionCell.innerHTML;
    moveInstrumentation(descriptionCell, description);
    textContainer.append(description);
  }

  // CTA Link
  if (ctaLinkCell && ctaLabelCell) { // Ensure both cells exist
    const ctaLink = document.createElement('a');
    const foundCtaLink = ctaLinkCell.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href;
    }
    ctaLink.title = ctaLabelCell.textContent.trim();
    ctaLink.classList.add('button', 'transparent-black', 'see-all-products', 'animate-enter-fade-up-short', 'animate-delay-7');
    ctaLink.setAttribute('aria-label', ctaLabelCell.textContent.trim());
    ctaLink.setAttribute('rel', 'follow');

    const buttonText = document.createElement('span');
    buttonText.classList.add('button-text');
    buttonText.textContent = ctaLabelCell.textContent.trim();
    ctaLink.append(buttonText);
    moveInstrumentation(ctaLinkCell, ctaLink);
    moveInstrumentation(ctaLabelCell, ctaLink);
    textContainer.append(ctaLink);
  }

  whiteBgPatch.append(textContainer);
  textCellWrapper.append(whiteBgPatch);
  gridX.append(textCellWrapper);

  block.innerHTML = '';
  block.append(gridX);
}
