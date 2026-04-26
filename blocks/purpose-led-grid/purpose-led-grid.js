import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');

  [...block.children].forEach((row, i) => {
    const [imageCell, altTextCell, linkCell, descriptionCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-md-6', 'aos-init', 'aos-animate');
    col.setAttribute('data-aos-easing', 'ease-in-out');
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', `${700 + i * 100}`); // Add a slight delay variation

    const cardWrap = document.createElement('a');
    cardWrap.classList.add('card-wrap');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardWrap.href = foundLink.href;
      cardWrap.target = '_blank'; // From original HTML
    }
    moveInstrumentation(row, cardWrap);

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const altText = altTextCell.textContent.trim();
        const optimizedPic = createOptimizedPicture(img.src, altText, false, [
          { media: '(max-width: 576px)', width: '750' }, // Example breakpoint for mobile
          { width: '750' },
        ]);
        // Copy img-fluid class from original HTML
        const optimizedImg = optimizedPic.querySelector('img');
        if (optimizedImg) {
          optimizedImg.classList.add('img-fluid');
        }
        moveInstrumentation(img, optimizedImg);
        cardImage.append(optimizedPic);
      }
    }

    const cardText = document.createElement('div');
    cardText.classList.add('card-text');

    const desc = document.createElement('p');
    desc.classList.add('desc');
    desc.innerHTML = descriptionCell.innerHTML; // Use innerHTML for richtext

    cardText.append(desc);
    cardWrap.append(cardImage, cardText);
    col.append(cardWrap);
    wrapper.append(col);
  });

  block.innerHTML = '';
  block.append(wrapper);
}
