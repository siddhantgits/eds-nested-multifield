import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure block.children based on the BlockJson model
  // imageRow: field="image" type=reference
  // altTextRow: field="altText" type=text
  // descriptionRow: field="description" type=richtext
  // ctaLinkRows: container field "ctaLinks" with item rows
  const [imageRow, altTextRow, descriptionRow, ...ctaLinkRows] = [...block.children];

  block.classList.add('grid-container', 'padding', 'animate-enter', 'in-view');
  block.setAttribute('aria-label', 'Home Page Description Module');

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x', 'max-width-container');

  const cellWrapper = document.createElement('div');
  cellWrapper.classList.add('cell', 'large-offset-1', 'large-10', 'xlarge-offset-2', 'xlarge-8', 'text-center', 'wrapper');

  // Image
  if (imageRow) {
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container', 'animate-enter-fade-up-short', 'animate-delay-3');
    const picture = imageRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        // Read altText from altTextRow.textContent.trim()
        const optimizedPic = createOptimizedPicture(img.src, altTextRow?.querySelector('div')?.textContent.trim() || img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageContainer.append(optimizedPic);
      }
    }
    moveInstrumentation(imageRow, imageContainer);
    cellWrapper.append(imageContainer);
  }

  // Description
  if (descriptionRow) {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('description1', 'bodyMediumRegular', 'animate-enter-fade-up-short', 'animate-delay-5');
    // Description is richtext, so use innerHTML
    descriptionDiv.innerHTML = descriptionRow.querySelector('div')?.innerHTML || '';
    moveInstrumentation(descriptionRow, descriptionDiv);
    cellWrapper.append(descriptionDiv);
  }

  // CTA Links
  if (ctaLinkRows.length > 0) {
    const ctaContainer = document.createElement('div');
    ctaContainer.classList.add('cta-container');

    ctaLinkRows.forEach((row, index) => {
      // Use content detection for cells within item rows, NOT index access
      const cells = [...row.children];
      const linkCell = cells.find(cell => cell.querySelector('a')); // type=aem-content
      const labelCell = cells.find(cell => !cell.querySelector('a')); // type=text

      const anchor = document.createElement('a');
      anchor.classList.add('link', 'small', 'black', 'animate-enter-fade-up-short', 'animate-delay-9');

      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        // For type=aem-content, read href from the <a> tag
        anchor.href = foundLink.href;
      }

      const labelSpan = document.createElement('span');
      labelSpan.classList.add('button-text');
      // For type=text, read textContent.trim()
      labelSpan.textContent = labelCell?.textContent.trim() || '';
      anchor.append(labelSpan);

      // Add specific classes based on index (assuming sign-in/register pattern)
      if (index === 0) {
        anchor.classList.add('sign-in');
        anchor.setAttribute('aria-label', 'Sign in');
      } else if (index === 1) {
        // Add separator before the second link if it exists
        if (ctaLinkRows.length > 1) {
          const separator = document.createElement('span');
          separator.classList.add('labelSmallBold', 'separator', 'animate-enter-fade-up-short', 'animate-delay-9');
          separator.textContent = ' / ';
          ctaContainer.append(separator);
        }
        anchor.classList.add('register');
        anchor.setAttribute('aria-label', 'Register');
      }

      moveInstrumentation(row, anchor);
      ctaContainer.append(anchor);
    });
    cellWrapper.append(ctaContainer);
  }

  const productCardWtb = document.createElement('div');
  productCardWtb.classList.add('product-card__wtb');
  cellWrapper.append(productCardWtb);

  gridX.append(cellWrapper);
  block.innerHTML = ''; // Clear original block content
  block.append(gridX);
}
