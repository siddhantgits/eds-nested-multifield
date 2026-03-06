/**
 * footer-nav.js
 *
 * This block renders:
 *  - A brand name row
 *  - A multi-column link section, one column per Footer Group item
 *    Each column has a heading + a list of links (with optional nested sublinks)
 *  - A legal text row at the bottom
 *
 * EDS gives us: <div class="footer-nav">
 *   Row 0: brandName
 *   Row 1: legalText
 *   Row 2..N: footer group items — each row has 2 columns: [groupTitle, links-richtext]
 */

export default function decorate(block) {
  // Get all direct child divs — these are the "rows" EDS rendered
  const rows = [...block.querySelectorAll(':scope > div')];

  // ─── Step 1: Pull out the parent block's own property rows ──────────────────
  // The model has 2 fields on the parent: brandName (row 0) and legalText (row 1)
  // The item rows start from row 2 onwards

  const brandNameRow = rows[0];
  const legalTextRow = rows[1];
  const groupRows = rows.slice(2); // All footer group item rows

  // ─── Step 2: Extract the values ─────────────────────────────────────────────
  const brandName = brandNameRow?.querySelector('div')?.textContent?.trim() || '';
  const legalHTML = legalTextRow?.querySelector('div')?.innerHTML || '';

  // ─── Step 3: Build the new footer DOM ───────────────────────────────────────
  block.innerHTML = ''; // Clear the raw EDS output

  // Brand row
  if (brandName) {
    const brandEl = document.createElement('div');
    brandEl.className = 'footer-brand';
    brandEl.textContent = brandName;
    block.appendChild(brandEl);
  }

  // Columns container
  const columnsEl = document.createElement('div');
  columnsEl.className = 'footer-columns';

  groupRows.forEach((row) => {
    // Each group item row has 2 columns: groupTitle and links (richtext)
    const cols = [...row.querySelectorAll(':scope > div')];
    const groupTitle = cols[0]?.textContent?.trim() || '';
    const linksHTML = cols[1]?.innerHTML || '';

    if (!groupTitle && !linksHTML) return; // skip empty rows

    // Build a column
    const colEl = document.createElement('div');
    colEl.className = 'footer-column';

    // Group heading
    const headingEl = document.createElement('h3');
    headingEl.className = 'footer-column-title';
    headingEl.textContent = groupTitle;
    colEl.appendChild(headingEl);

    // Links — the richtext already contains <ul><li><a>...</a></li></ul>
    // including nested <ul> for sublinks. We just inject it and add classes.
    const linksWrapper = document.createElement('div');
    linksWrapper.className = 'footer-links';
    linksWrapper.innerHTML = linksHTML;

    // Add classes to top-level list and nested sublists
    const topList = linksWrapper.querySelector(':scope > ul');
    if (topList) {
      topList.className = 'footer-link-list';
      // Mark each <li> that has a nested list as a "has-sublinks" item
      topList.querySelectorAll('li').forEach((li) => {
        const subList = li.querySelector('ul');
        if (subList) {
          li.classList.add('has-sublinks');
          subList.className = 'footer-sublink-list';
        }
      });
    }

    colEl.appendChild(linksWrapper);
    columnsEl.appendChild(colEl);
  });

  block.appendChild(columnsEl);

  // Legal text row
  if (legalHTML) {
    const legalEl = document.createElement('div');
    legalEl.className = 'footer-legal';
    legalEl.innerHTML = legalHTML;
    block.appendChild(legalEl);
  }
}
