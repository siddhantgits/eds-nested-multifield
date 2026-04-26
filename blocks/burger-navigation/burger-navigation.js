import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, level) {
  rootUl.querySelectorAll(':scope > li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');
    let triggerEl;

    // Add classes to li elements from the original HTML
    li.classList.add('persistent-nav--level3-list-item');

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
    } else {
      triggerEl = anchor;
      // Add classes to anchor elements from the original HTML
      anchor.classList.add('persistent-nav--level3-link', 'grid-x', 'align-left', 'align-middle');
      const spanTitle = document.createElement('span');
      spanTitle.classList.add('persistent-nav--level3-title');
      if (!nested) { // Only add no-icon if it's a leaf node
        spanTitle.classList.add('no-icon');
      }
      spanTitle.textContent = anchor.textContent.trim();
      anchor.textContent = ''; // Clear original text
      anchor.prepend(spanTitle);
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-sub-child'); // Use original HTML class
      if (level === 2) {
        subWrap.classList.add('has-footer-sub-child');
      } else if (level === 3) {
        subWrap.classList.add('has-footer-inner-sub-child');
      }
      subWrap.append(nested);
      li.append(subWrap);

      if (triggerEl) {
        triggerEl.classList.add('js-persistent-nav--level2-link');
        triggerEl.classList.add('labelMediumRegular');
        triggerEl.classList.add('text-left');
        triggerEl.setAttribute('aria-expanded', 'false');
        triggerEl.setAttribute('aria-controls', `persistentNavLevel3List-burger-nav-wrapper-burger-${Math.random().toString(36).substring(2, 7)}`); // Unique ID
        triggerEl.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
          triggerEl.setAttribute('aria-expanded', li.classList.contains('active'));
        });
      }
      transformNestedLists(nested, level + 1);
    } else if (triggerEl) {
      triggerEl.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'no-submenu');
    }
  });
}

