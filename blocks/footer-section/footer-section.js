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
      subWrap.classList.add('has-sub-child'); // Use original HTML class if available, otherwise a generic one
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
  block.classList.add('grid-container');

  const [
    logoRow,
    logoLinkRow,
    countrySelectorIconRow,
    countrySelectorLinkRow,
    countrySelectorLabelRow,
    socialTitleRow,
    legalLinkRow,
    feedbackAltTextRow,
    ...itemRows
  ] = [...block.children];

  const logoLangContainer = document.createElement('div');
  logoLangContainer.classList.add('logo-lang-container');

  // Logo
  const footerLogo = document.createElement('div');
  footerLogo.classList.add('footer-logo');
  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
    logoLink.title = 'Nescafe Logo'; // Example title
    logoLink.setAttribute('aria-label', 'Nescafe logo links to the home page');
  }
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    if (logoImg) {
      const optimizedLogoPic = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(logoImg, optimizedLogoPic.querySelector('img'));
      logoLink.append(optimizedLogoPic);
    }
  }
  moveInstrumentation(logoRow, footerLogo);
  moveInstrumentation(logoLinkRow, logoLink);
  footerLogo.append(logoLink);
  logoLangContainer.append(footerLogo);

  // Country Selector
  const countrySelectorLink = document.createElement('a');
  const foundCountrySelectorLink = countrySelectorLinkRow.querySelector('a');
  if (foundCountrySelectorLink) {
    countrySelectorLink.href = foundCountrySelectorLink.href;
    countrySelectorLink.classList.add('link--underlined', 'country-selector');
    countrySelectorLink.title = 'India'; // Example title
    countrySelectorLink.setAttribute('aria-label', 'Link to select language and country');
  }
  const countrySelectorPicture = countrySelectorIconRow.querySelector('picture');
  if (countrySelectorPicture) {
    const countrySelectorImg = countrySelectorPicture.querySelector('img');
    if (countrySelectorImg) {
      const optimizedCountryPic = createOptimizedPicture(countrySelectorImg.src, countrySelectorImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(countrySelectorImg, optimizedCountryPic.querySelector('img'));
      countrySelectorLink.append(optimizedCountryPic);
    }
  }
  const countrySelectorLabel = document.createElement('span');
  countrySelectorLabel.classList.add('labelMediumRegular');
  countrySelectorLabel.textContent = countrySelectorLabelRow.textContent.trim();
  countrySelectorLink.append(countrySelectorLabel);
  moveInstrumentation(countrySelectorIconRow, countrySelectorLink);
  moveInstrumentation(countrySelectorLinkRow, countrySelectorLink);
  moveInstrumentation(countrySelectorLabelRow, countrySelectorLink);
  logoLangContainer.append(countrySelectorLink);

  block.append(logoLangContainer);

  const socialLinks = itemRows.filter((row) => row.children.length === 4);
  const siteLinks = itemRows.filter((row) => row.children.length === 2);

  // Social Section
  if (socialLinks.length > 0) {
    const footerSocial = document.createElement('div');
    footerSocial.classList.add('footer-social');

    const socialTitle = document.createElement('span');
    socialTitle.classList.add('utilityLegend', 'footer-social-title');
    socialTitle.textContent = socialTitleRow.textContent.trim();
    moveInstrumentation(socialTitleRow, socialTitle);
    footerSocial.append(socialTitle);

    const socialLinksList = document.createElement('ul');
    socialLinksList.classList.add('footer-social-links');

    socialLinks.forEach((row) => {
      const [iconCell, linkCell, labelCell, hierarchyCell] = [...row.children];
      const li = document.createElement('li');
      const socialAnchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        socialAnchor.href = foundLink.href;
        socialAnchor.setAttribute('aria-label', labelCell.textContent.trim());
        socialAnchor.title = labelCell.textContent.trim();
      }
      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const iconImg = iconPicture.querySelector('img');
        if (iconImg) {
          const optimizedIconPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '750' }]);
          moveInstrumentation(iconImg, optimizedIconPic.querySelector('img'));
          socialAnchor.append(optimizedIconPic);
        }
      }
      moveInstrumentation(row, li);
      li.append(socialAnchor);

      // Handle hierarchy-tree richtext
      if (hierarchyCell) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyCell.innerHTML; // Use innerHTML to preserve structure
        const hierarchyRoot = tempDiv.querySelector('ul');

        if (hierarchyRoot) {
          // Apply classes from original HTML to nested elements
          hierarchyRoot.querySelectorAll('ul').forEach(ul => ul.classList.add('nav-menu-list'));
          hierarchyRoot.querySelectorAll('li').forEach(liItem => liItem.classList.add('nav-menu-item', 'list-item'));
          hierarchyRoot.querySelectorAll('a').forEach(a => a.classList.add('nav-menu-link'));

          const wrapper = document.createElement('div');
          wrapper.classList.add('nav-dropdown'); // Use original HTML class
          
          // Move instrumentation from the original cell to the new wrapper
          moveInstrumentation(hierarchyCell, wrapper);

          while (tempDiv.firstChild) {
            wrapper.append(tempDiv.firstChild);
          }
          
          socialAnchor.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            wrapper.classList.toggle('active');
            li.classList.toggle('active');
          });
          li.appendChild(wrapper);
          transformNestedLists(hierarchyRoot);
        }
      }
      socialLinksList.append(li);
    });
    footerSocial.append(socialLinksList);
    block.append(footerSocial);
  }

  // Site Links and Legal Links
  const footerSiteLinks = document.createElement('div');
  footerSiteLinks.classList.add('footer-site-links');

  if (siteLinks.length > 0) {
    const footerLinks = document.createElement('div');
    footerLinks.classList.add('footer-links');
    const siteLinksList = document.createElement('ul');

    siteLinks.forEach((row) => {
      const [labelCell, linkCell] = [...row.children];
      const li = document.createElement('li');
      const siteAnchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        siteAnchor.href = foundLink.href;
        siteAnchor.textContent = labelCell.textContent.trim();
        siteAnchor.title = labelCell.textContent.trim();
        siteAnchor.classList.add('labelMediumRegular');
      }
      moveInstrumentation(row, li);
      li.append(siteAnchor);
      siteLinksList.append(li);
    });
    footerLinks.append(siteLinksList);
    footerSiteLinks.append(footerLinks);
  }

  // Legal Link
  const legalLinksDiv = document.createElement('div');
  legalLinksDiv.classList.add('legal-links');
  const legalAnchor = document.createElement('a');
  const foundLegalLink = legalLinkRow.querySelector('a');
  if (foundLegalLink) {
    legalAnchor.href = foundLegalLink.href;
    legalAnchor.classList.add('utilityNav');
    legalAnchor.title = 'NESCAFE® is registered trademarks of Société de Produits Nestlé S.A.'; // Example title
    legalAnchor.setAttribute('aria-label', '');
    legalAnchor.innerHTML = 'NESCAFE<sup>®</sup> is registered trademarks of Société de Produits Nestlé S.A.'; // Hardcoded text from original HTML
  }
  moveInstrumentation(legalLinkRow, legalAnchor);
  legalLinksDiv.append(legalAnchor);
  footerSiteLinks.append(legalLinksDiv);

  block.append(footerSiteLinks);

  // Feedback Alt Text
  const feedbackDiv = document.createElement('div');
  feedbackDiv.classList.add('feedback_alt_text');
  feedbackDiv.setAttribute('data-alttext', feedbackAltTextRow.textContent.trim());
  moveInstrumentation(feedbackAltTextRow, feedbackDiv);
  block.append(feedbackDiv);

  // Clean up original rows
  block.querySelectorAll('div > div').forEach((row) => {
    if (row.children.length === 0) {
      row.remove();
    }
  });

  // Optimize all images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
