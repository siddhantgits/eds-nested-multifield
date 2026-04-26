import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    desktopImageRow, // Renamed from desktopImageCell for clarity as it's a row containing a cell
    fileReferenceRow, // Renamed from fileReferenceCell for clarity as it's a row containing a cell
    titleRow,         // Renamed from titleCell for clarity as it's a row containing a cell
    descriptionRow,   // Renamed from descriptionCell for clarity as it's a row containing a cell
    ...linkRows
  ] = [...block.children];

  // Create the main container
  const ttilComp = document.createElement('div');
  ttilComp.classList.add(
    'ttil-comp',
    'view5050',
    'paddingBottom40',
    'paddingTop40',
    'mobile-padding14',
    'homePage'
  );
  moveInstrumentation(block, ttilComp);

  const view5050Div = document.createElement('div');
  view5050Div.classList.add('view5050');

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row', 'm-0', 'gray', 'flex-row');

  // Image Section
  const imageSection = document.createElement('div');
  imageSection.classList.add('image-section', 'col-md-6');

  // Find the actual cell within the desktopImageRow
  const desktopImageCell = [...desktopImageRow.children].find(c => c.querySelector('picture'));
  const desktopPicture = desktopImageCell?.querySelector('picture');

  if (desktopPicture) {
    const img = desktopPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      desktopPicture.replaceWith(optimizedPic);
    }
    imageSection.appendChild(desktopPicture);
  } else {
    // Fallback to fileReference if desktopImage is not present
    // Find the actual cell within the fileReferenceRow
    const fileReferenceCell = [...fileReferenceRow.children].find(c => c.querySelector('picture'));
    const fileReferencePicture = fileReferenceCell?.querySelector('picture');
    if (fileReferencePicture) {
      const img = fileReferencePicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        fileReferencePicture.replaceWith(optimizedPic);
      }
      imageSection.appendChild(fileReferencePicture);
    }
  }

  rowDiv.appendChild(imageSection);

  // Text Section
  const textWrapper = document.createElement('div');
  textWrapper.classList.add('text-wrapper', 'col-md-6');

  const textContainer = document.createElement('div');
  textContainer.classList.add(
    'text-container',
    'xp-ttil',
    'd-flex',
    'flex-column',
    'h-100',
    'black-grey03',
    'defaultview01'
  );

  const contentDown = document.createElement('div');
  contentDown.classList.add('content-down');

  // Title
  const titleEl = document.createElement('h5');
  titleEl.classList.add('ttil-title', 'pb-1', 'pb-lg-3', 'aos-init', 'aos-animate');
  // Find the actual cell within the titleRow
  const titleCell = [...titleRow.children].find(c => c.textContent.trim());
  titleEl.textContent = titleCell?.textContent.trim() || '';
  moveInstrumentation(titleCell, titleEl);
  contentDown.appendChild(titleEl);

  // Description
  const ctnWrap = document.createElement('div');
  ctnWrap.classList.add('ctn-wrap');

  const descriptionEl = document.createElement('div');
  descriptionEl.classList.add('ttil-description', 'aos-init', 'aos-animate');
  // Find the actual cell within the descriptionRow
  const descriptionCell = [...descriptionRow.children].find(c => c.innerHTML.trim());
  descriptionEl.innerHTML = descriptionCell?.innerHTML || '';
  moveInstrumentation(descriptionCell, descriptionEl);
  ctnWrap.appendChild(descriptionEl);
  contentDown.appendChild(ctnWrap);
  textContainer.appendChild(contentDown);

  // Links Section
  const linksSection = document.createElement('div');
  linksSection.classList.add('links-section', 'mt-auto', 'd-flex');

  linkRows.forEach((row) => {
    // CRITICAL FIX: Use content detection instead of index access for item rows
    // EDS Block Structure indicates:
    // cell[0]: field="link" label="Link" type=aem-content — read: cell.querySelector('a').href
    // cell[1]: field="label" label="Link Label" type=text — read: cell.textContent.trim()
    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('a') && cell.textContent.trim());

    const linkEl = document.createElement('a');
    linkEl.classList.add('ttil-cta', 'cta-link', 'blue', 'aos-init', 'aos-animate');

    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
    }

    const labelSpan = document.createElement('span');
    labelSpan.classList.add('link-label');
    labelSpan.textContent = labelCell?.textContent.trim() || '';
    linkEl.appendChild(labelSpan);

    moveInstrumentation(row, linkEl);
    linksSection.appendChild(linkEl);
  });
  textContainer.appendChild(linksSection);

  textWrapper.appendChild(textContainer);
  rowDiv.appendChild(textWrapper);

  view5050Div.appendChild(rowDiv);
  ttilComp.appendChild(view5050Div);

  block.innerHTML = '';
  block.appendChild(ttilComp);
}
