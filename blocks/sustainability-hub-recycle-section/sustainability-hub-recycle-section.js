import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    mainImageRow,
    mainImageAltRow,
    titleRow,
    descriptionRow,
    ...buttonRows
  ] = [...block.children];

  block.innerHTML = '';
  block.classList.add('grid-container', 'bg--paper-white', 'homepage-recommended-article', 'padding', 'animate-enter', 'in-view');

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x', 'pos-rel');
  block.append(gridX);

  // Main Image Section
  const imageCell = mainImageRow?.firstElementChild;
  if (imageCell) {
    const bgContainer = document.createElement('div');
    bgContainer.classList.add('cell', 'bg-container', 'animate-enter-fade', 'animate-delay-3');
    moveInstrumentation(imageCell, bgContainer);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const altText = mainImageAltRow?.firstElementChild?.textContent.trim() || img.alt;
        const optimizedPic = createOptimizedPicture(img.src, altText, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        // FIX: Replaced block.replaceWith() anti-pattern
        picture.parentElement.replaceChild(optimizedPic, picture);
        optimizedPic.classList.add('animate-enter-fade', 'animate-delay-3', 'lazyloaded');
      }
    }
    bgContainer.append(picture); // This will append the optimizedPic if it was replaced
    gridX.append(bgContainer);
  }

  // Text Content Section
  const textCellWrapper = document.createElement('div');
  textCellWrapper.classList.add('cell');

  const whiteBgPatch = document.createElement('div');
  whiteBgPatch.classList.add('grid-x', 'white-bg-patch');
  textCellWrapper.append(whiteBgPatch);

  const textContainer = document.createElement('div');
  textContainer.classList.add('text-container', 'text-center');
  whiteBgPatch.append(textContainer);

  const titleCell = titleRow?.firstElementChild;
  if (titleCell) {
    const title = document.createElement('h2');
    title.classList.add('title', 'headline-h2', 'animate-enter-fade-up-short', 'animate-delay-3');
    title.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, title);
    textContainer.append(title);
  }

  const descriptionCell = descriptionRow?.firstElementChild;
  if (descriptionCell) {
    const description = document.createElement('div');
    description.classList.add('description', 'bodyMediumRegular', 'animate-enter-fade-up-short', 'animate-delay-5');
    description.innerHTML = descriptionCell.innerHTML;
    moveInstrumentation(descriptionCell, description);
    textContainer.append(description);
  }

  // Buttons
  if (buttonRows.length > 0) {
    buttonRows.forEach((row, i) => {
      const [linkCell, labelCell] = [...row.children];

      const anchor = document.createElement('a');
      anchor.classList.add('button', 'transparent-black', 'see-all-products', 'animate-enter-fade-up-short', `animate-delay-${7 + i * 2}`); // Increment delay
      anchor.setAttribute('aria-label', '');
      anchor.setAttribute('rel', 'follow');

      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
      }

      const buttonText = document.createElement('span');
      buttonText.classList.add('button-text');
      buttonText.textContent = labelCell?.textContent.trim() || '';
      anchor.append(buttonText);

      moveInstrumentation(row, anchor);
      textContainer.append(anchor);
    });
  }

  gridX.append(textCellWrapper);
}
