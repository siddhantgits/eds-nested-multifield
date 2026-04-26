import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [viewInRowRow, titleRow, currentPageRow, totalPageRow, ...cardRows] = [...block.children];

  block.innerHTML = ''; // Clear the block content

  const railsComp = document.createElement('div');
  railsComp.classList.add('tml-comp', 'rails-comp');
  // Add dynamic class based on viewInRow content
  const viewInRowText = viewInRowRow?.firstElementChild?.textContent?.trim();
  if (viewInRowText) {
    railsComp.classList.add(viewInRowText.replace(/\s/g, ''));
  }
  railsComp.setAttribute('initializer', 'RailsComp');
  moveInstrumentation(viewInRowRow, railsComp); // Move instrumentation from first row

  const railsSection = document.createElement('div');
  railsSection.classList.add('rails-section');
  railsComp.append(railsSection);

  if (viewInRowText) {
    const viewInRowP = document.createElement('p');
    viewInRowP.classList.add('view-in-row');
    viewInRowP.textContent = viewInRowText;
    railsSection.append(viewInRowP);
  }

  const titleH4 = document.createElement('h4');
  titleH4.classList.add('rails-title');
  titleH4.textContent = titleRow?.firstElementChild?.textContent?.trim() || '';
  railsSection.append(titleH4);

  const owlCarousel = document.createElement('div');
  owlCarousel.classList.add('owl-carousel', 'owl-loaded', 'owl-drag');
  railsSection.append(owlCarousel);

  const owlStageOuter = document.createElement('div');
  owlStageOuter.classList.add('owl-stage-outer');
  owlCarousel.append(owlStageOuter);

  const owlStage = document.createElement('div');
  owlStage.classList.add('owl-stage');
  owlStageOuter.append(owlStage);

  cardRows.forEach((row) => {
    const [imageCell, titleCell, linkCell] = [...row.children];

    const owlItem = document.createElement('div');
    owlItem.classList.add('owl-item');
    owlStage.append(owlItem);

    const railsCard = document.createElement('div');
    railsCard.classList.add('rails-card');
    owlItem.append(railsCard);

    const railsImg = document.createElement('div');
    railsImg.classList.add('rails-img');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(picture, optimizedPic.querySelector('img'));
        railsImg.append(optimizedPic);
      }
    }
    railsCard.append(railsImg);

    const cardDetails = document.createElement('div');
    cardDetails.classList.add('card-details');
    railsCard.append(cardDetails);

    const cardTitle = document.createElement('h6');
    cardTitle.classList.add('rails-card-title');
    cardTitle.textContent = titleCell.textContent.trim();
    cardDetails.append(cardTitle);

    const linkA = document.createElement('a');
    linkA.classList.add('rails-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkA.href = foundLink.href;
      linkA.textContent = foundLink.textContent.trim(); // Use text content from the AEM link
      linkA.setAttribute('aria-label', foundLink.textContent.trim()); // Use text content for aria-label
    } else {
      // Fallback if no link is found, though model implies it should always be there
      linkA.textContent = 'Learn More';
      linkA.setAttribute('aria-label', 'Learn More');
    }
    const arrowIcon = document.createElement('span');
    arrowIcon.classList.add('icon-Arrow-Right-20', 'right-arrow-icon');
    linkA.append(arrowIcon);
    cardDetails.append(linkA);

    moveInstrumentation(row, railsCard);
  });

  const owlNav = document.createElement('div');
  owlNav.classList.add('owl-nav');
  owlCarousel.append(owlNav);

  const prevButton = document.createElement('button');
  prevButton.classList.add('owl-prev');
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('role', 'presentation');
  prevButton.setAttribute('aria-label', 'previous');
  prevButton.innerHTML = '<span class="icon-Arrow-Left"></span>';
  owlNav.append(prevButton);

  const nextButton = document.createElement('button');
  nextButton.classList.add('owl-next');
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('role', 'presentation');
  nextButton.setAttribute('aria-label', 'next');
  nextButton.innerHTML = '<span class="icon-Arrow-Right"></span>';
  owlNav.append(nextButton);

  const owlDots = document.createElement('div');
  owlDots.classList.add('owl-dots');
  owlCarousel.append(owlDots);

  const pagination = document.createElement('div');
  pagination.classList.add('pagination');
  railsSection.append(pagination);

  const currentPageDiv = document.createElement('div');
  currentPageDiv.classList.add('current-page');
  currentPageDiv.textContent = currentPageRow?.firstElementChild?.textContent?.trim() || '1';
  pagination.append(currentPageDiv);

  const separatorSpan = document.createElement('span');
  separatorSpan.textContent = '/';
  pagination.append(separatorSpan);

  const totalPageDiv = document.createElement('div');
  totalPageDiv.classList.add('total-page');
  totalPageDiv.textContent = totalPageRow?.firstElementChild?.textContent?.trim() || '3';
  pagination.append(totalPageDiv);

  block.append(railsComp);

  // Basic carousel functionality (simplified, full Owl Carousel logic is complex)
  let currentIndex = 0;
  const itemsPerPage = parseInt(viewInRowText.replace('_', ''), 10) || 4; // _4InRow -> 4
  const totalItems = cardRows.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const updateCarousel = () => {
    owlStage.style.transform = `translateX(-${currentIndex * (100 / itemsPerPage)}%)`;
    currentPageDiv.textContent = currentIndex + 1;

    [...owlDots.children].forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  };

  const createDots = () => {
    owlDots.innerHTML = '';
    for (let i = 0; i < totalPages; i += 1) {
      const dotButton = document.createElement('button');
      dotButton.classList.add('owl-dot');
      dotButton.setAttribute('role', 'button');
      dotButton.innerHTML = '<span></span>';
      dotButton.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
      });
      owlDots.append(dotButton);
    }
    updateCarousel(); // Initial update to set active dot
  };

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalPages - 1;
    updateCarousel();
  });

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex < totalPages - 1) ? currentIndex + 1 : 0;
    updateCarousel();
  });

  createDots();
}