export default function decorate(block) {
  block.classList.add('grid-container', 'js-burger-navigation');
  block.setAttribute('aria-label', 'Burger Navigation Section');

  const navWrapper = document.createElement('nav');
  navWrapper.classList.add('persistent-navigation--wrapper', 'js-persistent-nav', 'burger-nav');

  const persistentNav = document.createElement('ul');
  persistentNav.classList.add('persistent-navigation', 'grid-x');

  const navListItem = document.createElement('li');
  navListItem.classList.add('persistent-navigation--list');

  const menuWrapper = document.createElement('div');
  menuWrapper.classList.add('persistent-navigation--menu-wrapper', 'burger-nav');
  menuWrapper.id = 'burger-nav-wrapper';
  menuWrapper.setAttribute('aria-labelledby', 'burger-nav');

  const level2Div = document.createElement('div');
  level2Div.classList.add('persistent-nav--level2', 'level2', 'grid-x');

  const level2Items = document.createElement('div');
  level2Items.classList.add('small-12', 'large-4', 'xlarge-3', 'persistent-nav--level2-items');

  const level2Close = document.createElement('div');
  level2Close.classList.add('persistent-nav--level2--close', 'hide-for-large');

  const controlPrev = document.createElement('div');
  controlPrev.classList.add('persistent-nav--control-prev', 'persistent-nav--control');
  level2Close.append(controlPrev);

  const closeButton = document.createElement('button');
  closeButton.classList.add('persistent-nav--control-close', 'persistent-nav--control', 'js-persistent-nav-l1--close');
  closeButton.setAttribute('aria-label', 'Close navigation');
  level2Close.append(closeButton);
  level2Items.append(level2Close);

  const level2List = document.createElement('ul');
  level2List.classList.add('persistent-nav--level2-list', 'burger-nav');
  level2List.setAttribute('aria-labelledby', 'persistent-nav--level2--title--');

  const mainNavigationItems = [];
  const level2BannerItems = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 6) { // main-navigation-item
      mainNavigationItems.push(row);
    } else if (cells.length === 2) { // level2-banner
      level2BannerItems.push(row);
    }
  });

  mainNavigationItems.forEach((row) => {
    // Use content detection for cells based on BlockJson model
    const cells = [...row.children];
    const labelCell = cells.find(c => !c.querySelector('a') && !c.querySelector('ul') && !c.querySelector('picture'));
    const linkCell = cells.find(c => c.querySelector('a') && !c.querySelector('ul'));
    const hierarchyTreeCell = cells.find(c => c.querySelector('ul'));

    const listItem = document.createElement('li');
    listItem.classList.add('persistent-nav--level2-list-item', 'grid-x', 'burger-nav');

    const hierarchyRoot = hierarchyTreeCell?.querySelector('ul');

    if (hierarchyRoot) {
      const trigger = document.createElement('button');
      trigger.classList.add('persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'js-persistent-nav--level2-link');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', `level-burger-nav-${Math.random().toString(36).substring(2, 7)}`);
      trigger.textContent = labelCell?.textContent.trim() || '';
      moveInstrumentation(labelCell, trigger);
      listItem.append(trigger);

      const level3Wrapper = document.createElement('div');
      level3Wrapper.classList.add('small-12', 'large-8', 'xlarge-9', 'persistent-nav--level3-wrapper');
      level3Wrapper.id = trigger.getAttribute('aria-controls');

      const level3Nav = document.createElement('div');
      level3Nav.classList.add('persistent-nav--level3', 'grid-x', 'burger-nav');
      level3Nav.setAttribute('role', 'list');

      const level3Close = document.createElement('div');
      level3Close.classList.add('persistent-nav--level2--close', 'level3', 'hide-for-large');
      level3Close.setAttribute('role', 'listitem');

      const backButton = document.createElement('button');
      backButton.classList.add('persistent-nav--control-prev', 'persistent-nav--control', 'js-persistent-nav-l2--close');
      backButton.setAttribute('aria-label', 'Back to previous navigation');
      level3Close.append(backButton);

      const titleSpan = document.createElement('span');
      titleSpan.classList.add('persistent-nav--control-title', 'utilityTagHighCaps', 'js-persistent-nav-l2--close');
      level3Close.append(titleSpan);

      const closeL1Button = document.createElement('button');
      closeL1Button.classList.add('persistent-nav--control-close', 'persistent-nav--control', 'js-persistent-nav-l1--close');
      closeL1Button.setAttribute('aria-label', 'Close navigation');
      level3Close.append(closeL1Button);
      level3Nav.append(level3Close);

      const level3Title = document.createElement('p');
      level3Title.classList.add('persistent-nav--level3--title', 'text-center', 'hide-for-large', 'headline-h2');
      level3Title.setAttribute('role', 'listitem');
      level3Title.textContent = labelCell?.textContent.trim() || '';
      level3Nav.append(level3Title);

      const level3ListWrapper = document.createElement('div');
      level3ListWrapper.classList.add('cell', 'small-12', 'large-12', 'xlarge-8', 'persistent-nav--level3-list', 'burger-nav');
      level3ListWrapper.id = `persistentNavLevel3List-burger-nav-wrapper-burger-${Math.random().toString(36).substring(2, 7)}`;

      // Move instrumentation for the hierarchy tree cell
      moveInstrumentation(hierarchyTreeCell, hierarchyRoot);

      // Apply classes to ul and li elements within the hierarchy tree
      hierarchyRoot.classList.add('persistent-nav--level3-list'); // Add class to the root ul
      hierarchyRoot.querySelectorAll('ul').forEach(ul => ul.classList.add('persistent-nav--level3-list'));
      hierarchyRoot.querySelectorAll('li').forEach(li => li.classList.add('persistent-nav--level3-list-item'));
      hierarchyRoot.querySelectorAll('a').forEach(a => {
        a.classList.add('persistent-nav--level3-link', 'grid-x', 'align-left', 'align-middle');
        const spanTitle = document.createElement('span');
        spanTitle.classList.add('persistent-nav--level3-title');
        // Check if it has a nested ul to determine 'no-icon'
        if (!a.parentElement.querySelector('ul')) {
          spanTitle.classList.add('no-icon');
        }
        spanTitle.textContent = a.textContent.trim();
        a.textContent = ''; // Clear original text
        a.prepend(spanTitle);
      });

      level3ListWrapper.append(hierarchyRoot);
      transformNestedLists(hierarchyRoot, 2); // Start at level 2 for nested lists
      level3Nav.append(level3ListWrapper);
      level3Wrapper.append(level3Nav);
      listItem.append(level3Wrapper);

      trigger.addEventListener('click', () => {
        level3Wrapper.classList.toggle('active');
        trigger.setAttribute('aria-expanded', level3Wrapper.classList.contains('active'));
      });
      backButton.addEventListener('click', () => {
        level3Wrapper.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      });
      closeL1Button.addEventListener('click', () => {
        block.classList.remove('active');
        navWrapper.classList.remove('active');
      });
    } else {
      const link = document.createElement('a');
      link.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'no-submenu');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.textContent = labelCell?.textContent.trim() || '';
        link.setAttribute('aria-label', labelCell?.textContent.trim() || '');
      } else {
        link.href = '#';
        link.textContent = labelCell?.textContent.trim() || '';
        link.setAttribute('aria-label', labelCell?.textContent.trim() || '');
      }
      moveInstrumentation(row, link);
      listItem.append(link);
    }
    level2List.append(listItem);
  });

  level2Items.append(level2List);
  level2Div.append(level2Items);

  if (level2BannerItems.length > 0) {
    const bannerRow = level2BannerItems[0]; // Assuming only one banner for level2
    const cells = [...bannerRow.children];
    const imageCell = cells.find(c => c.querySelector('picture'));
    const titleCell = cells.find(c => !c.querySelector('picture'));

    const level2BannerDiv = document.createElement('div');
    level2BannerDiv.classList.add('small-12', 'large-8', 'xlarge-9', 'persistent-nav--level2-banner', 'show-for-large');

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const optimizedPic = createOptimizedPicture(picture.querySelector('img').src, picture.querySelector('img').alt, false, [{ width: '750' }]);
      optimizedPic.classList.add('persistent-nav--level2-banner-picture', 'burger-nav');
      moveInstrumentation(picture, optimizedPic.querySelector('img'));
      level2BannerDiv.append(optimizedPic);
    }

    const bannerInfo = document.createElement('div');
    bannerInfo.classList.add('persistent-nav--level2-banner--info', 'burger-nav');

    const bannerTitle = document.createElement('p');
    bannerTitle.classList.add('headline-h4');
    bannerTitle.textContent = titleCell?.textContent.trim() || '';
    bannerInfo.append(bannerTitle);

    level2BannerDiv.append(bannerInfo);
    level2Div.append(level2BannerDiv);
  }

  menuWrapper.append(level2Div);
  navListItem.append(menuWrapper);
  persistentNav.append(navListItem);
  navWrapper.append(persistentNav);
  block.append(navWrapper);
}
