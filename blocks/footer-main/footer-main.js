import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, isInner = false) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');
    let triggerEl = anchor;

    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
        triggerEl = span;
      }
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add(isInner ? 'has-footer-inner-sub-child' : 'has-footer-sub-child');
      subWrap.append(nested);
      li.append(subWrap);

      if (triggerEl) {
        // Add a small element for mobile accordion toggle, if it doesn't exist
        if (!triggerEl.nextElementSibling || !triggerEl.nextElementSibling.matches('small, span')) {
          const toggleIcon = document.createElement('span'); // Use span as per original HTML
          triggerEl.after(toggleIcon);
        }

        triggerEl.closest('li').classList.add('has-child-menu'); // Add class for styling
        triggerEl.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
      transformNestedLists(nested, true);
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];
  const [logoRow, logoLinkRow, copyrightTextRow, ...itemRows] = children;

  block.innerHTML = ''; // Clear the block to rebuild

  const container = document.createElement('div');
  container.classList.add('container');

  // Footer Header Section
  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');

  const logoWrap = document.createElement('div');
  logoWrap.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  logoDiv.append(logoLink);
  logoWrap.append(logoDiv);
  footerHeader.append(logoWrap);

  // Social Links
  const socialLinksWrap = document.createElement('div');
  socialLinksWrap.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  const socialUl = document.createElement('ul');
  socialUl.classList.add('social-wrap');

  // Filter for social-link-item: 3 cells, first cell has a picture, second cell has an anchor
  const socialLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3
      && cells[0].querySelector('picture')
      && cells[1].querySelector('a');
  });

  socialLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    // const hierarchyCell = cells.find(cell => cell.querySelector('ul')); // Not used for social links directly

    const li = document.createElement('li');
    const socialLink = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      socialLink.href = foundLink.href;
      socialLink.target = '_blank'; // Assuming social links open in new tab
    }
    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]); // Adjust width as needed
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      socialLink.append(optimizedPic);
    }
    moveInstrumentation(row, li);
    li.append(socialLink);
    socialUl.append(li);
  });
  socialLinksWrap.append(socialUl);
  footerHeader.append(socialLinksWrap);
  container.append(footerHeader);

  // Footer Menu Blocks
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');

  // Filter for footer-menu-block: 3 cells, first cell is text, second cell has an anchor, third cell is text "Menu Items value"
  const footerMenuBlockItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3
      && !cells[0].querySelector('picture') // Not a picture
      && !cells[0].querySelector('a') // Not an anchor
      && cells[1].querySelector('a') // Has an anchor link
      && cells[2].textContent.trim() === 'Menu Items value'; // Specific text for container field
  });

  // Store the created link-blocks to append menu items later
  const menuBlocksElements = [];

  footerMenuBlockItems.forEach((row) => {
    const cells = [...row.children];
    const blockTitleCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim() !== 'Menu Items value');
    const blockTitleLinkCell = cells.find(cell => cell.querySelector('a'));

    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    const head = document.createElement('div');
    head.classList.add('head');
    const span = document.createElement('span');
    const blockTitleLink = document.createElement('a');
    const foundBlockTitleLink = blockTitleLinkCell?.querySelector('a');
    if (foundBlockTitleLink) {
      blockTitleLink.href = foundBlockTitleLink.href;
    }
    blockTitleLink.textContent = blockTitleCell?.textContent.trim() || '';
    span.append(blockTitleLink);
    const small = document.createElement('small'); // For mobile toggle
    span.append(small);
    head.append(span);
    linkBlocks.append(head);

    // Add event listener for mobile accordion toggle on the head
    head.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      linkBlocks.classList.toggle('active');
    });

    footerMenu.append(linkBlocks);
    moveInstrumentation(row, linkBlocks);
    menuBlocksElements.push(linkBlocks); // Store for later appending menu items
  });

  footerMenuCol.append(footerMenu);
  footerMenuBox.append(footerMenuCol);
  container.append(footerMenuBox);

  // Secondary Nav and Copyright
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');

  // Filter for footer-secondary-nav-item: 2 cells, first cell is text, second cell has an anchor
  const secondaryNavItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2
      && !cells[0].querySelector('picture') // Not a picture
      && !cells[0].querySelector('a') // Not an anchor
      && cells[1].querySelector('a'); // Has an anchor link
  });

  secondaryNavItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    const li = document.createElement('li');
    const secondaryNavLink = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      secondaryNavLink.href = foundLink.href;
    }
    secondaryNavLink.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, li);
    li.append(secondaryNavLink);
    secondaryNavUl.append(li);
  });
  secondaryNavCol.append(secondaryNavUl);
  copyrightWrap.append(secondaryNavCol);

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  if (copyrightTextRow) {
    moveInstrumentation(copyrightTextRow, copyrightTextCol);
    copyrightTextCol.innerHTML = copyrightTextRow.innerHTML;
  }
  copyrightWrap.append(copyrightTextCol);
  container.append(copyrightWrap);

  block.append(container);

  // Process the nested navigation hierarchies for footer-menu-items
  // Filter for footer-menu-item rows: 3 cells, first cell is text, second cell has an anchor, third cell has a 'ul'
  const footerMenuItemRows = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3
      && !cells[0].querySelector('picture') // Not a picture
      && !cells[0].querySelector('a') // Not an anchor
      && cells[1].querySelector('a') // Has an anchor link
      && cells[2].querySelector('ul'); // Has a hierarchy tree
  });

  // Group footer menu items by their conceptual parent (footer-menu-block)
  // This requires a more sophisticated grouping logic if the itemRows are not strictly sequential.
  // For now, we'll assume a simple distribution or that all items go into the first block if only one exists.
  // A robust solution would involve matching based on authored structure or explicit linking.
  // Given the flat structure, we'll append all `footer-menu-item` hierarchies to the first menu block.
  // If there are multiple menu blocks, this logic needs to be refined to distribute items correctly.

  if (menuBlocksElements.length > 0) {
    const firstMenuBlock = menuBlocksElements[0]; // Get the first menu block
    let menuBlockUl = firstMenuBlock.querySelector('.footer-inner-list');
    if (!menuBlockUl) {
      menuBlockUl = document.createElement('ul');
      menuBlockUl.classList.add('footer-inner-list');
      firstMenuBlock.append(menuBlockUl);
    }

    footerMenuItemRows.forEach((row) => {
      const cells = [...row.children];
      const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture'));
      const linkCell = cells.find(cell => cell.querySelector('a'));
      const hierarchyCell = cells.find(cell => cell.querySelector('ul'));

      const li = document.createElement('li');
      let rootEl;

      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        rootEl = document.createElement('a');
        rootEl.href = foundLink.href;
      } else {
        rootEl = document.createElement('span'); // Use span if no link, as per transformNestedLists
      }
      rootEl.textContent = labelCell?.textContent.trim() || '';
      moveInstrumentation(row, rootEl); // Move instrumentation from the original row to the new root element
      li.appendChild(rootEl);

      if (hierarchyCell) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyCell.innerHTML; // Use innerHTML to preserve nested structure
        const hierarchyRoot = tempDiv.querySelector('ul');

        if (hierarchyRoot) {
          // Apply classes from original HTML to nested elements
          hierarchyRoot.querySelectorAll('a').forEach(a => {
            // No specific classes for <a> in original HTML, but if there were, add them here
          });
          hierarchyRoot.querySelectorAll('ul').forEach(ul => ul.classList.add('footer-inner-list')); // Example: if inner lists need a class
          hierarchyRoot.querySelectorAll('li').forEach(liItem => {
            // No specific classes for <li> in original HTML, but if there were, add them here
          });

          // Move instrumentation from the original cell to the temporary div
          moveInstrumentation(hierarchyCell, tempDiv);

          const wrapper = document.createElement('div');
          wrapper.classList.add('has-footer-sub-child'); // Use original HTML class
          while (tempDiv.firstChild) {
            wrapper.append(tempDiv.firstChild);
          }
          li.appendChild(wrapper);
          transformNestedLists(hierarchyRoot); // Transform nested lists recursively
        }
      }
      menuBlockUl.appendChild(li);
    });
  }

  // Optimize pictures
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
