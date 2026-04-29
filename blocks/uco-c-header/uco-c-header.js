import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [
    logoRow,
    logoLinkRow,
    locationLabelRow,
    locationActionLinkRow,
    themeHelpLinkRow,
    ...itemRows
  ] = children;

  const header = document.createElement('header');
  header.classList.add('uco-c-header');

  const headerTools = document.createElement('div');
  headerTools.classList.add('uco-c-header__tools');

  // Theme Options
  const themeOptions = itemRows.filter((row) => {
    const cells = [...row.children];
    // Theme-Option-Item has 3 cells: icon (picture), label (text), hierarchy-tree (richtext)
    // The hierarchy-tree field is optional, so we check for 2 or 3 cells.
    // However, the model definition shows 3 fields, so we expect 3 cells.
    // Let's refine the filter to look for a picture and a text cell.
    const hasIcon = cells.some(cell => cell.querySelector('picture'));
    const hasLabel = cells.some(cell => cell.textContent.trim() && !cell.querySelector('picture') && !cell.querySelector('a') && !cell.querySelector('ul'));
    return hasIcon && hasLabel && (cells.length === 2 || cells.length === 3); // Adjust if hierarchy-tree is truly optional
  });

  if (themeOptions.length > 0) {
    const themeWrapper = document.createElement('div');
    themeWrapper.classList.add('uco-c-header__theme');

    const themeInner = document.createElement('div');
    themeInner.classList.add('uco-c-header__theme__inner');

    const themeMenuActionButton = document.createElement('button');
    themeMenuActionButton.classList.add(
      'uco-c-header__theme__menu-action',
      'uco-c-header__theme__button',
    );
    themeMenuActionButton.setAttribute('aria-expanded', 'false');
    themeMenuActionButton.setAttribute('aria-controls', 'uco-c-header__theme-options-menu');
    themeMenuActionButton.setAttribute('role', 'combobox');
    // The aria-label "Theme Default" is hardcoded in original HTML, but should come from the first theme option's label.
    // For now, we'll use a generic label or try to derive it.
    const firstThemeLabel = themeOptions[0]?.children[1]?.textContent.trim() || 'Theme Default';
    themeMenuActionButton.setAttribute('aria-label', firstThemeLabel);
    themeMenuActionButton.setAttribute('aria-activedescendant', '');

    const themeMenuActionLabel = document.createElement('span');
    themeMenuActionLabel.textContent = 'Theme'; // This is hardcoded in original HTML, not from a cell.

    // Find the icon cell for the main theme button
    const firstThemeOptionCells = [...themeOptions[0].children];
    const themeMenuActionIconCell = firstThemeOptionCells.find(cell => cell.querySelector('picture'));
    const themeMenuActionIcon = themeMenuActionIconCell?.querySelector('img');

    if (themeMenuActionIcon) {
      const optimizedIcon = createOptimizedPicture(themeMenuActionIcon.src, themeMenuActionIcon.alt, false, [{ width: '20' }]);
      moveInstrumentation(themeMenuActionIcon, optimizedIcon.querySelector('img'));
      themeMenuActionButton.append(optimizedIcon);
    }
    themeMenuActionButton.append(themeMenuActionLabel);
    // Add arrow icon
    const arrowIcon = document.createElement('img');
    arrowIcon.alt = 'svg file';
    arrowIcon.src = '/icons/arrow-down.svg'; // Placeholder for actual arrow icon
    themeMenuActionButton.append(arrowIcon);

    const themeOptionsMenu = document.createElement('div');
    themeOptionsMenu.classList.add('uco-c-header__theme__options-menu');
    themeOptionsMenu.id = 'uco-c-header__theme-options-menu';
    themeOptionsMenu.setAttribute('role', 'listbox');
    themeOptionsMenu.setAttribute('aria-labelledby', 'uco-c-header-theme-menu-action');
    themeOptionsMenu.setAttribute('tabindex', '-1');

    themeOptions.forEach((row, index) => {
      const cells = [...row.children];
      const iconCell = cells.find(cell => cell.querySelector('picture'));
      const labelCell = cells.find(cell => cell.textContent.trim() && !cell.querySelector('picture') && !cell.querySelector('a') && !cell.querySelector('ul'));

      const themeOptionButton = document.createElement('button');
      themeOptionButton.classList.add('uco-c-header__theme__option', 'uco-c-header__theme__button');
      themeOptionButton.setAttribute('role', 'option');
      themeOptionButton.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      if (index === 0) themeOptionButton.classList.add('is-active');

      const themeIcon = iconCell?.querySelector('img');
      if (themeIcon) {
        const optimizedIcon = createOptimizedPicture(themeIcon.src, themeIcon.alt, false, [{ width: '20' }]);
        moveInstrumentation(themeIcon, optimizedIcon.querySelector('img'));
        themeOptionButton.append(optimizedIcon);
      }

      const themeLabel = document.createElement('span');
      themeLabel.classList.add('uco-c-header__theme__option-label');
      themeLabel.textContent = labelCell?.textContent.trim() || '';
      themeOptionButton.append(themeLabel);
      themeOptionsMenu.append(themeOptionButton);
      moveInstrumentation(row, themeOptionButton);
    });

    const themeFooter = document.createElement('div');
    themeFooter.classList.add('uco-c-header__theme__footer');
    const themeHelpLink = document.createElement('a');
    themeHelpLink.classList.add('uol-c-link', 'has-icon', 'is-new-window', 'uco-c-header__theme__link');
    const themeHelpLinkA = themeHelpLinkRow.querySelector('a');
    if (themeHelpLinkA) {
      themeHelpLink.href = themeHelpLinkA.href;
      themeHelpLink.target = '_blank';
      themeHelpLink.rel = 'noopener noreferrer';
      const linkInner = document.createElement('span');
      linkInner.classList.add('uol-c-link__inner');
      const linkLabel = document.createElement('span');
      linkLabel.classList.add('uol-c-link__label');
      // Read "What is a theme?" from the link's text content, not hardcoded
      linkLabel.textContent = themeHelpLinkA.textContent.trim();
      linkInner.append(linkLabel);
      const linkIcon = document.createElement('span');
      linkIcon.classList.add('uol-c-link__icon--end');
      const iconImg = document.createElement('img');
      iconImg.alt = 'svg file';
      iconImg.src = '/icons/external-link.svg'; // Placeholder for actual external link icon
      linkIcon.append(iconImg);
      linkInner.append(linkIcon);
      themeHelpLink.append(linkInner);
      themeFooter.append(themeHelpLink);
      moveInstrumentation(themeHelpLinkRow, themeHelpLink);
    }
    themeOptionsMenu.append(themeFooter);

    themeInner.append(themeMenuActionButton, themeOptionsMenu);
    themeWrapper.append(themeInner);
    headerTools.append(themeWrapper);

    themeMenuActionButton.addEventListener('click', () => {
      const expanded = themeMenuActionButton.getAttribute('aria-expanded') === 'true';
      themeMenuActionButton.setAttribute('aria-expanded', String(!expanded));
      themeOptionsMenu.classList.toggle('is-active', !expanded);
    });
  }

  // Location
  const locationP = document.createElement('p');
  locationP.classList.add('uco-c-header__location');

  const locationLabelSpan = document.createElement('span');
  locationLabelSpan.classList.add('uco-c-header__location-label');
  const locationIcon = document.createElement('img');
  locationIcon.alt = 'svg file';
  locationIcon.src = '/icons/location.svg'; // Placeholder for actual location icon
  locationLabelSpan.append(locationIcon);
  locationLabelSpan.append(` ${locationLabelRow.textContent.trim()} `);
  locationP.append(locationLabelSpan);
  moveInstrumentation(locationLabelRow, locationLabelSpan);


  const locationActionLink = document.createElement('a');
  locationActionLink.classList.add('uol-c-link', 'uco-c-header__location-action');
  const locationActionLinkA = locationActionLinkRow.querySelector('a');
  if (locationActionLinkA) {
    locationActionLink.href = locationActionLinkA.href;
    const linkInner = document.createElement('span');
    linkInner.classList.add('uol-c-link__inner');
    const linkLabel = document.createElement('span');
    linkLabel.classList.add('uol-c-link__label');
    // Read "Change location" from the link's text content, not hardcoded
    linkLabel.textContent = locationActionLinkA.textContent.trim();
    linkInner.append(linkLabel);
    locationActionLink.append(linkInner);
    locationP.append(locationActionLink);
    moveInstrumentation(locationActionLinkRow, locationActionLink);
  }
  headerTools.append(locationP);
  header.append(headerTools);

  const headerMain = document.createElement('div');
  headerMain.classList.add('uco-c-header__main');

  const headerLogo = document.createElement('div');
  headerLogo.classList.add('uco-c-header__logo');

  const logoLink = document.createElement('a');
  logoLink.classList.add('uol-c-link', 'uco-c-header__logo-link');
  const logoLinkA = logoLinkRow.querySelector('a');
  if (logoLinkA) {
    logoLink.href = logoLinkA.href;
    const logoInner = document.createElement('span');
    logoInner.classList.add('uol-c-link__inner');
    const logoLabel = document.createElement('span');
    logoLabel.classList.add('uol-c-link__label');
    const logoPicture = logoRow.querySelector('picture');
    if (logoPicture) {
      const logoImg = logoPicture.querySelector('img');
      const optimizedLogo = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '49' }]);
      optimizedLogo.querySelector('img').classList.add('uco-c-header__logo-image');
      moveInstrumentation(logoImg, optimizedLogo.querySelector('img'));
      logoLabel.append(optimizedLogo);
    }
    logoInner.append(logoLabel);
    logoLink.append(logoInner);
    headerLogo.append(logoLink);
    moveInstrumentation(logoRow, logoLink);
  }
  headerMain.append(headerLogo);

  const headerControls = document.createElement('div');
  headerControls.classList.add('uco-c-header__controls');

  const nav = document.createElement('nav');
  nav.classList.add('uco-c-header__nav');

  const menuToggleButton = document.createElement('a');
  menuToggleButton.classList.add(
    'uol-c-button',
    'is-icon-start',
    'uol-c-button--light',
    'uol-c-button--size-sm',
    'uol-c-button--rounded',
    'uol-c-button--rounded-inline-end',
    'uco-c-header__menu-toggle',
  );
  menuToggleButton.href = '#uco-header-menu';
  menuToggleButton.setAttribute('controls-id', 'uco-header-menu');
  menuToggleButton.setAttribute('is-active', 'false');

  const menuToggleLabel = document.createElement('span');
  menuToggleLabel.classList.add('uol-c-button__label');
  menuToggleLabel.textContent = 'Menu'; // This is hardcoded in original HTML, not from a cell.
  menuToggleButton.append(menuToggleLabel);

  const menuToggleIcon = document.createElement('span');
  menuToggleIcon.classList.add('uol-c-button__icon');
  const menuIconImg = document.createElement('img');
  menuIconImg.alt = 'svg file';
  menuIconImg.src = '/icons/menu.svg'; // Placeholder for actual menu icon
  menuToggleIcon.append(menuIconImg);
  menuToggleButton.append(menuToggleIcon);
  nav.append(menuToggleButton);

  const menuWrapper = document.createElement('div');
  menuWrapper.classList.add('uco-c-header__menu');
  menuWrapper.id = 'uco-header-menu';
  menuWrapper.setAttribute('data-level', '0');

  const menuInner = document.createElement('div');
  menuInner.classList.add('uco-c-header__menu-inner');
  menuInner.setAttribute('data-level', '0');

  const menuList = document.createElement('ul');
  menuList.classList.add('uco-c-header__menu-list');
  menuList.setAttribute('role', 'list');
  menuList.setAttribute('data-level', '0');

  // Filter item rows based on cell count and content to match model definitions
  const navigationItems = itemRows.filter((row) => {
    const cells = [...row.children];
    // Navigation-Item has 5 cells: label (text), link (aem-content), hierarchy-tree (richtext), sub-menu-cards (container), sub-menu-links (container)
    // The container fields are represented by text content in the cell, and richtext by <ul>
    return cells.length === 5 && cells[0].textContent.trim() && cells[1].querySelector('a') && (cells[2].querySelector('ul') || cells[2].textContent.trim() === '') && cells[3].textContent.trim() !== undefined && cells[4].textContent.trim() !== undefined;
  });

  const subMenuCardItems = itemRows.filter((row) => {
    const cells = [...row.children];
    // Sub-Menu-Card-Item has 4 cells: image (reference), title (text), link (aem-content), body (text)
    return cells.length === 4 && cells[0].querySelector('picture') && cells[1].textContent.trim() && cells[2].querySelector('a') && cells[3].textContent.trim() !== undefined;
  });

  const subMenuLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    // Sub-Menu-Link-Item has 2 cells: label (text), link (aem-content)
    return cells.length === 2 && cells[0].textContent.trim() && cells[1].querySelector('a');
  });

  function transformNestedLists(rootUl) {
    rootUl.classList.add('uco-c-header__sub-menu-list'); // Add class to the root UL
    rootUl.querySelectorAll('li').forEach((li) => {
      li.classList.add('uco-c-header__sub-menu-list-item'); // Add class to all LI elements
      const nested = li.querySelector(':scope > ul');
      const anchor = li.querySelector(':scope > a');
      if (anchor) {
        anchor.classList.add('uco-c-header__sub-menu-list-link', 'uco-c-header__sub-menu-link'); // Add classes to anchor
      } else {
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
        subWrap.classList.add('has-sub-child');
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

  navigationItems.forEach((row, index) => {
    const [labelCell, linkCell, hierarchyCell, subMenuCardsCell, subMenuLinksCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('uco-c-header__menu-item');
    li.setAttribute('data-level', '0');

    // For richtext, use innerHTML to get the full structure, then parse it
    const hierarchyContent = hierarchyCell.innerHTML.trim();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyContent;
    const hierarchyRoot = tempDiv.querySelector('ul');

    const hasSubMenu = hierarchyRoot || subMenuCardsCell.textContent.trim() || subMenuLinksCell.textContent.trim();

    if (hasSubMenu) {
      li.classList.add('has-sub-menu');
      const button = document.createElement('button');
      button.classList.add('uco-c-header__menu-link');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', `uco-header-menu-1-${index}`);
      button.setAttribute('data-level', '0');
      button.textContent = labelCell.textContent.trim();
      const arrowIcon = document.createElement('img');
      arrowIcon.alt = 'svg file';
      arrowIcon.src = '/icons/arrow-right.svg'; // Placeholder for actual arrow icon
      button.append(arrowIcon);
      li.append(button);

      const subMenu = document.createElement('div');
      subMenu.classList.add('uco-c-header__sub-menu');
      subMenu.id = `uco-header-menu-1-${index}`;
      subMenu.setAttribute('data-level', '1');
      subMenu.setAttribute('inert', ''); // Initially inert
      subMenu.setAttribute('use-menu-height', 'true');

      const subMenuInner = document.createElement('div');
      subMenuInner.classList.add('uco-c-header__sub-menu-inner');
      subMenuInner.setAttribute('data-level', '1');

      const backButton = document.createElement('a');
      backButton.classList.add('uco-c-header__sub-menu-back');
      backButton.href = `#uco-header-menu-0-${index}`;
      const backIcon = document.createElement('img');
      backIcon.alt = 'svg file';
      backIcon.src = '/icons/arrow-left.svg'; // Placeholder for actual back arrow icon
      backButton.append(backIcon, ' Back'); // "Back" is hardcoded in original HTML
      subMenuInner.append(backButton);

      const subMenuTitle = document.createElement('h2');
      subMenuTitle.classList.add('uco-c-header__sub-menu-title');
      subMenuTitle.textContent = labelCell.textContent.trim();
      subMenuInner.append(subMenuTitle);

      const subMenuItems = document.createElement('ul');
      subMenuItems.classList.add('uco-c-header__sub-menu-items');
      subMenuItems.setAttribute('role', 'list');

      if (hierarchyRoot) {
        moveInstrumentation(hierarchyCell, hierarchyRoot); // Move instrumentation for the original richtext cell
        transformNestedLists(hierarchyRoot);
        const hierarchyListItem = document.createElement('li');
        hierarchyListItem.classList.add('uco-c-header__sub-menu-item-list');
        // Move all children from the temporary div to the new list item
        while (hierarchyRoot.firstChild) {
          hierarchyListItem.append(hierarchyRoot.firstChild);
        }
        subMenuItems.append(hierarchyListItem);
      }

      // Add sub-menu cards
      if (subMenuCardsCell.textContent.trim()) {
        // The subMenuCardsCell.textContent.trim() is just a placeholder value,
        // it doesn't indicate the number of cards. We need to consume from the filtered list.
        // The original HTML shows multiple cards, so we need to iterate through the available subMenuCardItems.
        // For now, we'll assume the number of cards is determined by the number of actual subMenuCardItems
        // that haven't been consumed yet.
        // This logic needs to be careful if multiple navigation items use the same subMenuCardItems.
        // A better approach would be to have a *list of references* in subMenuCardsCell.textContent.
        // Given the current model, we'll consume all available subMenuCardItems here.
        // This is a potential issue if multiple navigation items share card items.
        // Assuming unique consumption for now.
        const cardsToProcess = [...subMenuCardItems]; // Create a copy to consume
        cardsToProcess.forEach((cardRow) => {
          const [imageCell, titleCell, cardLinkCell, bodyCell] = [...cardRow.children];
          const cardLi = document.createElement('li');
          cardLi.classList.add('uco-c-header__sub-menu-item', 'uco-c-header__sub-menu-card');

          const picture = imageCell.querySelector('picture');
          if (picture) {
            const img = picture.querySelector('img');
            const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '140' }]);
            optimizedPic.querySelector('img').classList.add('uol-c-picture__image');
            moveInstrumentation(img, optimizedPic.querySelector('img'));
            const pictureWrapper = document.createElement('div');
            pictureWrapper.classList.add('uol-c-picture', 'uol-c-picture--rounded', 'uco-c-header__sub-menu-card-media');
            pictureWrapper.append(optimizedPic);
            cardLi.append(pictureWrapper);
          }

          const cardContent = document.createElement('div');
          cardContent.classList.add('uco-c-header__sub-menu-card-content');
          const cardTitle = document.createElement('h3');
          cardTitle.classList.add('uco-c-header__sub-menu-card-title');
          const cardLink = document.createElement('a');
          cardLink.classList.add('uco-c-header__sub-menu-card-link', 'uco-c-header__sub-menu-link');
          const cardLinkA = cardLinkCell.querySelector('a');
          if (cardLinkA) {
            cardLink.href = cardLinkA.href;
          }
          cardLink.textContent = titleCell.textContent.trim();
          cardTitle.append(cardLink);
          cardContent.append(cardTitle);

          if (bodyCell.textContent.trim()) {
            const cardBody = document.createElement('p');
            cardBody.classList.add('uco-c-header__sub-menu-card-body');
            cardBody.textContent = bodyCell.textContent.trim();
            cardContent.append(cardBody);
          }
          cardLi.append(cardContent);
          subMenuItems.append(cardLi);
          moveInstrumentation(cardRow, cardLi);
        });
        // Clear the consumed items from the global list to prevent re-use
        subMenuCardItems.splice(0, cardsToProcess.length);
      }

      // Add sub-menu links
      if (subMenuLinksCell.textContent.trim()) {
        // Similar to sub-menu cards, assuming unique consumption.
        const linksToProcess = [...subMenuLinkItems]; // Create a copy to consume
        const subMenuLinkList = document.createElement('ul');
        subMenuLinkList.classList.add('uco-c-header__sub-menu-list');
        linksToProcess.forEach((linkRow) => {
          const [labelCell, linkCell] = [...linkRow.children];
          const linkLi = document.createElement('li');
          linkLi.classList.add('uco-c-header__sub-menu-list-item');
          const linkA = document.createElement('a');
          linkA.classList.add('uco-c-header__sub-menu-list-link', 'uco-c-header__sub-menu-link');
          const linkFound = linkCell.querySelector('a');
          if (linkFound) {
            linkA.href = linkFound.href;
          }
          linkA.textContent = labelCell.textContent.trim();
          linkLi.append(linkA);
          subMenuLinkList.append(linkLi);
          moveInstrumentation(linkRow, linkLi);
        });
        const subMenuLinkListItem = document.createElement('li');
        subMenuLinkListItem.classList.add('uco-c-header__sub-menu-item-list');
        subMenuLinkListItem.append(subMenuLinkList);
        subMenuItems.append(subMenuLinkListItem);
        // Clear the consumed items from the global list to prevent re-use
        subMenuLinkItems.splice(0, linksToProcess.length);
      }

      subMenuInner.append(subMenuItems);

      const subMenuFooter = document.createElement('div');
      subMenuFooter.classList.add('uco-c-header__sub-menu-footer');
      const introLink = document.createElement('a');
      introLink.classList.add('uol-c-button', 'uol-c-button--rounded', 'uol-c-button--rounded-inline-end', 'uco-c-header__sub-menu-intro__link');
      const introLinkA = linkCell.querySelector('a'); // Use the link from the main navigation item
      if (introLinkA) {
        introLink.href = introLinkA.href;
      }
      const introLinkLabel = document.createElement('span');
      introLinkLabel.classList.add('uol-c-button__label');
      introLinkLabel.textContent = `View ${labelCell.textContent.trim()}`; // Read from labelCell
      introLink.append(introLinkLabel);
      subMenuFooter.append(introLink);
      subMenuInner.append(subMenuFooter);

      subMenu.append(subMenuInner);
      li.append(subMenu);

      button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!expanded));
        if (!expanded) {
          subMenu.removeAttribute('inert');
          subMenu.focus();
        } else {
          subMenu.setAttribute('inert', '');
        }
      });

      backButton.addEventListener('click', (e) => {
        e.preventDefault();
        button.click();
      });
    } else {
      // Simple link
      const link = document.createElement('a');
      link.classList.add('uco-c-header__menu-link');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        if (foundLink.target === '_blank') {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          const visuallyHidden = document.createElement('span');
          visuallyHidden.classList.add('uol-u-visually-hidden');
          visuallyHidden.textContent = '(Opens in new window)';
          link.append(visuallyHidden);
          const externalLinkIcon = document.createElement('img');
          externalLinkIcon.alt = 'svg file';
          externalLinkIcon.src = '/icons/external-link.svg'; // Placeholder for actual external link icon
          link.append(externalLinkIcon);
        }
      }
      link.textContent = labelCell.textContent.trim();
      li.append(link);
    }
    menuList.append(li);
    moveInstrumentation(row, li);
  });

  menuInner.append(menuList);
  menuWrapper.append(menuInner);
  nav.append(menuWrapper);
  headerControls.append(nav);
  headerMain.append(headerControls);
  header.append(headerMain);

  block.innerHTML = '';
  block.append(header);

  // Toggle menu functionality
  menuToggleButton.addEventListener('click', () => {
    const isActive = menuToggleButton.getAttribute('is-active') === 'true';
    menuToggleButton.setAttribute('is-active', String(!isActive));
    if (!isActive) {
      menuWrapper.classList.add('is-mounted');
      menuWrapper.removeAttribute('inert');
      menuWrapper.focus();
    } else {
      menuWrapper.classList.remove('is-mounted');
      menuWrapper.setAttribute('inert', '');
    }
  });

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
