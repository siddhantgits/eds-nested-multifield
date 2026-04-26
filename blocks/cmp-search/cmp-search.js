import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    minLengthRow,
    resultsDesktopSizeRow,
    resultsMobileSizeRow,
    noResultsTitleRow,
    noResultsDescriptionRow,
    inputPlaceholderRow,
    searchActionRow,
    ...categoryRows
  ] = [...block.children];

  const minLength = minLengthRow?.firstElementChild?.textContent.trim();
  const resultsDesktopSize = resultsDesktopSizeRow?.firstElementChild?.textContent.trim();
  const resultsMobileSize = resultsMobileSizeRow?.firstElementChild?.textContent.trim();
  const noResultsTitle = noResultsTitleRow?.firstElementChild?.textContent.trim();
  const noResultsDescription = noResultsDescriptionRow?.firstElementChild?.textContent.trim();
  const inputPlaceholder = inputPlaceholderRow?.firstElementChild?.textContent.trim();
  const searchAction = searchActionRow?.querySelector('a')?.href; // Corrected: aem-content field

  const categories = categoryRows.map((row) => {
    const [categoryNameCell, categoryURLCell] = [...row.children];
    return {
      categoryName: categoryNameCell?.textContent.trim(),
      categoryURL: categoryURLCell?.querySelector('a')?.href, // Corrected: aem-content field
    };
  });

  const errorResponse = {
    noResultsTitle,
    noResultsDescription,
    categories,
  };

  const section = document.createElement('section');
  section.classList.add('cmp-search');
  section.setAttribute('role', 'search');
  if (minLength) section.setAttribute('data-cmp-min-length', minLength);
  if (resultsDesktopSize) section.setAttribute('data-cmp-results-desktop-size', resultsDesktopSize);
  if (resultsMobileSize) section.setAttribute('data-cmp-results-mobile-size', resultsMobileSize);
  section.setAttribute('data-error-response', JSON.stringify(errorResponse));
  if (inputPlaceholder) section.setAttribute('data-input-placeholder', inputPlaceholder);

  moveInstrumentation(block, section);

  const infoDiv = document.createElement('div');
  infoDiv.classList.add('cmp_search__info');
  infoDiv.setAttribute('aria-live', 'polite');
  infoDiv.setAttribute('role', 'status');
  section.append(infoDiv);

  const form = document.createElement('form');
  form.classList.add('cmp-search__form');
  form.setAttribute('data-cmp-hook-search', 'form');
  form.setAttribute('method', 'get');
  form.setAttribute('action', searchAction || '#');
  form.setAttribute('autocomplete', 'off');
  section.append(form);

  const hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('id', 'searchroot');
  hiddenInput.setAttribute('name', 'searchroot');
  // Extract the path from searchAction if it's a full URL, otherwise use default
  const searchRootValue = searchAction ? new URL(searchAction).pathname.split('.customsearchresults.json')[0] : '/content/itc-foods-brands/aashirvaad/us/en';
  hiddenInput.setAttribute('value', searchRootValue);
  form.append(hiddenInput);

  const fieldDiv = document.createElement('div');
  fieldDiv.classList.add('cmp-search__field');
  form.append(fieldDiv);

  const icon = document.createElement('i');
  icon.classList.add('cmp-search__icon');
  icon.setAttribute('data-cmp-hook-search', 'icon');
  fieldDiv.append(icon);

  const loadingIndicator = document.createElement('span');
  loadingIndicator.classList.add('cmp-search__loading-indicator');
  loadingIndicator.setAttribute('data-cmp-hook-search', 'loadingIndicator');
  fieldDiv.append(loadingIndicator);

  const input = document.createElement('input');
  input.classList.add('cmp-search__input');
  input.setAttribute('data-cmp-hook-search', 'input');
  input.setAttribute('type', 'text');
  input.setAttribute('name', 'fulltext');
  input.setAttribute('placeholder', inputPlaceholder || 'Search');
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-haspopup', 'true');
  input.setAttribute('aria-invalid', 'false');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-owns', 'cmp-search-results-0');
  fieldDiv.append(input);

  const clearButton = document.createElement('button');
  clearButton.classList.add('cmp-search__clear');
  clearButton.setAttribute('data-cmp-hook-search', 'clear');
  clearButton.setAttribute('aria-label', 'Clear');
  fieldDiv.append(clearButton);

  const clearIcon = document.createElement('i');
  clearIcon.classList.add('cmp-search__clear-icon');
  clearButton.append(clearIcon);

  const resultsDiv = document.createElement('div');
  resultsDiv.classList.add('cmp-search__results');
  resultsDiv.setAttribute('aria-label', 'Search results');
  resultsDiv.setAttribute('data-cmp-hook-search', 'results');
  resultsDiv.setAttribute('role', 'listbox');
  resultsDiv.setAttribute('aria-multiselectable', 'false');
  resultsDiv.setAttribute('id', 'cmp-search-results-0');
  section.append(resultsDiv);

  const scriptTemplate = document.createElement('script');
  scriptTemplate.setAttribute('data-cmp-hook-search', 'itemTemplate');
  scriptTemplate.setAttribute('type', 'x-template');
  scriptTemplate.innerHTML = `
    <a class="cmp-search__item" data-cmp-hook-search="item" role="option" aria-selected="false">
        <span class="cmp-search__item-title" data-cmp-hook-search="itemTitle"></span>
    </a>
  `;
  section.append(scriptTemplate);

  block.innerHTML = '';
  block.append(section);
}
