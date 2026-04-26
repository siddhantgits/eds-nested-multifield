import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [buttonTextCell] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('cookie-btn-container', 'bg--light-beige-accent', 'optanon-toggle-display');

  const button = document.createElement('button');
  button.classList.add('cookie-btn', 'bodySmallRegular');

  const span = document.createElement('span');
  span.classList.add('cookie-btn-text');
  span.textContent = buttonTextCell.textContent.trim();
  moveInstrumentation(buttonTextCell, span);

  button.append(span);
  container.append(button);

  // Clear the block and append the new structure
  block.innerHTML = '';
  block.append(container);
}
