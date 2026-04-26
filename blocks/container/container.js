import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('container', 'responsivegrid', 'top-lg-margin', 'bottom-lg-margin');

  const container = document.createElement('div');
  container.classList.add('cmp-container');
  wrapper.append(container);

  const textItems = [];
  const buttonItems = [];

  [...block.children].forEach((row) => {
    // Determine item type based on number of cells and content
    const cells = [...row.children];
    if (cells.length === 1) {
      // This is a text-item (1 cell: richtext content)
      textItems.push(row);
    } else if (cells.length === 2) {
      // This is a button-item (2 cells: link, label)
      buttonItems.push(row);
    }
  });

  if (textItems.length > 0) {
    const textDiv = document.createElement('div');
    textDiv.classList.add('text');
    const cmpTextDiv = document.createElement('div');
    cmpTextDiv.classList.add('cmp-text');
    textDiv.append(cmpTextDiv);

    textItems.forEach((row) => {
      const contentCell = [...row.children][0]; // text-item has only one cell
      if (contentCell) {
        moveInstrumentation(row, contentCell);
        // Use innerHTML for richtext content
        cmpTextDiv.innerHTML += contentCell.innerHTML;
      }
    });
    container.append(textDiv);
  }

  if (buttonItems.length > 0) {
    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('button', 'cmp-button--primary-anchor', 'cmp-container--center-align');

    buttonItems.forEach((row) => {
      const [linkCell, labelCell] = [...row.children]; // button-item has two cells: link and label
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-button');

      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
        // Add event listener for interactive buttons
        anchor.addEventListener('click', (e) => {
          // Example: if button triggers a modal or other interaction, add logic here
          // For a simple link, no extra JS is needed beyond the href.
          // If data-request="true" implies a specific behavior, implement it.
          // For now, assuming it's a standard link.
        });
      }

      const span = document.createElement('span');
      span.classList.add('cmp-button__text');
      span.textContent = labelCell?.textContent.trim() || ''; // Read label from text cell
      anchor.append(span);

      moveInstrumentation(row, anchor);
      buttonWrapper.append(anchor);
    });
    container.append(buttonWrapper);
  }

  block.innerHTML = '';
  block.append(wrapper);
}
