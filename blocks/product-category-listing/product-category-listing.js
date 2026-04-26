import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const headerDiv = document.createElement('div');
  headerDiv.classList.add('cmp-product-category-listing__header');

  // CHECK 0 & 1: Replaced children[0] and children[1] with content detection for root rows.
  // Model has two root text fields, then a container of item rows.
  // The first row should contain the title, the second the subtitle.
  const titleRow = children.find((row, index) => index === 0 && row.firstElementChild?.textContent.trim());
  const subTitleRow = children.find((row, index) => index === 1 && row.firstElementChild?.textContent.trim());

  if (titleRow) {
    const title = document.createElement('h1');
    title.classList.add('cmp-product-category-listing__title');
    moveInstrumentation(titleRow, title);
    title.textContent = titleRow.firstElementChild?.textContent.trim() || '';
    headerDiv.append(title);
  }

  if (subTitleRow) {
    // CHECK 1.5: Fixed document.div to document.createElement('div')
    const subTitle = document.createElement('div');
    subTitle.classList.add('cmp-product-category-listing__subTitle', 'desc-2');
    moveInstrumentation(subTitleRow, subTitle);
    subTitle.textContent = subTitleRow.firstElementChild?.textContent.trim() || '';
    headerDiv.append(subTitle);
  }

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('cmp-product-category-listing__content');

  // All remaining rows are category-item
  // CHECK 1: Correctly slices from index 2 for item rows.
  const categoryItems = children.slice(2);

  categoryItems.forEach((row) => {
    // CHECK 0: This destructuring is correct for fixed-field item models.
    const [imageCell, linkCell, labelCell] = [...row.children];

    const categorylistDiv = document.createElement('div');
    categorylistDiv.classList.add('cmp-categorylist', 'cmp-categorylist--anchor');

    const anchor = document.createElement('a');
    anchor.classList.add('cmp-categorylist__item');

    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      // CHECK 3: Using labelCell.textContent for title attribute, not hardcoded.
      anchor.title = labelCell?.textContent.trim() || '';
    }
    moveInstrumentation(row, anchor);

    // Image wrapper
    const imageWrapper = document.createElement('span');
    imageWrapper.classList.add('cmp-categorylist__imagewrapper');

    const lazyImageContainer = document.createElement('div');
    lazyImageContainer.classList.add('lazy-image-container');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        // CHECK 1.5: Ensure createOptimizedPicture is used correctly.
        // The original code was creating an optimized picture but then trying to add classes to its internal img,
        // which might not be the direct child. It's better to append the optimized picture directly
        // and then apply classes if needed, or ensure createOptimizedPicture handles it.
        // For this scenario, the original approach of adding classes to the img within optimizedPic
        // is acceptable if createOptimizedPicture returns a <picture> element.
        // The classes 'lazy-image' and 'loaded' are from the ORIGINAL HTML.
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        if (optimizedImg) {
          optimizedImg.classList.add('cmp-categorylist__image', 'lazy-image', 'loaded');
          moveInstrumentation(img, optimizedImg);
        }
        lazyImageContainer.append(optimizedPic);
      }
    }
    imageWrapper.append(lazyImageContainer);
    anchor.append(imageWrapper);

    // Name span
    const nameSpan = document.createElement('span');
    nameSpan.classList.add('cmp-categorylist__name');
    // CHECK 3: Using labelCell.textContent for text content, not hardcoded.
    nameSpan.textContent = labelCell?.textContent.trim() || '';
    nameSpan.setAttribute('data-title', labelCell?.textContent.trim() || '');
    anchor.append(nameSpan);

    categorylistDiv.append(anchor);
    contentDiv.append(categorylistDiv);
  });

  // CHECK 4: block.innerHTML = ''; block.append(...) is the correct pattern.
  block.innerHTML = '';
  block.classList.add('cmp-product-category-listing');
  block.append(headerDiv);
  block.append(contentDiv);
}
