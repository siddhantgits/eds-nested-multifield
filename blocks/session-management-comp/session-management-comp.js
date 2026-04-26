import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add('session-management-comp');
  block.id = 'home-session';

  // The block has no authored content, only a script tag from the original HTML.
  // We need to recreate that script tag.
  const script = document.createElement('script');
  script.textContent = `
    var _refreshInterval ="0.0"||"0";
  `;
  block.append(script);
}
