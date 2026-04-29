import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [eyebrowRow, titleRow, introRow, ...swimlaneItemRows] = [...block.children];

  // Clear existing block content
  block.innerHTML = '';

  const sectionInner = document.createElement('div');
  sectionInner.classList.add('uol-c-section__inner', 'uol-l-space-block--spacious');
  block.append(sectionInner);

  const header = document.createElement('header');
  header.classList.add(
    'uol-c-section__header',
    'uol-c-section__header--default',
    'uol-l-contain--wide',
    'uol-l-contain-space--spacious',
    'uol-c-section__header--title-default',
  );
  sectionInner.append(header);

  if (eyebrowRow) {
    const eyebrow = document.createElement('p');
    eyebrow.classList.add('uol-c-section__eyebrow', 'uol-u-heading-4');
    moveInstrumentation(eyebrowRow, eyebrow);
    eyebrow.textContent = eyebrowRow.firstElementChild?.textContent.trim() || '';
    header.append(eyebrow);
  }

  if (titleRow) {
    const title = document.createElement('h2');
    title.classList.add('uol-c-section__title');
    moveInstrumentation(titleRow, title);
    title.textContent = titleRow.firstElementChild?.textContent.trim() || '';
    header.append(title);
  }

  if (introRow) {
    const intro = document.createElement('div');
    intro.classList.add('uol-c-section__intro', 'uol-l-stack--prose', 'uol-u-measure');
    moveInstrumentation(introRow, intro);
    intro.innerHTML = introRow.firstElementChild?.innerHTML || '';
    header.append(intro);
  }

  const main = document.createElement('div');
  main.classList.add('uol-c-section__main', 'uol-l-stack--spacious');
  sectionInner.append(main);

  const swimlane = document.createElement('div');
  swimlane.classList.add('uol-c-swimlane', 'uol-l-contain--wide', 'uol-l-contain-space--spacious', 'uol-c-swimlane--overflow-visible');
  main.append(swimlane);

  const swimlaneItems = document.createElement('div');
  swimlaneItems.classList.add('uol-c-swimlane__items');
  swimlane.append(swimlaneItems);

  swimlaneItemRows.forEach((row) => {
    const [imageCell, imageAltCell, titleCell, linkCell, iconCell] = [...row.children];

    const swimlaneItem = document.createElement('div');
    swimlaneItem.classList.add('uol-c-swimlane__item');
    moveInstrumentation(row, swimlaneItem);

    const card = document.createElement('article');
    card.classList.add('uol-c-card', 'is-clickable', 'has-media', 'uol-c-card--media-rounded', 'uol-c-card--eyebrow-border');

    const cardMedia = document.createElement('div');
    cardMedia.classList.add('uol-c-card__media', 'uol-c-card--media-square');
    card.append(cardMedia);

    const cardTag = document.createElement('span');
    cardTag.classList.add('uol-c-card__tag');
    cardTag.style.display = 'none'; // Hidden in original HTML
    cardMedia.append(cardTag);

    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, imageAltCell?.textContent.trim() || img.alt, false, [{ width: '750' }]);
        moveInstrumentation(picture, optimizedPic.querySelector('img'));

        const cardImageDiv = document.createElement('div');
        cardImageDiv.classList.add('uol-c-picture', 'uol-c-card__image');
        cardImageDiv.append(optimizedPic);
        cardMedia.append(cardImageDiv);
      }
    }

    const cardContent = document.createElement('div');
    cardContent.classList.add('uol-c-card__content');
    card.append(cardContent);

    const cardHeader = document.createElement('header');
    cardHeader.classList.add('uol-c-card__header', 'uol-u-measure');
    cardContent.append(cardHeader);

    const cardTitle = document.createElement('h3');
    cardTitle.classList.add('uol-c-card__title');
    cardHeader.append(cardTitle);

    const link = document.createElement('a');
    link.classList.add('uol-c-link', 'has-icon', 'is-pop-out', 'uol-c-card__title-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }

    const linkInner = document.createElement('span');
    linkInner.classList.add('uol-c-link__inner');
    link.append(linkInner);

    if (iconCell) {
      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const iconImg = iconPicture.querySelector('img');
        const iconSpan = document.createElement('span');
        iconSpan.classList.add('uol-c-link__icon--start');
        const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '24' }]);
        moveInstrumentation(iconImg, optimizedIcon.querySelector('img'));
        iconSpan.append(optimizedIcon);
        linkInner.append(iconSpan);
      }
    }

    const linkLabel = document.createElement('span');
    linkLabel.classList.add('uol-c-link__label');
    linkLabel.textContent = titleCell?.textContent.trim() || '';
    linkInner.append(linkLabel);

    const visuallyHiddenSpan = document.createElement('span');
    visuallyHiddenSpan.classList.add('uol-u-visually-hidden');
    visuallyHiddenSpan.textContent = ' (Opens in new modal)'; // Hardcoded in original HTML
    linkLabel.append(visuallyHiddenSpan);

    cardTitle.append(link);

    const cardBody = document.createElement('div');
    cardBody.classList.add('uol-c-card__body', 'uol-l-stack--compact', 'uol-u-measure');
    cardContent.append(cardBody);

    swimlaneItem.append(card);
    swimlaneItems.append(swimlaneItem);
  });

  const swimlaneControls = document.createElement('div');
  swimlaneControls.classList.add('uol-c-swimlane__controls');
  swimlane.append(swimlaneControls);

  // Create previous button
  const prevButton = document.createElement('button');
  prevButton.classList.add(
    'uol-c-button',
    'is-disabled',
    'is-inverted',
    'is-icon-start',
    'uol-c-button--light',
    'uol-c-button--size-sm',
    'uol-c-button--rounded',
    'uol-c-button--rounded-inline-start',
    'uol-c-swimlane__button',
    'uol-c-swimlane__button--prev',
  );
  prevButton.setAttribute('aria-disabled', 'true');
  prevButton.setAttribute('tabindex', '-1');
  prevButton.type = 'button';
  swimlaneControls.append(prevButton);

  const prevButtonLabel = document.createElement('span');
  prevButtonLabel.classList.add('uol-c-button__label');
  // Read "Previous" from a cell if available, otherwise use default
  const prevButtonTextCell = block.querySelector(':scope > div:last-child > div:nth-child(1) > div:nth-child(1)'); // Assuming a cell for "Previous" text
  prevButtonLabel.textContent = prevButtonTextCell?.textContent.trim() || 'Previous ';
  prevButton.append(prevButtonLabel);

  const prevButtonIcon = document.createElement('span');
  prevButtonIcon.classList.add('uol-c-button__icon');
  const prevIconCell = block.querySelector(':scope > div:last-child > div:nth-child(1) > div:nth-child(2) picture'); // Assuming a cell for prev icon
  if (prevIconCell) {
    const prevIconImg = prevIconCell.querySelector('img');
    const optimizedPrevIcon = createOptimizedPicture(prevIconImg.src, prevIconImg.alt, false, [{ width: '24' }]);
    moveInstrumentation(prevIconImg, optimizedPrevIcon.querySelector('img'));
    prevButtonIcon.append(optimizedPrevIcon);
  } else {
    // Fallback if no icon cell is provided, or if the original HTML had a hardcoded SVG
    const prevIconImg = document.createElement('img');
    prevIconImg.alt = 'Previous icon'; // Provide a meaningful alt text
    prevIconImg.src = '/content/dam/aemigrate/uploaded-folder/image/1777440368370.svg'; // Fallback to hardcoded path if no cell
    prevButtonIcon.append(prevIconImg);
  }
  prevButton.append(prevButtonIcon);

  // Create next button
  const nextButton = document.createElement('button');
  nextButton.classList.add(
    'uol-c-button',
    'is-inverted',
    'is-icon-end',
    'uol-c-button--light',
    'uol-c-button--size-sm',
    'uol-c-button--rounded',
    'uol-c-button--rounded-inline-end',
    'uol-c-swimlane__button',
    'uol-c-swimlane__button--next',
  );
  nextButton.type = 'button';
  swimlaneControls.append(nextButton);

  const nextButtonLabel = document.createElement('span');
  nextButtonLabel.classList.add('uol-c-button__label');
  // Read "Next" from a cell if available, otherwise use default
  const nextButtonTextCell = block.querySelector(':scope > div:last-child > div:nth-child(2) > div:nth-child(1)'); // Assuming a cell for "Next" text
  nextButtonLabel.textContent = nextButtonTextCell?.textContent.trim() || 'Next ';
  nextButton.append(nextButtonLabel);

  const nextButtonIcon = document.createElement('span');
  nextButtonIcon.classList.add('uol-c-button__icon');
  const nextIconCell = block.querySelector(':scope > div:last-child > div:nth-child(2) > div:nth-child(2) picture'); // Assuming a cell for next icon
  if (nextIconCell) {
    const nextIconImg = nextIconCell.querySelector('img');
    const optimizedNextIcon = createOptimizedPicture(nextIconImg.src, nextIconImg.alt, false, [{ width: '24' }]);
    moveInstrumentation(nextIconImg, optimizedNextIcon.querySelector('img'));
    nextButtonIcon.append(optimizedNextIcon);
  } else {
    // Fallback if no icon cell is provided, or if the original HTML had a hardcoded SVG
    const nextIconImg = document.createElement('img');
    nextIconImg.alt = 'Next icon'; // Provide a meaningful alt text
    nextIconImg.src = '/content/dam/aemigrate/uploaded-folder/image/1777440368441.svg'; // Fallback to hardcoded path if no cell
    nextButtonIcon.append(nextIconImg);
  }
  nextButton.append(nextButtonIcon);

  // Add event listeners for swimlane controls
  let currentIndex = 0;
  // Ensure swimlaneItems has children before trying to get offsetWidth
  const itemWidth = swimlaneItemRows.length > 0 && swimlaneItems.firstElementChild ? swimlaneItems.firstElementChild.offsetWidth : 0;
  const totalItems = swimlaneItemRows.length;

  const updateSwimlane = () => {
    swimlaneItems.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    prevButton.classList.toggle('is-disabled', currentIndex === 0);
    prevButton.setAttribute('aria-disabled', currentIndex === 0);
    prevButton.setAttribute('tabindex', currentIndex === 0 ? '-1' : '0');

    nextButton.classList.toggle('is-disabled', currentIndex >= totalItems - 1);
    nextButton.setAttribute('aria-disabled', currentIndex >= totalItems - 1);
    nextButton.setAttribute('tabindex', currentIndex >= totalItems - 1 ? '-1' : '0');
  };

  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSwimlane();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentIndex < totalItems - 1) {
      currentIndex++;
      updateSwimlane();
    }
  });

  // Initial update
  updateSwimlane();
}
