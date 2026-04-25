import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    closeIconCell,
    formActionCell,
    searchInputNameCell,
    searchInputPlaceholderCell,
    searchInputAutocompletePathCell,
    submitLabelCell,
    trendingTitleCell,
    ...suggestionRows
  ] = [...block.children];

  // Create main section and overlay
  const section = document.createElement('section');
  section.classList.add('search-autocomplete');
  section.id = 'search-autocomplete';
  section.setAttribute('aria-label', 'Search Autocomplete Module');

  const overlay = document.createElement('div');
  overlay.classList.add('search-autocomplete--overlay');
  section.append(overlay);

  // Close button
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
  section.append(closeButton);

  // Main block container
  const searchBlock = document.createElement('div');
  searchBlock.classList.add('search-autocomplete--block');
  const container = document.createElement('div');
  container.classList.add('search-autocomplete--container');
  searchBlock.append(container);
  section.append(searchBlock);

  // Search form placeholder
  const formPlaceholder = document.createElement('div');
  formPlaceholder.classList.add('search-autocomplete--form-placeholder');
  container.append(formPlaceholder);

  const viewsElementContainer = document.createElement('div');
  viewsElementContainer.classList.add('views-element-container');
  formPlaceholder.append(viewsElementContainer);

  const viewDomIdDiv = document.createElement('div');
  viewDomIdDiv.classList.add('js-view-dom-id-a30a17b3a1bcce0c2b32e08e44b9152f684e8e94669d7643f6a023f98aff7a55');
  viewsElementContainer.append(viewDomIdDiv);

  const form = document.createElement('form');
  form.classList.add('views-exposed-form');
  form.setAttribute('data-drupal-selector', 'views-exposed-form-solr-search-block-1');
  form.action = formActionCell?.textContent.trim() || '#';
  form.method = 'get';
  form.id = 'views-exposed-form-solr-search-block-1';
  form.setAttribute('accept-charset', 'UTF-8');
  viewDomIdDiv.append(form);

  const formItem = document.createElement('div');
  formItem.classList.add('js-form-item', 'form-item', 'js-form-type-search-api-autocomplete', 'form-item-search-term', 'js-form-item-search-term', 'form-no-label');
  form.append(formItem);

  const searchInput = document.createElement('input');
  searchInput.classList.add('form-autocomplete', 'form-text', 'ui-autocomplete-input');
  searchInput.setAttribute('data-drupal-selector', 'edit-search-term');
  searchInput.setAttribute('data-search-api-autocomplete-search', 'solr_search');
  searchInput.type = 'text';
  searchInput.id = 'edit-search-term';
  searchInput.name = searchInputNameCell?.textContent.trim() || 'search_term';
  searchInput.value = '';
  searchInput.size = '30';
  searchInput.maxLength = '128';
  searchInput.setAttribute('data-once', 'autocomplete search-api-autocomplete');
  searchInput.autocomplete = 'off';
  searchInput.placeholder = searchInputPlaceholderCell?.textContent.trim() || '';
  formItem.append(searchInput);

  const refreshSearchInputIcon = document.createElement('button');
  refreshSearchInputIcon.classList.add('refresh-search-input-icon');
  refreshSearchInputIcon.type = 'button';
  refreshSearchInputIcon.setAttribute('aria-label', 'Clear Search');
  formItem.append(refreshSearchInputIcon);

  const formActions = document.createElement('div');
  formActions.classList.add('form-actions', 'js-form-wrapper', 'form-wrapper');
  formActions.setAttribute('data-drupal-selector', 'edit-actions');
  formActions.id = 'edit-actions';
  form.append(formActions);

  const submitButton = document.createElement('input');
  submitButton.classList.add('button', 'js-form-submit', 'form-submit', 'is-disabled');
  submitButton.setAttribute('data-drupal-selector', 'edit-submit-solr-search');
  submitButton.type = 'submit';
  submitButton.id = 'edit-submit-solr-search';
  submitButton.value = submitLabelCell?.textContent.trim() || 'Apply';
  submitButton.disabled = true;
  formActions.append(submitButton);

  // Trending placeholder
  const trendPlaceholder = document.createElement('div');
  trendPlaceholder.classList.add('search-autocomplete--trend-placeholder');
  container.append(trendPlaceholder);

  const searchSuggestionSection = document.createElement('section');
  searchSuggestionSection.classList.add('grid-container', 'search-suggestion');
  searchSuggestionSection.setAttribute('aria-label', 'Search Suggestion Module');
  trendPlaceholder.append(searchSuggestionSection);

  const paddingXWrapper = document.createElement('div');
  paddingXWrapper.classList.add('padding-x', 'search-suggestion--wrapper');
  searchSuggestionSection.append(paddingXWrapper);

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x', 'max-width-container');
  paddingXWrapper.append(gridX);

  const suggestionCell = document.createElement('div');
  suggestionCell.classList.add('cell', 'small-12', 'large-offset-1', 'large-10', 'search-suggestion--cell');
  gridX.append(suggestionCell);

  const trendingTitleSpan = document.createElement('span');
  trendingTitleSpan.classList.add('search-suggestion--title', 'utilityTagHighCaps', 'suggestion-item');
  trendingTitleSpan.textContent = trendingTitleCell?.textContent.trim() || '';
  suggestionCell.append(trendingTitleSpan);

  const suggestionList = document.createElement('ul');
  suggestionList.classList.add('search-suggestion--list');
  suggestionCell.append(suggestionList);

  // Trending suggestions
  suggestionRows.forEach((row) => {
    // Corrected: Use destructuring for row.children
    const [linkCell, labelCell] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('search-suggestion--list-item', 'suggestion-item');
    suggestionList.append(listItem);

    const suggestionBlock = document.createElement('div');
    suggestionBlock.classList.add('search-suggestion--block');
    listItem.append(suggestionBlock);

    const linkAnchor = document.createElement('a');
    linkAnchor.classList.add('search-suggestion--link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkAnchor.href = foundLink.href;
    }
    suggestionBlock.append(linkAnchor);

    const labelSpan = document.createElement('span');
    labelSpan.classList.add('search-suggestion--label', 'bodyMediumRegular');
    labelSpan.textContent = labelCell?.textContent.trim() || '';
    linkAnchor.append(labelSpan);

    moveInstrumentation(row, listItem);
  });

  // Replace the original block with the new section
  block.replaceWith(section);

  // Event listeners for interaction
  closeButton.addEventListener('click', () => {
    section.classList.remove('active');
    document.body.classList.remove('search-autocomplete-open');
  });

  overlay.addEventListener('click', () => {
    section.classList.remove('active');
    document.body.classList.remove('search-autocomplete-open');
  });

  // Basic autocomplete simulation (for demonstration, EDS doesn't load external JS)
  searchInput.addEventListener('input', () => {
    if (searchInput.value.length > 0) {
      submitButton.disabled = false;
      submitButton.classList.remove('is-disabled');
    } else {
      submitButton.disabled = true;
      submitButton.classList.add('is-disabled');
    }
  });

  refreshSearchInputIcon.addEventListener('click', () => {
    searchInput.value = '';
    submitButton.disabled = true;
    submitButton.classList.add('is-disabled');
  });
}
