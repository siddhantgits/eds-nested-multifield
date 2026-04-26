import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const cardItems = [...block.children];
  block.innerHTML = '';

  cardItems.forEach((row) => {
    // Use content detection instead of index access for robustness
    const cells = [...row.children];
    const linkCell = cells.find((cell) => cell.querySelector('a'));
    const imageCell = cells.find((cell) => cell.querySelector('picture'));
    const descriptionCell = cells.find((cell) => !cell.querySelector('a') && !cell.querySelector('picture'));

    const linkEl = document.createElement('a');
    linkEl.classList.add('performace-driven-cards-link'); // Class from ORIGINAL HTML
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      // Original HTML has target="_blank"
      linkEl.target = '_blank';
    }
    moveInstrumentation(row, linkEl);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper'); // Class from ORIGINAL HTML

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image'); // Class from ORIGINAL HTML

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        // Original HTML has source elements for responsive images
        const sources = picture.querySelectorAll('source');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        // Copy sources from original picture to optimized picture
        sources.forEach((source) => {
          optimizedPic.prepend(source.cloneNode(true));
        });
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardImageDiv.append(optimizedPic);
      }
    }

    const cardContentDiv = document.createElement('div');
    cardContentDiv.classList.add('performace-driven-home-box-card'); // Class from ORIGINAL HTML

    const descriptionP = document.createElement('p');
    descriptionP.classList.add('desc'); // Class from ORIGINAL HTML
    // Ensure descriptionCell exists before accessing textContent
    if (descriptionCell) {
      descriptionP.innerHTML = descriptionCell.innerHTML.trim(); // Use innerHTML to preserve potential line breaks
    }

    cardContentDiv.append(descriptionP);
    cardWrapper.append(cardImageDiv, cardContentDiv);
    linkEl.append(cardWrapper);
    block.append(linkEl);
  });
}
