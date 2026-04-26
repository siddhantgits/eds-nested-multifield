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
      subWrap.classList.add('persistent-nav--level3-wrapper'); // Class from original HTML
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
      transformNestedLists(nested); // Recursively transform nested lists
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const header = document.createElement('div');
  header.classList.add('main-header');
  moveInstrumentation(block, header);

  const headerContainer = document.createElement('div');
  headerContainer.classList.add(
    'grid-x',
    'padding-x',
    'main-header--container',
    'align-justify',
    'align-middle',
  );
  header.append(headerContainer);

  const navigationOverlay = document.createElement('div');
  navigationOverlay.classList.add('navigation-overlay');
  headerContainer.append(navigationOverlay);

  // Mobile Search Button
  const mobileSearch = document.createElement('div');
  mobileSearch.classList.add('main-header--search-mobile', 'hide-for-large');
  const mobileSearchButton = document.createElement('button');
  mobileSearchButton.classList.add(
    'button',
    'brown',
    'square-icon',
    'corner-round',
    'search-btn',
    'sm-transparent',
    'md-transparent',
  );
  mobileSearchButton.setAttribute('aria-label', 'Search');
  const mobileSearchImg = document.createElement('img');
  // Hardcoded image path from original HTML, as no block field exists for this icon.
  mobileSearchImg.alt = 'svg file';
  mobileSearchImg.src = '/content/dam/aemigrate/uploaded-folder/image/1777213388638.svg';
  mobileSearchButton.append(mobileSearchImg);
  mobileSearch.append(mobileSearchButton);
  headerContainer.append(mobileSearch);

  // Logo
  const logoRow = children.find(row => row.querySelector('picture'));
  const logoLinkRow = children.find(row => row.querySelector('a') && !row.querySelector('picture'));

  const logoCell = logoRow?.querySelector('picture');
  const logoLinkCell = logoLinkRow?.querySelector('a');

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('main-header--left', 'logo');
  if (logoRow) moveInstrumentation(logoRow, logoWrapper);
  if (logoLinkRow) moveInstrumentation(logoLinkRow, logoWrapper);

  const logoLink = document.createElement('a');
  logoLink.classList.add('logo-link');
  if (logoLinkCell) {
    logoLink.href = logoLinkCell.href;
  } else {
    logoLink.href = '#';
  }
  logoLink.setAttribute('title', 'Nescafe Logo'); // Hardcoded, but from original HTML

  if (logoCell) {
    const logoImg = logoCell.querySelector('img');
    if (logoImg) {
      const optimizedLogo = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '100' }]);
      optimizedLogo.querySelector('img').classList.add('logo-img');
      logoLink.append(optimizedLogo);
    }
  }
  logoWrapper.append(logoLink);
  headerContainer.append(logoWrapper);

  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('persistent-navigation--wrapper', 'js-persistent-nav');
  nav.style.marginLeft = '27px'; // From original HTML
  nav.style.opacity = '1'; // From original HTML

  const navList = document.createElement('ul');
  navList.classList.add('persistent-navigation', 'grid-x');
  nav.append(navList);

  // Filter for nav-section items (5 cells, richtext hierarchy-tree)
  const navSectionRows = children.filter((row) => {
    const cells = [...row.children];
    return cells.length === 5 && cells.some(cell => cell.querySelector('ul'));
  });

  // Filter for nav-level2-banner items (3 cells, picture)
  const navLevel2BannerRows = children.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells.some(cell => cell.querySelector('picture'));
  });

  navSectionRows.forEach((row, i) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const ariaLabelCell = cells[1];
    // cells[2] and cells[3] are containers, not directly rendered here
    const hierarchyTreeCell = cells[4];

    const li = document.createElement('li');
    li.classList.add('persistent-navigation--list');
    moveInstrumentation(row, li);

    const button = document.createElement('button');
    button.id = `nav-title-${i + 1}`;
    button.classList.add(
      'persistent-navigation--link',
      'persistent-nav--level1',
      'level1',
      'utilityTagLowCaps',
      'bold-600',
    );
    button.setAttribute('aria-label', ariaLabelCell?.textContent.trim() || labelCell?.textContent.trim());
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', `level-${i + 1}`);
    button.setAttribute('data-nav-wrapper', `level-${i + 1}`);
    button.textContent = labelCell?.textContent.trim() || '';
    li.append(button);

    const menuWrapper = document.createElement('div');
    menuWrapper.classList.add('persistent-navigation--menu-wrapper');
    menuWrapper.id = `level-${i + 1}`;
    menuWrapper.setAttribute('aria-labelledby', `nav-title-${i + 1}`);
    li.append(menuWrapper);

    const level2Div = document.createElement('div');
    level2Div.classList.add('persistent-nav--level2', 'level2', 'grid-x');
    menuWrapper.append(level2Div);

    const level2Items = document.createElement('div');
    level2Items.classList.add('small-12', 'large-4', 'xlarge-3', 'persistent-nav--level2-items');
    level2Div.append(level2Items);

    const level2Close = document.createElement('div');
    level2Close.classList.add('persistent-nav--level2--close', 'hide-for-large');
    level2Items.append(level2Close);

    const prevButton = document.createElement('button');
    prevButton.classList.add(
      'persistent-nav--control-prev',
      'persistent-nav--control',
      'js-persistent-nav-l1--close',
    );
    prevButton.setAttribute('aria-label', 'Back to previous navigation');
    const prevImg = document.createElement('img');
    prevImg.alt = 'svg file';
    prevImg.src = '/content/dam/aemigrate/uploaded-folder/image/1777213388703.svg'; // Hardcoded from original HTML
    prevButton.append(prevImg);
    level2Close.append(prevButton);

    const closeButton = document.createElement('button');
    closeButton.classList.add(
      'persistent-nav--control-close',
      'persistent-nav--control',
      'js-persistent-nav-l1--close',
    );
    closeButton.setAttribute('aria-label', 'Close navigation');
    const closeImg = document.createElement('img');
    closeImg.alt = 'svg file';
    closeImg.src = '/content/dam/aemigrate/uploaded-folder/image/1777213388806.svg'; // Hardcoded from original HTML
    closeButton.append(closeImg);
    level2Close.append(closeButton);

    const level2Title = document.createElement('p');
    level2Title.classList.add('persistent-nav--level2--title', 'headline-h2');
    level2Title.id = `persistent-nav--level2--title--${labelCell?.textContent.trim().replace(/\s/g, '-')}`;
    level2Title.textContent = labelCell?.textContent.trim() || '';
    level2Items.append(level2Title);

    const level2List = document.createElement('ul');
    level2List.classList.add('persistent-nav--level2-list');
    level2List.setAttribute('aria-labelledby', level2Title.id);
    level2Items.append(level2List);

    const hierarchyRoot = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyRoot) {
      moveInstrumentation(hierarchyTreeCell, hierarchyRoot); // Instrument the moved content
      level2List.append(hierarchyRoot);
      transformNestedLists(hierarchyRoot);
    }

    // Level 2 Banners
    const level2BannerWrapper = document.createElement('div');
    level2BannerWrapper.classList.add(
      'small-12',
      'large-8',
      'xlarge-offset-1',
      'xlarge-8',
      'persistent-nav--level2-banner',
      'show-for-large',
    );
    level2Div.append(level2BannerWrapper);

    // Filter banners specific to this section if needed, otherwise use all
    navLevel2BannerRows.forEach((bannerRow) => {
      const bannerCells = [...bannerRow.children];
      const bannerImageCell = bannerCells[0];
      const bannerAltCell = bannerCells[1];
      const bannerDescriptionCell = bannerCells[2];

      const bannerPicture = bannerImageCell?.querySelector('picture');
      if (bannerPicture) {
        const bannerImg = bannerPicture.querySelector('img');
        if (bannerImg) {
          const optimizedBanner = createOptimizedPicture(bannerImg.src, bannerImg.alt, false, [
            { media: '(min-width: 1440px)', width: '2000' },
            { media: '(min-width: 1024px)', width: '2000' },
            { media: '(min-width: 768px)', width: '688' },
            { width: '688' },
          ]);
          optimizedBanner.classList.add('persistent-nav--level2-banner-picture');
          optimizedBanner.querySelector('img').classList.add('persistent-nav--level2-banner-img', 'lazyload');
          optimizedBanner.querySelector('img').setAttribute('data-src', bannerImg.src);
          optimizedBanner.querySelector('img').alt = bannerAltCell?.textContent.trim() || '';
          optimizedBanner.querySelector('img').height = '640'; // From original HTML
          level2BannerWrapper.append(optimizedBanner);
        }
      }

      const bannerInfo = document.createElement('div');
      bannerInfo.classList.add('persistent-nav--level2-banner--info');
      if (bannerDescriptionCell?.textContent.trim()) {
        const bannerDesc = document.createElement('div');
        bannerDesc.classList.add('bodyMediumRegular');
        bannerDesc.innerHTML = bannerDescriptionCell.innerHTML;
        bannerInfo.append(bannerDesc);
      }
      level2BannerWrapper.append(bannerInfo);
    });

    navList.append(li);

    // Event listeners for menu toggle
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', !isExpanded);
      menuWrapper.classList.toggle('active', !isExpanded);
      li.classList.toggle('active', !isExpanded);
      navigationOverlay.classList.toggle('active', !isExpanded);
    });

    closeButton.addEventListener('click', () => {
      button.setAttribute('aria-expanded', 'false');
      menuWrapper.classList.remove('active');
      li.classList.remove('active');
      navigationOverlay.classList.remove('active');
    });

    prevButton.addEventListener('click', () => {
      button.setAttribute('aria-expanded', 'false');
      menuWrapper.classList.remove('active');
      li.classList.remove('active');
      navigationOverlay.classList.remove('active');
    });

    navigationOverlay.addEventListener('click', () => {
      button.setAttribute('aria-expanded', 'false');
      menuWrapper.classList.remove('active');
      li.classList.remove('active');
      navigationOverlay.classList.remove('active');
    });
  });

  headerContainer.append(nav);

  // Right section (search and burger menu)
  const rightSection = document.createElement('div');
  rightSection.classList.add('main-header--right', 'grid-x', 'align-middle');
  headerContainer.append(rightSection);

  const searchButton = document.createElement('button');
  searchButton.classList.add('button', 'brown', 'square-icon', 'corner-round', 'search-btn', 'show-for-large');
  searchButton.setAttribute('aria-label', 'Search');
  const searchImg = document.createElement('img');
  searchImg.alt = 'svg file';
  searchImg.src = '/content/dam/aemigrate/uploaded-folder/image/1777213389062.svg'; // Hardcoded from original HTML
  searchButton.append(searchImg);
  rightSection.append(searchButton);

  const burgerButton = document.createElement('button');
  burgerButton.classList.add(
    'button',
    'brown',
    'square-icon',
    'corner-round',
    'burger-btn',
    'sm-transparent',
    'md-transparent',
    'js-burger-menu',
  );
  burgerButton.id = 'burger-nav';
  burgerButton.setAttribute('aria-label', 'Open Navigation');
  burgerButton.setAttribute('aria-expanded', 'false');
  burgerButton.setAttribute('aria-controls', 'burger-nav-wrapper');
  burgerButton.setAttribute('data-nav-wrapper', 'burger-nav-wrapper');
  const burgerImg = document.createElement('img');
  burgerImg.alt = 'svg file';
  burgerImg.src = '/content/dam/aemigrate/uploaded-folder/image/1777213389144.svg'; // Hardcoded from original HTML
  burgerButton.append(burgerImg);
  rightSection.append(burgerButton);

  block.innerHTML = '';
  block.classList.add('grid-container', 'js-navigation'); // Add classes from the original section
  block.setAttribute('aria-label', 'Main Navigation Section');
  block.append(header);
}
