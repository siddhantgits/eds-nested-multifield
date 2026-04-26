import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    // Handle label-only nodes
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
      subWrap.classList.add('has-sub-child'); // use ORIGINAL HTML class
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
  });
}

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    searchIconMobileRow,
    searchIconDesktopRow,
    burgerIconRow,
    ...itemRows
  ] = [...block.children];

  block.innerHTML = ''; // Clear the block content

  const mainNavigationSection = document.createElement('section');
  mainNavigationSection.classList.add('main-navigation', 'grid-container', 'js-navigation');
  mainNavigationSection.setAttribute('aria-label', 'Main Navigation Section');

  const mainHeader = document.createElement('div');
  mainHeader.classList.add('main-header');

  const mainHeaderContainer = document.createElement('div');
  mainHeaderContainer.classList.add('grid-x', 'padding-x', 'main-header--container', 'align-justify', 'align-middle');

  const navigationOverlay = document.createElement('div');
  navigationOverlay.classList.add('navigation-overlay');
  mainHeaderContainer.append(navigationOverlay);

  // Mobile Search
  const mobileSearchWrapper = document.createElement('div');
  mobileSearchWrapper.classList.add('main-header--search-mobile', 'hide-for-large');
  const mobileSearchButton = document.createElement('button');
  mobileSearchButton.classList.add('button', 'brown', 'square-icon', 'corner-round', 'search-btn', 'sm-transparent', 'md-transparent');
  mobileSearchButton.setAttribute('aria-label', 'Search');
  const mobileSearchIcon = searchIconMobileRow.querySelector('picture');
  if (mobileSearchIcon) {
    const img = mobileSearchIcon.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    mobileSearchButton.append(optimizedPic);
  }
  mobileSearchWrapper.append(mobileSearchButton);
  mainHeaderContainer.append(mobileSearchWrapper);

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('main-header--left', 'logo');
  const logoLink = document.createElement('a');
  logoLink.classList.add('logo-link');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
    logoLink.title = foundLogoLink.textContent.trim(); // Use the link text as title, not the whole cell
  }
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    optimizedPic.querySelector('img').classList.add('logo-img');
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoLinkRow, logoLink);
  logoWrapper.append(logoLink);
  mainHeaderContainer.append(logoWrapper);

  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('persistent-navigation--wrapper', 'js-persistent-nav');
  const ul = document.createElement('ul');
  ul.classList.add('persistent-navigation', 'grid-x');
  nav.append(ul);

  // Filter item rows based on their structure as per BlockJson and EDS structure
  const navigationItems = itemRows.filter((row) => [...row.children].length === 4);
  // const subNavigationItems = itemRows.filter((row) => [...row.children].length === 3 && !row.querySelector('picture')); // Not directly used in this structure
  // const subnavLinkItems = itemRows.filter((row) => [...row.children].length === 3 && row.querySelector('picture')); // Not directly used in this structure
  // const subnavBanners = itemRows.filter((row) => [...row.children].length === 2); // Not directly used in this structure

  navigationItems.forEach((row, i) => {
    const cells = [...row.children];
    const labelCell = cells[0]; // type=text
    const linkCell = cells[1]; // type=aem-content
    const subNavItemsCell = cells[2]; // type=container (placeholder)
    const hierarchyCell = cells[3]; // type=richtext, hierarchy-tree

    const li = document.createElement('li');
    li.classList.add('persistent-navigation--list');

    const button = document.createElement('button');
    button.id = `nav-title-${i + 1}`;
    button.classList.add('persistent-navigation--link', 'persistent-nav--level1', 'level1', 'utilityTagLowCaps', 'bold-600');
    button.setAttribute('aria-label', labelCell.textContent.trim());
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', `level-${i + 1}`);
    button.setAttribute('data-nav-wrapper', `level-${i + 1}`);
    button.textContent = labelCell.textContent.trim();
    moveInstrumentation(labelCell, button);
    li.append(button);

    const menuWrapper = document.createElement('div');
    menuWrapper.classList.add('persistent-navigation--menu-wrapper');
    menuWrapper.id = `level-${i + 1}`;
    menuWrapper.setAttribute('aria-labelledby', `nav-title-${i + 1}`);

    const level2Div = document.createElement('div');
    level2Div.classList.add('persistent-nav--level2', 'level2', 'grid-x');

    const level2Items = document.createElement('div');
    level2Items.classList.add('small-12', 'large-4', 'xlarge-3', 'persistent-nav--level2-items');

    const level2Close = document.createElement('div');
    level2Close.classList.add('persistent-nav--level2--close', 'hide-for-large');

    const prevButton = document.createElement('button');
    prevButton.classList.add('persistent-nav--control-prev', 'persistent-nav--control', 'js-persistent-nav-l1--close');
    prevButton.setAttribute('aria-label', 'Back to previous navigation');
    // Add icon if available in original HTML
    // const prevIcon = document.createElement('img');
    // prevIcon.alt = 'svg file';
    // prevIcon.src = '/content/dam/aemigrate/uploaded-folder/image/1777190875711.svg+xml';
    // prevButton.append(prevIcon);
    level2Close.append(prevButton);

    const closeButton = document.createElement('button');
    closeButton.classList.add('persistent-nav--control-close', 'persistent-nav--control', 'js-persistent-nav-l1--close');
    closeButton.setAttribute('aria-label', 'Close navigation');
    // Add icon if available in original HTML
    // const closeIcon = document.createElement('img');
    // closeIcon.alt = 'svg file';
    // closeIcon.src = '/content/dam/aemigrate/uploaded-folder/image/1777190875807.svg+xml';
    // closeButton.append(closeIcon);
    level2Close.append(closeButton);
    level2Items.append(level2Close);

    const level2Title = document.createElement('p');
    level2Title.classList.add('persistent-nav--level2--title', 'headline-h2');
    level2Title.id = `persistent-nav--level2--title--${labelCell.textContent.trim().replace(/\s/g, '-')}`;
    level2Title.textContent = labelCell.textContent.trim();
    level2Items.append(level2Title);

    const level2List = document.createElement('ul');
    level2List.classList.add('persistent-nav--level2-list');
    level2List.setAttribute('aria-labelledby', level2Title.id);

    // Handle hierarchy-tree richtext field
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyCell.innerHTML; // Use innerHTML to preserve structure
    moveInstrumentation(hierarchyCell, tempDiv);

    const hierarchyRoot = tempDiv.querySelector('ul');
    if (hierarchyRoot) {
      // Apply classes to the root UL if needed, based on original HTML
      // hierarchyRoot.classList.add('some-class-from-original-html');

      hierarchyRoot.querySelectorAll(':scope > li').forEach((itemLi) => {
        const listItem = document.createElement('li');
        listItem.classList.add('persistent-nav--level2-list-item', 'grid-x');

        const itemLiLink = itemLi.querySelector(':scope > a');
        const itemLiTextSpan = itemLi.querySelector(':scope > span'); // For label-only nodes
        const itemLiSubList = itemLi.querySelector(':scope > ul');

        let linkOrButton;
        if (itemLiLink) {
          linkOrButton = document.createElement('a');
          linkOrButton.href = itemLiLink.href;
          linkOrButton.textContent = itemLiLink.textContent.trim();
          linkOrButton.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left');
          if (!itemLiSubList) {
            linkOrButton.classList.add('no-submenu');
          }
          moveInstrumentation(itemLiLink, linkOrButton);
        } else if (itemLiTextSpan) { // Handle span for label-only nodes
          linkOrButton = document.createElement('button');
          linkOrButton.textContent = itemLiTextSpan.textContent.trim();
          linkOrButton.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left');
          linkOrButton.setAttribute('aria-expanded', 'false');
          linkOrButton.setAttribute('aria-controls', `persistentNavLevel3List-level-${i + 1}-desktop-${level2List.children.length + 1}`);
          linkOrButton.setAttribute('aria-label', itemLiTextSpan.textContent.trim());
          moveInstrumentation(itemLiTextSpan, linkOrButton);
        } else {
          // Fallback for plain text nodes directly under li, if any
          const textNode = [...itemLi.childNodes].find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
          if (textNode) {
            linkOrButton = document.createElement('button');
            linkOrButton.textContent = textNode.textContent.trim();
            linkOrButton.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left');
            linkOrButton.setAttribute('aria-expanded', 'false');
            linkOrButton.setAttribute('aria-controls', `persistentNavLevel3List-level-${i + 1}-desktop-${level2List.children.length + 1}`);
            linkOrButton.setAttribute('aria-label', textNode.textContent.trim());
            moveInstrumentation(textNode, linkOrButton);
          } else {
            linkOrButton = document.createElement('span');
            linkOrButton.textContent = 'Missing Label';
          }
        }
        listItem.append(linkOrButton);

        if (itemLiSubList) {
          const level3Wrapper = document.createElement('div');
          level3Wrapper.classList.add('small-12', 'large-8', 'xlarge-9', 'persistent-nav--level3-wrapper');
          level3Wrapper.id = `level-${i + 1}-${level2List.children.length + 1}`;

          const level3Div = document.createElement('div');
          level3Div.classList.add('persistent-nav--level3', 'grid-x');
          level3Div.setAttribute('role', 'list');

          const level3Close = document.createElement('div');
          level3Close.classList.add('persistent-nav--level2--close', 'level3', 'hide-for-large');
          level3Close.setAttribute('role', 'listitem');

          const level3PrevButton = document.createElement('button');
          level3PrevButton.classList.add('persistent-nav--control-prev', 'persistent-nav--control', 'js-persistent-nav-l2--close');
          level3PrevButton.setAttribute('aria-label', 'Back to previous navigation');
          level3Close.append(level3PrevButton);

          const level3ControlTitle = document.createElement('span');
          level3ControlTitle.classList.add('persistent-nav--control-title', 'utilityTagHighCaps', 'js-persistent-nav-l2--close');
          level3ControlTitle.textContent = labelCell.textContent.trim();
          level3Close.append(level3ControlTitle);

          const level3CloseButton = document.createElement('button');
          level3CloseButton.classList.add('persistent-nav--control-close', 'persistent-nav--control', 'js-persistent-nav-l1--close');
          level3CloseButton.setAttribute('aria-label', 'Close navigation');
          level3Close.append(level3CloseButton);
          level3Div.append(level3Close);

          const level3Title = document.createElement('p');
          level3Title.classList.add('persistent-nav--level3--title', 'text-center', 'hide-for-large', 'headline-h2');
          level3Title.setAttribute('role', 'listitem');
          level3Title.textContent = linkOrButton.textContent;
          level3Div.append(level3Title);

          const level3ListContainer = document.createElement('div');
          level3ListContainer.classList.add('cell', 'small-12', 'large-12', 'xlarge-8', 'persistent-nav--level3-list');
          level3ListContainer.id = `persistentNavLevel3List-level-${i + 1}-desktop-${level2List.children.length + 1}`;

          const subListUl = document.createElement('ul');
          subListUl.classList.add('level3-sub-list'); // Add a class for styling if needed

          itemLiSubList.querySelectorAll(':scope > li').forEach((subItemLi) => {
            const subItemLiLink = subItemLi.querySelector(':scope > a');
            const subItemLiPicture = subItemLi.querySelector(':scope > picture'); // Check for icon

            const subListItem = document.createElement('div');
            subListItem.classList.add('persistent-nav--level3-list-item');
            subListItem.setAttribute('role', 'listitem');

            if (subItemLiLink) {
              const subLink = document.createElement('a');
              subLink.classList.add('persistent-nav--level3-link', 'grid-x', 'align-left', 'align-middle');
              subLink.href = subItemLiLink.href;
              subLink.setAttribute('aria-label', subItemLiLink.textContent.trim());
              subLink.title = subItemLiLink.textContent.trim();

              if (subItemLiPicture) {
                const iconSpan = document.createElement('span');
                iconSpan.classList.add('persistent-nav--level3-icon');
                const img = subItemLiPicture.querySelector('img');
                const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '80' }]); // Assuming 80x80 for icons
                optimizedPic.querySelector('img').classList.add('persistent-nav--level3-icon-img', 'lazyload');
                moveInstrumentation(img, optimizedPic.querySelector('img'));
                iconSpan.append(optimizedPic);
                subLink.append(iconSpan);
              } else {
                subLink.classList.add('no-icon');
              }

              const subLinkTitle = document.createElement('span');
              subLinkTitle.classList.add('persistent-nav--level3-title');
              subLinkTitle.textContent = subItemLiLink.textContent.trim();
              subLink.append(subLinkTitle);
              moveInstrumentation(subItemLiLink, subLink);
              subListItem.append(subLink);
            } else {
              const subSpan = document.createElement('span');
              subSpan.classList.add('persistent-nav--level3-title', 'no-icon');
              subSpan.textContent = subItemLi.textContent.trim();
              moveInstrumentation(subItemLi, subSpan);
              subListItem.append(subSpan);
            }
            subListUl.append(subListItem);
          });
          level3ListContainer.append(subListUl);
          level3Div.append(level3ListContainer);
          level3Wrapper.append(level3Div);
          listItem.append(level3Wrapper);

          linkOrButton.addEventListener('click', () => {
            level3Wrapper.classList.toggle('active');
            linkOrButton.setAttribute('aria-expanded', level3Wrapper.classList.contains('active'));
          });
        }
        level2List.append(listItem);
      });
    }

    level2Items.append(level2List);
    level2Div.append(level2Items);

    const level2Banner = document.createElement('div');
    level2Banner.classList.add('small-12', 'large-8', 'xlarge-offset-1', 'xlarge-8', 'persistent-nav--level2-banner', 'show-for-large');
    // Add banner content here if available from the model (not currently in EDS structure for nav items)

    level2Div.append(level2Banner);
    menuWrapper.append(level2Div);
    li.append(menuWrapper);
    ul.append(li);

    button.addEventListener('click', () => {
      menuWrapper.classList.toggle('active');
      button.setAttribute('aria-expanded', menuWrapper.classList.contains('active'));
    });
  });

  mainHeaderContainer.append(nav);

  // Right section (Search Desktop, Burger)
  const mainHeaderRight = document.createElement('div');
  mainHeaderRight.classList.add('main-header--right', 'grid-x', 'align-middle');

  // Desktop Search
  const desktopSearchButton = document.createElement('button');
  desktopSearchButton.classList.add('button', 'brown', 'square-icon', 'corner-round', 'search-btn', 'show-for-large');
  desktopSearchButton.setAttribute('aria-label', 'Search');
  const desktopSearchIcon = searchIconDesktopRow.querySelector('picture');
  if (desktopSearchIcon) {
    const img = desktopSearchIcon.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    desktopSearchButton.append(optimizedPic);
  }
  mainHeaderRight.append(desktopSearchButton);

  // Burger Icon
  const burgerButton = document.createElement('button');
  burgerButton.classList.add('button', 'brown', 'square-icon', 'corner-round', 'burger-btn', 'sm-transparent', 'md-transparent', 'js-burger-menu');
  burgerButton.id = 'burger-nav';
  burgerButton.setAttribute('aria-label', 'Open Navigation');
  burgerButton.setAttribute('aria-expanded', 'false');
  burgerButton.setAttribute('aria-controls', 'burger-nav-wrapper');
  burgerButton.setAttribute('data-nav-wrapper', 'burger-nav-wrapper');
  const burgerIcon = burgerIconRow.querySelector('picture');
  if (burgerIcon) {
    const img = burgerIcon.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    burgerButton.append(optimizedPic);
  }
  mainHeaderRight.append(burgerButton);
  mainHeaderContainer.append(mainHeaderRight);

  mainHeader.append(mainHeaderContainer);
  mainNavigationSection.append(mainHeader);
  block.append(mainNavigationSection);

  // Burger menu functionality (simplified)
  burgerButton.addEventListener('click', () => {
    const isExpanded = burgerButton.getAttribute('aria-expanded') === 'true';
    burgerButton.setAttribute('aria-expanded', !isExpanded);
    mainNavigationSection.classList.toggle('active', !isExpanded); // Example class for mobile menu open state
  });

  // Close buttons for navigation levels
  mainNavigationSection.querySelectorAll('.js-persistent-nav-l1--close').forEach((btn) => {
    btn.addEventListener('click', () => {
      const menuWrapper = btn.closest('.persistent-navigation--menu-wrapper');
      if (menuWrapper) {
        menuWrapper.classList.remove('active');
        const navTitle = document.getElementById(menuWrapper.getAttribute('aria-labelledby'));
        if (navTitle) {
          navTitle.setAttribute('aria-expanded', 'false');
        }
      }
      mainNavigationSection.classList.remove('active'); // Close overall mobile menu
      burgerButton.setAttribute('aria-expanded', 'false');
    });
  });

  mainNavigationSection.querySelectorAll('.js-persistent-nav-l2--close').forEach((btn) => {
    btn.addEventListener('click', () => {
      const level3Wrapper = btn.closest('.persistent-nav--level3-wrapper');
      if (level3Wrapper) {
        level3Wrapper.classList.remove('active');
        const level2Link = level3Wrapper.previousElementSibling;
        if (level2Link && level2Link.tagName === 'BUTTON') {
          level2Link.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
