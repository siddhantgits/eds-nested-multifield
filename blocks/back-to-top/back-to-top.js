import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [buttonLabelCell, buttonLinkCell] = [...block.children];

  const ctaDiv = document.createElement('div');
  ctaDiv.classList.add('back-to-top__cta');

  const anchor = document.createElement('a');
  anchor.classList.add('button', 'light-beige-accent', 'bodySmallRegular');
  const buttonLabel = buttonLabelCell?.textContent.trim() || 'Back To Top';
  anchor.setAttribute('aria-label', buttonLabel);
  anchor.setAttribute('title', buttonLabel); // Added missing title attribute
  anchor.setAttribute('rel', 'follow');

  // The original HTML always has href="javascript:void(0)" and handles scroll-to-top via JS.
  // We will replicate this behavior regardless of the link in the AEM cell.
  anchor.href = 'javascript:void(0)';
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const span = document.createElement('span');
  span.classList.add('button-text');
  span.textContent = buttonLabel;

  anchor.append(span);
  // moveInstrumentation from the buttonLinkCell is not strictly necessary here
  // as we are not using its href directly, but it's harmless.
  moveInstrumentation(buttonLinkCell, anchor);

  ctaDiv.append(anchor);

  block.innerHTML = '';
  block.classList.add('back-to-top');
  block.setAttribute('aria-label', 'Back to top module');
  block.style.display = 'flex'; // Set initial display to flex as per original HTML

  block.append(ctaDiv);

  // Optional: Add scroll listener to show/hide the button
  const toggleVisibility = () => {
    if (window.scrollY > 200) { // Show button after scrolling down 200px
      block.style.display = 'flex';
    } else {
      block.style.display = 'none';
    }
  };

  window.addEventListener('scroll', toggleVisibility);
  toggleVisibility(); // Initial check on load
}
