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
  const [level2BannerImageRow, level2BannerTitleRow, ...itemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('burger-navigation', 'grid-container', 'js-burger-navigation');
  section.setAttribute('aria-label', 'Burger Navigation Section');

  const navWrapper = document.createElement('nav');
  navWrapper.classList.add('persistent-navigation--wrapper', 'js-persistent-nav', 'burger-nav');
  section.append(navWrapper);

  const persistentNavUl = document.createElement('ul');
  persistentNavUl.classList.add('persistent-navigation', 'grid-x');
  navWrapper.append(persistentNavUl);

  const persistentNavLi = document.createElement('li');
  persistentNavLi.classList.add('persistent-navigation--list');
  persistentNavUl.append(persistentNavLi);

  const menuWrapper = document.createElement('div');
  menuWrapper.classList.add('persistent-navigation--menu-wrapper', 'burger-nav');
  menuWrapper.id = 'burger-nav-wrapper';
  menuWrapper.setAttribute('aria-labelledby', 'burger-nav');
  persistentNavLi.append(menuWrapper);

  const level2Div = document.createElement('div');
  level2Div.classList.add('persistent-nav--level2', 'level2', 'grid-x');
  menuWrapper.append(level2Div);

  const level2ItemsDiv = document.createElement('div');
  level2ItemsDiv.classList.add('small-12', 'large-4', 'xlarge-3', 'persistent-nav--level2-items');
  level2Div.append(level2ItemsDiv);

  const level2CloseDiv = document.createElement('div');
  level2CloseDiv.classList.add('persistent-nav--level2--close', 'hide-for-large');
  level2ItemsDiv.append(level2CloseDiv);

  const controlPrev = document.createElement('div');
  controlPrev.classList.add('persistent-nav--control-prev', 'persistent-nav--control');
  level2CloseDiv.append(controlPrev);

  const closeButton = document.createElement('button');
  closeButton.classList.add('persistent-nav--control-close', 'persistent-nav--control', 'js-persistent-nav-l1--close');
  closeButton.setAttribute('aria-label', 'Close navigation');
  level2CloseDiv.append(closeButton);

  const closeButtonImg = document.createElement('img');
  const closeButtonImgSrc = level2BannerImageRow?.querySelector('img')?.src;
  if (closeButtonImgSrc) {
    closeButtonImg.src = closeButtonImgSrc;
    closeButtonImg.alt = 'svg file'; // Alt text should ideally come from model
    closeButton.append(closeButtonImg);
  }

  const level2List = document.createElement('ul');
  level2List.classList.add('persistent-nav--level2-list', 'burger-nav');
  level2List.setAttribute('aria-labelledby', 'persistent-nav--level2--title--');
  level2ItemsDiv.append(level2List);

  // Filter itemRows based on their structure as per BlockJson and EDS structure
  // nav-level2-item: 6 cells, with hierarchy-tree (ul) in the last cell
  // multiple-links-item: 2 cells, no picture, first cell is an anchor
  // nav-level3-link-item: 2 cells, no picture, first cell is an anchor
  // banner: 5 cells, with picture in the first cell

  itemRows.forEach((row, index) => {
    const cells = [...row.children];
    const numCells = cells.length;

    // nav-level2-item (6 cells, last cell is richtext hierarchy-tree)
    if (numCells === 6 && cells[5].querySelector('ul')) {
      const linkCell = cells[0];
      const labelCell = cells[1];
      const hierarchyTreeCell = cells[5];

      const listItem = document.createElement('li');
      listItem.classList.add('persistent-nav--level2-list-item', 'grid-x', 'burger-nav');
      level2List.append(listItem);

      const link = linkCell?.querySelector('a');
      const label = labelCell?.textContent.trim();
      const hierarchyRoot = hierarchyTreeCell?.querySelector('ul');

      if (hierarchyRoot) {
        const button = document.createElement('button');
        button.classList.add('persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'js-persistent-nav--level2-link');
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', `persistentNavLevel3List-burger-nav-wrapper-burger-${index + 1}`);
        button.setAttribute('aria-label', label);
        button.textContent = label;
        moveInstrumentation(row, button);
        listItem.append(button);

        const level3Wrapper = document.createElement('div');
        level3Wrapper.classList.add('small-12', 'large-8', 'xlarge-9', 'persistent-nav--level3-wrapper');
        level3Wrapper.id = `level-burger-nav-${index + 1}`;
        listItem.append(level3Wrapper);

        const level3Div = document.createElement('div');
        level3Div.classList.add('persistent-nav--level3', 'grid-x', 'burger-nav');
        level3Div.setAttribute('role', 'list');
        level3Wrapper.append(level3Div);

        const level3CloseDiv = document.createElement('div');
        level3CloseDiv.classList.add('persistent-nav--level2--close', 'level3', 'hide-for-large');
        level3CloseDiv.setAttribute('role', 'listitem');
        level3Div.append(level3CloseDiv);

        const backButton = document.createElement('button');
        backButton.classList.add('persistent-nav--control-prev', 'persistent-nav--control', 'js-persistent-nav-l2--close');
        backButton.setAttribute('aria-label', 'Back to previous navigation');
        level3CloseDiv.append(backButton);

        const backButtonImg = document.createElement('img');
        const backButtonImgSrc = level2BannerImageRow?.querySelector('img')?.src;
        if (backButtonImgSrc) {
          backButtonImg.src = backButtonImgSrc;
          backButtonImg.alt = 'svg file'; // Alt text should ideally come from model
          backButton.append(backButtonImg);
        }

        const controlTitle = document.createElement('span');
        controlTitle.classList.add('persistent-nav--control-title', 'utilityTagHighCaps', 'js-persistent-nav-l2--close');
        level3CloseDiv.append(controlTitle);

        const closeButtonL1 = document.createElement('button');
        closeButtonL1.classList.add('persistent-nav--control-close', 'persistent-nav--control', 'js-persistent-nav-l1--close');
        closeButtonL1.setAttribute('aria-label', 'Close navigation');
        level3CloseDiv.append(closeButtonL1);

        const closeButtonL1Img = document.createElement('img');
        const closeButtonL1ImgSrc = level2BannerImageRow?.querySelector('img')?.src;
        if (closeButtonL1ImgSrc) {
          closeButtonL1Img.src = closeButtonL1ImgSrc;
          closeButtonL1Img.alt = 'svg file'; // Alt text should ideally come from model
          closeButtonL1.append(closeButtonL1Img);
        }

        const level3Title = document.createElement('p');
        level3Title.classList.add('persistent-nav--level3--title', 'text-center', 'hide-for-large', 'headline-h2');
        level3Title.setAttribute('role', 'listitem');
        level3Title.textContent = label;
        level3Div.append(level3Title);

        const level3ListDiv = document.createElement('div');
        level3ListDiv.classList.add('cell', 'small-12', 'large-12', 'xlarge-8', 'persistent-nav--level3-list', 'burger-nav');
        level3ListDiv.id = `persistentNavLevel3List-burger-nav-wrapper-burger-${index + 1}`;
        level3Div.append(level3ListDiv);

        const hierarchyUl = document.createElement('ul');
        // Use innerHTML to preserve the nested structure
        hierarchyUl.innerHTML = hierarchyTreeCell.innerHTML;
        moveInstrumentation(hierarchyTreeCell, hierarchyUl); // Instrument the moved content

        // Apply classes to nested elements from ORIGINAL HTML
        hierarchyUl.querySelectorAll('li').forEach(li => li.classList.add('persistent-nav--level3-list-item'));
        hierarchyUl.querySelectorAll('a').forEach(a => a.classList.add('persistent-nav--level3-link', 'grid-x', 'align-left', 'align-middle'));
        hierarchyUl.querySelectorAll('span').forEach(span => span.classList.add('persistent-nav--level3-title', 'no-icon')); // Assuming span is for title

        transformNestedLists(hierarchyUl);
        level3ListDiv.append(hierarchyUl);

        button.addEventListener('click', () => {
          level3Wrapper.classList.toggle('active');
          listItem.classList.toggle('active');
        });
        backButton.addEventListener('click', () => {
          level3Wrapper.classList.remove('active');
          listItem.classList.remove('active');
        });
        closeButtonL1.addEventListener('click', () => {
          section.classList.remove('active');
        });
      } else if (link) { // Fallback if hierarchy-tree is not present but a link is
        const anchor = document.createElement('a');
        anchor.href = link.href;
        anchor.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left');
        anchor.textContent = label;
        moveInstrumentation(row, anchor);
        listItem.append(anchor);
      }
    }
    // multiple-links-item or nav-level3-link-item (2 cells, first cell is an anchor)
    else if (numCells === 2 && cells[0].querySelector('a')) {
      const linkCell = cells[0];
      const labelCell = cells[1];

      const listItem = document.createElement('li');
      listItem.classList.add('persistent-nav--level2-list-item', 'grid-x', 'burger-nav'); // Use appropriate classes
      level2List.append(listItem);

      const link = linkCell?.querySelector('a');
      const label = labelCell?.textContent.trim();

      if (link) {
        const anchor = document.createElement('a');
        anchor.href = link.href;
        anchor.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left');
        anchor.textContent = label;
        moveInstrumentation(row, anchor);
        listItem.append(anchor);
      }
    }
    // banner (5 cells, first cell is a picture)
    else if (numCells === 5 && cells[0].querySelector('picture')) {
      // This logic seems to be for the main banner, not individual list items.
      // The current structure places the banner outside the level2List.
      // If these are meant to be list items, the structure needs adjustment.
      // For now, we'll skip processing these as list items and assume they are handled elsewhere
      // or represent a different block structure not directly part of the main nav list.
    }
  });

  const level2BannerDiv = document.createElement('div');
  level2BannerDiv.classList.add('small-12', 'large-8', 'xlarge-9', 'persistent-nav--level2-banner', 'show-for-large');
  level2Div.append(level2BannerDiv);

  const picture = level2BannerImageRow?.querySelector('picture');
  if (picture) {
    const bannerPicture = document.createElement('picture');
    bannerPicture.classList.add('persistent-nav--level2-banner-picture', 'burger-nav');
    bannerPicture.innerHTML = picture.innerHTML;
    level2BannerDiv.append(bannerPicture);

    bannerPicture.querySelectorAll('img').forEach((img) => {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
    });
  }

  const bannerInfoDiv = document.createElement('div');
  bannerInfoDiv.classList.add('persistent-nav--level2-banner--info', 'burger-nav');
  level2BannerDiv.append(bannerInfoDiv);

  const bannerTitle = document.createElement('p');
  bannerTitle.classList.add('headline-h4');
  bannerTitle.textContent = level2BannerTitleRow?.textContent.trim() || '';
  bannerInfoDiv.append(bannerTitle);

  block.innerHTML = '';
  block.append(section);
}
