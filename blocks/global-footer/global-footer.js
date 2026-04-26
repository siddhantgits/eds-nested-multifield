import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    // Add classes to nested elements as per ORIGINAL HTML if applicable
    li.classList.add('nav-menu-item', 'list-item'); // Example: from original HTML if these were menu items
    const anchor = li.querySelector(':scope > a');
    if (anchor) {
      anchor.classList.add('nav-menu-link'); // Example: from original HTML
    } else {
      // Handle label-only nodes
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
        span.classList.add('nav-menu-label'); // Example: from original HTML
      }
    }
    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('nav-dropdown'); // Using 'nav-dropdown' from ORIGINAL HTML for nested items
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
  rootUl.querySelectorAll('ul').forEach((ul) => ul.classList.add('nav-menu-list')); // Example: from original HTML
  rootUl.querySelectorAll('a').forEach((a) => a.classList.add('nav-menu-link')); // Example: from original HTML
}

export default function decorate(block) {
  const children = [...block.children];

  const [
    logoRow,
    logoLinkRow,
    countrySelectorIconRow,
    countrySelectorLinkRow,
    countrySelectorLabelRow,
    socialTitleRow,
    legalLinkRow,
    legalLinkLabelRow,
    ...itemRows
  ] = children;

  block.innerHTML = '';
  block.classList.add('grid-container');

  const footerSection = document.createElement('section');
  footerSection.classList.add('footer-section', 'grid-container');
  footerSection.setAttribute('aria-label', 'Global Footer Module');

  // Logo and Language Container
  const logoLangContainer = document.createElement('div');
  logoLangContainer.classList.add('logo-lang-container');

  const footerLogo = document.createElement('div');
  footerLogo.classList.add('footer-logo');

  const logoAnchor = document.createElement('a');
  const logoLink = logoLinkRow?.querySelector('a');
  if (logoLink) {
    logoAnchor.href = logoLink.href;
    logoAnchor.title = 'Nescafe Logo'; // From original HTML
    logoAnchor.setAttribute('aria-label', 'Nescafe logo links to the home page'); // From original HTML
  } else {
    logoAnchor.href = '#';
  }

  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoAnchor.appendChild(optimizedPic);
    }
  }
  moveInstrumentation(logoRow, logoAnchor);
  footerLogo.appendChild(logoAnchor);
  logoLangContainer.appendChild(footerLogo);

  const countrySelectorAnchor = document.createElement('a');
  const countrySelectorLink = countrySelectorLinkRow?.querySelector('a');
  if (countrySelectorLink) {
    countrySelectorAnchor.href = countrySelectorLink.href;
    countrySelectorAnchor.title = countrySelectorLabelRow?.textContent.trim() || '';
    countrySelectorAnchor.setAttribute('aria-label', 'Link to select language and country');
  } else {
    countrySelectorAnchor.href = '#';
  }
  countrySelectorAnchor.classList.add('link--underlined', 'country-selector');

  const countrySelectorPicture = countrySelectorIconRow?.querySelector('picture');
  if (countrySelectorPicture) {
    const img = countrySelectorPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      countrySelectorAnchor.appendChild(optimizedPic);
    }
  }

  const countrySelectorSpan = document.createElement('span');
  countrySelectorSpan.classList.add('labelMediumRegular');
  countrySelectorSpan.textContent = countrySelectorLabelRow?.textContent.trim() || '';
  countrySelectorAnchor.appendChild(countrySelectorSpan);
  moveInstrumentation(countrySelectorIconRow, countrySelectorAnchor);
  moveInstrumentation(countrySelectorLinkRow, countrySelectorAnchor);
  moveInstrumentation(countrySelectorLabelRow, countrySelectorAnchor);
  logoLangContainer.appendChild(countrySelectorAnchor);
  footerSection.appendChild(logoLangContainer);

  // Social Links
  const footerSocial = document.createElement('div');
  footerSocial.classList.add('footer-social');

  const socialTitleSpan = document.createElement('span');
  socialTitleSpan.classList.add('utilityLegend', 'footer-social-title');
  socialTitleSpan.textContent = socialTitleRow?.textContent.trim() || '';
  moveInstrumentation(socialTitleRow, socialTitleSpan);
  footerSocial.appendChild(socialTitleSpan);

  const socialLinksUl = document.createElement('ul');
  socialLinksUl.classList.add('footer-social-links');

  const socialLinkItems = itemRows.filter((row) => row.children.length === 4);
  socialLinkItems.forEach((row) => {
    const [iconCell, linkCell, labelCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');

    const socialAnchor = document.createElement('a');
    const socialLink = linkCell?.querySelector('a');
    if (socialLink) {
      socialAnchor.href = socialLink.href;
      socialAnchor.title = labelCell?.textContent.trim() || '';
      socialAnchor.setAttribute('aria-label', labelCell?.textContent.trim() || '');
    } else {
      socialAnchor.href = '#';
    }

    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        socialAnchor.appendChild(optimizedPic);
      }
    }
    moveInstrumentation(row, socialAnchor);
    li.appendChild(socialAnchor);

    const hierarchyRoot = hierarchyCell?.querySelector('ul');
    if (hierarchyRoot) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('nav-dropdown'); // Using ORIGINAL HTML class
      // Move instrumentation for the hierarchy cell
      moveInstrumentation(hierarchyCell, wrapper);
      wrapper.appendChild(hierarchyRoot);
      socialAnchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        wrapper.classList.toggle('active');
        li.classList.toggle('active');
      });
      li.appendChild(wrapper);
      transformNestedLists(hierarchyRoot);
    }
    socialLinksUl.appendChild(li);
  });
  footerSocial.appendChild(socialLinksUl);
  footerSection.appendChild(footerSocial);

  // Footer Site Links
  const footerSiteLinks = document.createElement('div');
  footerSiteLinks.classList.add('footer-site-links');

  const footerLinksDiv = document.createElement('div');
  footerLinksDiv.classList.add('footer-links');

  const footerLinksUl = document.createElement('ul');

  const navLinkItems = itemRows.filter((row) => row.children.length === 2);
  navLinkItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');

    const navAnchor = document.createElement('a');
    const navLink = linkCell?.querySelector('a');
    if (navLink) {
      navAnchor.href = navLink.href;
      navAnchor.title = labelCell?.textContent.trim() || '';
    } else {
      navAnchor.href = '#';
    }
    navAnchor.classList.add('labelMediumRegular'); // From original HTML
    navAnchor.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, navAnchor);
    li.appendChild(navAnchor);
    footerLinksUl.appendChild(li);
  });
  footerLinksDiv.appendChild(footerLinksUl);
  footerSiteLinks.appendChild(footerLinksDiv);

  // Legal Links
  const legalLinksDiv = document.createElement('div');
  legalLinksDiv.classList.add('legal-links');

  const legalAnchor = document.createElement('a');
  const legalLink = legalLinkRow?.querySelector('a');
  if (legalLink) {
    legalAnchor.href = legalLink.href;
    legalAnchor.title = legalLinkLabelRow?.textContent.trim() || '';
    legalAnchor.setAttribute('aria-label', ''); // From original HTML
  } else {
    legalAnchor.href = '#';
  }
  legalAnchor.classList.add('utilityNav');
  legalAnchor.innerHTML = legalLinkLabelRow?.innerHTML.trim() || ''; // Use innerHTML to preserve potential <sup> tags if authored
  moveInstrumentation(legalLinkRow, legalAnchor);
  moveInstrumentation(legalLinkLabelRow, legalAnchor);
  legalLinksDiv.appendChild(legalAnchor);
  footerSiteLinks.appendChild(legalLinksDiv);

  footerSection.appendChild(footerSiteLinks);

  // Feedback button placeholder
  const feedbackDiv = document.createElement('div');
  feedbackDiv.classList.add('feedback_alt_text');
  feedbackDiv.setAttribute('data-alttext', 'qsiFeedback Button');
  footerSection.appendChild(feedbackDiv);

  block.appendChild(footerSection);

  // Optimize all pictures within the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
