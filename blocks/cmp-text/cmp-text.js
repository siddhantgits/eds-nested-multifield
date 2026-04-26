import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Check 0 & 1: The block structure indicates a single row with a single richtext cell.
  // The original JS uses textRow.firstElementChild, which is acceptable here
  // because there's only one cell in the row per the EDS structure.
  // However, for robustness and consistency with best practices, we'll use destructuring.
  const [row] = [...block.children];

  if (row) {
    // Check 0: No row.children[n] violation, but using destructuring is clearer.
    const [textCell] = [...row.children];

    if (textCell) {
      // Check 1.5: Richtext field handling.
      // The model specifies 'richtext', so we must use innerHTML to preserve formatting.
      // The original JS was moving children, which is correct for preserving HTML.
      // We need to ensure the classes from the original HTML are applied to the content.

      const contentDiv = document.createElement('div');
      // The original HTML shows classes applied directly to the block wrapper.
      // We will apply the relevant content classes to the contentDiv for better structure
      // and to match the visual presentation implied by the original HTML.
      // The class 'cmp-text__content' was invented; we must use classes from ORIGINAL HTML.
      // The ORIGINAL HTML shows 'c-link', 'paddingTop40', 'paddingBottom40', 'mobile-padding14'
      // directly on the outer div, which becomes 'block' in decorate.
      // We should apply these to the block itself or a wrapper that replaces the row.
      // Given the original HTML structure, the content itself is directly inside the block.
      // So, the classes should be applied to the block or a direct wrapper of the content.

      // The block itself already has 'cmp-text'. We need to add 'c-link', 'paddingTop40',
      // 'paddingBottom40', 'mobile-padding14' to the block.
      block.classList.add('c-link', 'paddingTop40', 'paddingBottom40', 'mobile-padding14');

      // Move the content from the original cell to the new div.
      // The original cell's content is the richtext.
      moveInstrumentation(textCell, contentDiv);
      while (textCell.firstChild) {
        contentDiv.append(textCell.firstChild);
      }

      // Replace the original row with the new content div.
      // The original HTML structure implies the <p> is directly inside the block.
      // So, we should replace the row with the contentDiv, and the block will contain it.
      row.replaceWith(contentDiv);
    }
  }

  // Check 2: Interactivity.
  // The ORIGINAL HTML does not show any interactive elements (buttons, toggles, etc.)
  // beyond standard links which are part of the richtext content.
  // No event listeners are needed for this simple text block.

  // Optimize images within the block if any exist (though not expected for a simple text block)
  // This part is generally good practice but not strictly necessary for this specific block type.
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
