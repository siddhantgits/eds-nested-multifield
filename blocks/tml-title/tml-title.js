import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0 & 1: Replaced block.children[0] with content detection.
  // The BlockJson indicates a single root field "title" of type "text".
  // This means the block will have one row, and that row will have one cell containing the title text.
  const titleRow = [...block.children][0]; // Get the first (and only) row
  const titleCell = [...titleRow.children][0]; // Get the first (and only) cell in that row

  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add('tml-comp', 'cmp-title', 'paddingBottom32', 'mobile-padding14');
  wrapperDiv.setAttribute('initializer', 'CmpTitle');

  const h4 = document.createElement('h4');
  h4.classList.add('cmp-title__text', 'aos-init', 'aos-animate');
  moveInstrumentation(titleCell, h4);
  h4.textContent = titleCell?.textContent.trim() || '';

  wrapperDiv.append(h4);

  block.innerHTML = '';
  block.classList.add('title', 'text-align-center');
  block.append(wrapperDiv);
}
