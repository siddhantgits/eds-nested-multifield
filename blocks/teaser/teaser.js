import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    bgImageDesktopRow,
    bgImageMobileRow,
    teaserLinkRow,
    ...buttonRows
  ] = [...block.children];

  const teaserLink = teaserLinkRow?.querySelector('a')?.href;

  const teaserCta = document.createElement('div');
  teaserCta.classList.add('cmp-teaser', 'cmp-teaser--cta');

  const teaserAnchor = document.createElement('a');
  teaserAnchor.classList.add('cmp-teaser__link');
  if (teaserLink) {
    teaserAnchor.href = teaserLink;
  }

  const teaserContent = document.createElement('div');
  teaserContent.classList.add('cmp-teaser__content');

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('cmp-teaser__action-container');

  buttonRows.forEach((row) => {
    // The button label is in the first (and only) cell of the item row.
    // Access it directly as per the EDS Block Structure for fixed-field item models.
    const [labelCell] = [...row.children];
    if (labelCell) {
      const buttonWrapper = document.createElement('div');
      buttonWrapper.classList.add('button', 'cmp-button--primary-anchor');

      const button = document.createElement('button');
      button.type = 'button';
      button.classList.add('cmp-button');

      const buttonText = document.createElement('span');
      buttonText.classList.add('cmp-button__text');
      buttonText.textContent = labelCell.textContent.trim();
      moveInstrumentation(labelCell, buttonText);

      button.append(buttonText);
      buttonWrapper.append(button);
      actionContainer.append(buttonWrapper);
    }
  });

  teaserContent.append(actionContainer);
  teaserAnchor.append(teaserContent);
  teaserCta.append(teaserAnchor);

  const desktopPicture = bgImageDesktopRow?.querySelector('picture');
  const mobilePicture = bgImageMobileRow?.querySelector('picture');

  if (desktopPicture) {
    const img = desktopPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      teaserCta.style.backgroundImage = `url(${optimizedPic.querySelector('img').src})`;
      teaserCta.setAttribute('data-background-image-desktop', optimizedPic.querySelector('img').src);
    }
  }

  if (mobilePicture) {
    const img = mobilePicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      teaserCta.setAttribute('data-background-image-mobile', optimizedPic.querySelector('img').src);
      // For mobile, the background image will be set by CSS media queries
    }
  }

  block.innerHTML = '';
  block.append(teaserCta);
}
