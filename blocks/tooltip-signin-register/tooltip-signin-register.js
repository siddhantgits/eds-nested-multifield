import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add('bg--white-accent');
  block.setAttribute('role', 'dialog');
  block.setAttribute('aria-hidden', 'true'); // Added for initial state

  const children = [...block.children];

  // Image
  const imageRow = children.shift(); // First row is image
  const imageCell = [...imageRow.children].find(cell => cell.querySelector('picture'));
  let optimizedPicElement = null;
  if (imageCell) {
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      optimizedPicElement = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPicElement.querySelector('img'));
    }
  }

  // Container for title and CTAs
  const container = document.createElement('div');
  container.classList.add('tooltip-signin-register--container');

  // Title
  const titleRow = children.shift(); // Second row is title
  const titleCell = [...titleRow.children].find(cell => !cell.querySelector('a') && !cell.querySelector('picture'));
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('labelMediumBold', 'tooltip-signin-register--title');
  if (titleCell) {
    moveInstrumentation(titleCell, titleDiv);
    titleDiv.textContent = titleCell.textContent.trim();
  }
  container.append(titleDiv);

  // Close button
  const closeDiv = document.createElement('div');
  closeDiv.classList.add('tooltip-signin-register--close');
  const closeButton = document.createElement('button');
  closeButton.classList.add('icon', 'cross-icon-black', 'tooltip-signin-register--close-btn');
  closeButton.setAttribute('type', 'button');
  closeButton.setAttribute('aria-label', 'Close tooltip');
  closeDiv.append(closeButton);
  container.append(closeDiv);

  // CTAs
  const ctasDiv = document.createElement('div');
  ctasDiv.classList.add('tooltip-signin-register--ctas');

  children.forEach((row, index) => { // Remaining rows are CTAs
    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture'));

    const ctaLink = document.createElement('a');
    if (linkCell) {
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        ctaLink.href = foundLink.href;
      }
    }
    ctaLink.classList.add('button');
    if (index === 0) {
      ctaLink.classList.add('red', 'tooltip-signin-register--signin');
    } else {
      ctaLink.classList.add('transparent-black', 'tooltip-signin-register--signup');
    }
    ctaLink.setAttribute('rel', 'follow');

    const span = document.createElement('span');
    span.classList.add('button-text');
    if (labelCell) {
      span.textContent = labelCell.textContent.trim();
    }
    ctaLink.append(span);

    moveInstrumentation(row, ctaLink);
    ctasDiv.append(ctaLink);
  });

  container.append(ctasDiv);

  // Replace original rows with new structure
  block.innerHTML = '';
  if (optimizedPicElement) {
    block.append(optimizedPicElement);
  }
  block.append(container);

  // Event listener for close button
  closeButton.addEventListener('click', () => {
    block.classList.remove('show');
    block.setAttribute('aria-hidden', 'true');
  });
}
