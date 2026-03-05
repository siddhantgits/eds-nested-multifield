/**
 * ============================================================
 *  FOOTER BLOCK — EDS / Universal Editor
 * ============================================================
 *
 * HOW EDS RENDERS THIS BLOCK
 * ─────────────────────────────────────────────────────────────
 * EDS converts every block to an HTML table. Each field in the
 * component model becomes one ROW. The block's HTML looks like:
 *
 *  <div class="footer block">
 *    <div>                      ROW 0 → "logo" (reference field → <picture><img>)
 *      <div><picture>…</picture></div>
 *    </div>
 *    <div>                      ROW 1 → "logoAlt" (text field)
 *      <div>alt text here</div>
 *    </div>
 *    <div>                      ROW 2 → "tagline" (richtext field)
 *      <div><p>Tagline text</p></div>
 *    </div>
 *    <div>                      ROW 3 → "columns" (COMPOSITE MULTIFIELD)
 *      <div>
 *        ALL column items land in ONE cell, separated by <hr> tags:
 *
 *        <hr>
 *        <p>Products</p>          ← "title" text field of column #1
 *        <ul>                     ← "links" aem-content multi of column #1
 *          <li><a href="…">Link A</a></li>
 *          <li><a href="…">Link B</a></li>
 *        </ul>
 *        <hr>
 *        <p>Company</p>           ← "title" of column #2
 *        <ul>
 *          <li><a href="…">About</a></li>
 *        </ul>
 *        <hr>
 *      </div>
 *    </div>
 *    <div>                      ROW 4 → "copyright" (text field)
 *      <div>© 2024 My Company</div>
 *    </div>
 *  </div>
 *
 * ─────────────────────────────────────────────────────────────
 * ABOUT FIELD NAMES (name property)
 * ─────────────────────────────────────────────────────────────
 * In EDS component-models.json, field names are always SIMPLE FLAT strings:
 *   "name": "title"     ✅ correct
 *   "name": "links"     ✅ correct
 *
 * The JCR path notation ("teaser/image/fileReference") is from AEM's old
 * Coral UI dialogs and is NOT used in EDS Universal Editor models.
 * Inside a composite container (multi:true), each sub-field simply uses
 * its own flat "name". The system handles JCR storage paths automatically.
 */

import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Splits the composite multifield cell into individual column objects.
 *
 * A composite multifield packs ALL items into ONE cell separated by <hr>.
 * Each item section contains:
 *   - <p>…</p>  → the "title" (text field)
 *   - <ul>…</ul> → the "links" (aem-content + multi:true)
 *
 * To DEBUG: open Browser DevTools → Console. Look for "[Footer]" messages.
 * Also open the Elements tab and inspect the footer's raw div rows to see
 * exactly what EDS rendered before this function ran.
 *
 * @param {Element} cell - The DOM element holding the composite multifield HTML
 * @returns {Array<{title: string, links: Array<{text: string, href: string}>}>}
 */
function parseColumns(cell) {
  // Split the cell's HTML on every <hr> tag.
  // innerHTML gives us the raw HTML string; split() cuts it into pieces.
  // Each piece is one column's content (title + links).
  const parts = cell.innerHTML
    .split(/<hr\s*\/?>/) // matches <hr>, <hr/>, <hr />
    .map((p) => p.trim()) // remove leading/trailing whitespace
    .filter((p) => p.length > 0); // drop empty strings

  // Convert each HTML piece into a structured { title, links } object
  return parts
    .map((part) => {
      // Create a throw-away <div> to parse the piece as real DOM nodes
      const temp = document.createElement('div');
      temp.innerHTML = part;

      // ── "title" field ──────────────────────────────────────────
      // The text field renders as a <p> element.
      // We grab the FIRST <p> in this section as the column title.
      const titleEl = temp.querySelector('p');
      const title = titleEl ? titleEl.textContent.trim() : '';
      if (titleEl) titleEl.remove(); // remove it so it won't appear in links

      // ── "links" field (aem-content + multi:true) ───────────────
      // aem-content with multi:true renders as <ul><li><a href="…">text</a></li></ul>
      // Each <li> is one URL the author picked in UE.
      const links = [];
      temp.querySelectorAll('li').forEach((li) => {
        const anchor = li.querySelector('a');
        if (anchor) {
          links.push({
            text: anchor.textContent.trim(), // the visible label of the link
            href: anchor.href, // the full URL (browser resolves relative paths)
          });
        }
      });

      return { title, links };
    })
    .filter((col) => col.title || col.links.length > 0); // remove empty items
}

/**
 * Creates the visual footer columns navigation from parsed data.
 *
 * Output structure:
 *   <nav class="footer-columns">
 *     <div class="footer-column">
 *       <h3 class="footer-column-title">Products</h3>
 *       <ul class="footer-column-links">
 *         <li><a href="/p1">Link A</a></li>
 *         <li><a href="/p2">Link B</a></li>
 *       </ul>
 *     </div>
 *     … more columns …
 *   </nav>
 *
 * @param {Array} columns - From parseColumns()
 * @returns {Element}
 */
