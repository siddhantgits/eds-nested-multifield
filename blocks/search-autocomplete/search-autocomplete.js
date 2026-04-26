import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    closeIconCell,
    closeLabelCell,
    formActionCell,
    formInputNameCell,
    formInputPlaceholderCell,
    formSubmitLabelCell,
    clearLabelCell,
    trendingTitleCell,
    ...itemRows
  ] = [...block.children];

  block.innerHTML = '';
  block.id = 'search-autocomplete';
  block.setAttribute('aria-label', 'Search Autocomplete Module');

  const overlay = document.createElement('div');
  overlay.classList.add('search-autocomplete--overlay');
  block.append(overlay);

  const closeButton = document.createElement('button');
  closeButton.classList.add('search-autocomplete--close');
  closeButton.setAttribute('aria-label', closeLabelCell?.textContent.trim() || 'Close Search Overlay');
  const closeIconPicture = closeIconCell?.querySelector('picture');
  if (closeIconPicture) {
    const img = closeIconPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '32' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    closeButton.append(optimizedPic);
  }
  block.append(closeButton);

  const autocompleteBlock = document.createElement('div');
  autocompleteBlock.classList.add('search-autocomplete--block');
  block.append(autocompleteBlock);

  const container = document.createElement('div');
  container.classList.add('search-autocomplete--container');
  autocompleteBlock.append(container);

  const formPlaceholder = document.createElement('div');
  formPlaceholder.classList.add('search-autocomplete--form-placeholder');
  container.append(formPlaceholder);

  const viewsElementContainer = document.createElement('div');
  viewsElementContainer.classList.add('views-element-container');
  formPlaceholder.append(viewsElementContainer);

  const formWrapperDiv = document.createElement('div');
  formWrapperDiv.classList.add('js-view-dom-id-46d6f72dfc8314ee11e2c562c2cc1a5558346396fef1714972cb763744aa435b');
  viewsElementContainer.append(formWrapperDiv);

  const form = document.createElement('form');
  form.classList.add('views-exposed-form');
  form.setAttribute('data-drupal-selector', 'views-exposed-form-solr-search-block-1');
  form.action = formActionCell?.textContent.trim() || '#';
  form.method = 'get';
  form.id = 'views-exposed-form-solr-search-block-1';
  form.setAttribute('accept-charset', 'UTF-8');
  formWrapperDiv.append(form);

  const formItem = document.createElement('div');
  formItem.classList.add(
    'js-form-item',
    'form-item',
    'js-form-type-search-api-autocomplete',
    'form-item-search-term',
    'js-form-item-search-term',
    'form-no-label',
  );
  form.append(formItem);

  const input = document.createElement('input');
  input.classList.add('form-autocomplete', 'form-text', 'ui-autocomplete-input');
  input.setAttribute('data-drupal-selector', 'edit-search-term');
  input.setAttribute('data-search-api-autocomplete-search', 'solr_search');
  input.setAttribute('data-autocomplete-path', '/in/search_api_autocomplete/solr_search?display=block_1&&filter=search_term');
  input.type = 'text';
  input.id = 'edit-search-term';
  input.name = formInputNameCell?.textContent.trim() || 'search_term';
  input.value = '';
  input.size = '30';
  input.maxLength = '128';
  input.setAttribute('data-once', 'autocomplete search-api-autocomplete');
  input.autocomplete = 'off';
  input.placeholder = formInputPlaceholderCell?.textContent.trim() || '';
  formItem.append(input);

  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.classList.add('refresh-search-input-icon');
  clearButton.setAttribute('aria-label', clearLabelCell?.textContent.trim() || 'Clear Search');
  formItem.append(clearButton);

  const formActions = document.createElement('div');
  formActions.classList.add('form-actions', 'js-form-wrapper', 'form-wrapper');
  formActions.setAttribute('data-drupal-selector', 'edit-actions');
  formActions.id = 'edit-actions';
  form.append(formActions);

  const submitButton = document.createElement('input');
  submitButton.disabled = true;
  submitButton.setAttribute('data-drupal-selector', 'edit-submit-solr-search');
  submitButton.type = 'submit';
  submitButton.id = 'edit-submit-solr-search';
  submitButton.value = formSubmitLabelCell?.textContent.trim() || 'Apply';
  submitButton.classList.add('button', 'js-form-submit', 'form-submit', 'is-disabled');
  formActions.append(submitButton);

  const trendPlaceholder = document.createElement('div');
  trendPlaceholder.classList.add('search-autocomplete--trend-placeholder');
  container.append(trendPlaceholder);

  const searchSuggestionSection = document.createElement('section');
  searchSuggestionSection.classList.add('grid-container', 'search-suggestion');
  searchSuggestionSection.setAttribute('aria-label', 'Search Suggestion Module');
  trendPlaceholder.append(searchSuggestionSection);

  const suggestionWrapper = document.createElement('div');
  suggestionWrapper.classList.add('padding-x', 'search-suggestion--wrapper');
  searchSuggestionSection.append(suggestionWrapper);

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x', 'max-width-container');
  suggestionWrapper.append(gridX);

  const suggestionCell = document.createElement('div');
  suggestionCell.classList.add('cell', 'small-12', 'large-offset-1', 'large-10', 'search-suggestion--cell');
  gridX.append(suggestionCell);

  const trendingTitleSpan = document.createElement('span');
  trendingTitleSpan.classList.add('search-suggestion--title', 'utilityTagHighCaps', 'suggestion-item');
  trendingTitleSpan.textContent = trendingTitleCell?.textContent.trim() || '';
  suggestionCell.append(trendingTitleSpan);

  const trendingList = document.createElement('ul');
  trendingList.classList.add('search-suggestion--list');
  suggestionCell.append(trendingList);

  itemRows.forEach((row) => {
    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a')); // Find cell with an anchor for the link
    const labelCell = cells.find(cell => !cell.querySelector('a')); // Find cell without an anchor for the label

    const listItem = document.createElement('li');
    listItem.classList.add('search-suggestion--list-item', 'suggestion-item');
    trendingList.append(listItem);

    const suggestionBlock = document.createElement('div');
    suggestionBlock.classList.add('search-suggestion--block');
    listItem.append(suggestionBlock);

    const link = document.createElement('a');
    link.classList.add('search-suggestion--link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }
    moveInstrumentation(linkCell, link); // Move instrumentation from link cell to new link element
    suggestionBlock.append(link);

    const labelSpan = document.createElement('span');
    labelSpan.classList.add('search-suggestion--label', 'bodyMediumRegular');
    labelSpan.textContent = labelCell?.textContent.trim() || '';
    link.append(labelSpan);
  });

  // Event listeners for interactivity
  let isAutocompleteOpen = false;

  const openAutocomplete = () => {
    block.classList.add('is-active');
    document.body.classList.add('search-autocomplete-active');
    isAutocompleteOpen = true;
    // Reset input and clear button state when opening
    input.value = '';
    clearButton.classList.remove('active');
    submitButton.disabled = true;
    submitButton.classList.add('is-disabled');
  };

  const closeAutocomplete = () => {
    block.classList.remove('is-active');
    document.body.classList.remove('search-autocomplete-active');
    isAutocompleteOpen = false;
  };

  // Example trigger (you might need to adapt this based on how the search is triggered in the original site)
  // For demonstration, let's assume there's a global search icon that opens this.
  // In a real scenario, you'd find the actual trigger element from the DOM.
  // const globalSearchTrigger = document.querySelector('.some-global-search-icon');
  // if (globalSearchTrigger) {
  //   globalSearchTrigger.addEventListener('click', openAutocomplete);
  // }

  closeButton.addEventListener('click', closeAutocomplete);
  overlay.addEventListener('click', closeAutocomplete);

  input.addEventListener('input', () => {
    if (input.value.trim()) {
      clearButton.classList.add('active');
      submitButton.disabled = false;
      submitButton.classList.remove('is-disabled');
    } else {
      clearButton.classList.remove('active');
      submitButton.disabled = true;
      submitButton.classList.add('is-disabled');
    }
  });

  clearButton.addEventListener('click', () => {
    input.value = '';
    clearButton.classList.remove('active');
    submitButton.disabled = true;
    submitButton.classList.add('is-disabled');
    input.focus();
  });

  // Expose methods to open/close the autocomplete from outside the block
  block.open = openAutocomplete;
  block.close = closeAutocomplete;
  block.isOpen = () => isAutocompleteOpen;
}
