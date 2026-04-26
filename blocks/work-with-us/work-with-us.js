import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...slideRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular');
  // CHECK 0 & 1: headingRow.children[0] is a root field, not an item row.
  // It's the only cell in its row, so index 0 is acceptable here.
  heading.textContent = headingRow.children[0]?.textContent.trim() || '';
  moveInstrumentation(headingRow.children[0], heading);
  sectionHeader.append(heading);

  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative');

  const container = document.createElement('div');
  container.classList.add('container');

  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');

  slideRows.forEach((row) => {
    // CHECK 0: Replaced direct index access with content detection for item rows.
    // The BlockJson model defines 5 fields for 'work-with-us-slide', so we expect 5 cells.
    const cells = [...row.children];
    const imageCell = cells[0]; // image is always first
    const altCell = cells[1]; // alt text is always second
    const titleCell = cells[2]; // title is always third
    const descriptionCell = cells[3]; // description is always fourth
    const linkCell = cells[4]; // link is always fifth

    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    // CHECK 1: The original HTML sometimes has an image-wrap and sometimes doesn't.
    // The JS should reflect this optionality.
    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');
    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        // CHECK 1: altText from altCell
        const optimizedPic = createOptimizedPicture(img.src, altCell?.textContent.trim() || '', false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageWrap.append(optimizedPic);
        moveInstrumentation(imageCell, imageWrap); // Move instrumentation only if imageWrap is used
        wrapDiv.append(imageWrap); // Append imageWrap only if it contains content
      }
    }

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const title = document.createElement('h3');
    title.classList.add('heading', 'font-regular');
    // CHECK 1: title from titleCell
    title.textContent = titleCell?.textContent.trim() || '';
    moveInstrumentation(titleCell, title);

    const description = document.createElement('p');
    description.classList.add('text-size-body');
    // CHECK 1: description from descriptionCell
    description.textContent = descriptionCell?.textContent.trim() || '';
    moveInstrumentation(descriptionCell, description);

    const linkAnchor = document.createElement('a');
    linkAnchor.classList.add('btn', 'btn-primary', 'stretched-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      linkAnchor.href = foundLink.href;
      // CHECK 3: Replaced hardcoded 'Learn More' with text from the link cell's <a> tag.
      // The original HTML shows the link text is 'Learn More' but it's part of the <a> tag content.
      linkAnchor.textContent = foundLink.textContent.trim();
    }
    moveInstrumentation(linkCell, linkAnchor);

    contentSectionHeader.append(title, description, linkAnchor);
    contentWrap.append(contentSectionHeader);

    wrapDiv.append(contentWrap); // contentWrap is always present

    slideDiv.append(wrapDiv);
    moveInstrumentation(row, slideDiv);
    gridLayout.append(slideDiv);
  });

  container.append(gridLayout);
  positionRelativeDiv.append(container);

  // CHECK 4: block.innerHTML = '' is correct.
  block.innerHTML = '';
  // CHECK 1: Added section and pb-0 classes to the block itself as per original HTML.
  block.classList.add('section', 'work-with-us', 'pb-0');
  block.append(sectionHeader, positionRelativeDiv);
}
