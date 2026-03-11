import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const mainSection = document.createElement('section');
  mainSection.className = 'header-position-relative header-mb-15';
  moveInstrumentation(block.children[0], mainSection);

  // Extracting header content
  const appNameSpan = document.createElement('span');
  appNameSpan.className = 'header-d-none header-app-name';
  appNameSpan.setAttribute('data-app-name', block.children[0].children[0].textContent.trim());
  appNameSpan.textContent = block.children[0].children[0].textContent.trim();
  mainSection.append(appNameSpan);

  const header = document.createElement('header');
  header.className = 'boing-container header-header header-d-flex header-justify-content-between header-align-items-center header-h-15 header-px-5 header-py-2 header-fixed-top header-w-100 header-bg-white';
  moveInstrumentation(block.children[0].children[1], header);

  const headerDiv1 = document.createElement('div');
  headerDiv1.className = 'header-d-flex header-w-25';
  header.append(headerDiv1);

  const headerDiv2 = document.createElement('div');
  headerDiv2.className = 'header-d-flex  header-justify-content-center header-w-25';
  const headerLogoLink = document.createElement('a');
  headerLogoLink.href = '/';
  headerLogoLink.className = 'header-analytics_cta_click';
  headerLogoLink.setAttribute('data-ct', '');
  headerLogoLink.setAttribute('a-label', 'header-logo-boing');
  const headerLogoDiv = document.createElement('div');
  headerLogoDiv.className = 'header__logo header-d-flex header-align-items-center';
  const headerLogoImg = block.children[0].children[2].querySelector('img');
  if (headerLogoImg) {
    const optimizedHeaderLogoPic = createOptimizedPicture(headerLogoImg.src, headerLogoImg.alt, true, [{ width: '200' }]);
    moveInstrumentation(headerLogoImg, optimizedHeaderLogoPic.querySelector('img'));
    optimizedHeaderLogoPic.querySelector('img').className = 'header__logo-img';
    headerLogoDiv.append(optimizedHeaderLogoPic);
  }
  headerLogoLink.append(headerLogoDiv);
  headerDiv2.append(headerLogoLink);
  header.append(headerDiv2);

  const headerDiv3 = document.createElement('div');
  headerDiv3.className = 'header-d-flex header-w-25 header-justify-content-end';
  const loginLink = block.children[0].children[3].querySelector('a');
  if (loginLink) {
    const newLoginLink = document.createElement('a');
    newLoginLink.href = loginLink.href;
    newLoginLink.className = 'header__login-btn-wrapper header-analytics_cta_click';
    newLoginLink.style.display = 'inline';
    const loginButton = document.createElement('button');
    loginButton.className = 'header__login-btn header-btn header-text-boing-primary header-bg-transparent header-fw-semibold header-rounded-4 header-btn-sm header-py-3 header-px-4';
    loginButton.textContent = loginLink.textContent.trim();
    newLoginLink.append(loginButton);
    headerDiv3.append(newLoginLink);
  }
  header.append(headerDiv3);
  mainSection.append(header);

  // Submenu container
  const submenuContainer = document.createElement('div');
  submenuContainer.className = 'header-submenu-container header-position-fixed header-top-0 header-start-0 header-end-0 header-m-auto header-overflow-hidden';
  moveInstrumentation(block.children[1], submenuContainer);

  const aside = document.createElement('aside');
  aside.className = 'header-sidebar header-start-0 header-bg-white header-position-absolute';
  moveInstrumentation(block.children[1].children[0], aside);

  const sidebarMenu = document.createElement('ul');
  sidebarMenu.className = 'header-sidebar__menu header-list-unstyled header-px-4';

  // Sidebar Menu Items
  const sidebarMenuItems = [...block.children[1].children[0].children[0].children];
  sidebarMenuItems.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.className = 'header-sidebar__menu-item header-py-6 header-border-bottom header-border-boing-neutral-gray-200';
    if (row.classList.contains('header-sidebar__menu-item--logout')) {
      li.classList.add('header-sidebar__menu-item--logout');
      li.style.display = 'none';
    }

    const link = row.querySelector('a');
    if (link) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.className = 'header-sidebar__menu-link header-d-flex header-align-items-center header-text-decoration-none header-px-6 header-fw-medium header-analytics_cta_click';
      if (link.classList.contains('header-sidebar__menu-item--logout-btn')) {
        newLink.classList.add('header-sidebar__menu-item--logout-btn');
      }
      newLink.setAttribute('data-consent', link.getAttribute('data-consent'));
      newLink.setAttribute('data-link', link.getAttribute('data-link'));

      const img = link.querySelector('img');
      if (img) {
        const optimizedImg = createOptimizedPicture(img.src, img.alt);
        moveInstrumentation(img, optimizedImg.querySelector('img'));
        optimizedImg.querySelector('img').className = 'header-sidebar__menu-icon header-me-4';
        newLink.append(optimizedImg);
      }
      newLink.append(document.createTextNode(link.textContent.trim()));
      li.append(newLink);
    }
    sidebarMenu.append(li);
  });
  aside.append(sidebarMenu);

  const sidebarCurve = document.createElement('div');
  sidebarCurve.className = 'header-sidebar__curve';
  aside.append(sidebarCurve);

  // Footer brand section
  const footerBrand = document.createElement('div');
  footerBrand.className = 'header-footer-brand header-w-100 header-bg-boing-neutral-gray-600';
  footerBrand.setAttribute('data-isdoodlevariation', 'false');

  const primaryFooterSection = document.createElement('section');
  primaryFooterSection.className = 'header-footer-brand__primary';
  primaryFooterSection.style.backgroundColor = '';

  const primaryContainer = document.createElement('div');
  primaryContainer.className = 'header-container';
  const primaryContent = document.createElement('div');
  primaryContent.className = 'header-footer-brand__primary--content header-d-flex header-flex-column header-flex-md-row header-justify-content-md-between header-align-items-center';

  const footerBrandLeft = document.createElement('section');
  footerBrandLeft.className = 'header-footer-brand__left header-d-flex header-gap-16 header-px-10 header-align-items-center header-justify-content-center';

  const itcLink = block.children[1].children[0].children[2].children[0].children[0].children[0].children[0].children[0];
  if (itcLink) {
    const newItcLink = document.createElement('a');
    newItcLink.href = itcLink.href;
    newItcLink.target = '_blank';
    newItcLink.className = 'header-footer-brand__logo header-d-inline-block header-analytics_cta_click';
    newItcLink.setAttribute('data-cta-region', 'Footer');
    newItcLink.setAttribute('aria-label', 'ITC Logo');
    const itcImg = itcLink.querySelector('img');
    if (itcImg) {
      const optimizedItcPic = createOptimizedPicture(itcImg.src, itcImg.alt);
      moveInstrumentation(itcImg, optimizedItcPic.querySelector('img'));
      optimizedItcPic.querySelector('img').className = 'header-object-fit-contain header-w-100 header-h-100 header-no-rendition';
      newItcLink.append(optimizedItcPic);
    }
    footerBrandLeft.append(newItcLink);
  }

  const fssiLogoDiv = document.createElement('div');
  fssiLogoDiv.className = 'header-footer-brand__secondary--logo header-d-inline-block';
  const fssiImg = block.children[1].children[0].children[2].children[0].children[0].children[0].children[1].querySelector('img');
  if (fssiImg) {
    const optimizedFssiPic = createOptimizedPicture(fssiImg.src, fssiImg.alt);
    moveInstrumentation(fssiImg, optimizedFssiPic.querySelector('img'));
    optimizedFssiPic.querySelector('img').className = 'header-object-fit-contain header-w-100 header-no-rendition';
    fssiLogoDiv.append(optimizedFssiPic);
  }
  footerBrandLeft.append(fssiLogoDiv);
  primaryContent.append(footerBrandLeft);

  const footerBrandRight = document.createElement('section');
  footerBrandRight.className = 'header-footer-brand__right';
  const footerNavbar = document.createElement('nav');
  footerNavbar.className = 'header-footer-brand__navbar header-d-grid header-d-md-flex';
  footerNavbar.setAttribute('aria-label', 'footer navbar');

  const footerNavbarLeft = document.createElement('div');
  footerNavbarLeft.className = 'header-footer-brand__navbar--left header-d-flex header-flex-column header-flex-md-row ';

  // Footer List 1
  const footerList1Div = document.createElement('div');
  footerList1Div.className = 'header-footerList';
  const footerList1Ul = document.createElement('ul');
  footerList1Ul.className = 'header-footer-list header-d-flex header-align-items-center header-justify-content-center header-align-items-md-start header-flex-column';
  const footerListItems1 = [...block.children[1].children[0].children[2].children[0].children[1].children[0].children[0].children[0].children];
  footerListItems1.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.className = 'header-footer-list__item';
    const link = row.querySelector('a');
    if (link) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.className = 'header-cta-analytics header-analytics_cta_click header-footer-list__item--link header-d-inline-block';
      newLink.setAttribute('data-link-region', 'Footer List');
      newLink.textContent = link.textContent.trim();
      li.append(newLink);
    }
    footerList1Ul.append(li);
  });
  footerList1Div.append(footerList1Ul);
  footerNavbarLeft.append(footerList1Div);

  // Footer List 2
  const footerList2Div = document.createElement('div');
  footerList2Div.className = 'header-footerList';
  const footerList2Ul = document.createElement('ul');
  footerList2Ul.className = 'header-footer-list header-d-flex header-align-items-center header-justify-content-center header-align-items-md-start header-flex-column';
  const footerListItems2 = [...block.children[1].children[0].children[2].children[0].children[1].children[0].children[1].children[0].children];
  footerListItems2.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.className = 'header-footer-list__item';
    const link = row.querySelector('a');
    if (link) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.className = 'header-cta-analytics header-analytics_cta_click header-footer-list__item--link header-d-inline-block';
      newLink.setAttribute('data-link-region', 'Footer List');
      newLink.textContent = link.textContent.trim();
      li.append(newLink);
    }
    footerList2Ul.append(li);
  });
  footerList2Div.append(footerList2Ul);
  footerNavbarLeft.append(footerList2Div);
  footerNavbar.append(footerNavbarLeft);

  const footerNavbarRight = document.createElement('div');
  footerNavbarRight.className = 'header-footer-brand__navbar--right header-d-flex header-flex-column header-flex-md-row';

  // Footer List 3
  const footerList3Div = document.createElement('div');
  footerList3Div.className = 'header-footerList';
  const footerList3Ul = document.createElement('ul');
  footerList3Ul.className = 'header-footer-list header-d-flex header-align-items-center header-justify-content-center header-align-items-md-start header-flex-column';
  const footerListItems3 = [...block.children[1].children[0].children[2].children[0].children[1].children[1].children[0].children[0].children];
  footerListItems3.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.className = 'header-footer-list__item';
    const link = row.querySelector('a');
    if (link) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      if (link.target) newLink.target = link.target;
      newLink.className = 'header-cta-analytics header-analytics_cta_click header-footer-list__item--link header-d-inline-block';
      newLink.setAttribute('data-link-region', 'Footer List');
      newLink.textContent = link.textContent.trim();
      li.append(newLink);
    }
    footerList3Ul.append(li);
  });
  footerList3Div.append(footerList3Ul);
  footerNavbarRight.append(footerList3Div);

  // Footer List 4
  const footerList4Div = document.createElement('div');
  footerList4Div.className = 'header-footerList';
  const footerList4Ul = document.createElement('ul');
  footerList4Ul.className = 'header-footer-list header-d-flex header-align-items-center header-justify-content-center header-align-items-md-start header-flex-column';
  const footerListItems4 = [...block.children[1].children[0].children[2].children[0].children[1].children[1].children[1].children[0].children];
  footerListItems4.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.className = 'header-footer-list__item';
    const link = row.querySelector('a');
    if (link) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.className = 'header-cta-analytics header-analytics_cta_click header-footer-list__item--link header-d-inline-block';
      newLink.setAttribute('data-link-region', 'Footer List');
      newLink.textContent = link.textContent.trim();
      li.append(newLink);
    }
    footerList4Ul.append(li);
  });
  footerList4Div.append(footerList4Ul);
  footerNavbarRight.append(footerList4Div);
  footerNavbar.append(footerNavbarRight);

  footerBrandRight.append(footerNavbar);
  primaryContent.append(footerBrandRight);
  primaryContainer.append(primaryContent);
  primaryFooterSection.append(primaryContainer);
  footerBrand.append(primaryFooterSection);

  const secondaryFooterSection = document.createElement('section');
  secondaryFooterSection.className = 'header-footer-brand__secondary';
  secondaryFooterSection.style.backgroundColor = '';

  const secondaryContainer = document.createElement('div');
  secondaryContainer.className = 'header-container';
  const secondaryContent = document.createElement('div');
  secondaryContent.className = 'header-footer-brand__secondary--content header-d-flex header-flex-column  header-justify-content-md-between header-align-items-center';

  const socialMediaSection = document.createElement('section');
  socialMediaSection.className = 'header-footer-brand__right header-d-flex header-flex-column header-pb-5';
  const socialMediaTitle = document.createElement('h3');
  socialMediaTitle.className = 'header-social_media--title';
  socialMediaTitle.textContent = 'Follow Us On';
  socialMediaSection.append(socialMediaTitle);

  const socialMediaList = document.createElement('ul');
  socialMediaList.className = 'header-footer-brand__right--list header-d-flex header-align-items-center header-justify-content-center header-px-10 header-flex-wrap';

  const socialLinks = [...block.children[1].children[0].children[2].children[1].children[0].children[0].children[1].children];
  socialLinks.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.className = 'header-footer-brand__right--item header-d-flex header-justify-content-center header-align-items-center';
    const link = row.querySelector('a');
    if (link) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.target = '_blank';
      newLink.className = 'header-footer-brand__right--link header-d-flex header-justify-content-center header-align-items-center header-analytics_cta_click';
      newLink.setAttribute('data-cta-region', 'Footer');
      newLink.setAttribute('data-cta-label', link.getAttribute('data-cta-label'));
      newLink.setAttribute('data-platform-name', link.getAttribute('data-platform-name'));
      newLink.setAttribute('data-social-linktype', 'follow');
      const img = link.querySelector('img');
      if (img) {
        const optimizedImg = createOptimizedPicture(img.src, img.alt);
        moveInstrumentation(img, optimizedImg.querySelector('img'));
        optimizedImg.querySelector('img').className = 'header-object-fit-contain header-w-100 header-h-100 header-no-rendition';
        optimizedImg.querySelector('img').setAttribute('aria-label', img.getAttribute('aria-label'));
        newLink.append(optimizedImg);
      }
      li.append(newLink);
    }
    socialMediaList.append(li);
  });
  socialMediaSection.append(socialMediaList);
  secondaryContent.append(socialMediaSection);

  const copyrightSection = document.createElement('section');
  copyrightSection.className = 'header-footer-brand__left header-py-5 header-d-flex header-flex-column header-gap-3';
  const copyrightList = document.createElement('ul');
  copyrightList.className = 'header-footer-brand__left--list header-d-flex header-align-items-center header-justify-content-center header-flex-wrap';

  const copyrightLinkItem = document.createElement('li');
  copyrightLinkItem.className = 'header-footer-brand__left--item header-foot_link';
  const copyrightLink = block.children[1].children[0].children[2].children[1].children[0].children[1].children[0].children[0].querySelector('a');
  if (copyrightLink) {
    const newCopyrightLink = document.createElement('a');
    newCopyrightLink.href = copyrightLink.href;
    newCopyrightLink.target = '_blank';
    newCopyrightLink.className = 'header-footer-brand__left--link header-analytics_cta_click';
    newCopyrightLink.setAttribute('data-cta-region', 'Footer');
    newCopyrightLink.textContent = copyrightLink.textContent.trim();
    copyrightLinkItem.append(newCopyrightLink);
  }
  copyrightList.append(copyrightLinkItem);
  copyrightSection.append(copyrightList);

  const copyrightDiv = document.createElement('div');
  copyrightDiv.className = 'header-footer-brand__left--copyright header-text-center ';
  const copyrightSpan = document.createElement('span');
  copyrightSpan.className = 'header-footer-brand__left--text header-text-white';
  copyrightSpan.textContent = block.children[1].children[0].children[2].children[1].children[0].children[1].children[1].children[0].textContent.trim();
  copyrightDiv.append(copyrightSpan);
  copyrightSection.append(copyrightDiv);
  secondaryContent.append(copyrightSection);

  secondaryContainer.append(secondaryContent);
  secondaryFooterSection.append(secondaryContainer);
  footerBrand.append(secondaryFooterSection);

  aside.append(footerBrand);
  submenuContainer.append(aside);

  const overlay = document.createElement('div');
  overlay.className = 'header-overlay header-position-absolute header-top-0 header-start-0 header-w-100 header-h-100 header-bg-black header-opacity-25';
  submenuContainer.append(overlay);

  mainSection.append(submenuContainer);

  block.textContent = '';
  block.append(mainSection);
}
