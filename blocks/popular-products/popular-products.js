import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, subtitleRow, ...productRows] = [...block.children];

  const wrapper = document.createElement('div');
  wrapper.classList.add('cmp-popular-products');

  const headerSection = document.createElement('div');
  headerSection.classList.add('cmp-popular-products__header-section');

  const title = document.createElement('h2');
  title.classList.add('cmp-popular-products__title');
  moveInstrumentation(titleRow.firstElementChild, title);
  title.textContent = titleRow.firstElementChild?.textContent.trim() || '';
  headerSection.append(title);

  const subtitle = document.createElement('div');
  subtitle.classList.add('cmp-popular-products__subtitle');
  moveInstrumentation(subtitleRow.firstElementChild, subtitle);
  subtitle.textContent = subtitleRow.firstElementChild?.textContent.trim() || '';
  headerSection.append(subtitle);

  wrapper.append(headerSection);

  const carousel = document.createElement('div');
  carousel.classList.add('cmp-popular-products__carousel', 'slickcarousel', 'carousel', 'panelcontainer');

  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel', 'cmp-carousel__container'); // Corrected: cmp-carousel__container from ORIGINAL HTML

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');

  productRows.forEach((row) => {
    const [imageCell, productLinkCell, productNameCell, productDetailsCell, ctaLabelCell] = [...row.children];

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('cmp-popular-products__carousel-item', 'cmp-carousel__item', 'slick-slide'); // Corrected: cmp-carousel__item from ORIGINAL HTML
    moveInstrumentation(row, carouselItem);

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('cmp-popular-products__content-wrapper');

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('cmp-popular-products__image');

    const productLink = document.createElement('a');
    const foundLink = productLinkCell?.querySelector('a');
    if (foundLink) {
      productLink.href = foundLink.href;
    } else {
      productLink.href = '#';
    }
    moveInstrumentation(productLinkCell, productLink);

    const lazyImageContainer = document.createElement('div');
    lazyImageContainer.classList.add('lazy-image-container');

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        if (optimizedImg) {
          optimizedImg.classList.add('cmp-popular-products__prod-image', 'lazy-image', 'loaded'); // Added classes from ORIGINAL HTML
          moveInstrumentation(img, optimizedImg);
        }
        lazyImageContainer.append(optimizedPic);
      }
    }
    productLink.append(lazyImageContainer);
    imageDiv.append(productLink);
    contentWrapper.append(imageDiv);

    const productDescription = document.createElement('div');
    productDescription.classList.add('cmp-popular-products__product-description');

    const productName = document.createElement('div');
    productName.classList.add('cmp-popular-products__product-name');
    moveInstrumentation(productNameCell, productName);
    productName.textContent = productNameCell?.textContent.trim() || '';
    productDescription.append(productName);

    const quantityContainer = document.createElement('div');
    quantityContainer.classList.add('cmp-popular-products__quantity-container');
    productDescription.append(quantityContainer);

    const productDetails = document.createElement('div');
    productDetails.classList.add('cmp-popular-products__product-details');
    moveInstrumentation(productDetailsCell, productDetails);
    productDetails.innerHTML = productDetailsCell?.innerHTML || '';
    productDescription.append(productDetails);

    const actionDiv = document.createElement('div');
    actionDiv.classList.add('cmp-popular-products__action');

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button', 'cmp-button--secondary', 'cmp-button--secondary-light');

    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('cmp-button');
    moveInstrumentation(ctaLabelCell, button);

    const buttonText = document.createElement('span');
    buttonText.classList.add('cmp-button__text');
    buttonText.textContent = ctaLabelCell?.textContent.trim() || '';
    button.append(buttonText);

    buttonDiv.append(button);
    actionDiv.append(buttonDiv);
    productDescription.append(actionDiv);
    contentWrapper.append(productDescription);
    carouselItem.append(contentWrapper);
    slickTrack.append(carouselItem);
  });

  slickList.append(slickTrack);
  carouselContainer.append(slickList);
  carousel.append(carouselContainer);
  wrapper.append(carousel);

  block.innerHTML = '';
  block.append(wrapper);

  // Initialize Slick Carousel (simplified for EDS context)
  // In a real scenario, you'd load a library like Slick.js or implement custom carousel logic.
  // For EDS, we'll just add basic classes to make it look like a carousel item.
  // The actual carousel functionality (arrows, dots, sliding) would be handled by a separate JS.

  // Simulate slick-active for the first item
  const firstItem = slickTrack.querySelector('.cmp-popular-products__carousel-item');
  if (firstItem) {
    firstItem.classList.add('slick-current', 'slick-active');
  }
}
