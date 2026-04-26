import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...buttonRows] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('container', 'responsivegrid', 'color-background-background-2');

  const innerContainer1 = document.createElement('div');
  innerContainer1.classList.add('cmp-container');
  container.append(innerContainer1);

  const innerContainer2 = document.createElement('div');
  innerContainer2.classList.add('container', 'responsivegrid', 'top-lg-margin', 'bottom-lg-margin');
  innerContainer1.append(innerContainer2);

  const innerContainer3 = document.createElement('div');
  innerContainer3.classList.add('cmp-container');
  innerContainer2.append(innerContainer3);

  const textDiv = document.createElement('div');
  textDiv.classList.add('text');
  const cmpTextDiv = document.createElement('div');
  cmpTextDiv.classList.add('cmp-text');
  textDiv.append(cmpTextDiv);

  if (headingRow) {
    const headingCell = headingRow.querySelector('div');
    if (headingCell) {
      const h2 = document.createElement('h2');
      h2.textContent = headingCell.textContent.trim();
      cmpTextDiv.append(h2);
      moveInstrumentation(headingRow, h2);
    }
  }

  if (descriptionRow) {
    const descriptionCell = descriptionRow.querySelector('div');
    if (descriptionCell) {
      const p = document.createElement('p');
      p.textContent = descriptionCell.textContent.trim();
      cmpTextDiv.append(p);
      // Removed the extra empty p tag, as it's not present in the original HTML and not explicitly requested.
      moveInstrumentation(descriptionRow, p);
    }
  }

  innerContainer3.append(textDiv);

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('button', 'cmp-button--primary-anchor', 'cmp-container--center-align');

  buttonRows.forEach((row) => {
    // Use array destructuring for fixed-field item models as per EDS guidelines
    const [linkCell, labelCell] = [...row.children];

    const anchor = document.createElement('a');
    anchor.classList.add('cmp-button');

    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }

    const span = document.createElement('span');
    span.classList.add('cmp-button__text');
    span.textContent = labelCell ? labelCell.textContent.trim() : '';
    anchor.append(span);
    buttonContainer.append(anchor);
    moveInstrumentation(row, anchor);
  });

  innerContainer3.append(buttonContainer);

  block.innerHTML = '';
  block.append(container);
}
