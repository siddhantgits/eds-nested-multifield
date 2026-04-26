import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [logoRow, logoLinkRow, ...itemRows] = [...block.children];

  block.innerHTML = '';
  block.classList.add('grid-container', 'js-navigation');
  block.setAttribute('aria-label', 'Main Navigation Section');

  const mainHeader = document.createElement('div');
  mainHeader.classList.add('main-header');
  block.append(mainHeader);

  const mainHeaderContainer = document.createElement('div');
  mainHeaderContainer.classList.add('grid-x', 'padding-x', 'main-header--container', 'align-justify', 'align-middle');
  mainHeader.append(mainHeaderContainer);

  const navigationOverlay = document.createElement('div');
  navigationOverlay.classList.add('navigation-overlay');
  mainHeaderContainer.append(navigationOverlay);

  // Mobile search button
  const mobileSearchWrapper = document.createElement('div');
  mobileSearchWrapper.classList.add('main-header--search-mobile', 'hide-for-large');
  mainHeaderContainer.append(mobileSearchWrapper);

  const mobileSearchButton = document.createElement('button');
  mobileSearchButton.classList.add('button', 'brown', 'square-icon', 'corner-round', 'search-btn', 'sm-transparent', 'md-transparent');
  mobileSearchButton.setAttribute('aria-label', 'Search');
  mobileSearchWrapper.append(mobileSearchButton);

  // Find the search button icon row by checking for a picture and a specific aria-label text
  const mobileSearchIconRow = itemRows.find(row => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].querySelector('picture') && cells[1].textContent.trim() === 'Aria Label label text'; // Assuming 'Aria Label label text' is for search
  });

  if (mobileSearchIconRow) {
    const searchButtonIcon = mobileSearchIconRow.querySelector('picture');
    if (searchButtonIcon) {
      const img = searchButtonIcon.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
      moveInstrumentation(searchButtonIcon, optimizedPic.querySelector('img'));
      mobileSearchButton.append(optimizedPic);
    }
  }

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('main-header--left', 'logo');
  mainHeaderContainer.append(logoWrapper);

  const logoLink = document.createElement('a');
  logoLink.classList.add('logo-link');
  const logoHref = logoLinkRow.querySelector('a')?.href;
  if (logoHref) {
    logoLink.href = logoHref;
  }
  logoLink.setAttribute('title', logoRow.querySelector('img')?.alt || 'Logo');
  logoWrapper.append(logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '100' }]);
    optimizedPic.querySelector('img').classList.add('logo-img');
    moveInstrumentation(logoPicture, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }

  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('persistent-navigation--wrapper', 'js-persistent-nav');
  mainHeaderContainer.append(nav);

  const ul = document.createElement('ul');
  ul.classList.add('persistent-navigation', 'grid-x');
  nav.append(ul);

  const navSections = itemRows.filter(row => {
    const cells = [...row.children];
    // A nav-section row has 5 cells: label, aria-label (aem-content), items (container), sectionBanner (container), hierarchy-tree (richtext)
    // The key differentiator is the richtext hierarchy-tree cell, which contains a <ul>
    return cells.length === 5 && cells.some(cell => cell.querySelector('ul'));
  });

  navSections.forEach((row, i) => {
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture') && !cell.querySelector('ul'));
    const ariaLabelCell = cells.find(cell => cell.querySelector('a'));
    const hierarchyCell = cells.find(cell => cell.querySelector('ul'));

    const li = document.createElement('li');
    li.classList.add('persistent-navigation--list');
    ul.append(li);

    const button = document.createElement('button');
    button.id = `nav-title-${i + 1}`;
    button.classList.add('persistent-navigation--link', 'persistent-nav--level1', 'level1', 'utilityTagLowCaps', 'bold-600');
    button.textContent = labelCell?.textContent.trim() || '';
    // Use the href from the aem-content field for aria-label, if available, otherwise fallback to textContent
    button.setAttribute('aria-label', ariaLabelCell?.querySelector('a')?.href || labelCell?.textContent.trim() || '');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', `level-${i + 1}`);
    button.setAttribute('data-nav-wrapper', `level-${i + 1}`);
    moveInstrumentation(labelCell, button);
    li.append(button);

    const menuWrapper = document.createElement('div');
    menuWrapper.classList.add('persistent-navigation--menu-wrapper');
    menuWrapper.id = `level-${i + 1}`;
    menuWrapper.setAttribute('aria-labelledby', `nav-title-${i + 1}`);
    li.append(menuWrapper);

    const level2 = document.createElement('div');
    level2.classList.add('persistent-nav--level2', 'level2', 'grid-x');
    menuWrapper.append(level2);

    const level2Items = document.createElement('div');
    level2Items.classList.add('small-12', 'large-4', 'xlarge-3', 'persistent-nav--level2-items');
    level2.append(level2Items);

    const level2Close = document.createElement('div');
    level2Close.classList.add('persistent-nav--level2--close', 'hide-for-large');
    level2Items.append(level2Close);

    const prevButton = document.createElement('button');
    prevButton.classList.add('persistent-nav--control-prev', 'persistent-nav--control', 'js-persistent-nav-l1--close');
    prevButton.setAttribute('aria-label', 'Back to previous navigation');
    level2Close.append(prevButton);
    const prevIcon = document.createElement('img');
    prevIcon.alt = 'svg file';
    prevButton.append(prevIcon); // Icon will be added by a separate component or CSS

    const closeButton = document.createElement('button');
    closeButton.classList.add('persistent-nav--control-close', 'persistent-nav--control', 'js-persistent-nav-l1--close');
    closeButton.setAttribute('aria-label', 'Close navigation');
    level2Close.append(closeButton);
    const closeIcon = document.createElement('img');
    closeIcon.alt = 'svg file';
    closeButton.append(closeIcon); // Icon will be added by a separate component or CSS

    const level2Title = document.createElement('p');
    level2Title.classList.add('persistent-nav--level2--title', 'headline-h2');
    level2Title.id = `persistent-nav--level2--title--${labelCell?.textContent.trim().replace(/\s/g, '-')}`;
    level2Title.textContent = labelCell?.textContent.trim() || '';
    level2Items.append(level2Title);

    const level2List = document.createElement('ul');
    level2List.classList.add('persistent-nav--level2-list');
    level2List.setAttribute('aria-labelledby', level2Title.id);
    level2Items.append(level2List);

    const hierarchyRoot = hierarchyCell?.querySelector('ul');
    if (hierarchyRoot) {
      transformNestedLists(hierarchyRoot, level2List);
    }

    button.addEventListener('click', () => {
      menuWrapper.classList.toggle('active');
      button.setAttribute('aria-expanded', menuWrapper.classList.contains('active'));
    });
    closeButton.addEventListener('click', () => {
      menuWrapper.classList.remove('active');
      button.setAttribute('aria-expanded', 'false');
    });
    prevButton.addEventListener('click', () => {
      menuWrapper.classList.remove('active');
      button.setAttribute('aria-expanded', 'false');
    });

    // Section Banner
    // Find section banner rows by checking for 3 cells and a picture in the first cell, and rich text in the third.
    const sectionBanner = itemRows.find(rowItem => {
      const rowItemCells = [...rowItem.children];
      return rowItemCells.length === 3 && rowItemCells[0].querySelector('picture') && rowItemCells[2].innerHTML.trim() !== '';
    });

    if (sectionBanner) {
      const bannerWrapper = document.createElement('div');
      bannerWrapper.classList.add('small-12', 'large-8', 'xlarge-offset-1', 'xlarge-8', 'persistent-nav--level2-banner', 'show-for-large');
      level2.append(bannerWrapper);

      const bannerPictureEl = sectionBanner.querySelector('picture');
      if (bannerPictureEl) {
        const picture = document.createElement('picture');
        picture.classList.add('persistent-nav--level2-banner-picture');
        const img = bannerPictureEl.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
        optimizedPic.querySelector('img').classList.add('persistent-nav--level2-banner-img');
        moveInstrumentation(bannerPictureEl, optimizedPic.querySelector('img'));
        picture.append(...optimizedPic.children);
        bannerWrapper.append(picture);
      }

      const bannerDescWrapper = document.createElement('div');
      bannerDescWrapper.classList.add('persistent-nav--level2-banner--info');
      bannerWrapper.append(bannerDescWrapper);

      const bannerDesc = document.createElement('div');
      bannerDesc.classList.add('bodyMediumRegular', 'persistent-nav--level2-banner-desc');
      // Use innerHTML for richtext field
      const descriptionCell = [...sectionBanner.children].find(cell => cell.innerHTML.trim() !== '' && !cell.querySelector('picture'));
      bannerDesc.innerHTML = descriptionCell?.innerHTML || '';
      bannerDescWrapper.append(bannerDesc);
    }
  });

  // Right section with search and burger buttons
  const mainHeaderRight = document.createElement('div');
  mainHeaderRight.classList.add('main-header--right', 'grid-x', 'align-middle');
  mainHeaderContainer.append(mainHeaderRight);

  // Find search buttons by checking for 2 cells, a picture, and specific text in the second cell
  const searchButtons = itemRows.filter(row => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].querySelector('picture') && cells[1].textContent.trim() === 'Aria Label label text'; // Assuming 'Aria Label label text' is for search
  });

  searchButtons.forEach(row => {
    const [iconCell, ariaLabelCell] = [...row.children];
    const searchButton = document.createElement('button');
    searchButton.classList.add('button', 'brown', 'square-icon', 'corner-round', 'search-btn', 'show-for-large');
    searchButton.setAttribute('aria-label', ariaLabelCell.textContent.trim());
    mainHeaderRight.append(searchButton);

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
      moveInstrumentation(iconPicture, optimizedPic.querySelector('img'));
      searchButton.append(optimizedPic);
    }
  });

  // Find burger buttons by checking for 2 cells, a picture, and specific text in the second cell
  const burgerButtons = itemRows.filter(row => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].querySelector('picture') && cells[1].textContent.trim() === 'Aria Label label text'; // Assuming 'Aria Label label text' is for burger
  });

  burgerButtons.forEach(row => {
    const [iconCell, ariaLabelCell] = [...row.children];
    const burgerButton = document.createElement('button');
    burgerButton.classList.add('button', 'brown', 'square-icon', 'corner-round', 'burger-btn', 'sm-transparent', 'md-transparent', 'js-burger-menu');
    burgerButton.id = 'burger-nav';
    burgerButton.setAttribute('aria-label', ariaLabelCell.textContent.trim());
    burgerButton.setAttribute('aria-expanded', 'false');
    burgerButton.setAttribute('aria-controls', 'burger-nav-wrapper');
    burgerButton.setAttribute('data-nav-wrapper', 'burger-nav-wrapper');
    mainHeaderRight.append(burgerButton);

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
      moveInstrumentation(iconPicture, optimizedPic.querySelector('img'));
      burgerButton.append(optimizedPic);
    }

    burgerButton.addEventListener('click', () => {
      const isExpanded = burgerButton.getAttribute('aria-expanded') === 'true';
      burgerButton.setAttribute('aria-expanded', !isExpanded);
      // Toggle a class on the main navigation or a wrapper to show/hide the mobile menu
      block.classList.toggle('burger-menu-open', !isExpanded);
    });
  });

  function transformNestedLists(rootUl, targetList) {
    [...rootUl.children].forEach((li) => {
      const newLi = document.createElement('li');
      newLi.classList.add('persistent-nav--level2-list-item', 'grid-x');

      const anchor = li.querySelector(':scope > a');
      const nestedUl = li.querySelector(':scope > ul');

      if (anchor) {
        const linkEl = document.createElement('a');
        linkEl.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left');
        linkEl.href = anchor.href;
        linkEl.textContent = anchor.textContent.trim();
        linkEl.setAttribute('aria-label', anchor.title || anchor.textContent.trim());
        if (!nestedUl) {
          linkEl.classList.add('no-submenu');
        }
        moveInstrumentation(li, linkEl);
        newLi.append(linkEl);
      } else {
        const textNode = [...li.childNodes].find(
          (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
        );
        if (textNode) {
          const buttonEl = document.createElement('button');
          buttonEl.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left');
          buttonEl.textContent = textNode.textContent.trim();
          buttonEl.setAttribute('aria-label', textNode.textContent.trim());
          if (!nestedUl) {
            buttonEl.classList.add('no-submenu');
          }
          moveInstrumentation(li, buttonEl);
          newLi.append(buttonEl);
        }
      }

      if (nestedUl) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('small-12', 'large-8', 'xlarge-9', 'persistent-nav--level3-wrapper');
        newLi.append(wrapper);

        const level3 = document.createElement('div');
        level3.classList.add('persistent-nav--level3', 'grid-x');
        wrapper.append(level3);

        const level3Close = document.createElement('div');
        level3Close.classList.add('persistent-nav--level2--close', 'level3', 'hide-for-large');
        level3.append(level3Close);

        const prevButton = document.createElement('button');
        prevButton.classList.add('persistent-nav--control-prev', 'persistent-nav--control', 'js-persistent-nav-l2--close');
        prevButton.setAttribute('aria-label', 'Back to previous navigation');
        level3Close.append(prevButton);
        const prevIcon = document.createElement('img');
        prevIcon.alt = 'svg file';
        prevButton.append(prevIcon);

        const closeTitle = document.createElement('span');
        closeTitle.classList.add('persistent-nav--control-title', 'utilityTagHighCaps', 'js-persistent-nav-l2--close');
        closeTitle.textContent = (anchor || textNode)?.textContent.trim() || '';
        level3Close.append(closeTitle);

        const closeButton = document.createElement('button');
        closeButton.classList.add('persistent-nav--control-close', 'persistent-nav--control', 'js-persistent-nav-l1--close');
        closeButton.setAttribute('aria-label', 'Close navigation');
        level3Close.append(closeButton);
        const closeIcon = document.createElement('img');
        closeIcon.alt = 'svg file';
        closeButton.append(closeIcon);

        const level3Title = document.createElement('p');
        level3Title.classList.add('persistent-nav--level3--title', 'text-center', 'hide-for-large', 'headline-h2');
        level3Title.textContent = (anchor || textNode)?.textContent.trim() || '';
        level3.append(level3Title);

        const level3List = document.createElement('div');
        level3List.classList.add('cell', 'small-12', 'large-12', 'xlarge-8', 'persistent-nav--level3-list');
        level3.append(level3List);

        const newUl = document.createElement('ul');
        newUl.classList.add('persistent-nav--level3-list');
        level3List.append(newUl);

        [...nestedUl.children].forEach(nestedLi => {
          const newNestedLi = document.createElement('li');
          newNestedLi.classList.add('persistent-nav--level3-list-item');
          newUl.append(newNestedLi);

          const nestedAnchor = nestedLi.querySelector(':scope > a');
          if (nestedAnchor) {
            const nestedLink = document.createElement('a');
            nestedLink.classList.add('persistent-nav--level3-link', 'grid-x', 'align-left', 'align-middle');
            nestedLink.href = nestedAnchor.href;
            nestedLink.setAttribute('aria-label', nestedAnchor.title || nestedAnchor.textContent.trim());
            nestedLink.setAttribute('title', nestedAnchor.title || nestedAnchor.textContent.trim());
            moveInstrumentation(nestedLi, nestedLink);
            newNestedLi.append(nestedLink);

            const icon = nestedLi.querySelector('picture');
            if (icon) {
              const iconSpan = document.createElement('span');
              iconSpan.classList.add('persistent-nav--level3-icon');
              const img = icon.querySelector('img');
              const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '80' }]);
              optimizedPic.querySelector('img').classList.add('persistent-nav--level3-icon-img', 'lazyload');
              moveInstrumentation(icon, optimizedPic.querySelector('img'));
              iconSpan.append(optimizedPic);
              nestedLink.append(iconSpan);
            } else {
              nestedLink.classList.add('no-icon');
            }

            const titleSpan = document.createElement('span');
            titleSpan.classList.add('persistent-nav--level3-title');
            titleSpan.textContent = nestedAnchor.textContent.trim();
            nestedLink.append(titleSpan);
          } else {
            const textContent = nestedLi.textContent.trim();
            if (textContent) {
              const span = document.createElement('span');
              span.classList.add('persistent-nav--level3-title', 'no-icon');
              span.textContent = textContent;
              newNestedLi.append(span);
            }
          }
        });

        const trigger = newLi.querySelector('button, a');
        if (trigger) {
          trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            wrapper.classList.toggle('active');
            newLi.classList.toggle('active');
            trigger.setAttribute('aria-expanded', wrapper.classList.contains('active'));
          });
        }
        // Add event listeners for the level 3 close buttons
        level3Close.querySelectorAll('.js-persistent-nav-l2--close').forEach(btn => {
          btn.addEventListener('click', () => {
            wrapper.classList.remove('active');
            newLi.classList.remove('active');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
          });
        });
      }
      targetList.append(newLi);
    });
  }
}
