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
      subWrap.classList.add('has-sub-child'); // Class from ORIGINAL HTML
      subWrap.append(nested);
      li.append(subWrap);

      // Apply classes to nested UL/LI/A elements from ORIGINAL HTML
      nested.querySelectorAll('ul').forEach(ul => ul.classList.add('sub-nav-wrap')); // Example, adjust based on actual structure
      nested.querySelectorAll('li').forEach(nestedLi => {
        // Example classes, adjust based on actual structure
        if (nestedLi.querySelector(':scope > ul')) {
          nestedLi.classList.add('top-level-li');
        } else {
          nestedLi.classList.add('first-level-li');
        }
        moveInstrumentation(li, nestedLi); // Move instrumentation for nested items
      });
      nested.querySelectorAll('a').forEach(nestedAnchor => {
        // No specific classes for anchors in ORIGINAL HTML, but good to keep in mind
        moveInstrumentation(li, nestedAnchor); // Move instrumentation for nested items
      });

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
  const children = [...block.children];

  const [
    mainLogoRow,
    mainLogoLinkRow,
    anniversaryLogoRow,
    anniversaryLogoLinkRow,
    ...itemRows
  ] = children;

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid'); // Do not add 'nav-up' initially

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Main Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const mainLogoLink = document.createElement('a');
  mainLogoLink.href = mainLogoLinkRow?.querySelector('a')?.href || '#';
  const mainLogoPicture = mainLogoRow?.querySelector('picture');
  if (mainLogoPicture) {
    const img = mainLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    mainLogoLink.append(optimizedPic);
    mainLogoLink.querySelector('img').classList.add('hiddenlogo1');
  }
  moveInstrumentation(mainLogoRow, mainLogoLink);
  logoDiv.append(mainLogoLink);
  wrap.append(logoDiv);

  // Hamburger menu
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }
  hamburger.append(hamburgerUl);
  wrap.append(hamburger);

  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);
  wrap.append(nav);

  const navigationItems = itemRows.filter((row) => row.children.length === 7);
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4);
  const contactLinkItems = itemRows.filter((row) => row.children.length === 3 && row.querySelector('img'));
  const searchIconItems = itemRows.filter((row) => row.children.length === 3 && row.children[0].querySelector('img') && row.children[1].querySelector('img'));

  // Build navigation menu
  navigationItems.forEach((row) => {
    const [labelCell, linkCell, iconCell, hierarchyCell, leftHeadingCell, leftDescCell, leftSubdescCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    anchor.href = linkCell?.querySelector('a')?.href || '#';
    anchor.textContent = labelCell?.textContent.trim() || '';
    li.append(anchor);

    const iconSpan = document.createElement('span');
    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '20' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      iconSpan.append(optimizedPic);
    }
    li.append(iconSpan);

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    const heading = document.createElement('h4');
    heading.classList.add('left-div-heading');
    const headingAnchor = document.createElement('a');
    headingAnchor.textContent = leftHeadingCell?.textContent.trim() || '';
    heading.append(headingAnchor);
    leftDiv.append(heading);

    const description = document.createElement('p');
    description.classList.add('left-div-desc');
    description.textContent = leftDescCell?.textContent.trim() || '';
    leftDiv.append(description);

    const subDescription = document.createElement('p');
    subDescription.classList.add('left-div-subdesc');
    subDescription.textContent = leftSubdescCell?.textContent.trim() || '';
    leftDiv.append(subDescription);

    centerDiv.append(leftDiv);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap', 'about-us-sub-nav');
    const hierarchyRoot = hierarchyCell?.querySelector('ul');
    if (hierarchyRoot) {
      // Create a temporary div to hold the innerHTML and apply classes
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv); // Instrument the original cell to the tempDiv

      // Apply classes to nested elements as per ORIGINAL HTML
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('sub-nav-wrap')); // Example, adjust based on actual structure
      tempDiv.querySelectorAll('li').forEach(nestedLi => {
        if (nestedLi.querySelector(':scope > ul')) {
          nestedLi.classList.add('top-level-li'); // Example, adjust based on actual structure
        } else {
          nestedLi.classList.add('first-level-li'); // Example, adjust based on actual structure
        }
        moveInstrumentation(hierarchyCell, nestedLi); // Instrument nested elements
      });
      tempDiv.querySelectorAll('a').forEach(nestedAnchor => {
        // No specific classes for anchors in ORIGINAL HTML, but good to keep in mind
        moveInstrumentation(hierarchyCell, nestedAnchor); // Instrument nested elements
      });

      // Move children from tempDiv to subNavWrap
      while (tempDiv.firstChild) {
        subNavWrap.append(tempDiv.firstChild);
      }
    }
    centerDiv.append(subNavWrap);

    megaMenuWrap.append(centerDiv);
    megaMenu.append(megaMenuWrap);
    li.append(megaMenu);
    navUl.append(li);
    moveInstrumentation(row, li);
  });

  // Latest Press Releases (Newsroom section)
  const newsroomLi = document.createElement('li');
  newsroomLi.classList.add('has-child', 'hover-red');
  newsroomLi.setAttribute('itemprop', 'name');
  const newsroomAnchor = document.createElement('a');
  newsroomAnchor.setAttribute('itemprop', 'url');
  // Get newsroom link from a model field if available, otherwise use a placeholder
  const newsroomLinkCell = itemRows.find(row => row.children.length === 7 && row.querySelector('a[href*="newsroom"]'))?.children[1];
  newsroomAnchor.href = newsroomLinkCell?.querySelector('a')?.href || '#';
  // Get newsroom label from a model field if available, otherwise use a placeholder
  const newsroomLabelCell = itemRows.find(row => row.children.length === 7 && row.textContent.toLowerCase().includes('newsroom'))?.children[0];
  newsroomAnchor.textContent = newsroomLabelCell?.textContent.trim() || 'newsroom';
  newsroomLi.append(newsroomAnchor);

  const newsroomIconSpan = document.createElement('span');
  // Add a default icon if not provided by model, or use model's icon
  const defaultIconImg = document.createElement('img');
  defaultIconImg.alt = 'svg file';
  defaultIconImg.src = '/icons/arrow-right.svg'; // Placeholder default icon
  newsroomIconSpan.append(defaultIconImg);
  newsroomLi.append(newsroomIconSpan);

  const newsroomMegaMenu = document.createElement('div');
  newsroomMegaMenu.classList.add('mega-menu');
  const newsroomWrap = document.createElement('div');
  newsroomWrap.classList.add('wrap', 'container');
  const newsroomCenterDiv = document.createElement('div');
  newsroomCenterDiv.classList.add('center-div');

  const newsroomLeftDiv = document.createElement('div');
  newsroomLeftDiv.classList.add('left-div', 'newsroom-left-div');
  const newsroomHeading = document.createElement('h4');
  newsroomHeading.classList.add('left-div-heading');
  const newsroomHeadingAnchor = document.createElement('a');
  // Get newsroom heading from a model field if available, otherwise use a placeholder
  newsroomHeadingAnchor.textContent = newsroomLabelCell?.textContent.trim() || 'Newsroom';
  newsroomHeading.append(newsroomHeadingAnchor);
  newsroomLeftDiv.append(newsroomHeading);

  const latestPressReleasesDiv = document.createElement('div');
  latestPressReleasesDiv.classList.add('latest-two-press-release');

  pressReleaseItems.forEach((row) => {
    const [linkCell, titleCell, dateCell, categoryCell] = [...row.children];

    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');
    const slideWrap = document.createElement('div');
    slideWrap.classList.add('wrap');
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content');
    const descDiv = document.createElement('div');
    descDiv.classList.add('desc');

    const p = document.createElement('p');
    const pressReleaseLink = document.createElement('a');
    pressReleaseLink.href = linkCell?.querySelector('a')?.href || '#';
    pressReleaseLink.textContent = titleCell?.textContent.trim() || '';
    p.append(pressReleaseLink);
    descDiv.append(p);

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    const dateEm = document.createElement('em');
    dateEm.textContent = dateCell?.textContent.trim() || '';
    const categoryEm = document.createElement('em');
    categoryEm.textContent = categoryCell?.textContent.trim() || '';
    dateDiv.append(dateEm, categoryEm);
    descDiv.append(dateDiv);

    contentDiv.append(descDiv);
    slideWrap.append(contentDiv);
    slideDiv.append(slideWrap);
    latestPressReleasesDiv.append(slideDiv);
    moveInstrumentation(row, slideDiv);
  });
  newsroomLeftDiv.append(latestPressReleasesDiv);
  newsroomCenterDiv.append(newsroomLeftDiv);

  const newsroomSubNavWrap = document.createElement('div');
  newsroomSubNavWrap.classList.add('sub-nav-wrap');
  const newsroomUl1 = document.createElement('ul');
  const newsroomLi1 = document.createElement('li');
  const newsroomLink1 = document.createElement('a');
  newsroomLink1.href = '#';
  newsroomLink1.textContent = 'Press Releases';
  newsroomLi1.append(newsroomLink1);
  const newsroomLi2 = document.createElement('li');
  const newsroomLink2 = document.createElement('a');
  newsroomLink2.href = '#';
  newsroomLink2.textContent = 'Media Resources';
  newsroomLi2.append(newsroomLink2);
  newsroomUl1.append(newsroomLi1, newsroomLi2);

  const newsroomUl2 = document.createElement('ul');
  const newsroomLi3 = document.createElement('li');
  const newsroomLink3 = document.createElement('a');
  newsroomLink3.href = '#';
  newsroomLink3.textContent = 'In The News';
  newsroomLi3.append(newsroomLink3);
  newsroomUl2.append(newsroomLi3);

  newsroomSubNavWrap.append(newsroomUl1, newsroomUl2);
  newsroomCenterDiv.append(newsroomSubNavWrap);
  newsroomWrap.append(newsroomCenterDiv);
  newsroomMegaMenu.append(newsroomWrap);
  newsroomLi.append(newsroomMegaMenu);
  navUl.append(newsroomLi);

  // Icon Nav (Mobile and Desktop)
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconUl = document.createElement('ul');
  mobileIconNav.append(mobileIconUl);

  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconUl = document.createElement('ul');
  desktopIconNav.append(desktopIconUl);

  contactLinkItems.forEach((row) => {
    const [linkCell, iconCell, labelCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('mail'); // Assuming 'mail' for contact links
    const anchor = document.createElement('a');
    anchor.href = linkCell?.querySelector('a')?.href || '#';
    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '20' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      anchor.append(optimizedPic);
    }
    anchor.append(labelCell?.textContent.trim() || '');
    li.append(anchor);
    mobileIconUl.append(li.cloneNode(true));
    desktopIconUl.append(li);
    moveInstrumentation(row, li);
  });

  searchIconItems.forEach((row) => {
    const [icon1Cell, icon2Cell, labelCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('search');
    const anchor = document.createElement('a');
    anchor.href = '#';
    const icon1Picture = icon1Cell?.querySelector('picture');
    if (icon1Picture) {
      const img = icon1Picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '20' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      anchor.append(optimizedPic);
    }
    const icon2Picture = icon2Cell?.querySelector('picture');
    if (icon2Picture) {
      const img = icon2Picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '20' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      anchor.append(optimizedPic);
    }
    const labelSpan = document.createElement('span');
    labelSpan.textContent = labelCell?.textContent.trim() || '';
    anchor.append(labelSpan);
    li.append(anchor);

    // Search screen wrap
    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');
    const searchWrapInner = document.createElement('div');
    searchWrapInner.classList.add('wrap');
    const form = document.createElement('form');
    form.action = 'https://www.mahindra.com/search';
    form.method = 'get';
    const searchWrap = document.createElement('div');
    searchWrap.classList.add('search-wrap');
    const searchIconDiv = document.createElement('div');
    searchIconDiv.classList.add('search-icon');
    const searchIconImg = document.createElement('img');
    searchIconImg.alt = 'svg file';
    searchIconImg.src = '/icons/search.svg'; // Placeholder search icon
    searchIconDiv.append(searchIconImg);
    searchWrap.append(searchIconDiv);
    const input = document.createElement('input');
    input.type = 'text';
    input.classList.add('input-text', 'searchtext');
    input.required = true;
    input.name = 'key';
    input.id = 'searchInput';
    input.autocomplete = 'off';
    searchWrap.append(input);
    const submitButton = document.createElement('button');
    submitButton.classList.add('submit-button');
    const submitLabel = document.createElement('div');
    submitLabel.classList.add('label');
    submitLabel.textContent = 'Submit';
    submitButton.append(submitLabel);
    const submitImg = document.createElement('img');
    submitImg.alt = 'svg file';
    submitImg.src = '/icons/arrow-right.svg'; // Placeholder submit icon
    submitButton.append(submitImg);
    searchWrap.append(submitButton);
    form.append(searchWrap);
    searchWrapInner.append(form);
    searchScreenWrap.append(searchWrapInner);
    li.append(searchScreenWrap);

    // Event listener for search toggle
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchScreenWrap.classList.toggle('active');
    });

    mobileIconUl.append(li.cloneNode(true));
    desktopIconUl.append(li);
    moveInstrumentation(row, li);
  });

  navUl.append(mobileIconNav);
  nav.append(desktopIconNav);

  // Anniversary Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const anniversaryLogoLink = document.createElement('a');
  anniversaryLogoLink.href = anniversaryLogoLinkRow?.querySelector('a')?.href || '#';
  const anniversaryLogoPicture = anniversaryLogoRow?.querySelector('picture');
  if (anniversaryLogoPicture) {
    const img = anniversaryLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    anniversaryLogoLink.append(optimizedPic);
    anniversaryLogoLink.querySelector('img').classList.add('hiddenlogo1', 'years-80');
  }
  moveInstrumentation(anniversaryLogoRow, anniversaryLogoLink);
  year80LogoDiv.append(anniversaryLogoLink);
  wrap.append(year80LogoDiv);

  block.innerHTML = '';
  block.append(header);

  // Hamburger toggle functionality
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });

  // Scroll behavior for header (nav-up/nav-down)
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > header.offsetHeight) {
      header.classList.add('nav-up');
      header.classList.remove('nav-down');
    } else if (window.scrollY < lastScrollY) {
      header.classList.add('nav-down');
      header.classList.remove('nav-up');
    }
    lastScrollY = window.scrollY;
  });
}
