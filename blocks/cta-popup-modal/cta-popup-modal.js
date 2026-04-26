import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [buttonLinkCell, buttonLabelCell, buttonAriaLabelCell, modalIdCell, modalContentCell] = [...block.children];

  // Create the trigger button (<a> styled as button)
  const ctaPopup = document.createElement('a');
  ctaPopup.classList.add('cta-popup', 'right-icon');
  const foundButtonLink = buttonLinkCell.querySelector('a');
  if (foundButtonLink) {
    ctaPopup.href = foundButtonLink.href; // Correctly read href from aem-content cell
  } else {
    ctaPopup.href = '#';
  }
  ctaPopup.role = 'button';
  ctaPopup.setAttribute('aria-label', buttonAriaLabelCell?.textContent.trim() || '');
  ctaPopup.setAttribute('data-bs-toggle', 'modal'); // Added for Bootstrap compatibility

  const button = document.createElement('button');
  button.classList.add('cta-btn', 'blue', 'right-icon');
  button.tabIndex = -1;
  const span = document.createElement('span');
  span.textContent = buttonLabelCell?.textContent.trim() || '';
  button.append(span);
  ctaPopup.append(button);

  // Create the modal
  const modal = document.createElement('div');
  modal.classList.add('modal', 'fade');
  const modalId = modalIdCell?.textContent.trim();
  if (modalId) {
    modal.id = modalId;
    ctaPopup.setAttribute('data-bs-target', `#${modalId}`);
  }
  modal.role = 'dialog';
  modal.setAttribute('data-backdrop', 'false');

  const modalDialog = document.createElement('div');
  modalDialog.classList.add('modal-dialog', 'modal-dialog-centered');
  modal.append(modalDialog);

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  modalDialog.append(modalContent);

  const closeButton = document.createElement('a');
  closeButton.classList.add('close', 'col-12');
  closeButton.href = '#';
  closeButton.setAttribute('aria-label', 'close');
  closeButton.role = 'button';
  closeButton.textContent = '×';
  closeButton.setAttribute('data-bs-dismiss', 'modal'); // Added for Bootstrap compatibility
  modalContent.append(closeButton);

  const ctaModalPopup = document.createElement('div');
  ctaModalPopup.classList.add('cta-modal-popup');
  ctaModalPopup.innerHTML = modalContentCell?.innerHTML || '';
  modalContent.append(ctaModalPopup);

  // Event listeners for modal functionality
  ctaPopup.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('show');
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('role', 'dialog');
  });

  closeButton.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
    modal.removeAttribute('aria-modal');
    modal.removeAttribute('role');
  });

  // Close modal when clicking outside of modal-dialog
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      modal.removeAttribute('aria-modal');
      modal.removeAttribute('role');
    }
  });

  // Append new elements to the block
  block.innerHTML = '';
  moveInstrumentation(buttonLinkCell, ctaPopup); // Move instrumentation from first cell to the trigger
  block.append(ctaPopup, modal);

  // Image optimization for any images within the modal content
  ctaModalPopup.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
