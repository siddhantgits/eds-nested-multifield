import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Use destructuring for root fields as per BlockJson model
  const [imageRow, titleRow, ...ctaRows] = [...block.children];

  block.innerHTML = ''; // Clear the block content

  block.classList.add('bg--white-accent');
  block.setAttribute('id', 'tooltip-signin-register');
  block.setAttribute('role', 'dialog');

  // Image
  const imageCell = imageRow.firstElementChild;
  const img = imageCell?.querySelector('img');
  if (img) {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    block.append(optimizedPic);
  }

  const container = document.createElement('div');
  container.classList.add('tooltip-signin-register--container');

  // Title
  const titleCell = titleRow.firstElementChild;
  if (titleCell) {
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('labelMediumBold', 'tooltip-signin-register--title');
    moveInstrumentation(titleCell, titleDiv);
    titleDiv.textContent = titleCell.textContent.trim();
    container.append(titleDiv);
  }

  // Close button
  const closeDiv = document.createElement('div');
  closeDiv.classList.add('tooltip-signin-register--close');
  const closeButton = document.createElement('button');
  closeButton.setAttribute('type', 'button');
  closeButton.classList.add('icon', 'cross-icon-black', 'tooltip-signin-register--close-btn');
  closeButton.setAttribute('aria-label', 'Close tooltip');
  closeDiv.append(closeButton);
  container.append(closeDiv);

  // CTAs
  const ctasDiv = document.createElement('div');
  ctasDiv.classList.add('tooltip-signin-register--ctas');

  ctaRows.forEach((row) => {
    // CRITICAL FIX: Use content detection for CTA cells, NOT index access.
    // The BlockJson defines two fields: "link" (aem-content) and "label" (text).
    // We need to find the anchor for href and the text for the label.
    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a')); // Finds the cell with the <a> tag
    const labelCell = cells.find(cell => !cell.querySelector('a')); // Finds the cell without an <a> tag (the label)

    const foundLink = linkCell?.querySelector('a');
    if (foundLink && labelCell) {
      const anchor = document.createElement('a');
      anchor.href = foundLink.href;
      anchor.classList.add('button'); // Add default button class

      // Determine specific button classes based on content (e.g., first CTA is red, second is transparent-black)
      // For this specific block, the original HTML shows the first CTA as 'red' and second as 'transparent-black'.
      if (ctasDiv.children.length === 0) {
        anchor.classList.add('red', 'tooltip-signin-register--signin');
      } else {
        anchor.classList.add('transparent-black', 'tooltip-signin-register--signup');
      }

      anchor.setAttribute('aria-label', ''); // From original HTML
      anchor.setAttribute('rel', 'follow'); // From original HTML

      const span = document.createElement('span');
      span.classList.add('button-text');
      // CRITICAL FIX: The label text comes from the labelCell, not the link cell.
      span.textContent = labelCell.textContent.trim();
      anchor.append(span);

      moveInstrumentation(row, anchor);
      ctasDiv.append(anchor);
    }
  });
  container.append(ctasDiv);

  block.append(container);

  // Add event listener for close button
  closeButton.addEventListener('click', () => {
    block.classList.remove('show'); // Assuming 'show' class controls visibility
  });

  // Close on outside click
  block.addEventListener('click', (e) => {
    if (e.target === block) {
      block.classList.remove('show');
    }
  });
}
