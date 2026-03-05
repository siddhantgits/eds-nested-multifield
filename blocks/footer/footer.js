import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Parses footer columns from the block's composite multifield table rows.
 *
 * Structure from EDS rendering:
 *  - Outer columns: composite container (multi:true) → each column renders as a
 *    <hr>-separated block with two cells:
 *      cell[0] = columnTitle (text)
 *      cell[1] = links (aem-content, multi:true) → rendered as <ul><li><a></a></li>...</ul>
 *
 * @param {Element} block
 * @returns {Array<{title: string, links: Array<{text: string, href: string}>}>}
 */
function parseFooterColumns(block) {
  const columns = [];

  // EDS renders composite multifield items as sibling <div> rows separated by <hr>
  // OR as direct child <div> rows in the block depending on version.
  // Handle both: look for rows in the block.
  const rows = [...block.querySelectorAll(':scope > div')];
  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (cells.length < 2) return;

    const titleCell = cells[0];
    const linksCell = cells[1];
    const title = titleCell.textContent.trim();

    // aem-content with multi:true renders as <ul><li><a href="...">text</a></li></ul>
    const links = [];
    const listItems = linksCell.querySelectorAll('li');
    listItems.forEach((li) => {
      const anchor = li.querySelector('a');
      if (anchor) {
        links.push({ text: anchor.textContent.trim(), href: anchor.href });
      } else {
        const text = li.textContent.trim();
        if (text) links.push({ text, href: '#' });
      }
    });

    if (title || links.length > 0) {
      columns.push({ title, links });
    }
  });

  return columns;
}

/**
 * Builds the footer columns nav element from parsed column data.
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
 * loads and decorates the footer
 * Supports two authoring paths:
 *  1. Fragment-based (classic / no UE content): loads /footer as a fragment
 *  2. Universal Editor authored: parses composite multifield rows from the block
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Detect UE-authored content: block has child rows with content
  const firstCell = block.querySelector(':scope > div > div');
  const hasUEContent = firstCell && firstCell.textContent.trim() !== '';

  /* --------------------------------------------------------
   * Fragment-based fallback (classic authoring)
   * -------------------------------------------------------- */
  if (!hasUEContent) {
    const footerMeta = getMetadata('footer');
    const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
    const fragment = await loadFragment(footerPath);

    block.textContent = '';
    const footer = document.createElement('div');
    while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
    block.append(footer);
    return;
  }

  /* --------------------------------------------------------
   * Universal Editor authored path (nested multifield)
   * Row 0: brand (logo | tagline)
   * Row 1: columns (composite multifield → column rows inside)
   * Row 2: copyright
   * -------------------------------------------------------- */
  const rows = [...block.querySelectorAll(':scope > div')];

  // --- Brand row ---
  let logoEl = null;
  let taglineEl = null;
  const brandRow = rows[0];
  if (brandRow) {
    const cells = [...brandRow.querySelectorAll(':scope > div')];
    const img = cells[0]?.querySelector('img');
    if (img) {
      const a = document.createElement('a');
      a.href = '/';
      a.className = 'footer-brand-logo';
      a.setAttribute('aria-label', 'Home');
      img.alt = img.alt || 'Brand Logo';
      a.append(img.cloneNode(true));
      logoEl = a;
    }
    if (cells[1]?.innerHTML) {
      taglineEl = document.createElement('p');
      taglineEl.className = 'footer-tagline';
      taglineEl.innerHTML = cells[1].innerHTML;
    }
  }

  // --- Columns row (composite multifield: outer container multi:true) ---
  // Each column item is hr-separated inside cells[1] of the columns row.
  // We parse the columns row's second cell for the column items.
  let columnsNav = null;
  const columnsRow = rows[1];
  if (columnsRow) {
    // The columns composite multifield renders as hr-separated blocks
    // Each block is: columnTitle \n links (ul>li>a)
    const columnsCell = columnsRow.querySelector(':scope > div:last-child') || columnsRow;
    const html = columnsCell.innerHTML;
    const parts = html.split(/<hr\s*\/?>/i).map((p) => p.trim()).filter(Boolean);

    const parsedColumns = parts.map((part) => {
      const temp = document.createElement('div');
      temp.innerHTML = part;
      // First <p> or plain text = column title
      const firstP = temp.querySelector('p');
      const title = firstP ? firstP.textContent.trim() : temp.childNodes[0]?.textContent?.trim() || '';
      if (firstP) firstP.remove();

      // Remaining <ul><li><a> = links
      const links = [];
      temp.querySelectorAll('li').forEach((li) => {
        const a = li.querySelector('a');
        if (a) {
          links.push({ text: a.textContent.trim(), href: a.href });
        } else {
          const text = li.textContent.trim();
          if (text) links.push({ text, href: '#' });
        }
      });

      return { title, links };
    }).filter(({ title, links }) => title || links.length > 0);

    if (parsedColumns.length > 0) {
      columnsNav = buildColumnsNav(parsedColumns);
    } else {
      // Fallback: treat each child row as a column (non-hr-separated layout)
      const colBlock = document.createElement('div');
      colBlock.innerHTML = columnsRow.innerHTML;
      const cols = parseFooterColumns(colBlock);
      if (cols.length > 0) columnsNav = buildColumnsNav(cols);
    }
  }

  // --- Copyright row ---
  const copyrightText = rows[2]?.textContent?.trim()
    || `© ${new Date().getFullYear()} All rights reserved.`;

  /* --------------------------------------------------------
   * Build final DOM
   * -------------------------------------------------------- */
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
  if (columnsNav) wrapper.append(columnsNav);

  // Bottom bar
  const bottom = document.createElement('div');
  bottom.className = 'footer-bottom';
  const copy = document.createElement('p');
  copy.className = 'footer-copyright';
  copy.textContent = copyrightText;
  bottom.append(copy);
  wrapper.append(bottom);

  block.append(wrapper);
}
