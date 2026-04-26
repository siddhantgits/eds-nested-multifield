import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, level = 1) {
  rootUl.classList.add('cmp-navigation__group'); // Add missing class
  rootUl.querySelectorAll(':scope > li').forEach((li) => {
    li.classList.add('cmp-navigation__item', `cmp-navigation__item--level-${level}`); // Add missing classes

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
    } else {
      anchor.classList.add('cmp-navigation__item-link'); // Add missing class
    }

    if (nested) {
      li.classList.add('cmp-header__nav-products-click'); // Add class for items with submenus
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('cmp-header__submenu');
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
      transformNestedLists(nested, level + 1); // Recursively transform nested lists
    } else {
      li.classList.add('cmp-header__no-item'); // Add class for items without submenus
    }
  });
}

export default function decorate(block) {
  const [logoRow, logoLinkRow, ...itemRows] = [...block.children];

  block.innerHTML = '';
  block.classList.add('cmp-header');

  const hamburgerInput = document.createElement('input');
  hamburgerInput.classList.add('cmp-header__hamburger');
  hamburgerInput.type = 'checkbox';
  block.append(hamburgerInput);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image', 'cmp-header__logo');
  moveInstrumentation(logoRow, logoDiv);

  const logoLink = document.createElement('a');
  logoLink.classList.add('cmp-image__link');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  } else {
    logoLink.href = '/'; // Default link
  }
  moveInstrumentation(logoLinkRow, logoLink);

  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  logoDiv.append(logoLink);
  block.append(logoDiv);

  const navLinksDiv = document.createElement('div');
  navLinksDiv.classList.add('cmp-header__nav-links');

  const navigationDiv = document.createElement('div');
  navigationDiv.classList.add('navigation');

  const nav = document.createElement('nav');
  nav.classList.add('cmp-navigation');
  nav.setAttribute('role', 'navigation');

  const mainUl = document.createElement('ul');
  mainUl.classList.add('cmp-navigation__group', 'cmp-header__nav-group');

  const navigationItems = itemRows.filter((row) => row.children.length === 3);
  const policyLinkItems = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture') && row.querySelector('a'));
  const socialMediaItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('a') && row.children[0].textContent.trim().toLowerCase() !== 'icon type label text'); // Differentiate from nav icons
  const navIconItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('a') && row.children[0].textContent.trim().toLowerCase().includes('icon type')); // Differentiate from social media

  navigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products');
    moveInstrumentation(row, li);

    const foundLink = linkCell.querySelector('a');
    let rootEl;
    if (foundLink) {
      rootEl = document.createElement('a');
      rootEl.href = foundLink.href;
      rootEl.classList.add('cmp-navigation__item-link');
    } else {
      rootEl = document.createElement('span'); // Use span if no link for the root item
    }
    rootEl.textContent = labelCell?.textContent.trim() || '';
    li.appendChild(rootEl);

    const hierarchyRoot = hierarchyCell.querySelector('ul');
    if (hierarchyRoot) {
      li.classList.add('cmp-header__nav-products-click');
      const dropdownWrapper = document.createElement('ul');
      dropdownWrapper.classList.add('cmp-navigation__group', 'cmp-header__product-items');

      const categoryMenuDiv = document.createElement('div');
      categoryMenuDiv.classList.add('cmp-header__category-menu');
      dropdownWrapper.appendChild(categoryMenuDiv);

      moveInstrumentation(hierarchyCell, hierarchyRoot); // Move instrumentation for the hierarchy
      categoryMenuDiv.appendChild(hierarchyRoot);
      transformNestedLists(hierarchyRoot); // Transform the nested list

      rootEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        dropdownWrapper.classList.toggle('active');
      });
      li.appendChild(dropdownWrapper);
    } else {
      li.classList.add('cmp-header__no-items');
    }
    mainUl.appendChild(li);
  });

  nav.appendChild(mainUl);
  navigationDiv.appendChild(nav);
  navLinksDiv.appendChild(navigationDiv);

  // Mobile list for policy links and social media
  const mobileListDiv = document.createElement('div');
  mobileListDiv.classList.add('cmp-header__mobile-list');

  if (policyLinkItems.length > 0) {
    const policyUl = document.createElement('ul');
    policyUl.classList.add('cmp-header__policy');
    policyLinkItems.forEach((row) => {
      const [labelCell, linkCell] = [...row.children];
      const li = document.createElement('li');
      li.classList.add('cmp-header__policy-list');
      moveInstrumentation(row, li);

      const anchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
      }
      anchor.textContent = labelCell?.textContent.trim() || '';
      li.appendChild(anchor);
      policyUl.appendChild(li);
    });
    mobileListDiv.appendChild(policyUl);
  }

  if (socialMediaItems.length > 0) {
    const socialMediaDiv = document.createElement('div');
    socialMediaDiv.classList.add('cmp-header__social-media');
    socialMediaItems.forEach((row) => {
      const [platformCell, linkCell] = [...row.children];
      const anchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
      }
      const platform = platformCell?.textContent.trim().toLowerCase();
      if (platform) {
        anchor.classList.add(`icon-${platform}`);
        anchor.setAttribute('data-social', platform);
      }
      moveInstrumentation(row, anchor);
      socialMediaDiv.appendChild(anchor);
    });
    mobileListDiv.appendChild(socialMediaDiv);
  }
  navLinksDiv.appendChild(mobileListDiv);
  block.append(navLinksDiv);

  // Nav icons
  const navIconsDiv = document.createElement('div');
  navIconsDiv.classList.add('cmp-header__nav-icons');

  navIconItems.forEach((row) => {
    const [iconTypeCell, linkCell] = [...row.children];
    const iconType = iconTypeCell?.textContent.trim().toLowerCase();
    const foundLink = linkCell.querySelector('a');

    const iconWrapper = document.createElement('div');
    iconWrapper.classList.add(`cmp-header__${iconType}`);
    if (iconType === 'accessibility' || iconType === 'login') {
      iconWrapper.classList.add('cmp-header__hide-icon');
    }

    const anchor = document.createElement('a');
    anchor.classList.add('cmp-header__icon-img');
    if (foundLink) {
      anchor.href = foundLink.href;
    } else {
      anchor.href = '#';
    }
    moveInstrumentation(row, anchor);

    const iconDiv = document.createElement('div');
    iconDiv.classList.add(`icon-${iconType}`);
    anchor.appendChild(iconDiv);

    if (iconType === 'search') {
      const iconText = document.createElement('div');
      iconText.classList.add('cmp-header__icon-text');
      iconText.textContent = 'Search'; // Text from original HTML
      anchor.appendChild(iconText);
    }
    iconWrapper.appendChild(anchor);
    navIconsDiv.appendChild(iconWrapper);
  });
  block.append(navIconsDiv);
}
