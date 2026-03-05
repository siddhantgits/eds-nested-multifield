/**
 * ============================================================
 *  FOOTER BLOCK — EDS / Universal Editor
 * ============================================================
 *
 * HOW EDS RENDERS THIS BLOCK (verified from actual page source)
 * ─────────────────────────────────────────────────────────────
 * AEM renders simple block properties as <div> rows. HOWEVER composite
 * multifield children (stored as JCR sub-nodes) are NOT rendered to HTML.
 * Instead, the columns node appears as an EMPTY div with a data-aue-resource:
 *
 *  <div class="footer">
 *    <div><div><picture><img alt="..."></picture></div></div>  ← Row 0: logo
 *    <div><div><p>tagline text</p></div></div>                 ← Row 1: tagline
 *    <div><div>copyright text</div></div>                      ← Row 2: copyright
 *    <div data-aue-resource="urn:aemconnection:/...columns">   ← Row 3: columns (EMPTY)
 *    </div>
 *  </div>
 *
 * NOTE: "logoAlt" is NOT a separate row — AEM merges it into <img alt="...">.
 *
 *
 * THE COLUMNS JCR STRUCTURE
 * ─────────────────────────────────────────────────────────────
 * Even though columns renders empty in HTML, the data IS stored in JCR:
 *
 *   /content/.../footer/
 *     columns/                    ← the composite multifield root node
 *       item0/                    ← first column (JCR child node)
 *         title: "Products"       ← text field (JCR string property)
 *         links: ["/p1", "/p2"]   ← aem-content multi (JCR multi-valued string)
 *       item1/                    ← second column
 *         title: "Company"
 *         links: ["/p3"]
 *
 * To fetch this, we use AEM's Sling GET servlet JSON API:
 *   GET https://{aem-host}/content/.../footer/columns.json
 * Response:
 *   {
 *     "item0": { "title": "Products", "links": ["/p1", "/p2"] },
 *     "item1": { "title": "Company",  "links": ["/p3"] }
 *   }
 *
 * We extract the columns node JCR path from the data-aue-resource attribute.
 * The AEM host is read from fstab.yaml (via the page's franklin proxy config).
 *
 *
 * FIELD NAMES IN COMPONENT MODELS (simple flat names)
 * ─────────────────────────────────────────────────────────────
 * In component-models.json, names are always SIMPLE FLAT strings:
 *   "name": "title"   ✅ → stored as JCR property: columns/item0/title
 *   "name": "links"   ✅ → stored as JCR property: columns/item0/links (multi-value)
 * NOT path-style like "teaser/image/fileReference" — that is old Coral UI XML syntax.
 */

import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * STEP 1: Parse the AEM .json response for the columns node.
 *
 * AEM's Sling GET servlet returns a JCR node as JSON.
 * Direct child nodes appear as keys whose values are objects.
 * JCR system properties start with "jcr:" or "sling:" — we skip those.
 *
 * Example response from GET .../footer/columns.json:
 *   {
 *     "jcr:primaryType": "nt:unstructured",    ← skip (system property)
 *     "item0": {                                ← first column item
 *       "jcr:primaryType": "nt:unstructured",  ← skip
 *       "title": "Products",                   ← our "title" field
 *       "links": ["/content/p1", "/content/p2"] ← our "links" field (multi-value)
 *     },
 *     "item1": {
 *       "title": "Company",
 *       "links": "/content/p3"                 ← single value: string, not array!
 *     }
 *   }
 *
 * IMPORTANT: AEM stores a single-value multi-field as a String (not array).
 * We always wrap `links` in Array.from() to handle both cases.
 *
 * @param {Object} json - Parsed JSON from AEM columns.json
 * @returns {Array<{title: string, links: string[]}>}
 */
