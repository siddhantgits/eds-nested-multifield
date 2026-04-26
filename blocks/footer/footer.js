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
      subWrap.classList.add('cmp-navigation__group'); // Use class from ORIGINAL HTML
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
  const children = [...block.children];

  // Destructure root fields based on BlockJson model
  const [
    logoRow, // block.children[0]
    logoLinkRow, // block.children[1]
    itcLogoRow, // block.children[2]
    fssaiLogoRow, // block.children[3]
    subscribeLogoRow, // block.children[4]
    subscribeTitleRow, // block.children[5]
    subscribeEmailPlaceholderRow, // block.children[6]
    subscribeConsentTextRow, // block.children[7]
    subscribePrivacyPolicyLinkRow, // block.children[8]
    subscribeButtonTextRow, // block.children[9]
    itcPortalTextRow, // block.children[10]
    itcPortalLinkRow, // block.children[11]
    copyrightTextRow, // block.children[12]
    ...itemRows // Remaining rows are item rows for containers
  ] = children;

  const footerNavLeftItems = [];
  const footerNavRightItems = [];
  const footerSocialItems = [];

  // Separate item rows based on cell count and content detection
  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 3) { // footer-navigation-item: label (text), link (aem-content), hierarchy-tree (richtext)
      // Determine if it's left or right navigation.
      // This heuristic assumes navigation items are grouped sequentially.
      // If the model had explicit container fields, we would use those.
      if (footerNavLeftItems.length <= footerNavRightItems.length) {
        footerNavLeftItems.push(row);
      } else {
        footerNavRightItems.push(row);
      }
    } else if (cells.length === 2) { // footer-social-item: link (aem-content), icon (text)
      footerSocialItems.push(row);
    }
  });

  // Main footer container
  const footerWrapper = document.createElement('div');
  footerWrapper.classList.add('container');

  const cmpFooter = document.createElement('div');
  cmpFooter.classList.add('cmp-footer');
  cmpFooter.setAttribute('aria-label', 'desktop altext');

  // Top content
  const topContent = document.createElement('div');
  topContent.classList.add('cmp-footer__top-content');

  const navLogo = document.createElement('div');
  navLogo.classList.add('cmp-footer__nav-logo');

  const navLogoTop = document.createElement('div');
  navLogoTop.classList.add('cmp-footer__nav-logo--top');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image', 'cmp-footer__logo');
  const logoPicture = logoRow?.querySelector('picture');
  const logoLink = logoLinkRow?.querySelector('a'); // Read href from aem-content cell
  if (logoPicture && logoLink) {
    const optimizedLogoPicture = createOptimizedPicture(
      logoPicture.querySelector('img').src,
      logoPicture.querySelector('img').alt,
      false,
      [{ width: '750' }],
    );
    const logoAnchor = document.createElement('a');
    logoAnchor.classList.add('cmp-image__link');
    logoAnchor.href = logoLink.href; // Use href from aem-content cell
    moveInstrumentation(logoLinkRow, logoAnchor);
    logoAnchor.append(optimizedLogoPicture);
    logoDiv.append(logoAnchor);
  } else if (logoPicture) {
    const optimizedLogoPicture = createOptimizedPicture(
      logoPicture.querySelector('img').src,
      logoPicture.querySelector('img').alt,
      false,
      [{ width: '750' }],
    );
    logoDiv.append(optimizedLogoPicture);
  }
  moveInstrumentation(logoRow, logoDiv);
  navLogoTop.append(logoDiv);
  navLogo.append(navLogoTop);

  const navLogoBottom = document.createElement('div');
  navLogoBottom.classList.add('cmp-footer__nav-logo--bottom');

  const itcLogoDiv = document.createElement('div');
  itcLogoDiv.classList.add('logoitc', 'logo', 'image', 'cmp-footer__itc_logo');
  const itcLogoPicture = itcLogoRow?.querySelector('picture');
  if (itcLogoPicture) {
    const optimizedItcLogoPicture = createOptimizedPicture(
      itcLogoPicture.querySelector('img').src,
      itcLogoPicture.querySelector('img').alt,
      false,
      [{ width: '600' }],
    );
    itcLogoDiv.append(optimizedItcLogoPicture);
  }
  moveInstrumentation(itcLogoRow, itcLogoDiv);
  navLogoBottom.append(itcLogoDiv);

  const fssaiLogoDiv = document.createElement('div');
  fssaiLogoDiv.classList.add('logofssai', 'logo', 'image', 'cmp-footer__fssai_logo');
  const fssaiLogoPicture = fssaiLogoRow?.querySelector('picture');
  if (fssaiLogoPicture) {
    const optimizedFssaiLogoPicture = createOptimizedPicture(
      fssaiLogoPicture.querySelector('img').src,
      fssaiLogoPicture.querySelector('img').alt,
      false,
      [{ width: '600' }],
    );
    fssaiLogoDiv.append(optimizedFssaiLogoPicture);
  }
  moveInstrumentation(fssaiLogoRow, fssaiLogoDiv);
  navLogoBottom.append(fssaiLogoDiv);

  navLogo.append(navLogoBottom);
  topContent.append(navLogo);

  // Subscribe section
  const subscribeDiv = document.createElement('div');
  subscribeDiv.classList.add('cmp-footer__nav-subscribe');

  const subscribeTextDiv = document.createElement('div');
  subscribeTextDiv.classList.add('cmp-footer__nav-text');
  const subscribeLogoImg = subscribeLogoRow?.querySelector('img');
  if (subscribeLogoImg) {
    const img = document.createElement('img');
    img.src = subscribeLogoImg.src;
    img.alt = subscribeLogoImg.alt;
    img.loading = 'lazy';
    img.fetchpriority = 'low';
    subscribeTextDiv.append(img);
  }
  const subscribeTitleH3 = document.createElement('h3');
  subscribeTitleH3.textContent = subscribeTitleRow?.textContent.trim() || '';
  subscribeTextDiv.append(subscribeTitleH3);
  subscribeDiv.append(subscribeTextDiv);

  const inputContainer = document.createElement('div');
  inputContainer.classList.add('container', 'responsivegrid', 'cmp-input');
  const emailInputDiv = document.createElement('div');
  emailInputDiv.classList.add('text', 'aem-GridColumn', 'aem-GridColumn--default--12', 'cmp-input__email');
  const formTextDiv = document.createElement('div');
  formTextDiv.classList.add('cmp-form-text');
  const emailInput = document.createElement('input');
  emailInput.classList.add('cmp-form-text__text');
  emailInput.type = 'email';
  emailInput.placeholder = subscribeEmailPlaceholderRow?.textContent.trim() || '';
  emailInput.name = 'email';
  formTextDiv.append(emailInput);
  emailInputDiv.append(formTextDiv);
  inputContainer.append(emailInputDiv);
  subscribeDiv.append(inputContainer);

  const errorMessageDiv = document.createElement('div');
  errorMessageDiv.classList.add('cmp-footer__error-message');
  subscribeDiv.append(errorMessageDiv);

  const consentDiv = document.createElement('div');
  consentDiv.classList.add('cmp-footer__consent');
  const consentCheckbox = document.createElement('input');
  consentCheckbox.type = 'checkbox';
  consentCheckbox.id = 'i_agree';
  consentCheckbox.name = 'i_agree';
  consentCheckbox.value = 'i_agree';
  consentCheckbox.classList.add('cmp-footer__consent--checkbox');
  consentDiv.append(consentCheckbox);

  const consentLinkDiv = document.createElement('div');
  consentLinkDiv.classList.add('cmp-footer__consent--link');
  const consentP = document.createElement('p');
  const consentText = subscribeConsentTextRow?.textContent.trim() || '';
  const privacyLink = subscribePrivacyPolicyLinkRow?.querySelector('a'); // Read href from aem-content cell
  if (privacyLink) {
    // Split the consent text to insert the privacy policy link correctly
    const parts = consentText.split('Privacy Policy');
    if (parts.length > 1) {
      consentP.append(document.createTextNode(parts[0]));
      const privacyAnchor = document.createElement('a');
      privacyAnchor.href = privacyLink.href; // Use href from aem-content cell
      privacyAnchor.target = '_self';
      privacyAnchor.rel = 'noopener noreferrer';
      privacyAnchor.textContent = 'Privacy Policy'; // Hardcoded text for the link label, as per original HTML
      consentP.append(privacyAnchor);
      consentP.append(document.createTextNode(parts[1]));
    } else {
      consentP.textContent = consentText;
    }
  } else {
    consentP.textContent = consentText;
  }
  consentLinkDiv.append(consentP);
  consentDiv.append(consentLinkDiv);
  subscribeDiv.append(consentDiv);

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'cmp-button--primary', 'cmp-button--primary-anchor-dark');
  const subscribeButton = document.createElement('button');
  subscribeButton.type = 'button';
  subscribeButton.classList.add('cmp-button');
  subscribeButton.disabled = true; // Initially disabled
  const buttonSpan = document.createElement('span');
  buttonSpan.classList.add('cmp-button__text');
  buttonSpan.textContent = subscribeButtonTextRow?.textContent.trim() || '';
  subscribeButton.append(buttonSpan);
  buttonDiv.append(subscribeButton);
  subscribeDiv.append(buttonDiv);

  // Event listener for consent checkbox to enable/disable subscribe button
  consentCheckbox.addEventListener('change', () => {
    subscribeButton.disabled = !consentCheckbox.checked;
  });

  // Event listener for subscribe button (example, actual API call would go here)
  subscribeButton.addEventListener('click', () => {
    if (consentCheckbox.checked && emailInput.value) {
      // eslint-disable-next-line no-alert
      alert(`Subscribing with email: ${emailInput.value}`);
      // Add actual subscription logic here
    } else {
      // eslint-disable-next-line no-alert
      alert('Please agree to the privacy policy and enter a valid email.');
    }
  });

  topContent.append(subscribeDiv);

  // Navigation
  const navDiv = document.createElement('div');
  navDiv.classList.add('cmp-footer__nav');

  const navItemsLeft = document.createElement('div');
  navItemsLeft.classList.add('cmp-footer__nav-items', 'cmp-navigation__group--left');
  const navLeft = document.createElement('nav');
  navLeft.classList.add('cmp-navigation');
  navLeft.setAttribute('role', 'navigation');
  const ulLeft = document.createElement('ul');
  ulLeft.classList.add('cmp-navigation__group');

  footerNavLeftItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('ul')); // text field
    const linkCell = cells.find(cell => cell.querySelector('a') && !cell.querySelector('ul')); // aem-content field
    const hierarchyCell = cells.find(cell => cell.querySelector('ul')); // richtext field

    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');

    const foundLink = linkCell?.querySelector('a');
    let rootEl;
    if (foundLink) {
      rootEl = document.createElement('a');
      rootEl.classList.add('cmp-navigation__item-link');
      rootEl.href = foundLink.href; // Use href from aem-content cell
    } else {
      rootEl = document.createElement('span');
    }
    rootEl.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, rootEl); // Move instrumentation from row to rootEl
    li.appendChild(rootEl);

    if (hierarchyCell) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML; // Read richtext content using innerHTML

      const hierarchyRoot = tempDiv.querySelector('ul');
      if (hierarchyRoot) {
        // Apply classes to nested elements from ORIGINAL HTML
        hierarchyRoot.classList.add('cmp-navigation__group');
        hierarchyRoot.querySelectorAll('li').forEach(item => item.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-1'));
        hierarchyRoot.querySelectorAll('a').forEach(link => link.classList.add('cmp-navigation__item-link'));

        const wrapper = document.createElement('div');
        wrapper.classList.add('cmp-navigation__group'); // Use class from ORIGINAL HTML
        moveInstrumentation(hierarchyCell, wrapper); // Move instrumentation from richtext cell to wrapper
        while (hierarchyRoot.firstChild) { // Move children from temp hierarchyRoot to wrapper
          wrapper.append(hierarchyRoot.firstChild);
        }
        rootEl.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          wrapper.classList.toggle('active');
          li.classList.toggle('active');
        });
        li.appendChild(wrapper);
        transformNestedLists(wrapper); // Apply nested list transformations
      }
    }
    ulLeft.appendChild(li);
  });
  navLeft.append(ulLeft);
  navItemsLeft.append(navLeft);
  navDiv.append(navItemsLeft);

  const navItemsRight = document.createElement('div');
  navItemsRight.classList.add('cmp-footer__nav-items', 'cmp-navigation__group--right');
  const navRight = document.createElement('nav');
  navRight.classList.add('cmp-navigation');
  navRight.setAttribute('role', 'navigation');
  const ulRight = document.createElement('ul');
  ulRight.classList.add('cmp-navigation__group');

  footerNavRightItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('ul')); // text field
    const linkCell = cells.find(cell => cell.querySelector('a') && !cell.querySelector('ul')); // aem-content field
    const hierarchyCell = cells.find(cell => cell.querySelector('ul')); // richtext field

    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');

    const foundLink = linkCell?.querySelector('a');
    let rootEl;
    if (foundLink) {
      rootEl = document.createElement('a');
      rootEl.classList.add('cmp-navigation__item-link');
      rootEl.href = foundLink.href; // Use href from aem-content cell
    } else {
      rootEl = document.createElement('span');
    }
    rootEl.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, rootEl); // Move instrumentation from row to rootEl
    li.appendChild(rootEl);

    if (hierarchyCell) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML; // Read richtext content using innerHTML

      const hierarchyRoot = tempDiv.querySelector('ul');
      if (hierarchyRoot) {
        // Apply classes to nested elements from ORIGINAL HTML
        hierarchyRoot.classList.add('cmp-navigation__group');
        hierarchyRoot.querySelectorAll('li').forEach(item => item.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-1'));
        hierarchyRoot.querySelectorAll('a').forEach(link => link.classList.add('cmp-navigation__item-link'));

        const wrapper = document.createElement('div');
        wrapper.classList.add('cmp-navigation__group'); // Use class from ORIGINAL HTML
        moveInstrumentation(hierarchyCell, wrapper); // Move instrumentation from richtext cell to wrapper
        while (hierarchyRoot.firstChild) { // Move children from temp hierarchyRoot to wrapper
          wrapper.append(hierarchyRoot.firstChild);
        }
        rootEl.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          wrapper.classList.toggle('active');
          li.classList.toggle('active');
        });
        li.appendChild(wrapper);
        transformNestedLists(wrapper); // Apply nested list transformations
      }
    }
    ulRight.appendChild(li);
  });
  navRight.append(ulRight);
  navItemsRight.append(navRight);
  navDiv.append(navItemsRight);

  topContent.append(navDiv);
  cmpFooter.append(topContent);

  // Bottom content
  const bottomContent = document.createElement('div');
  bottomContent.classList.add('cmp-footer__bottom-content');

  const footerContainer = document.createElement('div');
  footerContainer.classList.add('cmp-footer__container');

  const itcTitles = document.createElement('div');
  itcTitles.classList.add('cmp-footer__ITC-Titles');

  const itcPortalLink = itcPortalLinkRow?.querySelector('a'); // Read href from aem-content cell
  if (itcPortalLink) {
    const itcPortalAnchor = document.createElement('a');
    itcPortalAnchor.href = itcPortalLink.href; // Use href from aem-content cell
    itcPortalAnchor.target = '_blank';
    itcPortalAnchor.classList.add('desc-1');
    itcPortalAnchor.textContent = itcPortalTextRow?.textContent.trim() || '';
    moveInstrumentation(itcPortalLinkRow, itcPortalAnchor);
    itcTitles.append(itcPortalAnchor);
  }

  const copyrightAnchor = document.createElement('a'); // Changed to <a> as per original HTML
  copyrightAnchor.classList.add('desc-1');
  copyrightAnchor.textContent = copyrightTextRow?.textContent.trim() || '';
  // The original HTML has a target="_blank" for copyright, but the model doesn't specify a link.
  // Assuming it's a placeholder link or will be updated. For now, no href.
  // copyrightAnchor.href = '#'; // Placeholder if no link is provided by model
  moveInstrumentation(copyrightTextRow, copyrightAnchor);
  itcTitles.append(copyrightAnchor);
  footerContainer.append(itcTitles);

  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.classList.add('cmp-footer__social-media');

  footerSocialItems.forEach((row) => {
    const cells = [...row.children];
    const socialLinkCell = cells.find(cell => cell.querySelector('a')); // aem-content field
    const socialIconClassCell = cells.find(cell => !cell.querySelector('a')); // text field

    const socialLink = socialLinkCell?.querySelector('a'); // Read href from aem-content cell
    const socialIconClass = socialIconClassCell?.textContent.trim();

    if (socialLink && socialIconClass) {
      const socialAnchor = document.createElement('a');
      socialAnchor.href = socialLink.href; // Use href from aem-content cell
      socialAnchor.target = '_blank';
      socialAnchor.classList.add(socialIconClass);
      socialAnchor.setAttribute('data-social', socialIconClass.replace('icon-', ''));
      moveInstrumentation(row, socialAnchor);
      socialMediaDiv.append(socialAnchor);
    }
  });
  footerContainer.append(socialMediaDiv);
  bottomContent.append(footerContainer);
  cmpFooter.append(bottomContent);

  footerWrapper.append(cmpFooter);

  block.innerHTML = '';
  block.append(footerWrapper);

  // Optimize all images in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
