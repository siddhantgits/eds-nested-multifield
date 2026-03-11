import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const containerHd = document.createElement('section');
  containerHd.className = 'container-hd footer-container-hd p-0';
  moveInstrumentation(block, containerHd);

  const footerBrand = document.createElement('div');
  footerBrand.className = 'footer-brand footer-brand-w-100 footer-brand-bg-boing-neutral-gray-600';
  footerBrand.setAttribute('data-isdoodlevariation', 'false');
  containerHd.append(footerBrand);

  // Primary Section
  const primarySection = document.createElement('section');
  primarySection.className = 'footer-brand__primary footer-brand__primary';
  primarySection.style.backgroundColor = ''; // Assuming this is dynamic if needed
  footerBrand.append(primarySection);

  const primaryContainer = document.createElement('div');
  primaryContainer.className = 'container';
  primarySection.append(primaryContainer);

  const primaryContent = document.createElement('div');
  primaryContent.className = 'footer-brand__primary--content footer-brand__primary--content-d-flex footer-brand__primary--content-flex-column footer-brand__primary--content-flex-md-row footer-brand__primary--content-justify-content-md-between footer-brand__primary--content-align-items-center';
  primaryContainer.append(primaryContent);

  const primaryLeft = document.createElement('section');
  primaryLeft.className = 'footer-brand__left footer-brand__left-d-flex footer-brand__left-gap-16 footer-brand__left-px-10 footer-brand__left-align-items-center footer-brand__left-justify-content-center';
  primaryContent.append(primaryLeft);

  // Primary Logo (first row, first cell)
  const primaryLogoCell = block.children[0]?.children[0];
  if (primaryLogoCell) {
    const primaryLink = primaryLogoCell.querySelector('a');
    const primaryImg = primaryLogoCell.querySelector('img');
    if (primaryLink && primaryImg) {
      const newPrimaryLink = document.createElement('a');
      newPrimaryLink.href = primaryLink.href;
      newPrimaryLink.target = primaryLink.target;
      newPrimaryLink.className = 'footer-brand__logo footer-brand__logo-d-inline-block footer-brand__logo-analytics_cta_click';
      newPrimaryLink.setAttribute('data-cta-region', 'Footer');
      newPrimaryLink.setAttribute('aria-label', primaryLink.getAttribute('aria-label'));

      const optimizedPrimaryPic = createOptimizedPicture(primaryImg.src, primaryImg.alt);
      moveInstrumentation(primaryImg, optimizedPrimaryPic.querySelector('img'));
      optimizedPrimaryPic.querySelector('img').className = 'footer-brand__logo-object-fit-contain footer-brand__logo-w-100 footer-brand__logo-h-100 footer-brand__logo-no-rendition';
      optimizedPrimaryPic.querySelector('img').loading = 'lazy';
      newPrimaryLink.append(optimizedPrimaryPic);
      primaryLeft.append(newPrimaryLink);
    }
  }

  // Secondary Logo (first row, second cell)
  const secondaryLogoCell = block.children[0]?.children[1];
  if (secondaryLogoCell) {
    const secondaryImg = secondaryLogoCell.querySelector('img');
    if (secondaryImg) {
      const secondaryLogoDiv = document.createElement('div');
      secondaryLogoDiv.className = 'footer-brand__secondary--logo footer-brand__secondary--logo-d-inline-block';

      const optimizedSecondaryPic = createOptimizedPicture(secondaryImg.src, secondaryImg.alt);
      moveInstrumentation(secondaryImg, optimizedSecondaryPic.querySelector('img'));
      optimizedSecondaryPic.querySelector('img').className = 'footer-brand__secondary--logo-object-fit-contain footer-brand__secondary--logo-w-100 footer-brand__secondary--logo-no-rendition';
      optimizedSecondaryPic.querySelector('img').loading = 'lazy';
      secondaryLogoDiv.append(optimizedSecondaryPic);
      primaryLeft.append(secondaryLogoDiv);
    }
  }

  const primaryRight = document.createElement('section');
  primaryRight.className = 'footer-brand__right footer-brand__right';
  primaryContent.append(primaryRight);

  const navbar = document.createElement('nav');
  navbar.className = 'footer-brand__navbar footer-brand__navbar-d-grid footer-brand__navbar-d-md-flex';
  navbar.setAttribute('aria-label', 'footer navbar');
  primaryRight.append(navbar);

  const navbarLeft = document.createElement('div');
  navbarLeft.className = 'footer-brand__navbar--left footer-brand__navbar--left-d-flex footer-brand__navbar--left-flex-column footer-brand__navbar--left-flex-md-row ';
  navbar.append(navbarLeft);

  const navbarRight = document.createElement('div');
  navbarRight.className = 'footer-brand__navbar--right footer-brand__navbar--right-d-flex footer-brand__navbar--right-flex-column footer-brand__navbar--right-flex-md-row';
  navbar.append(navbarRight);

  // Footer Link Groups (starting from the third cell of the first row)
  const footerLinkGroupCells = Array.from(block.children[0]?.children || []).slice(2);
  footerLinkGroupCells.forEach((cell, index) => {
    const footerListDiv = document.createElement('div');
    footerListDiv.className = 'footerList';
    moveInstrumentation(cell, footerListDiv);

    const ul = document.createElement('ul');
    ul.className = 'footer-list footer-list-d-flex footer-list-align-items-center footer-list-justify-content-center footer-list-align-items-md-start footer-list-flex-column';
    footerListDiv.append(ul);

    const links = cell.querySelectorAll('li > a');
    links.forEach((link) => {
      const li = document.createElement('li');
      li.className = 'footer-list__item';

      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.textContent = link.textContent;
      newLink.className = 'cta-analytics footer-list__item--link-analytics_cta_click footer-list__item--link-d-inline-block';
      newLink.setAttribute('data-link-region', 'Footer List');
      if (link.target) {
        newLink.target = link.target;
      }
      li.append(newLink);
      ul.append(li);
    });

    if (index < 2) {
      navbarLeft.append(footerListDiv);
    } else {
      navbarRight.append(footerListDiv);
    }
  });

  // Secondary Section
  const secondarySection = document.createElement('section');
  secondarySection.className = 'footer-brand__secondary footer-brand__secondary';
  secondarySection.style.backgroundColor = '';
  footerBrand.append(secondarySection);

  const secondaryContainer = document.createElement('div');
  secondaryContainer.className = 'container';
  secondarySection.append(secondaryContainer);

  const secondaryContent = document.createElement('div');
  secondaryContent.className = 'footer-brand__secondary--content footer-brand__secondary--content-d-flex footer-brand__secondary--content-flex-column footer-brand__secondary--content-justify-content-md-between footer-brand__secondary--content-align-items-center';
  secondaryContainer.append(secondaryContent);

  const socialMediaRight = document.createElement('section');
  socialMediaRight.className = 'footer-brand__right footer-brand__right-d-flex footer-brand__right-flex-column footer-brand__right-pb-5';
  secondaryContent.append(socialMediaRight);

  const socialMediaTitle = document.createElement('h3');
  socialMediaTitle.className = 'social_media--title';
  socialMediaTitle.textContent = 'Follow Us On';
  socialMediaRight.append(socialMediaTitle);

  const socialMediaList = document.createElement('ul');
  socialMediaList.className = 'footer-brand__right--list footer-brand__right--list-d-flex footer-brand__right--list-align-items-center footer-brand__right--list-justify-content-center footer-brand__right--list-px-10 footer-brand__right--list-flex-wrap';
  socialMediaRight.append(socialMediaList);

  // Social Links (second row, first cell)
  const socialLinksCell = block.children[1]?.children[0];
  if (socialLinksCell) {
    const socialLinks = socialLinksCell.querySelectorAll('li > a');
    socialLinks.forEach((link) => {
      const li = document.createElement('li');
      li.className = 'footer-brand__right--item footer-brand__right--item-d-flex footer-brand__right--item-justify-content-center footer-brand__right--item-align-items-center';

      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.className = 'footer-brand__right--link footer-brand__right--link-d-flex footer-brand__right--link-justify-content-center footer-brand__right--link-align-items-center footer-brand__right--link-analytics_cta_click';
      newLink.setAttribute('data-cta-region', 'Footer');
      newLink.setAttribute('data-cta-label', link.getAttribute('data-cta-label'));
      newLink.target = link.target;
      newLink.setAttribute('data-platform-name', link.getAttribute('data-platform-name'));
      newLink.setAttribute('data-social-linktype', link.getAttribute('data-social-linktype'));

      const img = link.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        optimizedPic.querySelector('img').className = 'footer-brand__right--link-object-fit-contain footer-brand__right--link-w-100 footer-brand__right--link-h-100 footer-brand__right--link-no-rendition';
        optimizedPic.querySelector('img').loading = 'lazy';
        optimizedPic.querySelector('img').setAttribute('aria-label', img.getAttribute('aria-label'));
        newLink.append(optimizedPic);
      }
      li.append(newLink);
      socialMediaList.append(li);
    });
  }

  const copyrightLeft = document.createElement('section');
  copyrightLeft.className = 'footer-brand__left footer-brand__left-py-5 footer-brand__left-d-flex footer-brand__left-flex-column footer-brand__left-gap-3';
  secondaryContent.append(copyrightLeft);

  const copyrightList = document.createElement('ul');
  copyrightList.className = 'footer-brand__left--list footer-brand__left--list-d-flex footer-brand__left--list-align-items-center footer-brand__left--list-justify-content-center footer-brand__left--list-flex-wrap';
  copyrightLeft.append(copyrightList);

  // ITC Portal Link (second row, second cell)
  const itcPortalCell = block.children[1]?.children[1];
  if (itcPortalCell) {
    const itcLink = itcPortalCell.querySelector('a');
    if (itcLink) {
      const li = document.createElement('li');
      li.className = 'footer-brand__left--item footer-brand__left--item-foot_link';

      const newLink = document.createElement('a');
      newLink.href = itcLink.href;
      newLink.target = itcLink.target;
      newLink.className = 'footer-brand__left--link footer-brand__left--link-analytics_cta_click';
      newLink.setAttribute('data-cta-region', 'Footer');
      newLink.textContent = itcLink.textContent;
      li.append(newLink);
      copyrightList.append(li);
    }
  }

  // Copyright Text (second row, third cell)
  const copyrightTextCell = block.children[1]?.children[2];
  if (copyrightTextCell) {
    const copyrightDiv = document.createElement('div');
    copyrightDiv.className = 'footer-brand__left--copyright footer-brand__left--copyright-text-center ';

    const copyrightSpan = document.createElement('span');
    copyrightSpan.className = 'footer-brand__left--text footer-brand__left--text-text-white';
    copyrightSpan.innerHTML = copyrightTextCell.innerHTML; // Take inner HTML to preserve any formatting
    copyrightDiv.append(copyrightSpan);
    copyrightLeft.append(copyrightDiv);
  }

  block.textContent = '';
  block.append(containerHd);
}
