import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...faqItemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  if (headingRow) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');
    moveInstrumentation(headingRow, sectionHeader);

    // CRITICAL FIX: Use content detection instead of row.children[0]
    // The heading cell is the only cell in the headingRow, so we can find it.
    const headingCell = [...headingRow.children].find(cell => cell.textContent.trim());

    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.textContent = headingCell?.textContent.trim() || ''; // Use the detected cell
    sectionHeader.append(heading);
    container.append(sectionHeader);
  }

  if (faqItemRows.length > 0) {
    const accoDiv = document.createElement('div');
    accoDiv.classList.add('acco-div');
    container.append(accoDiv);

    const ul = document.createElement('ul');
    accoDiv.append(ul);

    faqItemRows.forEach((row, index) => {
      // Correctly destructuring cells for faq-item
      const [questionCell, answerCell] = [...row.children];

      const li = document.createElement('li');
      li.classList.add('aos-init', 'aos-animate');
      if (index === 0) {
        li.classList.add('active');
      }
      moveInstrumentation(row, li);
      ul.append(li);

      const h2 = document.createElement('h2');
      h2.textContent = questionCell?.textContent.trim() || '';
      h2.setAttribute('data-once', 'faqsAccordion');
      li.append(h2);

      const accoContentDiv = document.createElement('div');
      accoContentDiv.classList.add('acco-content-div');
      if (index === 0) {
        accoContentDiv.classList.add('show');
      }
      // Correctly using innerHTML for richtext field 'answer'
      accoContentDiv.innerHTML = answerCell?.innerHTML || '';
      li.append(accoContentDiv);

      h2.addEventListener('click', () => {
        const currentlyActive = ul.querySelector('li.active');
        if (currentlyActive && currentlyActive !== li) {
          currentlyActive.classList.remove('active');
          currentlyActive.querySelector('.acco-content-div').classList.remove('show');
        }

        li.classList.toggle('active');
        accoContentDiv.classList.toggle('show');
      });
    });
  }

  block.innerHTML = '';
  block.append(section);

  // Image optimization (if any images were present, though not in this specific block)
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
