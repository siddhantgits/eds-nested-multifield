import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    // Add classes to li elements
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-1'); // Assuming level 1 for nested items

    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (anchor) {
      anchor.classList.add('cmp-navigation__item-link'); // Add class to anchor
    } else {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        span.classList.add('cmp-navigation__item-link'); // Add class to span for consistency
        textNode.remove();
        li.prepend(span);
      }
    }

    if (nested) {
      // Add class to nested ul
      nested.classList.add('cmp-navigation__group', 'cmp-navigation__group--level-1'); // Assuming level 1 for nested group

      nested.remove(); // Remove from original position to re-append
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-sub-child'); // Use original HTML class
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

  const [
    mainLogoRow,
    mainLogoLinkRow,
    itcLogoRow,
    fssaiLogoRow,
    subscribeApiUrlRow,
    subscribeSuccessMsgRow,
    subscribeFailureMsgRow,
    subscribeTitleRow,
    subscribeLogoRow,
    subscribeInputPlaceholderRow,
    subscribeInputRequiredMsgRow,
    subscribeInputEmailMsgRow,
    subscribeConsentTextRow,
    subscribeConsentLinkRow,
    subscribeButtonLabelRow,
    ...itemRows
  ] = children;

  const leftNavigationItems = [];
  const rightNavigationItems = [];
  const footerTitleLinks = [];
  const socialMediaItems = [];

  itemRows.forEach((row) => {
    const cells = [...row.children];
    // Use content detection for item types
    const firstCellText = cells[0]?.textContent.trim().toLowerCase();

    if (cells.length === 3 && cells[2].querySelector('ul')) {
      // Navigation-item with hierarchy-tree
      leftNavigationItems.push(row);
    } else if (cells.length === 2 && firstCellText === 'social platform label text') { // More specific check
      // Social-media-item
      socialMediaItems.push(row);
    } else if (cells.length === 2 && firstCellText === 'title label text') { // More specific check
      // Title-link-item
      footerTitleLinks.push(row);
    } else if (cells.length === 2 && cells[1].querySelector('a')) { // Navigation-item without hierarchy (flat link)
      // This condition needs to be carefully placed to not overlap with other 2-cell items
      // Assuming navigation-item without hierarchy has 2 cells, and the second cell is a link
      rightNavigationItems.push(row);
    }
  });

  // Main container
  const container = document.createElement('div');
  container.classList.add('container');

  const cmpContainer = document.createElement('div');
  cmpContainer.classList.add('cmp-container');
  container.append(cmpContainer);

  const footerWrapper = document.createElement('div');
  footerWrapper.classList.add('footer');
  footerWrapper.setAttribute('data-component', 'footer');
  footerWrapper.setAttribute('aria-label', 'desktop altext');
  cmpContainer.append(footerWrapper);

  const cmpFooter = document.createElement('div');
  cmpFooter.classList.add('cmp-footer');
  footerWrapper.append(cmpFooter);

  // Top content
  const topContent = document.createElement('div');
  topContent.classList.add('cmp-footer__top-content');
  cmpFooter.append(topContent);

  // Nav Logo section
  const navLogo = document.createElement('div');
  navLogo.classList.add('cmp-footer__nav-logo');
  topContent.append(navLogo);

  const navLogoTop = document.createElement('div');
  navLogoTop.classList.add('cmp-footer__nav-logo--top');
  navLogoTop.classList.add('logo', 'image', 'cmp-footer__logo');
  navLogo.append(navLogoTop);

  // Main Logo
  const mainLogoPicture = mainLogoRow?.querySelector('picture');
  if (mainLogoPicture) {
    const mainLogoLink = document.createElement('a');
    mainLogoLink.classList.add('cmp-image__link');
    const foundMainLogoLink = mainLogoLinkRow?.querySelector('a');
    if (foundMainLogoLink) {
      mainLogoLink.href = foundMainLogoLink.href;
    } else {
      mainLogoLink.href = '/'; // Fallback
    }

    const optimizedMainLogo = createOptimizedPicture(
      mainLogoPicture.querySelector('img').src,
      mainLogoPicture.querySelector('img').alt,
      false,
      [{ width: '750' }],
    );
    optimizedMainLogo.classList.add('w-100', 'd-block');
    moveInstrumentation(mainLogoPicture, optimizedMainLogo.querySelector('img'));
    mainLogoLink.append(optimizedMainLogo);
    navLogoTop.append(mainLogoLink);
  }

  const navLogoBottom = document.createElement('div');
  navLogoBottom.classList.add('cmp-footer__nav-logo--bottom');
  navLogo.append(navLogoBottom);

  // ITC Logo
  const itcLogoPicture = itcLogoRow?.querySelector('picture');
  if (itcLogoPicture) {
    const itcLogoDiv = document.createElement('div');
    itcLogoDiv.classList.add('logoitc', 'logo', 'image', 'cmp-footer__itc_logo');
    const optimizedItcLogo = createOptimizedPicture(
      itcLogoPicture.querySelector('img').src,
      itcLogoPicture.querySelector('img').alt,
      false,
      [{ width: '750' }],
    );
    optimizedItcLogo.classList.add('w-100', 'd-block');
    moveInstrumentation(itcLogoPicture, optimizedItcLogo.querySelector('img'));
    itcLogoDiv.append(optimizedItcLogo);
    navLogoBottom.append(itcLogoDiv);
  }

  // FSSAI Logo
  const fssaiLogoPicture = fssaiLogoRow?.querySelector('picture');
  if (fssaiLogoPicture) {
    const fssaiLogoDiv = document.createElement('div');
    fssaiLogoDiv.classList.add('logofssai', 'logo', 'image', 'cmp-footer__fssai_logo');
    const optimizedFssaiLogo = createOptimizedPicture(
      fssaiLogoPicture.querySelector('img').src,
      fssaiLogoPicture.querySelector('img').alt,
      false,
      [{ width: '750' }],
    );
    optimizedFssaiLogo.classList.add('w-100', 'd-block');
    moveInstrumentation(fssaiLogoPicture, optimizedFssaiLogo.querySelector('img'));
    fssaiLogoDiv.append(optimizedFssaiLogo);
    navLogoBottom.append(fssaiLogoDiv);
  }

  // Subscribe section
  const subscribeDiv = document.createElement('div');
  subscribeDiv.classList.add('cmp-footer__nav-subscribe');
  subscribeDiv.setAttribute('data-register-api-url', subscribeApiUrlRow?.textContent.trim() || '');
  subscribeDiv.setAttribute('data-popup-success-message', subscribeSuccessMsgRow?.textContent.trim() || '');
  subscribeDiv.setAttribute('data-popup-failure-message', subscribeFailureMsgRow?.textContent.trim() || '');
  topContent.append(subscribeDiv);

  const subscribeTextDiv = document.createElement('div');
  subscribeTextDiv.classList.add('cmp-footer__nav-text');
  subscribeDiv.append(subscribeTextDiv);

  const subscribeLogoImg = subscribeLogoRow?.querySelector('picture')?.querySelector('img');
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

  const inputContainer = document.createElement('div');
  inputContainer.classList.add('container', 'responsivegrid', 'cmp-input');
  subscribeDiv.append(inputContainer);

  const inputEmailDiv = document.createElement('div');
  inputEmailDiv.classList.add('text', 'aem-GridColumn', 'aem-GridColumn--default--12', 'cmp-input__email');
  inputContainer.append(inputEmailDiv);

  const formTextDiv = document.createElement('div');
  formTextDiv.classList.add('cmp-form-text');
  formTextDiv.setAttribute('data-cmp-required-message', subscribeInputRequiredMsgRow?.textContent.trim() || '');
  formTextDiv.setAttribute('data-cmp-valid-email', subscribeInputEmailMsgRow?.textContent.trim() || '');
  inputEmailDiv.append(formTextDiv);

  const emailInput = document.createElement('input');
  emailInput.classList.add('cmp-form-text__text');
  emailInput.type = 'email';
  emailInput.placeholder = subscribeInputPlaceholderRow?.textContent.trim() || '';
  emailInput.name = 'email';
  formTextDiv.append(emailInput);

  const errorMessageDiv = document.createElement('div');
  errorMessageDiv.classList.add('cmp-footer__error-message');
  subscribeDiv.append(errorMessageDiv);

  const consentDiv = document.createElement('div');
  consentDiv.classList.add('cmp-footer__consent');
  subscribeDiv.append(consentDiv);

  const consentCheckbox = document.createElement('input');
  consentCheckbox.type = 'checkbox';
  consentCheckbox.id = 'i_agree';
  consentCheckbox.name = 'i_agree';
  consentCheckbox.value = 'i_agree';
  consentCheckbox.classList.add('cmp-footer__consent--checkbox');
  consentDiv.append(consentCheckbox);

  const consentLinkDiv = document.createElement('div');
  consentLinkDiv.classList.add('cmp-footer__consent--link');
  consentDiv.append(consentLinkDiv);

  const consentP = document.createElement('p');
  const consentText = subscribeConsentTextRow?.textContent.trim() || '';
  const consentLink = subscribeConsentLinkRow?.querySelector('a')?.href || '#';
  consentP.innerHTML = `${consentText}&nbsp;<a href="${consentLink}" target="_self" rel="noopener noreferrer">Privacy Policy</a>&nbsp;and to receive marketing emails from the Aashirvaad community`;
  consentLinkDiv.append(consentP);

  const subscribeButtonDiv = document.createElement('div');
  subscribeButtonDiv.classList.add('button', 'cmp-button--primary', 'cmp-button--primary-anchor-dark');
  subscribeDiv.append(subscribeButtonDiv);

  const subscribeButton = document.createElement('button');
  subscribeButton.type = 'button';
  subscribeButton.classList.add('cmp-button');
  subscribeButton.setAttribute('data-request', 'true');
  subscribeButton.disabled = true; // Initially disabled
  subscribeButtonDiv.append(subscribeButton);

  const subscribeButtonSpan = document.createElement('span');
  subscribeButtonSpan.classList.add('cmp-button__text');
  subscribeButtonSpan.textContent = subscribeButtonLabelRow?.textContent.trim() || '';
  subscribeButton.append(subscribeButtonSpan);

  // Enable/disable subscribe button based on consent and email input
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const updateButtonState = () => {
    const isEmailValid = validateEmail(emailInput.value);
    subscribeButton.disabled = !consentCheckbox.checked || !isEmailValid;
  };

  emailInput.addEventListener('input', updateButtonState);
  consentCheckbox.addEventListener('change', updateButtonState);

  subscribeButton.addEventListener('click', async () => {
    if (!subscribeButton.disabled) {
      errorMessageDiv.textContent = '';
      const apiUrl = subscribeDiv.getAttribute('data-register-api-url');
      const successMsg = subscribeDiv.getAttribute('data-popup-success-message');
      const failureMsg = subscribeDiv.getAttribute('data-popup-failure-message');

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: emailInput.value }),
        });

        if (response.ok) {
          errorMessageDiv.textContent = successMsg;
          errorMessageDiv.style.color = 'green';
          emailInput.value = '';
          consentCheckbox.checked = false;
          updateButtonState();
        } else {
          errorMessageDiv.textContent = failureMsg;
          errorMessageDiv.style.color = 'red';
        }
      } catch (error) {
        errorMessageDiv.textContent = failureMsg;
        errorMessageDiv.style.color = 'red';
      }
    }
  });

  // Nav component for lists
  const navDiv = document.createElement('div');
  navDiv.classList.add('cmp-footer__nav');
  topContent.append(navDiv);

  // Left Navigation
  const leftNavItemsDiv = document.createElement('div');
  leftNavItemsDiv.classList.add('cmp-footer__nav-items', 'cmp-navigation__group--left');
  navDiv.append(leftNavItemsDiv);

  const leftNavWrapper = document.createElement('div');
  leftNavWrapper.classList.add('navigation');
  leftNavItemsDiv.append(leftNavWrapper);

  const leftNav = document.createElement('nav');
  leftNav.classList.add('cmp-navigation');
  leftNav.setAttribute('role', 'navigation');
  leftNavWrapper.append(leftNav);

  const leftUl = document.createElement('ul');
  leftUl.classList.add('cmp-navigation__group');
  leftNav.append(leftUl);

  leftNavigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');

    const foundLink = linkCell?.querySelector('a');
    let rootEl;
    if (foundLink) {
      rootEl = document.createElement('a');
      rootEl.href = foundLink.href;
      rootEl.classList.add('cmp-navigation__item-link');
    } else {
      rootEl = document.createElement('span');
    }
    rootEl.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, rootEl);
    li.appendChild(rootEl);

    // Handle hierarchy-tree richtext field
    if (hierarchyCell) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML; // Use innerHTML to preserve structure

      const hierarchyRoot = tempDiv.querySelector('ul');
      if (hierarchyRoot) {
        // Apply classes to the root ul
        hierarchyRoot.classList.add('cmp-navigation__group', 'cmp-navigation__group--level-1');

        // Apply classes to all nested li and a elements
        hierarchyRoot.querySelectorAll('li').forEach(nestedLi => {
          nestedLi.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-1');
        });
        hierarchyRoot.querySelectorAll('a').forEach(nestedA => {
          nestedA.classList.add('cmp-navigation__item-link');
        });

        const wrapper = document.createElement('div');
        wrapper.classList.add('nav-dropdown'); // Use original HTML class
        moveInstrumentation(hierarchyCell, hierarchyRoot); // Move instrumentation for the rich text content
        while (hierarchyRoot.firstChild) {
          wrapper.append(hierarchyRoot.firstChild);
        }
        rootEl.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          wrapper.classList.toggle('active');
          li.classList.toggle('active');
        });
        li.appendChild(wrapper);
        // transformNestedLists(hierarchyRoot); // This function expects a UL, but we are appending children directly
        // Instead, apply the logic of transformNestedLists directly or ensure it works with the current structure
        // The transformNestedLists function is designed to work on a UL, so we should pass the hierarchyRoot
        transformNestedLists(wrapper); // Pass the wrapper containing the UL
      }
    }
    leftUl.appendChild(li);
  });

  // Right Navigation
  const rightNavItemsDiv = document.createElement('div');
  rightNavItemsDiv.classList.add('cmp-footer__nav-items', 'cmp-navigation__group--right');
  navDiv.append(rightNavItemsDiv);

  const rightNavWrapper = document.createElement('div');
  rightNavWrapper.classList.add('navigation');
  rightNavItemsDiv.append(rightNavWrapper);

  const rightNav = document.createElement('nav');
  rightNav.classList.add('cmp-navigation');
  rightNav.setAttribute('role', 'navigation');
  rightNavWrapper.append(rightNav);

  const rightUl = document.createElement('ul');
  rightUl.classList.add('cmp-navigation__group');
  rightNav.append(rightUl);

  rightNavigationItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');

    const foundLink = linkCell?.querySelector('a');
    const anchor = document.createElement('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell?.textContent.trim() || '';
    anchor.classList.add('cmp-navigation__item-link');
    moveInstrumentation(row, anchor);
    li.appendChild(anchor);
    rightUl.appendChild(li);
  });

  // Bottom content
  const bottomContent = document.createElement('div');
  bottomContent.classList.add('cmp-footer__bottom-content');
  cmpFooter.append(bottomContent);

  const bottomContainer = document.createElement('div');
  bottomContainer.classList.add('cmp-footer__container');
  bottomContent.append(bottomContainer);

  // Footer Title Links
  const itcTitlesDiv = document.createElement('div');
  itcTitlesDiv.classList.add('cmp-footer__ITC-Titles');
  bottomContainer.append(itcTitlesDiv);

  footerTitleLinks.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const foundLink = linkCell?.querySelector('a');
    const anchor = document.createElement('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell?.textContent.trim() || '';
    anchor.classList.add('desc-1');
    anchor.target = '_blank'; // Assuming these are external links
    moveInstrumentation(row, anchor);
    itcTitlesDiv.append(anchor);
  });

  // Social Media
  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.classList.add('cmp-footer__social-media');
  bottomContainer.append(socialMediaDiv);

  socialMediaItems.forEach((row) => {
    const [platformCell, linkCell] = [...row.children];
    const platform = platformCell?.textContent.trim().toLowerCase();
    const foundLink = linkCell?.querySelector('a');
    const anchor = document.createElement('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.target = '_blank';

    switch (platform) {
      case 'instagram':
        anchor.classList.add('icon-instagram');
        anchor.setAttribute('data-social', 'instagram');
        break;
      case 'facebook':
        anchor.classList.add('icon-facebook'); // Corrected class name
        anchor.setAttribute('data-social', 'facebook');
        break;
      case 'twitter':
        anchor.classList.add('icon-twitter');
        anchor.setAttribute('data-social', 'twitter');
        break;
      case 'youtube':
        anchor.classList.add('icon-youtube');
        anchor.setAttribute('data-social', 'youtube');
        break;
      default:
        // Handle unknown platforms or add a default icon
        anchor.classList.add(`icon-${platform}`);
        break;
    }
    moveInstrumentation(row, anchor);
    socialMediaDiv.append(anchor);
  });

  block.innerHTML = '';
  block.append(container);
}
