import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    desktopImageRow,
    tabletImageRow,
    mobileImageRow,
    imageAltRow,
    imageTitleRow,
    eyebrowTextRow,
    priceInfoRow,
    bannerTitleRow,
    bannerSubtitleRow,
    ...ctaItemRows
  ] = [...block.children];

  block.innerHTML = ''; // Clear the block content

  const bannerComp = document.createElement('div');
  bannerComp.classList.add('banner-comp');
  bannerComp.setAttribute('data-contentview', 'defaultView');
  bannerComp.setAttribute('data-dynamic-image-preset', 'BA-1920-1067');
  bannerComp.setAttribute('data-bannername', 'Punch banner');

  const dataAccessories = document.createElement('div');
  dataAccessories.classList.add('data-accessories', 'd-none');
  bannerComp.append(dataAccessories);

  const dataEw = document.createElement('span');
  dataEw.classList.add('data-ew', 'd-none');
  bannerComp.append(dataEw);

  const dataAmc = document.createElement('span');
  dataAmc.classList.add('data-amc', 'd-none');
  bannerComp.append(dataAmc);

  const bannerImage = document.createElement('div');
  bannerImage.classList.add('banner-image');
  bannerComp.append(bannerImage);

  const populateBannerImage = document.createElement('div');
  populateBannerImage.classList.add('populate-banner-image');
  bannerImage.append(populateBannerImage);

  const picture = document.createElement('picture');

  const mobileImageSrc = mobileImageRow?.querySelector('img')?.src;
  if (mobileImageSrc) {
    const mobileSource = document.createElement('source');
    mobileSource.classList.add('mobile-image');
    mobileSource.media = '(max-width:767px)';
    mobileSource.srcset = mobileImageSrc;
    picture.append(mobileSource);
  }

  const tabletImageSrc = tabletImageRow?.querySelector('img')?.src;
  if (tabletImageSrc) {
    const tabletSource = document.createElement('source');
    tabletSource.classList.add('tablet-image');
    tabletSource.media = '(max-width:992px)';
    tabletSource.srcset = tabletImageSrc;
    picture.append(tabletSource);
  }

  const desktopImg = desktopImageRow?.querySelector('img');
  if (desktopImg) {
    const img = createOptimizedPicture(desktopImg.src, imageAltRow?.textContent.trim() || desktopImg.alt, false, [{ width: '750' }]);
    const optimizedImg = img.querySelector('img');
    optimizedImg.classList.add('desktop-image', 'show-img', 'aos-init', 'aos-animate');
    optimizedImg.setAttribute('data-aos-duration', '1000');
    optimizedImg.alt = imageAltRow?.textContent.trim() || desktopImg.alt;
    optimizedImg.title = imageTitleRow?.textContent.trim() || '';
    optimizedImg.setAttribute('fetchpriority', 'auto');
    moveInstrumentation(desktopImg, optimizedImg);
    picture.append(optimizedImg);
  }

  populateBannerImage.append(picture);

  const bannerTextContainer = document.createElement('div');
  bannerTextContainer.classList.add(
    'banner-text-container',
    'content-bg-black',
    'mob-content-bg-black',
    'hc-opacity',
    'aos-init',
    'aos-animate',
  );
  bannerTextContainer.setAttribute('data-aos-duration', '800');
  bannerTextContainer.setAttribute('data-aos-delay', '200');
  bannerImage.append(bannerTextContainer);

  const bannerContent = document.createElement('div');
  bannerContent.classList.add('banner-content');
  bannerTextContainer.append(bannerContent);

  const bannerIndex = document.createElement('div');
  bannerIndex.classList.add('banner-index');
  bannerContent.append(bannerIndex);

  const eyebrowText = eyebrowTextRow?.textContent.trim();
  if (eyebrowText) {
    const eyebrowH6 = document.createElement('h6');
    eyebrowH6.classList.add('banner-eyebrow-text');
    eyebrowH6.textContent = eyebrowText;
    bannerIndex.append(eyebrowH6);
  }

  const priceInfo = priceInfoRow?.textContent.trim();
  if (priceInfo) {
    const priceH5 = document.createElement('h5');
    priceH5.classList.add('banner-price-info');
    priceH5.textContent = priceInfo;
    bannerIndex.append(priceH5);
  }

  const dynamicSubtext = document.createElement('h6');
  dynamicSubtext.classList.add('banner-eyebrow-text', 'banner-dynamic-subtext', 'd-none');
  bannerIndex.append(dynamicSubtext);

  const bannerTitle = bannerTitleRow?.textContent.trim();
  if (bannerTitle) {
    const titleH5 = document.createElement('h5');
    titleH5.classList.add('banner-title');
    titleH5.setAttribute('data-isdynamic', 'false');
    titleH5.textContent = bannerTitle;
    bannerIndex.append(titleH5);
  }

  const bannerSubtitle = bannerSubtitleRow?.textContent.trim();
  if (bannerSubtitle) {
    const subtitleH3 = document.createElement('h3');
    subtitleH3.classList.add('banner-subtitle', 'banner-solid');
    subtitleH3.textContent = bannerSubtitle;
    bannerIndex.append(subtitleH3);
  }

  if (ctaItemRows.length > 0) {
    const ctaGroup = document.createElement('div');
    ctaGroup.classList.add('banner-cta-group', 'cta');
    bannerContent.append(ctaGroup);

    ctaItemRows.forEach((row, index) => {
      const [linkCell, labelCell] = [...row.children];
      const foundLink = linkCell?.querySelector('a');
      const labelText = labelCell?.textContent.trim();

      if (foundLink && labelText) {
        const ctaAnchor = document.createElement('a');
        ctaAnchor.href = foundLink.href;
        ctaAnchor.classList.add('banner-index');
        ctaAnchor.setAttribute('aria-label', labelText);

        const ctaButton = document.createElement('button');
        ctaButton.classList.add('cta-btn', 'right-icon');
        ctaButton.setAttribute('tabindex', '-1');

        const ctaLabelSpan = document.createElement('span');
        ctaLabelSpan.classList.add('cta-label');
        ctaLabelSpan.textContent = labelText;
        ctaButton.append(ctaLabelSpan);

        const iconArrowRight = document.createElement('span');
        iconArrowRight.classList.add('icon-Arrow-Right');
        ctaButton.append(iconArrowRight);

        ctaAnchor.append(ctaButton);
        moveInstrumentation(row, ctaAnchor);

        if (index === 0) {
          ctaAnchor.classList.add('cta-to-button', 'cta1');
          ctaButton.classList.add('blue');
        } else {
          ctaAnchor.classList.add('cta-to-link', 'cta2');
          ctaButton.classList.add('white');
        }
        ctaGroup.append(ctaAnchor);
      }
    });
  }

  const emptyBannerIndex = document.createElement('div');
  emptyBannerIndex.classList.add('banner-index');
  bannerContent.append(emptyBannerIndex);

  block.append(bannerComp);
}
