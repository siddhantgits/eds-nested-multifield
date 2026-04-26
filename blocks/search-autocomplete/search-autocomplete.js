import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    closeIconCell,
    searchActionCell,
    searchInputNameCell,
    searchInputLabelCell,
    searchButtonLabelCell,
    trendingTitleCell,
    ...suggestionRows
  ] = [...block.children];

  block.innerHTML = ''; // Clear the block content

  const searchAutocompleteSection = document.createElement('section');
  searchAutocompleteSection.id = 'search-autocomplete';
  searchAutocompleteSection.setAttribute('aria-label', 'Search Autocomplete Module');
  searchAutocompleteSection.classList.add('search-autocomplete');

  const overlay = document.createElement('div');
  overlay.classList.add('search-autocomplete--overlay');
  searchAutocompleteSection.append(overlay);

  const closeButton = document.createElement('button');
  closeButton.classList.add('search-autocomplete--close');
  closeButton.setAttribute('aria-label', 'Close Search Overlay');
  const closeIconPicture = closeIconCell.querySelector('picture');
  if (closeIconPicture) {
    const img = closeIconPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    closeButton.append(optimizedPic);
  }
  searchAutocompleteSection.append(closeButton);

  const searchAutocompleteBlock = document.createElement('div');
  searchAutocompleteBlock.classList.add('search-autocomplete--block');

  const searchAutocompleteContainer = document.createElement('div');
  searchAutocompleteContainer.classList.add('search-autocomplete--container');

  const formPlaceholder = document.createElement('div');
  formPlaceholder.classList.add('search-autocomplete--form-placeholder');

  const viewsElementContainer = document.createElement('div');
  viewsElementContainer.classList.add('views-element-container');

  const viewDomIdDiv = document.createElement('div');
  viewDomIdDiv.classList.add('js-view-dom-id-46d6f72dfc8314ee11e2c562c2cc1a5558346396fef1714972cb763744aa435b');

  const searchForm = document.createElement('form');
  searchForm.classList.add('views-exposed-form');
  searchForm.setAttribute('data-drupal-selector', 'views-exposed-form-solr-search-block-1');
  searchForm.action = searchActionCell.textContent.trim();
  searchForm.method = 'get';
  searchForm.id = 'views-exposed-form-solr-search-block-1';
  searchForm.setAttribute('accept-charset', 'UTF-8');

  const formItem = document.createElement('div');
  formItem.classList.add(
    'js-form-item',
    'form-item',
    'js-form-type-search-api-autocomplete',
    'form-item-search-term',
    'js-form-item-search-term',
    'form-no-label',
  );

  const searchInput = document.createElement('input');
  searchInput.classList.add('form-autocomplete', 'form-text', 'ui-autocomplete-input');
  searchInput.setAttribute('data-drupal-selector', 'edit-search-term');
  searchInput.setAttribute('data-search-api-autocomplete-search', 'solr_search');
  searchInput.setAttribute('data-autocomplete-path', '/in/search_api_autocomplete/solr_search?display=block_1&&filter=search_term');
  searchInput.type = 'text';
  searchInput.id = 'edit-search-term';
  searchInput.name = searchInputNameCell.textContent.trim();
  searchInput.value = '';
  searchInput.size = '30';
  searchInput.maxLength = '128';
  searchInput.setAttribute('data-once', 'autocomplete search-api-autocomplete');
  searchInput.setAttribute('autocomplete', 'off');
  searchInput.setAttribute('aria-label', searchInputLabelCell.textContent.trim());

  const refreshSearchInputIcon = document.createElement('button');
  refreshSearchInputIcon.type = 'button';
  refreshSearchInputIcon.classList.add('refresh-search-input-icon');
  refreshSearchInputIcon.setAttribute('aria-label', 'Clear Search');

  formItem.append(searchInput, refreshSearchInputIcon);

  const formActions = document.createElement('div');
  formActions.classList.add('form-actions', 'js-form-wrapper', 'form-wrapper');
  formActions.setAttribute('data-drupal-selector', 'edit-actions');
  formActions.id = 'edit-actions';

  const submitButton = document.createElement('input');
  submitButton.disabled = true;
  submitButton.setAttribute('data-drupal-selector', 'edit-submit-solr-search');
  submitButton.type = 'submit';
  submitButton.id = 'edit-submit-solr-search';
  submitButton.value = searchButtonLabelCell.textContent.trim();
  submitButton.classList.add('button', 'js-form-submit', 'form-submit', 'is-disabled');

  formActions.append(submitButton);
  searchForm.append(formItem, formActions);
  viewDomIdDiv.append(searchForm);
  viewsElementContainer.append(viewDomIdDiv);
  formPlaceholder.append(viewsElementContainer);
  searchAutocompleteContainer.append(formPlaceholder);

  const trendPlaceholder = document.createElement('div');
  trendPlaceholder.classList.add('search-autocomplete--trend-placeholder');

  const searchSuggestionSection = document.createElement('section');
  searchSuggestionSection.classList.add('grid-container', 'search-suggestion');
  searchSuggestionSection.setAttribute('aria-label', 'Search Suggestion Module');

  const paddingXWrapper = document.createElement('div');
  paddingXWrapper.classList.add('padding-x', 'search-suggestion--wrapper');

  const gridXMaxWidthContainer = document.createElement('div');
  gridXMaxWidthContainer.classList.add('grid-x', 'max-width-container');

  const searchSuggestionCell = document.createElement('div');
  searchSuggestionCell.classList.add(
    'cell',
    'small-12',
    'large-offset-1',
    'large-10',
    'search-suggestion--cell',
  );

  const trendingTitleSpan = document.createElement('span');
  trendingTitleSpan.classList.add('search-suggestion--title', 'utilityTagHighCaps', 'suggestion-item');
  trendingTitleSpan.textContent = trendingTitleCell.textContent.trim();
  searchSuggestionCell.append(trendingTitleSpan);

  const suggestionList = document.createElement('ul');
  suggestionList.classList.add('search-suggestion--list');

  suggestionRows.forEach((row) => {
    // Correctly destructure item row cells
    const [labelCell, linkCell] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('search-suggestion--list-item', 'suggestion-item');

    const suggestionBlock = document.createElement('div');
    suggestionBlock.classList.add('search-suggestion--block');

    const link = document.createElement('a');
    link.classList.add('search-suggestion--link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }

    const labelSpan = document.createElement('span');
    labelSpan.classList.add('search-suggestion--label', 'bodyMediumRegular');
    labelSpan.textContent = labelCell.textContent.trim();

    link.append(labelSpan);
    suggestionBlock.append(link);
    moveInstrumentation(row, listItem); // Move instrumentation from original row to new li
    listItem.append(suggestionBlock);
    suggestionList.append(listItem);
  });

  searchSuggestionCell.append(suggestionList);
  gridXMaxWidthContainer.append(searchSuggestionCell);
  paddingXWrapper.append(gridXMaxWidthContainer);
  searchSuggestionSection.append(paddingXWrapper);
  trendPlaceholder.append(searchSuggestionSection);

  searchAutocompleteBlock.append(searchAutocompleteContainer, trendPlaceholder);
  searchAutocompleteSection.append(searchAutocompleteBlock);

  block.append(searchAutocompleteSection);

  // Add event listeners for interactivity
  const toggleSearch = () => {
    searchAutocompleteSection.classList.toggle('active');
    document.body.classList.toggle('search-overlay-active'); // Toggle class on body
  };

  closeButton.addEventListener('click', toggleSearch);
  overlay.addEventListener('click', toggleSearch);

  // Clear search input functionality
  refreshSearchInputIcon.addEventListener('click', () => {
    searchInput.value = '';
    submitButton.disabled = true;
  });

  searchInput.addEventListener('input', () => {
    submitButton.disabled = searchInput.value.trim() === '';
  });
}
