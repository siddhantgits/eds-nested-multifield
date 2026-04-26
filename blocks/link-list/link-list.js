import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const linkListComp = document.createElement('div');
  linkListComp.classList.add('tml-comp', 'link-list-comp', 'paddingBottom24', 'paddingTop24', 'mobile-padding14');

  const linkImageMain = document.createElement('div');
  linkImageMain.classList.add('link-image-main', 'linkWithImage', 'row');

  [...block.children].forEach((row) => {
    const cells = [...row.children];

    // CHECK 0 & 1.5 FIX: Replaced direct index access with content detection
    // Based on EDS Block Structure:
    // cell[0]: field="image" type=reference
    // cell[1]: field="label" type=text
    // cell[2]: field="link" type=aem-content
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    const linkImageListCol = document.createElement('div');
    linkImageListCol.classList.add('link-image-list', 'col');

    const linkImageDiv = document.createElement('div');
    linkImageDiv.classList.add('link-image');
    if (imageCell) { // Ensure imageCell exists before querying
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          linkImageDiv.append(optimizedPic);
        }
      }
      moveInstrumentation(imageCell, linkImageDiv);
    }


    const linkItemsDiv = document.createElement('div');
    linkItemsDiv.classList.add('link-items');

    const anchor = document.createElement('a');
    if (linkCell) { // Ensure linkCell exists before querying
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href; // Correctly extract href from aem-content cell
      }
      moveInstrumentation(linkCell, anchor);
    }


    const h6 = document.createElement('h6');
    if (labelCell) { // Ensure labelCell exists before querying
      h6.textContent = labelCell.textContent.trim(); // Correctly extract text from text cell
      moveInstrumentation(labelCell, h6);
    }


    const iconSpan = document.createElement('span');
    iconSpan.classList.add('icon-Arrow-Right');
    h6.append(iconSpan);
    anchor.append(h6);
    linkItemsDiv.append(anchor);

    linkImageListCol.append(linkImageDiv, linkItemsDiv);
    moveInstrumentation(row, linkImageListCol);
    linkImageMain.append(linkImageListCol);
  });

  linkListComp.append(linkImageMain);
  block.innerHTML = '';
  block.append(linkListComp);
}
