import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    titleCell,
    actionCell,
    inputNameCell,
    placeholderCell,
    submitLabelCell,
    submitIconCell,
  ] = [...block.children];

  const aside = document.createElement('aside');
  aside.classList.add('uol-c-hero-search', 'uol-c-hero-search--tone-cloud');
  aside.setAttribute('data-testid', 'uol-c-hero-search');

  const form = document.createElement('form');
  form.classList.add(
    'uol-c-form',
    'uol-c-hero-search__form',
    'xl:uol-l-contain--lock',
    'uol-l-stack'
  );
  form.method = 'get';
  form.action = actionCell?.querySelector('a')?.href || '#';
  form.setAttribute('data-testid', 'uol-c-hero-search-form');

  const formGroup = document.createElement('div');
  formGroup.classList.add(
    'uol-c-form-group',
    'uol-c-form-group--horizontal',
    'uol-c-form-group--fill',
    'uol-c-hero-search__input'
  );
  formGroup.setAttribute('data-testid', 'uol-c-hero-search-input');

  const formGroupLabelDiv = document.createElement('div');
  formGroupLabelDiv.classList.add('uol-c-form-group__label');

  const label = document.createElement('label');
  label.htmlFor = 'uol-c-hero-search-input-field';
  label.classList.add(
    'uol-c-form-label',
    'uol-c-hero-search__label',
    'uol-u-heading-3'
  );
  label.setAttribute('data-testid', 'uol-c-hero-search-label');
  label.textContent = titleCell?.textContent.trim() || '';
  moveInstrumentation(titleCell, label);
  formGroupLabelDiv.append(label);

  const formGroupFields = document.createElement('div');
  formGroupFields.classList.add('uol-c-form-group__fields');

  const formGroupInputs = document.createElement('div');
  formGroupInputs.classList.add('uol-c-form-group__inputs');

  const input = document.createElement('input');
  input.id = 'uol-c-hero-search-input-field';
  input.type = 'search';
  input.name = inputNameCell?.textContent.trim() || '';
  input.placeholder = placeholderCell?.textContent.trim() || '';
  input.classList.add(
    'uol-c-form-input',
    'uol-c-form-input--rounded-start'
  );
  input.setAttribute('data-testid', 'uol-c-hero-search-input-field');
  input.setAttribute('data-size', 'no size');
  moveInstrumentation(inputNameCell, input);
  moveInstrumentation(placeholderCell, input);
  formGroupInputs.append(input);

  const formGroupActions = document.createElement('div');
  formGroupActions.classList.add('uol-c-form-group__actions');

  const button = document.createElement('button');
  button.type = 'submit';
  button.classList.add(
    'uol-c-button',
    'is-icon-only',
    'is-icon-end',
    'uol-c-button--rounded',
    'uol-c-button--rounded-inline-end',
    'uol-c-hero-search__submit'
  );
  button.setAttribute('data-testid', 'uol-c-hero-search-submit');

  const buttonLabel = document.createElement('span');
  buttonLabel.classList.add('uol-c-button__label', 'uol-u-visually-hidden');
  buttonLabel.setAttribute('data-testid', 'uol-c-button-label');
  buttonLabel.textContent = submitLabelCell?.textContent.trim() || '';
  moveInstrumentation(submitLabelCell, buttonLabel);

  const buttonIcon = document.createElement('span');
  buttonIcon.classList.add('uol-c-button__icon');
  buttonIcon.setAttribute('data-testid', 'uol-c-button-icon');

  const img = submitIconCell?.querySelector('img');
  if (img) {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    buttonIcon.append(optimizedPic);
  }
  moveInstrumentation(submitIconCell, buttonIcon);

  button.append(buttonLabel, buttonIcon);
  formGroupActions.append(button);

  formGroupFields.append(formGroupInputs, formGroupActions);
  formGroup.append(formGroupLabelDiv, formGroupFields);
  form.append(formGroup);
  aside.append(form);

  block.innerHTML = '';
  block.append(aside);
}
