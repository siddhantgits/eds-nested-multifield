import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    // Add classes from ORIGINAL HTML to li elements
    li.classList.add('footer-nav-link', 'py-2');

    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (anchor) {
      // Add classes from ORIGINAL HTML to anchor elements
      anchor.classList.add('d-flex', 'align-items-center');
    } else {
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
      // Add classes from ORIGINAL HTML to ul elements
      nested.classList.add('list-unstyled', 'text-small');

      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-sub-child'); // This class is not in ORIGINAL HTML, but seems to be for JS behavior
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
  const goTopIconRow = children[0];
  const footerLogoRow = children[1];
  const footerLogoLinkRow = children[2];
  const tataCarsTitleRow = children[3];
  const helpTitleRow = children[4];
  const quickLinksTitleRow = children[5];
  const socialTitleRow = children[6];
  const copyrightTextRow = children[7];

  // Item rows start from index 8
  const itemRows = children.slice(8);

  // Content detection for item rows
  const footerNavItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells.find(cell => cell.querySelector('ul'));
  });
  const tataCarsLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && row.previousElementSibling?.querySelector('div')?.textContent.trim() === tataCarsTitleRow.querySelector('div').textContent.trim();
  });
  const helpLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && row.previousElementSibling?.querySelector('div')?.textContent.trim() === helpTitleRow.querySelector('div').textContent.trim();
  });
  const quickLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && row.previousElementSibling?.querySelector('div')?.textContent.trim() === quickLinksTitleRow.querySelector('div').textContent.trim();
  });
  const socialLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells.find(cell => cell.querySelector('picture'));
  });

  block.innerHTML = '';
  block.classList.add('footer-comp');

  const goTopIconContainer = document.createElement('div');
  goTopIconContainer.classList.add('go-top-icon');
  const topButton = document.createElement('div');
  topButton.classList.add('top-button');
  const goTopPicture = goTopIconRow.querySelector('picture');
  if (goTopPicture) {
    const goTopImg = goTopPicture.querySelector('img');
    const optimizedGoTopPic = createOptimizedPicture(goTopImg.src, goTopImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(goTopImg, optimizedGoTopPic.querySelector('img'));
    topButton.append(optimizedGoTopPic);
  }
  moveInstrumentation(goTopIconRow, topButton);
  goTopIconContainer.append(topButton);
  block.append(goTopIconContainer);

  const footer = document.createElement('footer');
  footer.classList.add('footer-comp');

  const container = document.createElement('div');
  container.classList.add('container');

  const footerMainTop = document.createElement('div');
  footerMainTop.classList.add('footer-main', 'footer');

  const footerDetailsNav = document.createElement('div');
  footerDetailsNav.classList.add('footer-details');

  const tmlFooterNav = document.createElement('div');
  tmlFooterNav.classList.add('tml-footer-nav');

  const footerLogoLink = document.createElement('a');
  footerLogoLink.classList.add('link-secondary', 'text-decoration-none');
  const footerLogoAnchor = footerLogoLinkRow.querySelector('a');
  if (footerLogoAnchor) {
    footerLogoLink.href = footerLogoAnchor.href;
  }
  const footerLogoPicture = footerLogoRow.querySelector('picture');
  if (footerLogoPicture) {
    const footerLogoImg = footerLogoPicture.querySelector('img');
    const optimizedFooterLogoPic = createOptimizedPicture(footerLogoImg.src, footerLogoImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(footerLogoImg, optimizedFooterLogoPic.querySelector('img'));
    footerLogoLink.append(optimizedFooterLogoPic);
  }
  moveInstrumentation(footerLogoLinkRow, footerLogoLink);
  tmlFooterNav.append(footerLogoLink);

  const footerNavUl = document.createElement('ul');
  footerNavUl.classList.add('list-unstyled', 'text-small');

  footerNavItems.forEach((row) => {
    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const hierarchyCell = cells.find(cell => cell.querySelector('ul'));
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('ul'));

    const li = document.createElement('li');
    li.classList.add('footer-nav-link', 'py-2');

    const foundLink = linkCell?.querySelector('a');
    let rootEl;
    if (foundLink) {
      rootEl = document.createElement('a');
      rootEl.href = foundLink.href;
      rootEl.classList.add('d-flex', 'align-items-center'); // Add classes for styling
    } else {
      rootEl = document.createElement('span');
    }
    rootEl.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, rootEl);
    li.appendChild(rootEl);

    if (hierarchyCell) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML; // Use innerHTML for richtext
      moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation for the richtext cell

      // Add classes to nested elements from ORIGINAL HTML
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('link-secondary', 'text-decoration-none'));
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('list-unstyled', 'text-small'));
      tempDiv.querySelectorAll('li').forEach(liEl => liEl.classList.add('footer-nav-link', 'py-2'));

      const hierarchyRoot = tempDiv.querySelector('ul');
      if (hierarchyRoot) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('nav-dropdown'); // This class is not in ORIGINAL HTML, but seems to be for JS behavior
        wrapper.appendChild(hierarchyRoot);
        rootEl.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          wrapper.classList.toggle('active');
          li.classList.toggle('active');
        });
        li.appendChild(wrapper);
        transformNestedLists(hierarchyRoot);
      }
    }
    footerNavUl.append(li);
  });
  tmlFooterNav.append(footerNavUl);
  footerDetailsNav.append(tmlFooterNav);
  footerMainTop.append(footerDetailsNav);

  const createQuickLinksSection = (titleRow, items, sectionClass) => {
    const sectionDiv = document.createElement('div');
    sectionDiv.classList.add('footer-details', 'footer-quick-links', sectionClass);

    const navLinkHeading = document.createElement('div');
    navLinkHeading.classList.add('nav-link-heading', 'nav-quicklinks', 'mb-sm-2', 'pt-lg-1', 'pb-lg-2');

    const titleP = document.createElement('p');
    titleP.classList.add('linkdropdown_label');
    titleP.textContent = titleRow.querySelector('div').textContent.trim();
    moveInstrumentation(titleRow, titleP);
    navLinkHeading.append(titleP);
    sectionDiv.append(navLinkHeading);

    const ul = document.createElement('ul');
    ul.classList.add('list-unstyled', 'text-small');

    items.forEach((row) => {
      const cells = [...row.children];
      const linkCell = cells.find(cell => cell.querySelector('a'));
      const labelCell = cells.find(cell => !cell.querySelector('a'));

      const li = document.createElement('li');
      li.classList.add('footer-nav-link', 'py-2', 'mb-lg-2');

      const link = document.createElement('a');
      link.classList.add('link-secondary', 'text-decoration-none', 'd-flex', 'align-items-center');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      }
      link.textContent = labelCell?.textContent.trim() || '';
      moveInstrumentation(row, link);
      ul.append(li);
      li.append(link);
    });
    sectionDiv.append(ul);
    footerMainTop.append(sectionDiv);
  };

  createQuickLinksSection(tataCarsTitleRow, tataCarsLinkItems, 'TataCars');
  createQuickLinksSection(helpTitleRow, helpLinkItems, 'Help');
  createQuickLinksSection(quickLinksTitleRow, quickLinkItems, 'QuickLinks');

  const socialSectionDiv = document.createElement('div');
  socialSectionDiv.classList.add('footer-details', 'footer-list');

  const socialQuickLinksDiv = document.createElement('div');
  socialQuickLinksDiv.classList.add('footer-quick-links');

  const socialNavLinkHeading = document.createElement('div');
  socialNavLinkHeading.classList.add('nav-link-heading', 'mb-sm-2', 'pt-lg-1', 'pb-lg-2');

  const socialTitleP = document.createElement('p');
  socialTitleP.classList.add('linkdropdown_label');
  socialTitleP.textContent = socialTitleRow.querySelector('div').textContent.trim();
  moveInstrumentation(socialTitleRow, socialTitleP);
  socialNavLinkHeading.append(socialTitleP);
  socialQuickLinksDiv.append(socialNavLinkHeading);

  const socialUl = document.createElement('ul');
  socialUl.classList.add('list-unstyled', 'text-small');

  socialLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));

    const li = document.createElement('li');
    li.classList.add('social-nav-link', 'py-2', 'mb-lg-2');

    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const optimizedIconPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(iconImg, optimizedIconPic.querySelector('img'));
      optimizedIconPic.classList.add('social_media_icon');
      li.append(optimizedIconPic);
    }

    const link = document.createElement('a');
    link.classList.add('link-secondary', 'text-decoration-none');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }
    link.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, link);
    li.append(link);
    socialUl.append(li);
  });
  socialQuickLinksDiv.append(socialUl);
  socialSectionDiv.append(socialQuickLinksDiv);
  footerMainTop.append(socialSectionDiv);

  container.append(footerMainTop);

  const footerMainBottom = document.createElement('div');
  footerMainBottom.classList.add('footer-main');

  const copyrightCol = document.createElement('div');
  copyrightCol.classList.add('col-lg-4', 'col-md-4', 'col-sm12');

  const copyrightTextDiv = document.createElement('div');
  copyrightTextDiv.classList.add('copyright-text');
  copyrightTextDiv.innerHTML = copyrightTextRow.querySelector('div').innerHTML;
  moveInstrumentation(copyrightTextRow, copyrightTextDiv);
  copyrightCol.append(copyrightTextDiv);
  footerMainBottom.append(copyrightCol);
  container.append(footerMainBottom);

  footer.append(container);
  block.append(footer);

  // Scroll to top functionality
  topButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      goTopIconContainer.style.display = 'block';
      topButton.style.display = 'block';
    } else {
      goTopIconContainer.style.display = 'none';
      topButton.style.display = 'none';
    }
  });

  // Optimize all images within the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
