import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    minLengthCell,
    resultsDesktopSizeCell,
    resultsMobileSizeCell,
    inputPlaceholderCell,
    noResultsTitleCell,
    noResultsDescriptionCell,
    formActionCell,
    searchRootCell,
    ...categoryRows
  ] = [...block.children];

  const minLength = minLengthCell?.textContent.trim() || '3';
  const resultsDesktopSize = resultsDesktopSizeCell?.textContent.trim() || '8';
  const resultsMobileSize = resultsMobileSizeCell?.textContent.trim() || '5';
  const inputPlaceholder = inputPlaceholderCell?.textContent.trim() || 'Search';
  const noResultsTitle = noResultsTitleCell?.textContent.trim() || 'Sorry, we cannot find what you are looking for :(';
  const noResultsDescription = noResultsDescriptionCell?.textContent.trim() || 'Please try a new search term or browse through one of our product categories.';
  const formAction = formActionCell?.querySelector('a')?.href || '';
  const searchRoot = searchRootCell?.textContent.trim() || '';

  const categories = categoryRows.map((row) => {
    const [categoryNameCell, categoryURLCell] = [...row.children];
    return {
      categoryName: categoryNameCell?.textContent.trim() || '',
      categoryURL: categoryURLCell?.querySelector('a')?.href || '',
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
  section.setAttribute('data-cmp-min-length', minLength);
  section.setAttribute('data-cmp-results-desktop-size', resultsDesktopSize);
  section.setAttribute('data-cmp-results-mobile-size', resultsMobileSize);
  section.setAttribute('data-error-response', JSON.stringify(errorResponse));
  section.setAttribute('data-input-placeholder', inputPlaceholder);

  const infoDiv = document.createElement('div');
  infoDiv.classList.add('cmp_search__info');
  infoDiv.setAttribute('aria-live', 'polite');
  infoDiv.setAttribute('role', 'status');
  section.append(infoDiv);

  const form = document.createElement('form');
  form.classList.add('cmp-search__form');
  form.setAttribute('data-cmp-hook-search', 'form');
  form.setAttribute('method', 'get');
  form.setAttribute('action', formAction);
  form.setAttribute('autocomplete', 'off');
  section.append(form);

  const hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('id', 'searchroot');
  hiddenInput.setAttribute('name', 'searchroot');
  hiddenInput.setAttribute('value', searchRoot);
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
  input.setAttribute('placeholder', inputPlaceholder);
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
  scriptTemplate.textContent = `
    <a class="cmp-search__item" data-cmp-hook-search="item" role="option" aria-selected="false">
        <span class="cmp-search__item-title" data-cmp-hook-search="itemTitle"></span>
    </a>
  `;
  section.append(scriptTemplate);

  moveInstrumentation(block, section);
  block.innerHTML = '';
  block.append(section);
}
