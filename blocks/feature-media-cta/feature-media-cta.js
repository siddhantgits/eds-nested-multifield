import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    imageCell,
    imageAltCell,
    eyebrowCell,
    titleCell,
    ...actionRows
  ] = [...block.children];

  // Create the main feature section
  const section = document.createElement('section');
  section.classList.add(
    'uol-c-feature',
    'uol-c-feature--media-rounded-diagonal',
    'uol-c-feature--ghost',
    'uol-c-feature--size-lg',
    'uol-l-contain--extra-wide',
    'uol-l-contain-space--spacious',
    'uol-c-feature-block-space--default',
    'uol-c-feature-inline-space--default',
    'uol-c-feature--rounded',
    'uol-c-feature--rounded-all',
  );
  moveInstrumentation(block, section);

  // Create media container
  const mediaDiv = document.createElement('div');
  mediaDiv.classList.add('uol-c-feature__media');

  const pictureDiv = document.createElement('div');
  pictureDiv.classList.add(
    'uol-c-picture',
    'uol-c-picture--cover',
    'uol-c-picture--rounded',
    'uol-c-feature__image',
  );

  const picture = imageCell.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const altText = imageAltCell?.textContent.trim() || img?.alt || '';
    const optimizedPic = createOptimizedPicture(img.src, altText, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    optimizedPic.classList.add('uol-c-picture__picture');
    pictureDiv.append(optimizedPic);
  }
  mediaDiv.append(pictureDiv);

  // Create content container
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('uol-c-feature__content');

  const eyebrowP = document.createElement('p');
  eyebrowP.classList.add('uol-c-feature__eyebrow');
  eyebrowP.textContent = eyebrowCell?.textContent.trim() || '';
  contentDiv.append(eyebrowP);

  const titleH2 = document.createElement('h2');
  titleH2.classList.add('uol-c-feature__title', 'uol-u-measure');
  titleH2.textContent = titleCell?.textContent.trim() || '';
  contentDiv.append(titleH2);

  const bodyDiv = document.createElement('div');
  bodyDiv.classList.add('uol-c-feature__body', 'uol-l-stack--prose');
  // No body field in model, so this will remain empty, matching original HTML structure
  contentDiv.append(bodyDiv);

  const actionsDiv = document.createElement('div');
  actionsDiv.classList.add('uol-c-feature__actions');

  actionRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const anchor = document.createElement('a');
    anchor.classList.add(
      'uol-c-button',
      'is-inverted',
      'uol-c-button--light',
      'uol-c-button--rounded',
      'uol-c-button--rounded-inline-end',
    );

    // The 'link' field is type=aem-content, so we must read its href from the <a> tag
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }

    const labelSpan = document.createElement('span');
    labelSpan.classList.add('uol-c-button__label');
    labelSpan.textContent = labelCell?.textContent.trim() || '';
    anchor.append(labelSpan);
    moveInstrumentation(row, anchor);
    actionsDiv.append(anchor);
  });
  contentDiv.append(actionsDiv);

  section.append(mediaDiv, contentDiv);

  block.innerHTML = '';
  block.append(section);
}