function parseColumnsJson(json) {
  // Filter to only JCR child nodes (objects that aren't system properties)
  // System props: "jcr:primaryType", "jcr:created", "sling:resourceType", etc.
  const columnItems = Object.entries(json)
    .filter(([key, value]) => (
      !key.startsWith('jcr:') // skip JCR system properties
      && !key.startsWith('sling:') // skip Sling system properties
      && typeof value === 'object' // must be an object (child node)
      && value !== null
    ))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })); // item0, item1, item2…

  // Convert each child node into { title, links }
  return columnItems.map(([, item]) => {
    const title = item.title || '';

    // "links" is a multi-valued string property in JCR.
    // If only one value was saved, AEM sends it as a plain string.
    // If multiple, it's an array. Always normalize to an array.
    const rawLinks = item.links;
    const linkPaths = rawLinks
      ? Array.from(Array.isArray(rawLinks) ? rawLinks : [rawLinks])
      : [];

    // Convert JCR content paths to absolute URLs.
    // AEM paths like "/content/mysite/page" become full URLs on publish.
    // For display purposes we use the path as href; authors set link text
    // via the aem-content picker which stores the page path.
    // EDS will resolve these to the correct CDN URLs after publish.
    const links = linkPaths.map((path) => ({
      href: path,
      // Use the last segment of the path as the link text (fallback).
      // e.g. "/content/mysite/about-us" → "about-us"
      // Authors can override this by configuring the page's nav title.
      text: path.split('/').filter(Boolean).pop() || path,
    }));

    return { title, links };
  }).filter((col) => col.title || col.links.length > 0);
}

/**
 * STEP 2: Fetches column data from AEM's JSON API.
 *
 * Uses the JCR path from the columns row's data-aue-resource attribute,
 * then appends .json to call AEM's Sling GET servlet.
 *
 * The AEM host URL is extracted from window.hlx config (set by scripts.js)
 * or falls back to the fstab-configured AEM Cloud URL.
 *
 * @param {Element} columnsRow - The columns div (with data-aue-resource)
 * @returns {Promise<Array>} Parsed column objects
 */
async function fetchColumnsData(columnsRow) {
  // The data-aue-resource attribute format:
  //   "urn:aemconnection:/content/path/to/footer/columns"
  // We need just the JCR path after "urn:aemconnection:"
  const resource = columnsRow.getAttribute('data-aue-resource') || '';
  const jcrPath = resource.replace('urn:aemconnection:', '');

  if (!jcrPath) return [];

  // Build the AEM JSON API URL.
  // AEM's Sling GET servlet with .json selector returns the node as JSON.
  // We use the same AEM host that serves this page's content.
  //
  // In local dev (aem up), this is proxied through localhost:3000.
  // In production, this would be the published CDN — but composite
  // multifield data is not published to the CDN yet (early-access).
  // So this fetch currently ONLY works in local dev / UE environments.
  const aemUrl = `${jcrPath}.json`;

  try {
    // fetch() makes an HTTP GET request to the URL.
    // "credentials: include" sends cookies for AEM authentication.
    const response = await fetch(aemUrl, { credentials: 'include' });

    if (!response.ok) {
      // Response status 401/403 = not authenticated, 404 = path doesn't exist
      return [];
    }

    // response.json() parses the JSON text into a JavaScript object
    const json = await response.json();
    return parseColumnsJson(json);
  } catch {
    // Network error or JSON parse error — silently return empty array
    return [];
  }
}

/**
 * STEP 3: Build the footer columns <nav> from parsed column data.
 *
 * Creates:
 *   <nav class="footer-columns">
 *     <div class="footer-column">
 *       <h3 class="footer-column-title">Products</h3>
 *       <ul class="footer-column-links">
 *         <li><a href="/p1">p1</a></li>
 *       </ul>
 *     </div>
 *     … more columns …
 *   </nav>
 *
 * @param {Array<{title: string, links: Array<{text: string, href: string}>}>} columns
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

    // Links list <ul><li><a>
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
 * MAIN DECORATE FUNCTION
 * ══════════════════════
 * EDS calls this when it finds a block with class "footer".
 *
 * TWO INSTANCES OF THIS BLOCK EXIST PER PAGE:
 *  1. Inside <main> — the UE-authored footer block (has logo/tagline/etc.)
 *  2. Inside <footer> — auto-added by scripts.js (empty, loads /footer fragment)
 *
 * ACTUAL BLOCK ROWS (from page source, verified):
 *  Row 0 → logo      (reference field  → <picture><img alt="...">)
 *  Row 1 → tagline   (richtext field   → <p> elements)
 *  Row 2 → copyright (text field       → plain text)
 *  Row 3 → columns   (composite multi  → EMPTY div with data-aue-resource)
 *
 * NOTE: "logoAlt" is NOT a separate row. AEM merges it into <img alt="">.
 *
 * @param {Element} block - The footer block DOM element
 */
