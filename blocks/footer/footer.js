import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Parses footer columns from composite multifield rendered rows.
 * EDS renders composite multifields (container, multi:true) as rows in the block table.
 * Each column row contains: columnTitle | links (hr-separated composite items)
 * @param {Element} block
 * @returns {Array<{title: string, links: Array<{text: string, href: string}>}>}
 */
function parseFooterColumns(block) {
  const columns = [];
  // Each row in the block table maps to one column item
  const rows = [...block.querySelectorAll(':scope > div')];
  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (cells.length < 2) return;

    const titleCell = cells[0];
    const linksCell = cells[1];
    const title = titleCell.textContent.trim();

    // Links are either <ul><li> (simple) or hr-separated composite items
    const links = [];
    const listItems = linksCell.querySelectorAll('li');
    if (listItems.length > 0) {
      // Simple multifield rendered as <ul><li>
      listItems.forEach((li) => {
        const anchor = li.querySelector('a');
        if (anchor) {
          links.push({ text: anchor.textContent.trim(), href: anchor.href });
        } else {
          const text = li.textContent.trim();
          if (text) links.push({ text, href: '#' });
        }
      });
    } else {
      // Composite multifield rendered as <hr>-separated blocks
      const html = linksCell.innerHTML;
      const parts = html.split(/<hr\s*\/?>/i).map((p) => p.trim()).filter(Boolean);
      parts.forEach((part) => {
        const temp = document.createElement('div');
        temp.innerHTML = part;
        const anchor = temp.querySelector('a');
        const text = temp.textContent.trim();
        if (text) {
          links.push({
            text: anchor ? anchor.textContent.trim() : text,
            href: anchor ? anchor.href : text,
          });
        }
      });
    }

    if (title || links.length > 0) {
      columns.push({ title, links });
    }
  });
  return columns;
}

/**
 * Builds the columns nav HTML from parsed column data.
 * @param {Array} columns
 * @returns {Element}
 */
function buildColumnsNav(columns) {
  const nav = document.createElement('nav');
  nav.className = 'footer-columns';
  nav.setAttribute('aria-label', 'Footer Navigation');

  columns.forEach(({ title, links }) => {
    const col = document.createElement('div');
    col.className = 'footer-column';

    if (title) {
      const heading = document.createElement('h3');
      heading.className = 'footer-column-title';
      heading.textContent = title;
      col.append(heading);
    }

    if (links.length > 0) {
      const ul = document.createElement('ul');
      ul.className = 'footer-column-links';
      links.forEach(({ text, href }) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = href;
        a.textContent = text;
        li.append(a);
        ul.append(li);
      });
      col.append(ul);
    }
    nav.append(col);
  });
  return nav;
}

/**
 * Decorates a footer block authored via Universal Editor with nested multifield.
 * Falls back to fragment-based rendering when not authored via UE.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  /* ---- Fragment-based fallback (classic authoring / old path) ---- */
  const footerMeta = getMetadata('footer');

  // If the block has no rows authored via UE, load as fragment
  const hasUEContent = block.querySelector(':scope > div > div') !== null
    && block.querySelector(':scope > div > div')?.textContent.trim() !== '';

  if (!hasUEContent) {
    const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
    const fragment = await loadFragment(footerPath);

    block.textContent = '';
    const footer = document.createElement('div');
    while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
    block.append(footer);
    return;
  }

  /* ---- Universal Editor authored path with nested multifield ---- */
  const rows = [...block.querySelectorAll(':scope > div')];

  // Row 0: brand (logo | tagline)
  const brandRow = rows[0];
  let logoEl = null;
  let taglineEl = null;
  let copyrightText = '';

  if (brandRow) {
    const cells = [...brandRow.querySelectorAll(':scope > div')];
    if (cells[0]) {
      const img = cells[0].querySelector('img');
      if (img) {
        const a = document.createElement('a');
        a.href = '/';
        a.className = 'footer-brand-logo';
        a.setAttribute('aria-label', 'Home');
        img.alt = img.alt || 'Brand Logo';
        a.append(img.cloneNode(true));
        logoEl = a;
      }
    }
    if (cells[1]) {
      taglineEl = document.createElement('p');
      taglineEl.className = 'footer-tagline';
      taglineEl.innerHTML = cells[1].innerHTML;
    }
  }

  // Row 1: columns (nested multifield)
  const columnsRow = rows[1];
  let columnsNav = null;
  if (columnsRow) {
    const colBlock = document.createElement('div');
    colBlock.innerHTML = columnsRow.innerHTML;
    const columns = parseFooterColumns(colBlock);
    if (columns.length > 0) {
      columnsNav = buildColumnsNav(columns);
    }
  }

  // Row 2: copyright
  const copyrightRow = rows[2];
  if (copyrightRow) {
    copyrightText = copyrightRow.textContent.trim();
  }

  // Build the footer DOM
  block.textContent = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'footer-wrapper';

  // Brand section
  if (logoEl || taglineEl) {
    const brand = document.createElement('div');
    brand.className = 'footer-brand';
    if (logoEl) brand.append(logoEl);
    if (taglineEl) brand.append(taglineEl);
    wrapper.append(brand);
  }

  // Columns nav
  if (columnsNav) {
    wrapper.append(columnsNav);
  }

  // Bottom bar
  const bottom = document.createElement('div');
  bottom.className = 'footer-bottom';
  const copy = document.createElement('p');
  copy.className = 'footer-copyright';
  copy.textContent = copyrightText || `© ${new Date().getFullYear()} All rights reserved.`;
  bottom.append(copy);
  wrapper.append(bottom);

  block.append(wrapper);
}
