import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [imageRow, titleRow, ...ctaRows] = [...block.children];

  // Create the main container
  const tooltipContainer = document.createElement('div');
  tooltipContainer.classList.add('tooltip-signin-register--container');

  // Image
  const imageCell = imageRow?.firstElementChild;
  if (imageCell) {
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        // Append the optimized picture directly to the block, before the tooltipContainer
        // The original HTML shows the image outside the container.
        block.append(optimizedPic);
      }
    }
  }

  // Title
  const titleCell = titleRow?.firstElementChild;
  if (titleCell) {
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('labelMediumBold', 'tooltip-signin-register--title');
    titleDiv.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleRow, titleDiv);
    tooltipContainer.append(titleDiv);
  }

  // Close button
  const closeDiv = document.createElement('div');
  closeDiv.classList.add('tooltip-signin-register--close');
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.classList.add('icon', 'cross-icon-black', 'tooltip-signin-register--close-btn');
  closeButton.setAttribute('aria-label', 'Close tooltip');
  closeDiv.append(closeButton);
  tooltipContainer.append(closeDiv);

  // CTAs
  const ctasDiv = document.createElement('div');
  ctasDiv.classList.add('tooltip-signin-register--ctas');

  ctaRows.forEach((row, index) => {
    const [labelCell, linkCell] = [...row.children];

    const anchor = document.createElement('a');
    anchor.classList.add('button'); // All CTAs have 'button' class

    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      // Add rel="follow" if present in original HTML, or as a default for external links
      if (foundLink.getAttribute('rel')) {
        anchor.setAttribute('rel', foundLink.getAttribute('rel'));
      }
      // Add aria-label if present in original HTML
      if (foundLink.getAttribute('aria-label')) {
        anchor.setAttribute('aria-label', foundLink.getAttribute('aria-label'));
      }
    }

    const labelText = labelCell?.textContent.trim();
    if (labelText) {
      const span = document.createElement('span');
      span.classList.add('button-text');
      span.textContent = labelText;
      anchor.append(span);
    }

    // Apply specific classes based on the order as per original HTML
    if (index === 0) {
      anchor.classList.add('red', 'tooltip-signin-register--signin');
    } else if (index === 1) {
      anchor.classList.add('transparent-black', 'tooltip-signin-register--signup');
    }

    moveInstrumentation(row, anchor);
    ctasDiv.append(anchor);
  });

  tooltipContainer.append(ctasDiv);

  // Clear the block and append the new structure
  block.innerHTML = ''; // Clear existing block content
  block.classList.add('bg--white-accent'); // Add main block classes
  block.setAttribute('role', 'dialog');
  // The image is appended first, then the container
  // block.append(optimizedPic); // This was moved up to be appended directly after creation
  block.append(tooltipContainer);

  // Add event listener for close button
  closeButton.addEventListener('click', () => {
    // Assuming 'show' class controls visibility for the tooltip itself
    // The original HTML doesn't show a 'show' class, but if it's dynamic, this is the pattern.
    // If it's a modal, it might be removed from DOM or display:none.
    // For this block, based on original HTML, it's a static component.
    // If it's meant to be hidden, we need to define how.
    // For now, let's assume it's a simple hide.
    block.style.display = 'none';
  });
}
