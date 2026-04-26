import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [buttonLabelCell, buttonLinkCell] = [...block.children];

  const ctaDiv = document.createElement('div');
  ctaDiv.classList.add('back-to-top__cta');

  const anchor = document.createElement('a');
  anchor.classList.add('button', 'light-beige-accent', 'bodySmallRegular');
  anchor.setAttribute('title', buttonLabelCell.textContent.trim());
  anchor.setAttribute('aria-label', buttonLabelCell.textContent.trim());
  anchor.setAttribute('rel', 'follow');

  const foundLink = buttonLinkCell.querySelector('a');
  if (foundLink) {
    anchor.href = foundLink.href;
    moveInstrumentation(buttonLinkCell, anchor);
  } else {
    anchor.href = 'javascript:void(0)';
  }

  const span = document.createElement('span');
  span.classList.add('button-text');
  span.textContent = buttonLabelCell.textContent.trim();
  moveInstrumentation(buttonLabelCell, span);

  anchor.append(span);
  ctaDiv.append(anchor);
  block.replaceChildren(ctaDiv);

  // Add scroll event listener to show/hide the button
  const showButtonThreshold = 200; // Pixels scrolled to show the button
  const hideButtonThreshold = 100; // Pixels scrolled to hide the button

  function toggleBackToTopButton() {
    if (window.scrollY > showButtonThreshold) {
      block.style.display = 'flex';
    } else if (window.scrollY < hideButtonThreshold) {
      block.style.display = 'none';
    }
  }

  // Initial state check
  toggleBackToTopButton();

  // Add scroll event listener
  window.addEventListener('scroll', toggleBackToTopButton);

  // Add click listener to scroll to top
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}
