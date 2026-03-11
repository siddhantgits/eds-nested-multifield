import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const section = document.createElement('section');
  section.className = 'stickyNavigation-sticky-bottom-nav stickyNavigation-position-fixed stickyNavigation-bottom-0 stickyNavigation-p-3 stickyNavigation-d-flex stickyNavigation-align-items-center stickyNavigation-boing-container stickyNavigation-bg-boing-primary';

  const ul = document.createElement('ul');
  ul.className = 'stickyNavigation-sticky-bottom-nav__list stickyNavigation-d-flex stickyNavigation-justify-content-around stickyNavigation-align-items-center stickyNavigation-flex-grow-1';

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.className = 'stickyNavigation-sticky-bottom-nav__item stickyNavigation-position-relative';

    const linkCell = row.children[2]; // Assuming link is the third cell based on JSON
    const iconCell = row.children[0]; // Assuming icon is the first cell
    const labelCell = row.children[1]; // Assuming label is the second cell
    const consentCell = row.children[3]; // Assuming consent is the fourth cell

    const linkElement = linkCell.querySelector('a');
    const iconElement = iconCell.querySelector('img');
    const labelText = labelCell.textContent.trim();
    const consentValue = consentCell.textContent.trim().toLowerCase() === 'true';

    if (linkElement && iconElement) {
      const newLink = document.createElement('a');
      newLink.href = linkElement.href;
      newLink.className = 'stickyNavigation-sticky-bottom-nav__link stickyNavigation-d-flex stickyNavigation-flex-column stickyNavigation-align-items-center stickyNavigation-gap-1 stickyNavigation-analytics_cta_click';
      newLink.setAttribute('data-consent', consentValue);
      newLink.setAttribute('data-link', linkElement.getAttribute('data-link') || linkElement.href); // Use existing data-link or fallback to href

      const optimizedPic = createOptimizedPicture(iconElement.src, iconElement.alt);
      moveInstrumentation(iconElement, optimizedPic.querySelector('img'));
      optimizedPic.querySelector('img').className = 'stickyNavigation-sticky-bottom-nav__icon';
      newLink.append(optimizedPic);

      const span = document.createElement('span');
      span.className = 'stickyNavigation-sticky-bottom-nav__label';
      span.textContent = labelText;
      newLink.append(span);

      li.append(newLink);
    }
    ul.append(li);
  });

  section.append(ul);
  block.textContent = '';
  block.append(section);
}
