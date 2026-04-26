import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, subtitleRow, ...categoryRows] = [...block.children];

  const headerDiv = document.createElement('div');
  headerDiv.classList.add('cmp-product-category-listing__header');

  const title = document.createElement('h1');
  title.classList.add('cmp-product-category-listing__title');
  moveInstrumentation(titleRow, title);
  title.textContent = titleRow?.firstElementChild?.textContent.trim() || '';
  headerDiv.append(title);

  const subtitle = document.createElement('div');
  subtitle.classList.add('cmp-product-category-listing__subTitle', 'desc-2');
  moveInstrumentation(subtitleRow, subtitle);
  subtitle.textContent = subtitleRow?.firstElementChild?.textContent.trim() || '';
  headerDiv.append(subtitle);

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('cmp-product-category-listing__content');

  categoryRows.forEach((row) => {
    // Use content detection instead of index access for robustness
    const cells = [...row.children];
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a[href^="/content/"]')); // Detect AEM content link
    const nameCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a[href^="/content/"]')); // Text cell without picture or AEM link

    const categoryItemWrapper = document.createElement('div');
    categoryItemWrapper.classList.add('cmp-categorylist', 'cmp-categorylist--anchor');

    const anchor = document.createElement('a');
    anchor.classList.add('cmp-categorylist__item');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.title = nameCell?.textContent.trim() || '';
    }
    moveInstrumentation(row, anchor);

    const imageWrapper = document.createElement('span');
    imageWrapper.classList.add('cmp-categorylist__imagewrapper');

    const lazyImageContainer = document.createElement('div');
    lazyImageContainer.classList.add('lazy-image-container');

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        optimizedPic.querySelector('img').classList.add('cmp-categorylist__image', 'lazy-image', 'loaded');
        lazyImageContainer.append(optimizedPic);
      }
    }
    imageWrapper.append(lazyImageContainer);
    anchor.append(imageWrapper);

    const nameSpan = document.createElement('span');
    nameSpan.classList.add('cmp-categorylist__name');
    nameSpan.textContent = nameCell?.textContent.trim() || '';
    nameSpan.setAttribute('data-title', nameCell?.textContent.trim() || '');
    anchor.append(nameSpan);

    categoryItemWrapper.append(anchor);
    contentDiv.append(categoryItemWrapper);
  });

  block.innerHTML = '';
  block.classList.add('cmp-product-category-listing'); // Add the main block class
  block.append(headerDiv, contentDiv);
}
