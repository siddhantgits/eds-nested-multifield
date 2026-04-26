import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Use content detection instead of index access for robust parsing
  const cells = [...block.children];

  const backgroundImageDesktopCell = cells.find((cell) => cell.querySelector('picture') && cell.textContent.includes('Background Image Desktop'));
  const backgroundImageMobileCell = cells.find((cell) => cell.querySelector('picture') && cell.textContent.includes('Background Image Mobile'));
  const linkCell = cells.find((cell) => cell.querySelector('a'));
  const buttonLabelCell = cells.find((cell) => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim() !== '');

  const teaserLink = linkCell?.querySelector('a')?.href || '#';
  const buttonLabel = buttonLabelCell?.textContent.trim() || '';

  const wrapper = document.createElement('div');
  wrapper.classList.add('cmp-teaser', 'cmp-teaser--cta'); // Classes from ORIGINAL HTML

  const linkElement = document.createElement('a');
  linkElement.classList.add('cmp-teaser__link'); // Class from ORIGINAL HTML
  linkElement.href = teaserLink;
  moveInstrumentation(linkCell, linkElement);

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('cmp-teaser__content'); // Class from ORIGINAL HTML

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('cmp-teaser__action-container'); // Class from ORIGINAL HTML

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'cmp-button--primary-anchor'); // Classes from ORIGINAL HTML

  const button = document.createElement('button');
  button.classList.add('cmp-button'); // Class from ORIGINAL HTML
  button.type = 'button';
  button.id = `button-${Math.random().toString(36).substring(2, 11)}`; // Generate a unique ID
  button.setAttribute('data-request', 'true');

  const buttonTextSpan = document.createElement('span');
  buttonTextSpan.classList.add('cmp-button__text'); // Class from ORIGINAL HTML
  buttonTextSpan.textContent = buttonLabel; // Use the extracted buttonLabel
  moveInstrumentation(buttonLabelCell, buttonTextSpan);

  button.append(buttonTextSpan);
  buttonDiv.append(button);
  actionContainer.append(buttonDiv);
  contentDiv.append(actionContainer);
  linkElement.append(contentDiv);
  wrapper.append(linkElement);

  // Set background images
  const desktopPicture = backgroundImageDesktopCell?.querySelector('picture');
  const mobilePicture = backgroundImageMobileCell?.querySelector('picture');

  if (desktopPicture) {
    const desktopImg = desktopPicture.querySelector('img');
    if (desktopImg) {
      const optimizedDesktopPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '2000' }]);
      // Ensure the original img element's instrumentation is moved to the new img
      moveInstrumentation(desktopImg, optimizedDesktopPic.querySelector('img'));
      // Replace the original picture with the optimized one
      desktopPicture.replaceWith(optimizedDesktopPic);
      const desktopSrc = optimizedDesktopPic.querySelector('img').src;
      wrapper.style.backgroundImage = `url(${desktopSrc})`;
    }
  }

  // Add mobile image as a source for responsive background
  if (mobilePicture) {
    const mobileImg = mobilePicture.querySelector('img');
    if (mobileImg) {
      const optimizedMobilePic = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(mobileImg, optimizedMobilePic.querySelector('img'));
      mobilePicture.replaceWith(optimizedMobilePic);
      const mobileSrc = optimizedMobilePic.querySelector('img').src;

      // Add a CSS variable or data attribute for mobile background
      // The actual responsive switching would be handled by CSS media queries
      wrapper.style.setProperty('--teaser-mobile-background', `url(${mobileSrc})`);
    }
  }

  // Clear the block and append the new structure
  block.innerHTML = '';
  block.append(wrapper);
}
