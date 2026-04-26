import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, titleRow] = [...block.children];

  const headingContainer = document.createElement('div');
  headingContainer.classList.add('no-color', 'cmp-text', 'c-link', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, headingContainer);
  // Heading is richtext, so use innerHTML
  headingContainer.innerHTML = headingRow.children[0]?.innerHTML || '';

  const titleContainer = document.createElement('div');
  titleContainer.classList.add('tml-comp', 'cmp-title', 'paddingBottom32', 'mobile-padding14');
  moveInstrumentation(titleRow, titleContainer);

  const titleText = document.createElement('h4');
  titleText.classList.add('cmp-title__text', 'aos-init', 'aos-animate');
  // Title is richtext, so use innerHTML
  titleText.innerHTML = titleRow.children[0]?.innerHTML || '';
  titleContainer.append(titleText);

  block.innerHTML = '';
  block.classList.add('text'); // Added 'text' class from ORIGINAL HTML
  block.append(headingContainer);
  block.append(titleContainer);
}

