import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // If there's no direct anchor, but there's text, wrap it in a span for consistent triggering
    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
      }
    }

    if (nested) {
      nested.remove(); // Remove the original nested UL
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-sub-child'); // This class is not in the original HTML, but needed for functionality.
                                              // If a specific class from original HTML is available for nested menus, use that.
      subWrap.append(nested);
      li.append(subWrap);

      // Add classes to nested elements from the original HTML if applicable
      nested.classList.add('nav-menu-list'); // Example class, adjust based on actual original HTML for nested ULs
      nested.querySelectorAll('li').forEach(nestedLi => nestedLi.classList.add('nav-menu-item', 'list-item')); // Example classes
      nested.querySelectorAll('a').forEach(nestedA => nestedA.classList.add('nav-menu-link', 'list-link')); // Example classes

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
    pageShareHeaderIconRow,
    pageShareTitleRow,
    connectTitleRow,
    connectBodyRow,
    contactTitleRow,
    contactBodyRow,
    contactButtonLinkRow,
    contactButtonLabelRow,
    footerLogoRow,
    footerLocationRow,
    footerCopyrightRow,
    cookieSettingsLabelRow,
    cookieSettingsIconRow,
    ...itemRows
  ] = children;

  // Filter item rows based on the number of cells, as per BlockJson and EDS structure guide
  const pageShareItems = itemRows.filter((row) => row.children.length === 4); // icon, link, label, hierarchy-tree
  const connectItems = itemRows.filter((row) => row.children.length === 3); // icon, link, label
  const footerMenuItems = itemRows.filter((row) => row.children.length === 2); // label, link

  block.innerHTML = '';
  block.classList.add('uol-l-contain--wide', 'md:uol-l-contain-space--default');

  const footerInner = document.createElement('div');
  footerInner.classList.add('uco-c-footer__inner');
  block.append(footerInner);

  // Page Share Section
  const pageShareSection = document.createElement('section');
  pageShareSection.classList.add('uol-c-page-share');
  pageShareSection.setAttribute('aria-label', 'Share this page');
  footerInner.append(pageShareSection);

  const pageShareHeader = document.createElement('div');
  pageShareHeader.classList.add('uol-c-page-share__header');
  pageShareSection.append(pageShareHeader);

  const pageShareIcon = pageShareHeaderIconRow?.querySelector('picture');
  if (pageShareIcon) {
    const img = pageShareIcon.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(pageShareIcon, optimizedPic.querySelector('img'));
    pageShareHeader.append(optimizedPic);
  }

  const pageShareTitle = document.createElement('h2');
  pageShareTitle.classList.add('uol-c-page-share__title');
  pageShareTitle.textContent = pageShareTitleRow?.textContent.trim() || '';
  pageShareHeader.append(pageShareTitle);

  if (pageShareItems.length > 0) {
    const pageShareList = document.createElement('ul');
    pageShareList.setAttribute('role', 'list');
    pageShareList.classList.add('uol-c-page-share__list');
    pageShareSection.append(pageShareList);

    pageShareItems.forEach((row) => {
      const cells = [...row.children];
      const iconCell = cells[0];
      const linkCell = cells[1];
      const labelCell = cells[2];
      const hierarchyCell = cells[3]; // This is the new hierarchy-tree field

      const listItem = document.createElement('li');
      listItem.classList.add('uol-c-page-share__list-item');
      pageShareList.append(listItem);

      const link = document.createElement('a');
      link.classList.add('uol-c-page-share__list-link');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      }
      moveInstrumentation(linkCell, link);
      listItem.append(link);

      const iconPicture = iconCell?.querySelector('picture');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(iconPicture, optimizedPic.querySelector('img'));
        link.append(optimizedPic);
      }

      const visuallyHiddenSpan = document.createElement('span');
      visuallyHiddenSpan.classList.add('uol-u-visually-hidden');
      visuallyHiddenSpan.textContent = labelCell?.textContent.trim() || '';
      link.append(visuallyHiddenSpan);

      // Handle hierarchy-tree richtext field
      if (hierarchyCell && hierarchyCell.innerHTML.trim()) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyCell.innerHTML;
        const rootUl = tempDiv.querySelector('ul');
        if (rootUl) {
          moveInstrumentation(hierarchyCell, rootUl); // Instrument the original cell to the new UL
          transformNestedLists(rootUl); // Apply transformation for nested lists and interactivity
          listItem.append(rootUl); // Append the transformed UL to the list item
        }
      }
    });
  }

  // Communication Section
  const communicationDiv = document.createElement('div');
  communicationDiv.classList.add('uco-c-footer__communication');
  footerInner.append(communicationDiv);

  const mainInnerDiv = document.createElement('div');
  mainInnerDiv.classList.add('uco-c-footer__main-inner', 'md:uol-l-grid');
  communicationDiv.append(mainInnerDiv);

  // Connect Section
  const connectSection = document.createElement('section');
  connectSection.classList.add('uco-c-footer__connect', 'uol-l-stack--prose', 'md:uol-l-col--6');
  mainInnerDiv.append(connectSection);

  const connectTitle = document.createElement('h2');
  connectTitle.classList.add('uco-c-footer__connect-title');
  connectTitle.textContent = connectTitleRow?.textContent.trim() || '';
  connectSection.append(connectTitle);

  const connectBody = document.createElement('p');
  connectBody.classList.add('uco-c-footer__connect-body', 'uol-u-measure');
  connectBody.innerHTML = connectBodyRow?.innerHTML || ''; // Use innerHTML for richtext
  connectSection.append(connectBody);

  if (connectItems.length > 0) {
    const connectList = document.createElement('ul');
    connectList.setAttribute('role', 'list');
    connectList.classList.add('uco-c-footer__connect-list');
    connectSection.append(connectList);

    connectItems.forEach((row) => {
      const cells = [...row.children];
      const iconCell = cells[0];
      const linkCell = cells[1];
      const labelCell = cells[2];

      const listItem = document.createElement('li');
      listItem.classList.add('uco-c-footer__connect-list-item');
      connectList.append(listItem);

      const link = document.createElement('a');
      link.classList.add('uol-c-link', 'uco-c-footer__connect-list-link');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      }
      moveInstrumentation(linkCell, link);
      listItem.append(link);

      const linkInner = document.createElement('span');
      linkInner.classList.add('uol-c-link__inner');
      link.append(linkInner);

      const linkLabel = document.createElement('span');
      linkLabel.classList.add('uol-c-link__label');
      linkInner.append(linkLabel);

      const iconPicture = iconCell?.querySelector('picture');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(iconPicture, optimizedPic.querySelector('img'));
        linkLabel.append(optimizedPic);
      }

      const visuallyHiddenSpan = document.createElement('span');
      visuallyHiddenSpan.classList.add('uol-u-visually-hidden');
      visuallyHiddenSpan.textContent = labelCell?.textContent.trim() || '';
      linkLabel.append(visuallyHiddenSpan);
    });
  }

  // Contact Section
  const contactSection = document.createElement('section');
  contactSection.classList.add('uco-c-footer__contact', 'uol-l-stack--prose', 'md:uol-l-col--6');
  mainInnerDiv.append(contactSection);

  const contactTitle = document.createElement('h2');
  contactTitle.classList.add('uco-c-footer__contact-title');
  contactTitle.textContent = contactTitleRow?.textContent.trim() || '';
  contactSection.append(contactTitle);

  const contactBody = document.createElement('p');
  contactBody.classList.add('uco-c-footer__contact-body', 'uol-u-measure');
  contactBody.innerHTML = contactBodyRow?.innerHTML || ''; // Use innerHTML for richtext
  contactSection.append(contactBody);

  const contactButton = document.createElement('a');
  contactButton.classList.add('uol-c-button', 'uol-c-button--rounded', 'uol-c-button--rounded-inline-end');
  const contactButtonLink = contactButtonLinkRow?.querySelector('a');
  if (contactButtonLink) {
    contactButton.href = contactButtonLink.href;
  }
  moveInstrumentation(contactButtonLinkRow, contactButton);

  const contactButtonLabelSpan = document.createElement('span');
  contactButtonLabelSpan.classList.add('uol-c-button__label');
  contactButtonLabelSpan.textContent = contactButtonLabelRow?.textContent.trim() || '';
  contactButton.append(contactButtonLabelSpan);
  contactSection.append(contactButton);

  // Main Footer Content
  const footerMain = document.createElement('div');
  footerMain.classList.add('uco-c-footer__main');
  footerInner.append(footerMain);

  const footerMainInner = document.createElement('div');
  footerMainInner.classList.add('uco-c-footer__main-inner', 'md:uol-l-grid', 'md:uol-l-grid--gap-block-none');
  footerMain.append(footerMainInner);

  const footerMainBody = document.createElement('div');
  footerMainBody.classList.add('uco-c-footer__main-body', 'md:uol-l-col--8', 'lg:uol-l-col--9');
  footerMainInner.append(footerMainBody);

  const footerMainBodyInner = document.createElement('div');
  footerMainBodyInner.classList.add('uco-c-footer__main-body-inner');
  footerMainBody.append(footerMainBodyInner);

  // Footer Menu
  if (footerMenuItems.length > 0) {
    const footerNav = document.createElement('nav');
    footerNav.classList.add('uco-c-footer__menu');
    footerNav.setAttribute('aria-label', 'Footer menu');
    footerMainBodyInner.append(footerNav);

    const footerMenuList = document.createElement('ul');
    footerMenuList.setAttribute('role', 'list');
    footerMenuList.classList.add('uco-c-footer__menu-list');
    footerNav.append(footerMenuList);

    footerMenuItems.forEach((row) => {
      const cells = [...row.children];
      const labelCell = cells[0];
      const linkCell = cells[1];

      const listItem = document.createElement('li');
      listItem.classList.add('uco-c-footer__menu-item');
      footerMenuList.append(listItem);

      const link = document.createElement('a');
      link.classList.add('uol-c-link', 'uco-c-footer__menu-link');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      }
      moveInstrumentation(linkCell, link);
      listItem.append(link);

      const linkInner = document.createElement('span');
      linkInner.classList.add('uol-c-link__inner');
      link.append(linkInner);

      const linkLabel = document.createElement('span');
      linkLabel.classList.add('uol-c-link__label');
      linkLabel.textContent = labelCell?.textContent.trim() || '';
      linkInner.append(linkLabel);
    });
  }

  const footerMainContent = document.createElement('div');
  footerMainContent.classList.add('uco-c-footer__main-content');
  footerMainBodyInner.append(footerMainContent);

  // Footer Logo
  const footerLogoDiv = document.createElement('div');
  footerLogoDiv.classList.add('uco-c-footer__main-logo');
  footerMainContent.append(footerLogoDiv);

  const footerLogoPicture = footerLogoRow?.querySelector('picture');
  if (footerLogoPicture) {
    const img = footerLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    optimizedPic.querySelector('img').classList.add('uco-c-footer__main-logo-image');
    moveInstrumentation(footerLogoPicture, optimizedPic.querySelector('img'));
    footerLogoDiv.append(optimizedPic);
  }

  const footerMainContentInner = document.createElement('div');
  footerMainContentInner.classList.add('uco-c-footer__main-content-inner', 'uol-l-stack--compact', 'uol-u-measure');
  footerMainContent.append(footerMainContentInner);

  // Footer Location
  const footerLocation = document.createElement('p');
  footerLocation.classList.add('uco-c-footer__location');
  footerLocation.textContent = footerLocationRow?.textContent.trim() || '';
  footerMainContentInner.append(footerLocation);

  const footerAdditionalInfo = document.createElement('div');
  footerAdditionalInfo.classList.add('uco-c-footer__additional-info');
  footerMainContentInner.append(footerAdditionalInfo);

  // Footer Copyright
  const footerCopyright = document.createElement('p');
  footerCopyright.classList.add('uco-c-footer__copyright');
  footerCopyright.textContent = footerCopyrightRow?.textContent.trim() || '';
  footerAdditionalInfo.append(footerCopyright);

  // Cookie Settings
  const cookieSettingsButton = document.createElement('button');
  cookieSettingsButton.setAttribute('type', 'button');
  cookieSettingsButton.classList.add('uol-c-button', 'is-icon-end', 'uol-c-button--link', 'uco-c-footer__menu-link', 'optanon-show-settings');
  footerAdditionalInfo.append(cookieSettingsButton);

  const cookieButtonLabelSpan = document.createElement('span');
  cookieButtonLabelSpan.classList.add('uol-c-button__label');
  cookieSettingsButton.append(cookieButtonLabelSpan);

  const cookieLabelTextSpan = document.createElement('span');
  cookieLabelTextSpan.setAttribute('id', 'ot-sdk-btn-label');
  cookieLabelTextSpan.classList.add('uco-c-footer__menu-link-text');
  cookieLabelTextSpan.textContent = cookieSettingsLabelRow?.textContent.trim() || '';
  cookieButtonLabelSpan.append(cookieLabelTextSpan);

  const cookieButtonIconSpan = document.createElement('span');
  cookieButtonIconSpan.classList.add('uol-c-button__icon');
  cookieSettingsButton.append(cookieButtonIconSpan);

  const cookieIconPicture = cookieSettingsIconRow?.querySelector('picture');
  if (cookieIconPicture) {
    const img = cookieIconPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(cookieIconPicture, optimizedPic.querySelector('img'));
    cookieButtonIconSpan.append(optimizedPic);
  }

  // The original block had a redundant loop to optimize all images at the end.
  // Images are already optimized when they are created/moved. Removing this.
}
