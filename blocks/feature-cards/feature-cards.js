import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const featureCardsText = block.querySelector('.featureCards-text');
  if (featureCardsText) {
    const heading = featureCardsText.querySelector('h1');
    if (heading) {
      const headingWrapper = document.createElement('div');
      headingWrapper.classList.add('featureCards-text');
      headingWrapper.append(heading);
      block.prepend(headingWrapper);
    }
    featureCardsText.remove(); // Remove the original text container after processing
  }

  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('featureCards-cards-container');

  const bolteSitareCardSections = [...block.querySelectorAll('a.featureCards-bolteSitare_cardSection')];

  bolteSitareCardSections.forEach((row) => {
    const link = row;
    const linkHref = link.href;
    const linkTitle = link.title;
    const dataTitle = link.dataset.title;
    const target = link.target;

    const cardWrapper = document.createElement('a');
    cardWrapper.classList.add('featureCards-bolteSitare_cardSection', 'analytics_cta_click', 'text-decoration-none');
    cardWrapper.href = linkHref;
    cardWrapper.title = linkTitle;
    if (dataTitle) cardWrapper.dataset.title = dataTitle;
    if (target) cardWrapper.target = target;

    moveInstrumentation(row, cardWrapper);

    const innerWrapper = document.createElement('div');
    innerWrapper.classList.add('featureCards-bolteSitare_cardSection--wrapper');

    const imgWrapper = document.createElement('div');
    imgWrapper.classList.add('featureCards-bolteSitare_cardSection--img');
    const img = row.querySelector('img.featureCards-card-img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imgWrapper.append(optimizedPic);
    }
    innerWrapper.append(imgWrapper);

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('featureCards-content-wrapper');

    const textContentDiv = document.createElement('div');
    const titleElement = row.querySelector('h2.featureCards-bolteSitare_cardSection--title');
    if (titleElement) {
      textContentDiv.append(titleElement);
    }
    const descriptionElement = row.querySelector('p.featureCards-bolteSitare_cardSection--text');
    if (descriptionElement) {
      textContentDiv.append(descriptionElement);
    }
    contentWrapper.append(textContentDiv);

    const buttonDiv = document.createElement('div');
    const button = row.querySelector('button.featureCards-bolteSitare_cardSection--btn');
    if (button) {
      buttonDiv.append(button);
    }
    contentWrapper.append(buttonDiv);

    innerWrapper.append(contentWrapper);
    cardWrapper.append(innerWrapper);
    cardsContainer.append(cardWrapper);
  });

  const curveContainer = block.querySelector('.featureCards-curve-container');
  if (curveContainer) {
    cardsContainer.append(curveContainer);
  }

  const featureCardSection = block.querySelector('section.featureCards-feature_card--Section');
  if (featureCardSection) {
    const link = featureCardSection.querySelector('a.featureCards-d-flex');
    if (link) {
      const newLink = document.createElement('a');
      newLink.classList.add('featureCards-d-flex', 'flex-column', 'analytics_cta_click', 'text-decoration-none');
      newLink.href = link.href;
      newLink.title = link.title;
      if (link.target) newLink.target = link.target;
      if (link.dataset.ctaLabel) newLink.dataset.ctaLabel = link.dataset.ctaLabel;

      moveInstrumentation(link, newLink);

      const imageWrapper = document.createElement('div');
      imageWrapper.classList.add('featureCards-feature_card--image', 'w-100', 'pb-4');
      const img = link.querySelector('img.featureCards-w-100.h-100');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageWrapper.append(optimizedPic);
      }
      newLink.append(imageWrapper);

      const textCenterDiv = document.createElement('div');
      textCenterDiv.classList.add('featureCards-text-center');

      const titleElement = link.querySelector('h2.featureCards-feature_card--title');
      if (titleElement) {
        textCenterDiv.append(titleElement);
      }

      const pb5Div = document.createElement('div');
      pb5Div.classList.add('featureCards-pb-5');
      const descElement = link.querySelector('p.featureCards-feature_card--desc');
      if (descElement) {
        pb5Div.append(descElement);
      }
      textCenterDiv.append(pb5Div);

      const redirectedBtnDiv = document.createElement('div');
      redirectedBtnDiv.classList.add('featureCards-redirected_btn');
      const button = link.querySelector('button.featureCards-arrow-icon-btn');
      if (button) {
        redirectedBtnDiv.append(button);
      }
      textCenterDiv.append(redirectedBtnDiv);

      newLink.append(textCenterDiv);
      cardsContainer.append(newLink);
    }
  }

  block.textContent = '';
  block.append(cardsContainer);
}
