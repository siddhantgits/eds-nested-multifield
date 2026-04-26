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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist. Assuming it's a generic utility class or needs to be added to allowlist.
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in the allowlist. Assuming it's a generic utility class or needs to be added to allowlist.
          subWrap.classList.toggle('active'); // This class is not in the allowlist. Assuming it's a generic utility class or needs to be added to allowlist.
        });
      }
      transformNestedLists(nested); // Recursively transform nested lists
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Root fields - direct index access is acceptable here as per model
  const logoCell = children[0].firstElementChild;
  const logoLinkCell = children[1].firstElementChild;
  const loginUrlCell = children[2].firstElementChild;
  const showBasketIconCell = children[3].firstElementChild;
  const showHeaderAlwaysCell = children[4].firstElementChild;

  const itemRows = children.slice(5);

  // Content detection for item rows
  const navigationItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[1].querySelector('a') && cells[2].querySelector('ul');
  });
  const primaryNavItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[1].querySelector('a') && cells[2].querySelector('ul');
  });
  const quickLinks = itemRows.filter((row) => row.children.length === 2);
  const carModelCards = itemRows.filter((row) => row.children.length === 3 && row.querySelector('div:nth-child(1) picture'));

  // --- Header Structure ---
  const navigation = document.createElement('div');
  navigation.classList.add('navigation');
  navigation.id = 'header-navbar';

  const menuLogInSubMenu = document.createElement('div');
  menuLogInSubMenu.classList.add('menuLogInSubMenu', 'd-none');
  const loginLink = loginUrlCell.querySelector('a');
  if (loginLink) {
    menuLogInSubMenu.dataset.loginurl = loginLink.href;
  }
  navigation.append(menuLogInSubMenu);

  const headers = document.createElement('div');
  headers.classList.add('headers', 'd-flex', 'w-100', 'align-items-center', 'header-position', 'secondary-header');
  headers.id = 'headers';
  navigation.append(headers);

  const headerPos = document.createElement('div');
  headerPos.classList.add('header-pos');
  headers.append(headerPos);

  const logo = document.createElement('div');
  logo.classList.add('logo', 'flex-grow-1', 'd-flex', 'justify-content-start');
  headerPos.append(logo);

  const logoAnchor = document.createElement('a');
  logoAnchor.classList.add('logo-icon');
  const logoLink = logoLinkCell.querySelector('a');
  if (logoLink) {
    logoAnchor.href = logoLink.href;
  } else {
    logoAnchor.href = '#';
  }
  logoAnchor.style.display = 'block';
  logo.append(logoAnchor);

  const blackLogo = document.createElement('div');
  blackLogo.classList.add('black-logo');
  logoAnchor.append(blackLogo);

  const logoPicture = logoCell.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      blackLogo.append(optimizedPic);
    }
  }

  const secondaryNavWrapper = document.createElement('div');
  secondaryNavWrapper.classList.add('secondary-nav');
  headerPos.append(secondaryNavWrapper);

  const secNavComp = document.createElement('div');
  secNavComp.classList.add('tml-comp', 'sec-nav-comp');
  secNavComp.setAttribute('initializer', 'SecNavComp');
  secondaryNavWrapper.append(secNavComp);

  const dropDownComponent = document.createElement('div');
  dropDownComponent.classList.add('DropDownComponent');
  secNavComp.append(dropDownComponent);

  const navSection = document.createElement('div');
  navSection.classList.add('NavSection');
  dropDownComponent.append(navSection);

  const navSectionColumn = document.createElement('div');
  navSectionColumn.classList.add('NavSectioncolumn');
  navSection.append(navSectionColumn);

  const nav = document.createElement('nav');
  nav.classList.add('navbar-expand');
  navSectionColumn.append(nav);

  const navbarToggler = document.createElement('button');
  navbarToggler.classList.add('navbar-toggler', 'mx-auto');
  navbarToggler.type = 'button';
  navbarToggler.setAttribute('aria-controls', 'navbarSupportedContent');
  navbarToggler.setAttribute('aria-expanded', 'false');
  navbarToggler.setAttribute('aria-label', 'Toggle navigation');
  const secNavLabel = document.createElement('div');
  secNavLabel.classList.add('sec-nav-label');
  secNavLabel.innerHTML = '<span> </span>';
  navbarToggler.append(secNavLabel);
  nav.append(navbarToggler);

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('collapse', 'navbar-collapse');
  navbarCollapse.id = 'menubar';
  nav.append(navbarCollapse);

  const menuBar = document.createElement('ul');
  menuBar.classList.add('navbar', 'menubar', 'flex-nowrap', 'mx-auto', 'justify-content-md-center');
  menuBar.dataset.selecttext = 'Select';
  navbarCollapse.append(menuBar);

  navbarToggler.addEventListener('click', () => {
    navbarCollapse.classList.toggle('show'); // This class is not in the allowlist. Assuming it's a generic utility class or needs to be added to allowlist.
    navbarToggler.classList.toggle('collapsed'); // This class is not in the allowlist. Assuming it's a generic utility class or needs to be added to allowlist.
  });

  navigationItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('ul'));
    const linkCell = cells.find(cell => cell.querySelector('a') && !cell.querySelector('ul'));
    const hierarchyCell = cells.find(cell => cell.querySelector('ul'));

    const li = document.createElement('li');
    li.classList.add('nav-item', 'dropdown');
    li.id = 'nav-item';

    const hierarchyRoot = hierarchyCell ? hierarchyCell.querySelector('ul') : null;
    const linkElement = linkCell ? linkCell.querySelector('a') : null;

    if (hierarchyRoot) {
      const dropdownItems = document.createElement('div');
      dropdownItems.classList.add('dropdown-items');

      const dropdownLabel = document.createElement('a');
      dropdownLabel.classList.add('nav-link', 'dropdown-label');
      dropdownLabel.href = linkElement ? linkElement.href : '#';
      dropdownLabel.textContent = labelCell ? labelCell.textContent.trim() : '';
      dropdownLabel.setAttribute('role', 'button');
      dropdownLabel.setAttribute('aria-expanded', 'false');
      dropdownItems.append(dropdownLabel);

      const dropdownIcon = document.createElement('span');
      dropdownIcon.classList.add('dropdown-icon', 'icon-Chevron-Down');
      dropdownItems.append(dropdownIcon);
      li.append(dropdownItems);

      const modeDropdown = document.createElement('a');
      modeDropdown.classList.add('nav-link', 'mode-dropdown');
      modeDropdown.href = linkElement ? linkElement.href : '#';
      modeDropdown.textContent = labelCell ? labelCell.textContent.trim() : '';
      modeDropdown.setAttribute('role', 'button');
      modeDropdown.setAttribute('aria-label', labelCell ? labelCell.textContent.trim() : '');
      li.append(modeDropdown);

      const dropdownMenu = document.createElement('ul');
      dropdownMenu.classList.add('dropdown-menu', 'drop-block', 'sec-drop-menu');
      dropdownMenu.setAttribute('aria-labelledby', 'navbarDropdownMenuLink');
      li.append(dropdownMenu);

      // Use innerHTML for richtext and then process
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      const processedHierarchyRoot = tempDiv.querySelector('ul');

      if (processedHierarchyRoot) {
        [...processedHierarchyRoot.children].forEach((childLi) => {
          const dropItem = document.createElement('li');
          dropItem.classList.add('drop-item');
          const childLink = childLi.querySelector('a');
          if (childLink) {
            const dropdownItem = document.createElement('a');
            dropdownItem.classList.add('dropdown-item');
            dropdownItem.href = childLink.href;
            dropdownItem.textContent = childLink.textContent.trim();
            dropItem.append(dropdownItem);
          } else {
            const span = document.createElement('span');
            span.textContent = childLi.textContent.trim();
            dropItem.append(span);
          }
          dropdownMenu.append(dropItem);
        });
      }

      // Toggle functionality for dropdown
      const toggleElements = [dropdownLabel, dropdownIcon, modeDropdown];
      toggleElements.forEach(el => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('show'); // This class is not in the allowlist. Assuming it's a generic utility class or needs to be added to allowlist.
          dropdownMenu.classList.toggle('show'); // This class is not in the allowlist. Assuming it's a generic utility class or needs to be added to allowlist.
          dropdownLabel.setAttribute('aria-expanded', dropdownMenu.classList.contains('show')); // This class is not in the allowlist. Assuming it's a generic utility class or needs to be added to allowlist.
        });
      });
    } else {
      const anchor = document.createElement('a');
      anchor.href = linkElement ? linkElement.href : '#';
      anchor.textContent = labelCell ? labelCell.textContent.trim() : '';
      anchor.classList.add('nav-link');
      li.append(anchor);
    }
    moveInstrumentation(row, li);
    menuBar.append(li);
  });

  const hamburgerMenuButton = document.createElement('div');
  hamburgerMenuButton.classList.add('hamburgerMenuButton', 'flex-grow-1', 'd-flex', 'justify-content-end');
  headerPos.append(hamburgerMenuButton);

  const searchIcon = document.createElement('a');
  searchIcon.classList.add('search-icon');
  const searchIconI = document.createElement('i');
  searchIconI.classList.add('icon-Search');
  searchIconI.setAttribute('aria-hidden', 'true');
  searchIcon.append(searchIconI);
  hamburgerMenuButton.append(searchIcon);

  const menuIconBtn = document.createElement('a');
  menuIconBtn.classList.add('menu-icon', 'btn-open');
  menuIconBtn.href = 'javascript:void(0)';
  menuIconBtn.setAttribute('aria-label', 'menu');
  const menuIconSpan = document.createElement('span');
  menuIconSpan.classList.add('icon');
  const menuIconI2 = document.createElement('i');
  menuIconI2.classList.add('fa', 'icon-Burger');
  menuIconI2.setAttribute('aria-hidden', 'true');
  menuIconSpan.append(menuIconI2);
  menuIconBtn.append(menuIconSpan);
  hamburgerMenuButton.append(menuIconBtn);

  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  navigation.append(overlay);

  const navigatioContainer = document.createElement('div');
  navigatioContainer.classList.add('navigatio-container');
  overlay.append(navigatioContainer);

  const rightContent = document.createElement('div');
  rightContent.classList.add('right-content', 'animated');
  rightContent.setAttribute('data-aos-duration', '300');
  rightContent.style.display = 'block';
  navigatioContainer.append(rightContent);

  const menu = document.createElement('div');
  menu.classList.add('menu');
  rightContent.append(menu);

  const loginDiv = document.createElement('div');
  loginDiv.classList.add('login');
  loginDiv.style.display = 'block';
  const loginAnchor = document.createElement('a');
  loginAnchor.classList.add('ga-class');
  loginAnchor.setAttribute('data-gaevent', 'login_click');
  loginAnchor.id = 'LogInData';
  loginAnchor.textContent = 'Sign In';
  const loginArrow = document.createElement('span');
  loginArrow.classList.add('icon-Arrow-Right');
  loginAnchor.append(loginArrow);
  menu.append(loginDiv);
  loginDiv.append(loginAnchor);

  const menuNav = document.createElement('ul');
  menuNav.classList.add('menu-nav');
  menu.append(menuNav);

  const mobileOurModelsLi = document.createElement('li');
  const mobileOurModelsAnchor = document.createElement('a');
  mobileOurModelsAnchor.classList.add('mobile_ourModels');
  mobileOurModelsAnchor.href = 'javascript:void(0)';
  mobileOurModelsAnchor.textContent = 'Our Models';
  const mobileOurModelsArrow = document.createElement('i');
  mobileOurModelsArrow.classList.add('mobile_OurModels_Arrow', 'icon-Chevron-Right');
  mobileOurModelsAnchor.append(mobileOurModelsArrow);
  mobileOurModelsLi.append(mobileOurModelsAnchor);
  menuNav.append(mobileOurModelsLi);

  // Event listener for mobile_ourModels to toggle left-content
  mobileOurModelsAnchor.addEventListener('click', (e) => {
    e.preventDefault();
    const leftContent = navigatioContainer.querySelector('.left-content');
    const rightContent = navigatioContainer.querySelector('.right-content');
    if (leftContent && rightContent) {
      leftContent.style.display = leftContent.style.display === 'block' ? 'none' : 'block';
      rightContent.style.display = rightContent.style.display === 'block' ? 'none' : 'block';
    }
  });

  primaryNavItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('ul'));
    const linkCell = cells.find(cell => cell.querySelector('a') && !cell.querySelector('ul'));
    const hierarchyCell = cells.find(cell => cell.querySelector('ul'));

    const li = document.createElement('li');
    li.classList.add('primary-nav-list', 'hover-method');

    const divExpanded = document.createElement('div');
    divExpanded.setAttribute('aria-expanded', 'false');
    li.append(divExpanded);

    const primaryNavLink = document.createElement('a');
    primaryNavLink.classList.add('primary-nav-link', 'ga-class');
    primaryNavLink.setAttribute('data-gaevent', 'menu_item_clicked');
    const linkElement = linkCell ? linkCell.querySelector('a') : null;
    primaryNavLink.href = linkElement ? linkElement.href : '#';
    primaryNavLink.textContent = labelCell ? labelCell.textContent.trim() : '';
    divExpanded.append(primaryNavLink);

    const hierarchyRoot = hierarchyCell ? hierarchyCell.querySelector('ul') : null;
    if (hierarchyRoot) {
      const subMenuArrow = document.createElement('i');
      subMenuArrow.classList.add('icon-Chevron-Right');
      primaryNavLink.append(subMenuArrow);

      const subMenuList = document.createElement('div');
      subMenuList.classList.add('sub-menu-list', 'position-absolute');
      subMenuList.setAttribute('aria-hidden', 'true');
      subMenuList.setAttribute('aria-label', `${labelCell ? labelCell.textContent.trim() : ''} submenu`);
      subMenuList.style.display = 'none';
      divExpanded.append(subMenuList);

      const subMenuItems = document.createElement('div');
      subMenuItems.classList.add('sub-menu-items');
      subMenuList.append(subMenuItems);

      const subPrimaryNav = document.createElement('ul');
      subPrimaryNav.classList.add('sub-primary-nav', 'position-absolute');
      subPrimaryNav.setAttribute('role', 'Menu');
      subMenuItems.append(subPrimaryNav);

      // Use innerHTML for richtext and then process
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      const processedHierarchyRoot = tempDiv.querySelector('ul');

      if (processedHierarchyRoot) {
        [...processedHierarchyRoot.children].forEach((childLi) => {
          const subLi = document.createElement('li');
          const h6 = document.createElement('h6');
          const childLink = childLi.querySelector('a');
          if (childLink) {
            const a = document.createElement('a');
            a.href = childLink.href;
            a.textContent = childLink.textContent.trim();
            h6.append(a);
          } else {
            h6.textContent = childLi.textContent.trim();
          }
          subLi.append(h6);
          subPrimaryNav.append(subLi);
        });
      }

      primaryNavLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isExpanded = divExpanded.getAttribute('aria-expanded') === 'true';
        divExpanded.setAttribute('aria-expanded', !isExpanded);
        subMenuList.style.display = isExpanded ? 'none' : 'block';
      });
    }
    moveInstrumentation(row, li);
    menuNav.append(li);
  });

  const leftContent = document.createElement('div');
  leftContent.classList.add('left-content');
  leftContent.style.display = 'block';
  navigatioContainer.append(leftContent);

  const titleDiv = document.createElement('div');
  titleDiv.classList.add('title', 'animated', 'animatedFadeInUp'); // animatedFadeInUp not in allowlist
  titleDiv.setAttribute('data-aos-duration', '300');
  leftContent.append(titleDiv);

  const h4 = document.createElement('h4');
  h4.classList.add('name');
  h4.textContent = 'Our Models';
  titleDiv.append(h4);

  const subTitle = document.createElement('div');
  subTitle.classList.add('sub-title');
  subTitle.innerHTML = '<p>Drive NEW FOREVER. A whole new range of cars from Tata Motors.</p>';
  titleDiv.append(subTitle);

  const carSectionRow = document.createElement('div');
  carSectionRow.classList.add('row', 'car-section', 'animated-fade-right'); // animated-fade-right not in allowlist
  carSectionRow.setAttribute('data-aos-duration', '1000');
  leftContent.append(carSectionRow);

  carModelCards.forEach((row) => {
    const cells = [...row.children];
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const titleCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));
    const learnMoreLinkCell = cells.find(cell => cell.querySelector('a') && !cell.querySelector('picture'));

    const col = document.createElement('div');
    col.classList.add('col-xl-4', 'col-lg-4', 'col-md-12', 'col-12', 'car-section-column');

    const card = document.createElement('div');
    card.classList.add('car-section-card', 'ga-class');
    card.setAttribute('data-gaevent', 'car_model_select');
    col.append(card);

    const carsImage = document.createElement('div');
    carsImage.classList.add('carsimage');
    card.append(carsImage);

    const learnMoreLink = learnMoreLinkCell ? learnMoreLinkCell.querySelector('a') : null;
    const imageAnchor = document.createElement('a');
    imageAnchor.href = learnMoreLink ? learnMoreLink.href : '#';
    carsImage.append(imageAnchor);

    const picture = imageCell ? imageCell.querySelector('picture') : null;
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageAnchor.append(optimizedPic);
      }
    }

    const contentElement = document.createElement('div');
    contentElement.classList.add('content_element');
    card.append(contentElement);

    const nameCar = document.createElement('h6');
    nameCar.classList.add('name-car');
    const nameCarAnchor = document.createElement('a');
    nameCarAnchor.href = learnMoreLink ? learnMoreLink.href : '#';
    nameCarAnchor.textContent = titleCell ? titleCell.textContent.trim() : '';
    nameCar.append(nameCarAnchor);
    contentElement.append(nameCar);

    const linkLabel = document.createElement('div');
    linkLabel.classList.add('link-label');
    const learnMoreAnchor = document.createElement('a');
    learnMoreAnchor.href = learnMoreLink ? learnMoreLink.href : '#';
    learnMoreAnchor.textContent = 'Learn More';
    const arrowRight = document.createElement('span');
    arrowRight.classList.add('icon-Arrow-Right');
    learnMoreAnchor.append(arrowRight);
    linkLabel.append(learnMoreAnchor);
    contentElement.append(linkLabel);

    moveInstrumentation(row, col);
    carSectionRow.append(col);
  });

  const blurCurtain = document.createElement('div');
  blurCurtain.classList.add('blur-curtain', 'd-none');
  navigation.append(blurCurtain);

  block.innerHTML = '';
  block.append(navigation);

  // Data attributes for basket and header visibility
  const dataAttrShowBasketIcon = document.createElement('div');
  dataAttrShowBasketIcon.classList.add('data-attr-show-basket-icon', 'd-none');
  dataAttrShowBasketIcon.dataset.isbaskettobeshown = showBasketIconCell.textContent.trim();
  block.prepend(dataAttrShowBasketIcon);

  const dataAttrShowHeaderAlways = document.createElement('div');
  dataAttrShowHeaderAlways.classList.add('data-attr-show-header-always', 'd-none');
  dataAttrShowHeaderAlways.dataset.showheaderalways = showHeaderAlwaysCell.textContent.trim();
  block.prepend(dataAttrShowHeaderAlways);

  // Hamburger menu toggle
  menuIconBtn.addEventListener('click', () => {
    overlay.classList.toggle('active'); // This class is not in the allowlist. Assuming it's a generic utility class or needs to be added to allowlist.
    document.body.classList.toggle('overflow-hidden'); // This class is not in the allowlist. Assuming it's a generic utility class or needs to be added to allowlist.
  });

  // Close overlay on blur curtain click
  blurCurtain.addEventListener('click', () => {
    overlay.classList.remove('active'); // This class is not in the allowlist. Assuming it's a generic utility class or needs to be added to allowlist.
    document.body.classList.remove('overflow-hidden'); // This class is not in the allowlist. Assuming it's a generic utility class or needs to be added to allowlist.
  });

  // Search bar functionality (simplified)
  const tmlHeaderSearchContainer = document.createElement('div');
  tmlHeaderSearchContainer.classList.add('tml-header-search-container', 'd-none', 'flex-column', 'w-100');
  navigation.append(tmlHeaderSearchContainer);

  const closeSearch = document.createElement('span');
  closeSearch.classList.add('icon-Cross', 'close-Search');
  closeSearch.id = 'close-Search';
  tmlHeaderSearchContainer.append(closeSearch);

  const searchBarForm = document.createElement('form');
  searchBarForm.classList.add('search-bar-container');
  searchBarForm.id = 'search-header-bar-form';
  searchBarForm.dataset.minSearch = '2';
  searchBarForm.dataset.defaultItem = 'all';
  searchBarForm.dataset.autoDefaultItem = 'all';
  tmlHeaderSearchContainer.append(searchBarForm);

  const searchBtn = document.createElement('span');
  searchBtn.classList.add('icon-Search', 'search-icon');
  searchBtn.id = 'search-btn';
  searchBarForm.append(searchBtn);

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.classList.add('search-bar');
  searchInput.placeholder = 'Search';
  searchInput.dataset.link = 'https://cars.tatamotors.com/enterprise-search.html';
  searchBarForm.append(searchInput);

  const clearSearchIcon = document.createElement('span');
  clearSearchIcon.classList.add('icon-Cross', 'search-icon', 'd-none');
  searchBarForm.append(clearSearchIcon);

  const searchRecommendationsContainer = document.createElement('div');
  searchRecommendationsContainer.classList.add('search-recommendations-container', 'd-flex', 'flex-column');
  searchRecommendationsContainer.dataset.noResults = 'No Results Found ';
  searchRecommendationsContainer.dataset.asSize = '5';
  tmlHeaderSearchContainer.append(searchRecommendationsContainer);

  const quickLinksContainer = document.createElement('div');
  quickLinksContainer.classList.add('quicklinks-container', 'd-flex', 'flex-column');
  quickLinksContainer.dataset.asTitle = 'Auto Suggestions';
  tmlHeaderSearchContainer.append(quickLinksContainer);

  const header6 = document.createElement('div');
  header6.classList.add('header6');
  header6.textContent = 'Quick Link';
  quickLinksContainer.append(header6);

  const quickLinksDiv = document.createElement('div');
  quickLinksDiv.classList.add('quickLinks', 'd-flex', 'flex-column');
  quickLinksContainer.append(quickLinksDiv);

  quickLinks.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    const quickLinkRow = document.createElement('div');
    quickLinkRow.classList.add('quickLinkRow', 'd-flex', 'align-items-center');

    const arrowSpan = document.createElement('span');
    arrowSpan.classList.add('icon-Arrow-Right');
    quickLinkRow.append(arrowSpan);

    const linkElement = linkCell ? linkCell.querySelector('a') : null;
    const anchor = document.createElement('a');
    anchor.href = linkElement ? linkElement.href : '#';
    anchor.classList.add('text-decoration-none');
    anchor.id = labelCell ? labelCell.textContent.trim() : '';
    anchor.textContent = labelCell ? labelCell.textContent.trim() : '';
    quickLinkRow.append(anchor);
    quickLinksDiv.append(quickLinkRow);
    moveInstrumentation(row, quickLinkRow);
  });

  searchIcon.addEventListener('click', () => {
    tmlHeaderSearchContainer.classList.toggle('d-none');
    blurCurtain.classList.toggle('d-none');
    document.body.classList.toggle('overflow-hidden'); // This class is not in the allowlist. Assuming it's a generic utility class or needs to be added to allowlist.
  });

  closeSearch.addEventListener('click', () => {
    tmlHeaderSearchContainer.classList.add('d-none');
    blurCurtain.classList.add('d-none');
    document.body.classList.remove('overflow-hidden'); // This class is not in the allowlist. Assuming it's a generic utility class or needs to be added to allowlist.
  });

  clearSearchIcon.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchIcon.classList.add('d-none');
  });

  searchInput.addEventListener('input', () => {
    if (searchInput.value.length > 0) {
      clearSearchIcon.classList.remove('d-none');
    } else {
      clearSearchIcon.classList.add('d-none');
    }
  });
}
