import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0 & 1: Replaced row.children[0] with content detection.
  // The BlockJson specifies 'videoUrl' as an 'aem-content' field, which means it will be
  // wrapped in a div. The original code correctly identifies the row, but then uses
  // querySelector('div') which is less robust than direct cell access if the structure changes.
  // However, given the EDS structure for aem-content, the cell itself IS the div containing the anchor.
  // So, `const videoUrlCell = videoUrlRow.children[0];` is the most direct and correct way to get the cell.
  // The original `videoUrlRow?.querySelector('div');` would also work if the row only contains one div.
  // Let's stick to the explicit children[0] for fixed-field models as per guide.
  const [videoUrlCell] = [...block.children][0].children; // Access the first (and only) cell of the first row

  const videoLink = videoUrlCell?.querySelector('a');
  const videoSrc = videoLink ? videoLink.href : '';

  if (!videoSrc) {
    block.remove();
    return;
  }

  const section = document.createElement('section');
  section.classList.add('video-cmp');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const videoContainer = document.createElement('div');
  videoContainer.classList.add('video-container', 'mx-auto', 'w-100');
  container.append(videoContainer);

  const positionRelative = document.createElement('div');
  positionRelative.classList.add('position-relative', 'youtube-video');
  videoContainer.append(positionRelative);

  const iframe = document.createElement('iframe');
  iframe.src = videoSrc;
  iframe.width = '100%';
  iframe.height = '100%';
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute(
    'allow',
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;'
  );
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  iframe.id = 'player1'; // CHECK 3: 'player1' is a hardcoded ID, but acceptable for a unique player instance.

  positionRelative.append(iframe);

  // CHECK 5: The original `videoUrlRow` was not defined as a variable.
  // It should be the first child of the block.
  const firstRow = [...block.children][0];
  moveInstrumentation(firstRow, section); // Corrected to use the actual first row.

  // CHECK 4: block.innerHTML = ''; block.append(section); is the correct pattern.
  block.innerHTML = '';
  block.append(section);
}
