import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [eyebrowRow, titleRow, footerLinkRow, footerLabelRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('uol-c-section', 'uol-c-section--cloud', 'uol-c-section--rounded');
  moveInstrumentation(block, section);

  const sectionInner = document.createElement('div');
  sectionInner.classList.add('uol-c-section__inner', 'uol-l-space-block--spacious');
  section.append(sectionInner);

  const header = document.createElement('header');
  header.classList.add('uol-c-section__header', 'uol-c-section__header--default', 'uol-l-contain--wide', 'uol-l-contain-space--spacious');
  sectionInner.append(header);

  const eyebrow = document.createElement('p');
  eyebrow.classList.add('uol-c-section__eyebrow', 'uol-u-heading-4');
  eyebrow.textContent = eyebrowRow?.firstElementChild?.textContent.trim() || '';
  moveInstrumentation(eyebrowRow, eyebrow);
  header.append(eyebrow);

  const title = document.createElement('h2');
  title.classList.add('uol-c-section__title');
  title.textContent = titleRow?.firstElementChild?.textContent.trim() || '';
  moveInstrumentation(titleRow, title);
  header.append(title);

  const main = document.createElement('div');
  main.classList.add('uol-c-section__main', 'uol-l-stack--spacious');
  sectionInner.append(main);

  const collection = document.createElement('div');
  collection.classList.add('uol-c-collection', 'uol-c-collection--columns-4', 'uol-l-contain--wide', 'uol-l-contain-space--spacious');
  main.append(collection);

  const collectionInner = document.createElement('div');
  collectionInner.classList.add('uol-c-collection__inner');
  collection.append(collectionInner);

  const collectionItems = document.createElement('div');
  collectionItems.classList.add('uol-c-collection__items');
  collectionInner.append(collectionItems);

  cardRows.forEach((row) => {
    const [imageCell, imageAltCell, cardTitleCell, cardLinkCell, cardBodyCell] = [...row.children];

    const collectionItem = document.createElement('div');
    collectionItem.classList.add('uol-c-collection__item');
    moveInstrumentation(row, collectionItem);

    const article = document.createElement('article');
    article.classList.add('uol-c-card', 'uol-c-card--sky', 'uol-c-card--default', 'is-clickable', 'has-media', 'uol-c-card--media-rounded', 'uol-c-card--content-default', 'uol-c-card--eyebrow-border');
    collectionItem.append(article);

    const media = document.createElement('div');
    media.classList.add('uol-c-card__media', 'uol-c-card--media-square');
    article.append(media);

    const pictureWrapper = document.createElement('div');
    pictureWrapper.classList.add('uol-c-picture', 'uol-c-card__image');
    media.append(pictureWrapper);

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, imageAltCell?.textContent.trim() || img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      pictureWrapper.append(optimizedPic);
    }

    const content = document.createElement('div');
    content.classList.add('uol-c-card__content');
    article.append(content);

    const cardHeader = document.createElement('header');
    cardHeader.classList.add('uol-c-card__header', 'uol-u-measure');
    content.append(cardHeader);

    const h3 = document.createElement('h3');
    h3.classList.add('uol-c-card__title');
    cardHeader.append(h3);

    const link = document.createElement('a');
    link.classList.add('uol-c-link', 'uol-c-card__title-link');
    link.href = cardLinkCell?.querySelector('a')?.href || '#';
    moveInstrumentation(cardLinkCell, link);

    const linkInner = document.createElement('span');
    linkInner.classList.add('uol-c-link__inner');
    link.append(linkInner);

    const linkLabel = document.createElement('span');
    linkLabel.classList.add('uol-c-link__label');
    linkLabel.textContent = cardTitleCell?.textContent.trim() || '';
    linkInner.append(linkLabel);
    h3.append(link);

    const cardBody = document.createElement('div');
    cardBody.classList.add('uol-c-card__body', 'uol-l-stack--compact', 'uol-u-measure');
    cardBody.innerHTML = cardBodyCell?.innerHTML || '';
    moveInstrumentation(cardBodyCell, cardBody);
    content.append(cardBody);

    collectionItems.append(collectionItem);
  });

  const collectionFooter = document.createElement('div');
  collectionFooter.classList.add('uol-c-collection__footer');
  collection.append(collectionFooter);

  const footerButton = document.createElement('a');
  footerButton.classList.add('uol-c-button', 'uol-c-button--light', 'uol-c-button--rounded', 'uol-c-button--rounded-inline-end');
  footerButton.href = footerLinkRow?.querySelector('a')?.href || '#';
  moveInstrumentation(footerLinkRow, footerButton);

  const buttonLabel = document.createElement('span');
  buttonLabel.classList.add('uol-c-button__label');
  buttonLabel.textContent = footerLabelRow?.firstElementChild?.textContent.trim() || '';
  moveInstrumentation(footerLabelRow, buttonLabel);
  footerButton.append(buttonLabel);
  collectionFooter.append(footerButton);

  block.innerHTML = '';
  block.append(section);
}
