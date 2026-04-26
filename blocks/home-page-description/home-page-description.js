import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Use destructuring for the first three known rows
  const [imageRow, altTextRow, descriptionRow, ...ctaRows] = [...block.children];

  // Image
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('image-container', 'animate-enter-fade-up-short', 'animate-delay-3');
  const picture = imageRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      // Use altTextRow.textContent.trim() for alt text as per model
      const optimizedPic = createOptimizedPicture(img.src, altTextRow.textContent.trim(), false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageContainer.append(optimizedPic);
    }
  }
  moveInstrumentation(imageRow, imageContainer);

  // Description
  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('description1', 'bodyMediumRegular', 'animate-enter-fade-up-short', 'animate-delay-5');
  // Description is richtext, so use innerHTML
  descriptionDiv.innerHTML = descriptionRow.innerHTML;
  moveInstrumentation(descriptionRow, descriptionDiv);

  // CTA Container
  const ctaContainer = document.createElement('div');
  ctaContainer.classList.add('cta-container');

  ctaRows.forEach((row, index) => {
    // CRITICAL FIX: Use content detection for cells within item rows
    // Based on BlockJson: cell[0] is 'aem-content' (link), cell[1] is 'text' (label)
    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a')); // Find cell with an anchor
    const labelCell = cells.find(cell => !cell.querySelector('a')); // Find cell without an anchor (label)

    const ctaLink = document.createElement('a');
    if (linkCell) {
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        // For 'aem-content' type, read only href, not textContent
        ctaLink.href = foundLink.href;
      }
    }
    // For 'text' type, read textContent.trim()
    if (labelCell) {
      ctaLink.textContent = labelCell.textContent.trim();
    }

    // Apply classes based on index (assuming first is 'sign-in', second is 'register')
    if (index === 0) {
      ctaLink.classList.add('link', 'small', 'black', 'sign-in', 'animate-enter-fade-up-short', 'animate-delay-9');
      ctaLink.setAttribute('aria-label', 'Sign in');
    } else if (index === 1) {
      const separator = document.createElement('span');
      separator.classList.add('labelSmallBold', 'separator', 'animate-enter-fade-up-short', 'animate-delay-9');
      separator.textContent = ' / ';
      ctaContainer.append(separator);
      ctaLink.classList.add('link', 'small', 'black', 'register', 'animate-enter-fade-up-short', 'animate-delay-9');
      ctaLink.setAttribute('aria-label', 'Register');
    }
    ctaLink.setAttribute('rel', 'follow');

    const buttonTextSpan = document.createElement('span');
    buttonTextSpan.classList.add('button-text');
    buttonTextSpan.textContent = ctaLink.textContent;
    ctaLink.textContent = ''; // Clear text content to wrap with span
    ctaLink.append(buttonTextSpan);

    moveInstrumentation(row, ctaLink);
    ctaContainer.append(ctaLink);
  });

  // Clear existing block content
  block.innerHTML = '';

  // Wrapper for content
  const wrapper = document.createElement('div');
  wrapper.classList.add('cell', 'large-offset-1', 'large-10', 'xlarge-offset-2', 'xlarge-8', 'text-center', 'wrapper');

  wrapper.append(imageContainer, descriptionDiv, ctaContainer);

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x', 'max-width-container');
  gridX.append(wrapper);

  block.classList.add('grid-container', 'padding', 'animate-enter', 'in-view');
  block.setAttribute('aria-label', 'Home Page Description Module');
  block.append(gridX);
}
