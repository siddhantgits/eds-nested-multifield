import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
      }
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('cmp-header__submenu'); // Use class from ORIGINAL HTML
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
    }
    // Apply classes from ORIGINAL HTML to nested elements
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-2');
    if (!li.querySelector('ul')) {
      li.classList.add('cmp-header__no-item');
    }
    if (anchor) {
      anchor.classList.add('cmp-navigation__item-link');
    }
    if (nested) {
      nested.classList.add('cmp-navigation__group', 'cmp-header__submenu');
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Root fields: logo, logo-link
  const logoRow = children[0];
  const logoLinkRow = children[1];

  const itemRows = children.slice(2); // All subsequent rows are item rows

  const header = document.createElement('div');
  header.classList.add('cmp-header');

  const hamburgerInput = document.createElement('input');
  hamburgerInput.classList.add('cmp-header__hamburger');
  hamburgerInput.type = 'checkbox';
  header.append(hamburgerInput);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image', 'cmp-header__logo');
  const logoLink = document.createElement('a');
  logoLink.classList.add('cmp-image__link');
  logoLink.href = logoLinkRow.querySelector('a')?.href || '/';

  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }
  moveInstrumentation(logoRow, logoLink);
  logoDiv.append(logoLink);
  header.append(logoDiv);

  const navLinksDiv = document.createElement('div');
  navLinksDiv.classList.add('cmp-header__nav-links');
  const navigationDiv = document.createElement('div');
  navigationDiv.classList.add('navigation');
  const nav = document.createElement('nav');
  nav.classList.add('cmp-navigation');
  nav.setAttribute('role', 'navigation');
  const navGroup = document.createElement('ul');
  navGroup.classList.add('cmp-navigation__group', 'cmp-header__nav-group');
  nav.append(navGroup);
  navigationDiv.append(nav);
  navLinksDiv.append(navigationDiv);

  // Content detection for item rows
  const navigationItems = itemRows.filter((row) => row.children.length === 3 && row.querySelector('ul'));
  const policyLinkItems = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture') && !row.querySelector('ul'));
  const socialLinkItems = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture') && row.querySelector('a') && !row.querySelector('ul'));
  const navIconItems = itemRows.filter((row) => row.children.length === 3 && !row.querySelector('picture') && row.querySelector('a') && !row.querySelector('ul'));
  const simpleNavigationItems = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture') && row.querySelector('a') && !row.querySelector('ul'));


  // Navigation Menu
  navigationItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('ul'));
    const linkCell = cells.find(cell => cell.querySelector('a') && !cell.querySelector('ul'));
    const hierarchyCell = cells.find(cell => cell.querySelector('ul'));

    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products');

    const foundLink = linkCell?.querySelector('a');
    let rootEl;
    if (foundLink) {
      rootEl = document.createElement('a');
      rootEl.href = foundLink.href;
      rootEl.classList.add('cmp-navigation__item-link');
    } else {
      rootEl = document.createElement('span'); // Use span for non-linked labels
      rootEl.classList.add('cmp-navigation__item-link'); // Apply link styling for consistency
    }
    rootEl.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, rootEl);
    li.appendChild(rootEl);

    if (hierarchyCell) {
      li.classList.add('cmp-header__nav-products-click'); // For items with sub-menus
      const wrapper = document.createElement('ul');
      wrapper.classList.add('cmp-navigation__group', 'cmp-header__product-items');
      const categoryMenuDiv = document.createElement('div');
      categoryMenuDiv.classList.add('cmp-header__category-menu');

      // Create a temporary div to parse the richtext HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell

      // Apply classes to all nested elements from ORIGINAL HTML
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('cmp-navigation__group'));
      tempDiv.querySelectorAll('li').forEach(liItem => liItem.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-1'));
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('cmp-navigation__item-link'));

      // Move children from tempDiv to categoryMenuDiv
      while (tempDiv.firstChild) {
        categoryMenuDiv.append(tempDiv.firstChild);
      }

      wrapper.appendChild(categoryMenuDiv);

      rootEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        wrapper.classList.toggle('active');
        li.classList.toggle('active');
      });
      li.appendChild(wrapper);
      transformNestedLists(categoryMenuDiv); // Apply transformations to the new structure
    } else {
      li.classList.add('cmp-header__no-items'); // For items without sub-menus
    }
    navGroup.appendChild(li);
  });

  // Policy Links (mobile-only)
  const mobileListDiv = document.createElement('div');
  mobileListDiv.classList.add('cmp-header__mobile-list');
  const policyUl = document.createElement('ul');
  policyUl.classList.add('cmp-header__policy');
  policyLinkItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const linkCell = cells[1];

    const li = document.createElement('li');
    li.classList.add('cmp-header__policy-list');
    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, anchor);
    li.append(anchor);
    policyUl.append(li);
  });
  mobileListDiv.append(policyUl);

  // Social Media Links (mobile-only)
  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.classList.add('cmp-header__social-media');
  socialLinkItems.forEach((row) => {
    const cells = [...row.children];
    const platformCell = cells[0];
    const linkCell = cells[1];

    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    const platform = platformCell?.textContent.trim().toLowerCase();
    if (platform === 'instagram') anchor.classList.add('icon-instagram');
    else if (platform === 'facebook') anchor.classList.add('icon-facebok'); // Typo fixed: 'icon-facebok' -> 'icon-facebook' if intended
    else if (platform === 'twitter') anchor.classList.add('icon-twitter');
    else if (platform === 'youtube') anchor.classList.add('icon-youtube');
    moveInstrumentation(row, anchor);
    socialMediaDiv.append(anchor);
  });
  mobileListDiv.append(socialMediaDiv);
  nav.append(mobileListDiv);

  // Header Nav Icons
  const navIconsDiv = document.createElement('div');
  navIconsDiv.classList.add('cmp-header__nav-icons');
  navIconItems.forEach((row) => {
    const cells = [...row.children];
    const iconTypeCell = cells[0];
    const linkCell = cells[1];
    const labelCell = cells[2];

    const iconWrapper = document.createElement('div');
    iconWrapper.classList.add('cmp-header__search'); // Default to search class for now

    const anchor = document.createElement('a');
    anchor.classList.add('cmp-header__icon-img');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;

    const iconDiv = document.createElement('div');
    const iconType = iconTypeCell?.textContent.trim().toLowerCase();
    if (iconType === 'accessibility') {
      iconDiv.classList.add('icon-accessibility');
      iconWrapper.classList.add('cmp-header__accessbility', 'cmp-header__hide-icon');
    } else if (iconType === 'search') {
      iconDiv.classList.add('icon-search');
      iconWrapper.classList.add('cmp-header__search');
    } else if (iconType === 'profile') {
      iconDiv.classList.add('icon-profile');
      iconWrapper.classList.add('cmp-header__login', 'cmp-header__hide-icon');
    }
    anchor.append(iconDiv);

    const labelText = labelCell?.textContent.trim();
    if (labelText) {
      const labelDiv = document.createElement('div');
      labelDiv.classList.add('cmp-header__icon-text');
      labelDiv.textContent = labelText;
      anchor.append(labelDiv);
    }
    moveInstrumentation(row, anchor);
    iconWrapper.append(anchor);
    navIconsDiv.append(iconWrapper);
  });
  header.append(navIconsDiv);

  block.innerHTML = '';
  block.append(header);
}
