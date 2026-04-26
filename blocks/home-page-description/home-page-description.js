import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // block.children[0]: imageRow
  // block.children[1]: imageAltRow (not used in rendering, but present in model)
  // block.children[2]: descriptionRow
  // block.children[3...N]: ctaLinkRows
  const [imageRow, imageAltRow, descriptionRow, ...ctaLinkRows] = [...block.children];

  // Main wrapper
  const section = document.createElement('section');
  section.classList.add('home-page-description', 'grid-container', 'padding', 'animate-enter', 'in-view');
  section.setAttribute('aria-label', 'Home Page Description Module');

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x', 'max-width-container');
  section.append(gridX);

  const cellWrapper = document.createElement('div');
  cellWrapper.classList.add('cell', 'large-offset-1', 'large-10', 'xlarge-offset-2', 'xlarge-8', 'text-center', 'wrapper');
  gridX.append(cellWrapper);

  // Image
  // Per EDS Block Structure, image is in the first child of imageRow
  const imageCell = imageRow?.children[0];
  if (imageCell) {
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container', 'animate-enter-fade-up-short', 'animate-delay-3');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        picture.replaceWith(optimizedPic);
      }
    }
    moveInstrumentation(imageRow, imageContainer);
    // Append the content of the imageCell (which is now the optimized picture)
    while (imageCell.firstChild) {
      imageContainer.append(imageCell.firstChild);
    }
    cellWrapper.append(imageContainer);
  }

  // Description
  // Per EDS Block Structure, description is in the first child of descriptionRow
  const descriptionCell = descriptionRow?.children[0];
  if (descriptionCell) {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('description1', 'bodyMediumRegular', 'animate-enter-fade-up-short', 'animate-delay-5');
    moveInstrumentation(descriptionRow, descriptionDiv);
    descriptionDiv.innerHTML = descriptionCell.innerHTML; // Use innerHTML for richtext
    cellWrapper.append(descriptionDiv);
  }

  // CTA Links
  if (ctaLinkRows.length > 0) {
    const ctaContainer = document.createElement('div');
    ctaContainer.classList.add('cta-container');
    cellWrapper.append(ctaContainer);

    ctaLinkRows.forEach((row, index) => {
      // Per EDS Block Structure, cta-link item rows have two cells: link and label
      const [linkCell, labelCell] = [...row.children];

      if (linkCell && labelCell) {
        const link = document.createElement('a');
        const foundLink = linkCell.querySelector('a');
        if (foundLink) {
          link.href = foundLink.href;
          link.setAttribute('rel', 'follow'); // Assuming rel="follow" from original HTML
        }
        link.classList.add('link', 'small', 'black', 'animate-enter-fade-up-short', 'animate-delay-9');
        // Add specific classes based on index or content if needed, for 'sign-in' and 'register'
        if (index === 0) {
          link.classList.add('sign-in');
          link.setAttribute('aria-label', 'Sign in');
        } else if (index === 1) {
          link.classList.add('register');
          link.setAttribute('aria-label', 'Register');
        }

        const spanText = document.createElement('span');
        spanText.classList.add('button-text');
        spanText.textContent = labelCell.textContent.trim();
        link.append(spanText);

        moveInstrumentation(row, link);
        ctaContainer.append(link);

        // Add separator if not the last link
        if (index < ctaLinkRows.length - 1) {
          const separator = document.createElement('span');
          separator.classList.add('labelSmallBold', 'separator', 'animate-enter-fade-up-short', 'animate-delay-9');
          separator.textContent = ' / ';
          ctaContainer.append(separator);
        }
      }
    });
  }

  // Product card WTB (empty in EDS, but present in original HTML for structure)
  const productCardWtb = document.createElement('div');
  productCardWtb.classList.add('product-card__wtb');
  cellWrapper.append(productCardWtb);

  block.innerHTML = '';
  block.append(section);
}