function buildColumnsNav(columns) {
  const nav = document.createElement('nav');
  nav.className = 'footer-columns';
  nav.setAttribute('aria-label', 'Footer Navigation');

  columns.forEach(({ title, links }) => {
    const col = document.createElement('div');
    col.className = 'footer-column';

    // Column heading <h3>
    if (title) {
      const heading = document.createElement('h3');
      heading.className = 'footer-column-title';
      heading.textContent = title;
      col.append(heading);
    }

    // Links list <ul>
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
 * EDS calls this function automatically when it finds a block with class "footer".
 * The `block` parameter is the <div class="footer block"> DOM element.
 *
 * HOW THE STANDARD FOOTER WORKS IN EDS
 * ─────────────────────────────────────
 * The boilerplate footer is NOT authored per-page. Instead:
 *   1. scripts.js auto-adds an empty "footer" block to every page
 *   2. decorate() loads the /footer PAGE as a "fragment" (an HTML snippet)
 *   3. That /footer page IS authored via Universal Editor with this block model
 *
 * So flow is:  Page loads → empty footer block → decorate() → fetches /footer → renders content
 *
 * When authoring ON the /footer page itself in Universal Editor, the block
 * DOES have content in its rows. So we still need to handle both cases.
 *
 * DEBUGGING TIP: Open the browser at localhost:3000, open DevTools → Elements,
 * find the <footer> element. Look at its inner HTML BEFORE this function runs
 * to understand the raw row structure. Add ?debug to the URL for extra EDS logs.
 *
 * @param {Element} block - The footer block DOM element
 */
export default async function decorate(block) {
  // ──────────────────────────────────────────────────────────────
  // DETECT: Does this block have UE-authored content in its rows?
  // ──────────────────────────────────────────────────────────────
  // ':scope > div > div' selects the first CELL inside the first ROW.
  // ':scope' means "relative to `block`" — prevents matching deeper elements.
  // If a cell exists and has text, the block has UE content.
  const firstCell = block.querySelector(':scope > div > div');
  const hasUEContent = firstCell !== null && firstCell.textContent.trim() !== '';

  // ──────────────────────────────────────────────────────────────
  // PATH A: No UE content → load /footer as a fragment (classic EDS)
  // ──────────────────────────────────────────────────────────────
  if (!hasUEContent) {
    const footerMeta = getMetadata('footer'); // check for custom footer path in metadata
    const footerPath = footerMeta
      ? new URL(footerMeta, window.location).pathname
      : '/footer'; // default path

    const fragment = await loadFragment(footerPath);

    // Replace block content with fragment
    block.textContent = '';
    const wrapper = document.createElement('div');
    while (fragment.firstElementChild) wrapper.append(fragment.firstElementChild);
    block.append(wrapper);
    return;
  }

  // ──────────────────────────────────────────────────────────────
  // PATH B: UE-authored — parse the block's rows
  // Our model field order → row index mapping:
  //   Row 0 → "logo"      (reference image)
  //   Row 1 → "logoAlt"   (text — used inside the img's alt attribute)
  //   Row 2 → "tagline"   (richtext)
  //   Row 3 → "columns"   (composite multifield: title + links per column)
  //   Row 4 → "copyright" (text)
  // ──────────────────────────────────────────────────────────────
  const rows = [...block.querySelectorAll(':scope > div')];

  // ── ROW 0: LOGO (reference field → rendered as <picture><img>) ──
  let logoEl = null;
  if (rows[0]) {
    const img = rows[0].querySelector('img');
    if (img) {
      // Wrap the logo image in a link to the homepage
      const a = document.createElement('a');
      a.href = '/';
      a.className = 'footer-brand-logo';
      a.setAttribute('aria-label', 'Home');
      img.alt = img.alt || 'Brand Logo';
      a.append(img.cloneNode(true)); // cloneNode(true) copies img + child nodes
      logoEl = a;
    }
  }

  // ── ROW 1: logoAlt is stored in the img's alt attribute automatically.
  //           We skip this row — no separate processing needed.

  // ── ROW 2: TAGLINE (richtext → may contain <p>, <strong>, etc.) ──
  let taglineEl = null;
  if (rows[2]) {
    const cell = rows[2].querySelector(':scope > div');
    if (cell && cell.innerHTML.trim()) {
      taglineEl = document.createElement('p');
      taglineEl.className = 'footer-tagline';
      taglineEl.innerHTML = cell.innerHTML; // preserve rich HTML formatting
    }
  }

  // ── ROW 3: COLUMNS (composite multifield — all items in ONE cell) ──
  // This is the core of the "nested multifield" feature.
  // See parseColumns() above for how the <hr>-separated content is handled.
  let columnsNav = null;
  if (rows[3]) {
    const columnsCell = rows[3].querySelector(':scope > div');
    if (columnsCell) {
      const parsedColumns = parseColumns(columnsCell);
      if (parsedColumns.length > 0) {
        columnsNav = buildColumnsNav(parsedColumns);
      }
    }
  }

  // ── ROW 4: COPYRIGHT (text field → plain text in a <div>) ──
  const copyrightText = rows[4]?.querySelector(':scope > div')?.textContent?.trim()
    || `© ${new Date().getFullYear()} All rights reserved.`;

  // ──────────────────────────────────────────────────────────────
  // BUILD THE FINAL FOOTER LAYOUT
  // ──────────────────────────────────────────────────────────────
  // Clear the original raw rows from the block
  block.textContent = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'footer-wrapper';

  // Brand section (logo + tagline)
  if (logoEl || taglineEl) {
    const brand = document.createElement('div');
    brand.className = 'footer-brand';
    if (logoEl) brand.append(logoEl);
    if (taglineEl) brand.append(taglineEl);
    wrapper.append(brand);
  }

  // Columns navigation
  if (columnsNav) wrapper.append(columnsNav);

  // Bottom bar with copyright
  const bottom = document.createElement('div');
  bottom.className = 'footer-bottom';
  const copy = document.createElement('p');
  copy.className = 'footer-copyright';
  copy.textContent = copyrightText;
  bottom.append(copy);
  wrapper.append(bottom);

  block.append(wrapper);
}