export default async function decorate(block) {
  // ──────────────────────────────────────────────────────────────
  // DETECT UE-AUTHORED CONTENT
  // ──────────────────────────────────────────────────────────────
  // KEY: Use innerHTML not textContent — images have no text!
  // Row 0 is a <picture><img> which has ZERO text, but HAS innerHTML.
  const firstCell = block.querySelector(':scope > div > div');
  const hasUEContent = firstCell !== null && firstCell.innerHTML.trim() !== '';

  // ──────────────────────────────────────────────────────────────
  // PATH A: No UE content → load /footer as a fragment (classic EDS)
  // ──────────────────────────────────────────────────────────────
  if (!hasUEContent) {
    const footerMeta = getMetadata('footer');
    const footerPath = footerMeta
      ? new URL(footerMeta, window.location).pathname
      : '/footer';
    const fragment = await loadFragment(footerPath);
    block.textContent = '';
    const wrapper = document.createElement('div');
    while (fragment.firstElementChild) wrapper.append(fragment.firstElementChild);
    block.append(wrapper);
    return;
  }

  // ──────────────────────────────────────────────────────────────
  // PATH B: UE-authored — parse block rows + fetch columns JSON
  //
  // Row index map (from actual AEM-rendered page source):
  //   rows[0] → logo      (reference → <picture><img alt="logoAlt value">)
  //   rows[1] → tagline   (richtext  → <p>...</p>)
  //   rows[2] → copyright (text      → plain text)
  //   rows[3] → columns   (composite → EMPTY div, has data-aue-resource)
  // ──────────────────────────────────────────────────────────────
  const rows = [...block.querySelectorAll(':scope > div')];

  // ── ROW 0: LOGO ──────────────────────────────────────────────
  // An AEM reference field renders as <picture><img src="..." alt="logoAlt">.
  // The "logoAlt" text field value is automatically placed in img.alt by AEM — NO separate row.
  let logoEl = null;
  if (rows[0]) {
    const img = rows[0].querySelector('img');
    if (img) {
      const a = document.createElement('a');
      a.href = '/';
      a.className = 'footer-brand-logo';
      a.setAttribute('aria-label', 'Home');
      a.append(img.cloneNode(true)); // cloneNode(true) = deep copy (copies all children too)
      logoEl = a;
    }
  }

  // ── ROW 1: TAGLINE ───────────────────────────────────────────
  // A richtext field renders as <p> (and other block tags) inside the cell <div>.
  let taglineEl = null;
  if (rows[1]) {
    const cell = rows[1].querySelector(':scope > div');
    if (cell && cell.innerHTML.trim()) {
      taglineEl = document.createElement('div');
      taglineEl.className = 'footer-tagline';
      taglineEl.innerHTML = cell.innerHTML; // keep rich HTML (bold, italic, etc.)
    }
  }

  // ── ROW 2: COPYRIGHT ─────────────────────────────────────────
  // A text field renders as plain text inside the cell <div>.
  const copyrightCell = rows[2]?.querySelector(':scope > div');
  const copyrightText = copyrightCell?.textContent?.trim()
    || `© ${new Date().getFullYear()} All rights reserved.`;

  // ── ROW 3: COLUMNS (composite multifield — fetched via AEM JSON API) ──
  //
  // The composite multifield renders as an EMPTY div in HTML — AEM's block
  // renderer does NOT serialize the child JCR nodes (item0, item1…) to HTML.
  //
  // Solution: fetch the JCR data from AEM's .json API using the path
  // embedded in the data-aue-resource attribute of the columns div.
  //
  // JCR structure fetched:
  //   { "item0": { "title": "Products", "links": ["/p1", "/p2"] },
  //     "item1": { "title": "Company",  "links": ["/p3"] } }
  let columnsNav = null;
  const columnsRow = rows[3];
  if (columnsRow) {
    const parsedColumns = await fetchColumnsData(columnsRow);
    if (parsedColumns.length > 0) {
      columnsNav = buildColumnsNav(parsedColumns);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // BUILD THE FINAL FOOTER LAYOUT
  // ──────────────────────────────────────────────────────────────
  block.textContent = ''; // clear raw block rows

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

  // Columns navigation (from AEM JSON API)
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
