import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Check 0: No row.children[n] usage.
  // Check 1: Structure alignment.
  // The block has two root-level rows, each containing one cell.
  // The model defines two fields: 'link' (aem-content) and 'label' (text).
  // We need to find these cells by content rather than index.
  const cells = [...block.children].map(row => row.firstElementChild); // Get the actual content cells

  const linkCell = cells.find(cell => cell.querySelector('a[href]'));
  const labelCell = cells.find(cell => !cell.querySelector('a[href]'));

  const ctaDiv = document.createElement('div');
  ctaDiv.classList.add('back-to-top__cta');

  const anchor = document.createElement('a');
  const foundLink = linkCell?.querySelector('a');
  if (foundLink) {
    anchor.href = foundLink.href;
  } else {
    anchor.href = 'javascript:void(0)'; // Fallback if no link is provided
  }

  // Check 1.5: Richtext fields with HTML content.
  // 'link' is aem-content, 'label' is text. Neither is richtext.
  anchor.title = labelCell?.textContent.trim() || 'Back To Top';
  anchor.classList.add('button', 'light-beige-accent', 'bodySmallRegular');
  anchor.setAttribute('aria-label', anchor.title);
  anchor.setAttribute('rel', 'follow');

  const span = document.createElement('span');
  span.classList.add('button-text');
  span.textContent = labelCell?.textContent.trim() || 'Back To Top';

  anchor.append(span);
  // Move instrumentation from the original link cell to the new anchor element
  if (linkCell) {
    moveInstrumentation(linkCell, anchor);
  }

  ctaDiv.append(anchor);

  block.innerHTML = ''; // Clear the block content
  block.classList.add('back-to-top'); // Ensure the block itself has the class
  block.setAttribute('aria-label', 'Back to top module');
  block.style.display = 'flex'; // Apply inline style from original HTML
  block.append(ctaDiv);

  // Check 2: Interactivity.
  // Add scroll event listener for back-to-top functionality
  const scrollThreshold = 200; // Adjust as needed
  const handleScroll = () => {
    if (window.scrollY > scrollThreshold) {
      block.style.display = 'flex'; // Show the button
    } else {
      block.style.display = 'none'; // Hide the button
    }
  };

  // Initial check on load
  handleScroll();

  window.addEventListener('scroll', handleScroll);

  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}
