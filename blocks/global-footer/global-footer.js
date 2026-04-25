import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Add classes from original HTML to <li>, <a>, <ul>
    li.classList.add('nav-menu-item', 'list-item'); // Assuming these are desired classes for list items
    if (anchor) {
      anchor.classList.add('nav-menu-link'); // Assuming this is a desired class for menu links
    }
    if (nested) {
      nested.classList.add('nav-menu-sublist'); // Assuming this is a desired class for sublists
    }

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
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-sub-child'); // Class from original HTML if available, otherwise default
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

  // Fixed fields - using content detection instead of index access
  const logoRow = children.find((row) => row.querySelector('picture') && row.nextElementSibling?.querySelector('a'));
  const logoLinkRow = children.find((row) => row.querySelector('a') && row.previousElementSibling?.querySelector('picture'));
  const countrySelectorIconRow = children.find((row) => row.querySelector('picture') && row.nextElementSibling?.textContent.trim() === 'Country Selector Label label text');
  const countrySelectorLabelRow = children.find((row) => row.textContent.trim() === 'Country Selector Label label text');
  const countrySelectorLinkRow = children.find((row) => row.querySelector('a') && row.previousElementSibling?.textContent.trim() === 'Country Selector Label label text');
  const footerSocialTitleRow = children.find((row) => row.textContent.trim() === 'Footer Social Title label text');
  const legalLinkRow = children.find((row) => row.querySelector('a') && row.textContent.includes('NESCAFE'));
  const feedbackAltTextRow = children.find((row) => row.textContent.trim() === 'Feedback Alt Text label text');

  // Filter out the fixed rows to get item rows
  const fixedRows = [
    logoRow, logoLinkRow, countrySelectorIconRow, countrySelectorLabelRow,
    countrySelectorLinkRow, footerSocialTitleRow, legalLinkRow, feedbackAltTextRow,
  ].filter(Boolean); // Filter out any undefined if a row wasn't found

  const itemRows = children.filter((row) => !fixedRows.includes(row));

  block.innerHTML = '';
  block.classList.add('grid-container');

  const footerSection = document.createElement('section');
  footerSection.classList.add('footer-section', 'grid-container');
  footerSection.setAttribute('aria-label', 'Global Footer Module');

  // Logo and Country Selector
  const logoLangContainer = document.createElement('div');
  logoLangContainer.classList.add('logo-lang-container');

  const footerLogo = document.createElement('div');
  footerLogo.classList.add('footer-logo');

  const logoAnchor = document.createElement('a');
  const logoLink = logoLinkRow?.querySelector('a');
  if (logoLink) {
    logoAnchor.href = logoLink.href;
  }
  logoAnchor.title = 'Nescafe Logo';
  logoAnchor.setAttribute('aria-label', 'Nescafe logo links to the home page');

  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    const optimizedLogo = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '200' }]);
    moveInstrumentation(logoImg, optimizedLogo.querySelector('img'));
    logoAnchor.append(optimizedLogo);
  }
  if (logoRow) moveInstrumentation(logoRow, logoAnchor);
  footerLogo.append(logoAnchor);
  logoLangContainer.append(footerLogo);

  const countrySelectorAnchor = document.createElement('a');
  const countrySelectorLink = countrySelectorLinkRow?.querySelector('a');
  if (countrySelectorLink) {
    countrySelectorAnchor.href = countrySelectorLink.href;
  }
  countrySelectorAnchor.classList.add('link--underlined', 'country-selector');
  countrySelectorAnchor.title = countrySelectorLabelRow?.textContent.trim() || '';
  countrySelectorAnchor.setAttribute('aria-label', 'Link to select language and country');

  const countrySelectorPicture = countrySelectorIconRow?.querySelector('picture');
  if (countrySelectorPicture) {
    const countrySelectorImg = countrySelectorPicture.querySelector('img');
    const optimizedCountryIcon = createOptimizedPicture(countrySelectorImg.src, countrySelectorImg.alt, false, [{ width: '24' }]);
    moveInstrumentation(countrySelectorImg, optimizedCountryIcon.querySelector('img'));
    countrySelectorAnchor.append(optimizedCountryIcon);
  }

  const countrySelectorSpan = document.createElement('span');
  countrySelectorSpan.classList.add('labelMediumRegular');
  countrySelectorSpan.textContent = countrySelectorLabelRow?.textContent.trim() || '';
  countrySelectorAnchor.append(countrySelectorSpan);
  if (countrySelectorIconRow) moveInstrumentation(countrySelectorIconRow, countrySelectorAnchor);
  logoLangContainer.append(countrySelectorAnchor);

  footerSection.append(logoLangContainer);

  // Social Links
  const footerSocial = document.createElement('div');
  footerSocial.classList.add('footer-social');

  const socialTitle = document.createElement('span');
  socialTitle.classList.add('utilityLegend', 'footer-social-title');
  socialTitle.textContent = footerSocialTitleRow?.textContent.trim() || '';
  footerSocial.append(socialTitle);

  const socialLinksList = document.createElement('ul');
  socialLinksList.classList.add('footer-social-links');

  // Filter for footer-social-link items (4 cells including hierarchy-tree)
  const socialLinkItems = itemRows.filter((row) => [...row.children].length === 4);
  socialLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a') && !cell.querySelector('picture'));
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture') && !cell.querySelector('ul'));
    const hierarchyCell = cells.find(cell => cell.querySelector('ul'));

    const li = document.createElement('li');
    const socialAnchor = document.createElement('a');
    const socialLink = linkCell?.querySelector('a');
    if (socialLink) {
      socialAnchor.href = socialLink.href;
    }
    socialAnchor.setAttribute('aria-label', labelCell?.textContent.trim() || '');
    socialAnchor.title = labelCell?.textContent.trim() || '';

    const socialPicture = iconCell?.querySelector('picture');
    if (socialPicture) {
      const socialImg = socialPicture.querySelector('img');
      const optimizedSocialIcon = createOptimizedPicture(socialImg.src, socialImg.alt, false, [{ width: '32' }]);
      moveInstrumentation(socialImg, optimizedSocialIcon.querySelector('img'));
      socialAnchor.append(optimizedSocialIcon);
    }
    moveInstrumentation(row, socialAnchor);
    li.append(socialAnchor);

    // Handle hierarchy-tree richtext
    if (hierarchyCell) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv);

      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('nav-menu-sublist'));
      tempDiv.querySelectorAll('li').forEach(liItem => liItem.classList.add('nav-menu-item', 'list-item'));
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('nav-menu-link'));

      const rootUl = tempDiv.querySelector('ul');
      if (rootUl) {
        transformNestedLists(rootUl);
        while (tempDiv.firstChild) {
          li.append(tempDiv.firstChild);
        }
      }
    }
    socialLinksList.append(li);
  });
  footerSocial.append(socialLinksList);
  footerSection.append(footerSocial);

  // Site Links
  const footerSiteLinks = document.createElement('div');
  footerSiteLinks.classList.add('footer-site-links');

  const footerLinksDiv = document.createElement('div');
  footerLinksDiv.classList.add('footer-links');

  const siteLinksList = document.createElement('ul');

  // Filter for footer-site-link items (2 cells)
  const siteLinkItems = itemRows.filter((row) => [...row.children].length === 2);
  siteLinkItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    const li = document.createElement('li');
    const siteAnchor = document.createElement('a');
    const siteLink = linkCell?.querySelector('a');
    if (siteLink) {
      siteAnchor.href = siteLink.href;
      if (siteLink.target) siteAnchor.target = siteLink.target; // Preserve target for external links
      if (siteLink.dataset.once) siteAnchor.dataset.once = siteLink.dataset.once; // Preserve data-once
      if (siteLink.classList.contains('external')) li.classList.add('external'); // Add external class to li
    }
    siteAnchor.title = labelCell?.textContent.trim() || '';
    siteAnchor.classList.add('labelMediumRegular');
    siteAnchor.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, siteAnchor);
    li.append(siteAnchor);
    siteLinksList.append(li);
  });
  footerLinksDiv.append(siteLinksList);
  footerSiteLinks.append(footerLinksDiv);

  // Legal Links
  const legalLinksDiv = document.createElement('div');
  legalLinksDiv.classList.add('legal-links');

  const legalAnchor = document.createElement('a');
  const legalLink = legalLinkRow?.querySelector('a');
  if (legalLink) {
    legalAnchor.href = legalLink.href;
  }
  legalAnchor.title = 'NESCAFE® is registered trademarks of Société de Produits Nestlé S.A.'; // Hardcoded from original HTML
  legalAnchor.classList.add('utilityNav');
  legalAnchor.setAttribute('aria-label', '');
  legalAnchor.innerHTML = legalLinkRow?.innerHTML || ''; // Use innerHTML to preserve <sup> tag
  if (legalLinkRow) moveInstrumentation(legalLinkRow, legalAnchor);
  legalLinksDiv.append(legalAnchor);
  footerSiteLinks.append(legalLinksDiv);

  footerSection.append(footerSiteLinks);

  // Feedback button
  const feedbackDiv = document.createElement('div');
  feedbackDiv.classList.add('feedback_alt_text');
  feedbackDiv.setAttribute('data-alttext', feedbackAltTextRow?.textContent.trim() || '');
  if (feedbackAltTextRow) moveInstrumentation(feedbackAltTextRow, feedbackDiv);
  footerSection.append(feedbackDiv);

  block.append(footerSection);

  // Optimize all images in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
