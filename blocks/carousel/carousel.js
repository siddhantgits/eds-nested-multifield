import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper', 'carousel-primary-swiper-wrapper', 'z-0');

  [...block.children].forEach((row) => {
    const swiperSlide = document.createElement('div');
    moveInstrumentation(row, swiperSlide);
    swiperSlide.classList.add('swiper-slide', 'carousel-primary-swiper-slide');
    swiperSlide.setAttribute('role', 'tabpanel');
    swiperSlide.setAttribute('aria-roledescription', 'slide');

    const bannerDiv = document.createElement('div');
    bannerDiv.classList.add('banner-banner');

    const section = document.createElement('section');
    section.classList.add('banner-banner-section');

    const wrapperDiv = document.createElement('div');
    wrapperDiv.classList.add('position-relative', 'boing', 'banner-banner-section__wrapper');

    const video = row.querySelector('video');
    const img = row.querySelector('img');
    const ctaLink = row.querySelector('a');
    const ctaText = ctaLink ? ctaLink.textContent : '';

    if (video) {
      const videoWrapper = document.createElement('div');
      videoWrapper.classList.add('banner-video-wrapper');

      const newVideo = document.createElement('video');
      moveInstrumentation(video, newVideo);
      newVideo.classList.add('w-100', 'object-fit-cover', 'banner-banner-media', 'banner-banner-video');
      newVideo.setAttribute('title', video.getAttribute('title') || 'Video');
      newVideo.setAttribute('aria-label', video.getAttribute('aria-label') || 'Video');
      newVideo.setAttribute('playsinline', '');
      newVideo.setAttribute('preload', 'metadata');
      newVideo.setAttribute('fetchpriority', 'high');
      newVideo.setAttribute('loop', video.getAttribute('loop') || 'false');
      newVideo.setAttribute('muted', video.getAttribute('muted') || 'true');
      newVideo.setAttribute('autoplay', video.getAttribute('autoplay') || 'true');
      newVideo.setAttribute('data-is-autoplay', video.getAttribute('data-is-autoplay') || 'true');

      const source = document.createElement('source');
      source.src = video.querySelector('source').src;
      source.type = video.querySelector('source').type;
      newVideo.append(source);

      // Add play/pause and mute/unmute buttons if they exist in the original HTML
      const playPauseWrapper = document.createElement('div');
      playPauseWrapper.classList.add('position-absolute', 'w-100', 'h-100', 'start-0', 'top-0', 'd-flex', 'justify-content-center', 'align-items-center', 'cursor-pointer');
      const playButton = row.querySelector('.icon-play');
      const pauseButton = row.querySelector('.icon-pause');
      if (playButton) {
        const newPlayButton = document.createElement('button');
        moveInstrumentation(playButton, newPlayButton);
        newPlayButton.type = 'button';
        newPlayButton.classList.add('d-none', 'banner-video-icon', 'icon-play', 'bg-transparent', 'd-flex', 'align-items-center', 'justify-content-center', 'cursor-pointer');
        newPlayButton.innerHTML = playButton.innerHTML;
        playPauseWrapper.append(newPlayButton);
      }
      if (pauseButton) {
        const newPauseButton = document.createElement('button');
        moveInstrumentation(pauseButton, newPauseButton);
        newPauseButton.type = 'button';
        newPauseButton.classList.add('d-block', 'banner-video-icon', 'icon-pause', 'bg-transparent', 'd-flex', 'align-items-center', 'justify-content-center', 'cursor-pointer');
        newPauseButton.innerHTML = pauseButton.innerHTML;
        playPauseWrapper.append(newPauseButton);
      }
      videoWrapper.append(newVideo, playPauseWrapper);

      const muteIconWrapper = document.createElement('div');
      muteIconWrapper.classList.add('position-absolute', 'z-2', 'd-flex', 'justify-content-center', 'align-items-center', 'cursor-pointer', 'mute-icon');
      const muteButton = row.querySelector('.icon-mute');
      const unmuteButton = row.querySelector('.icon-unmute');
      const noAudioIcon = row.querySelector('.no-audio-icon');
      if (muteButton) {
        const newMuteButton = document.createElement('button');
        moveInstrumentation(muteButton, newMuteButton);
        newMuteButton.type = 'button';
        newMuteButton.classList.add('banner-video-icon-volume', 'icon-mute', 'bg-transparent', 'd-flex', 'align-items-center', 'justify-content-center', 'cursor-pointer', 'd-none');
        newMuteButton.innerHTML = muteButton.innerHTML;
        muteIconWrapper.append(newMuteButton);
      }
      if (unmuteButton) {
        const newUnmuteButton = document.createElement('button');
        moveInstrumentation(unmuteButton, newUnmuteButton);
        newUnmuteButton.type = 'button';
        newUnmuteButton.classList.add('banner-video-icon-volume', 'icon-unmute', 'bg-transparent', 'd-flex', 'align-items-center', 'justify-content-center', 'cursor-pointer', 'd-none');
        newUnmuteButton.innerHTML = unmuteButton.innerHTML;
        muteIconWrapper.append(newUnmuteButton);
      }
      if (noAudioIcon) {
        const newNoAudioIcon = document.createElement('button');
        moveInstrumentation(noAudioIcon, newNoAudioIcon);
        newNoAudioIcon.type = 'button';
        newNoAudioIcon.classList.add('banner-video-icon-volume', 'no-audio-icon', 'bg-transparent', 'd-flex', 'align-items-center', 'justify-content-center', 'cursor-pointer');
        newNoAudioIcon.innerHTML = noAudioIcon.innerHTML;
        muteIconWrapper.append(newNoAudioIcon);
      }
      videoWrapper.append(muteIconWrapper);
      wrapperDiv.append(videoWrapper);
    } else if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      optimizedPic.querySelector('img').classList.add('w-100', 'h-100', 'object-fit-cover', 'banner-banner-media', 'banner-banner-image');
      optimizedPic.querySelector('img').setAttribute('loading', img.getAttribute('loading') || 'eager');
      optimizedPic.querySelector('img').setAttribute('fetchpriority', img.getAttribute('fetchpriority') || 'high');
      optimizedPic.querySelector('img').setAttribute('decoding', img.getAttribute('decoding') || 'async');
      wrapperDiv.append(optimizedPic);
    }

    const ctaWrapper = document.createElement('div');
    ctaWrapper.classList.add('position-absolute', 'start-50', 'translate-middle-x', 'w-100', 'boing__banner--cta');
    const bannerCtaDiv = document.createElement('div');
    bannerCtaDiv.classList.add('banner-banner-cta');

    if (ctaLink) {
      const textCenterDiv = document.createElement('div');
      textCenterDiv.classList.add('text-center');

      const newCtaLink = document.createElement('a');
      moveInstrumentation(ctaLink, newCtaLink);
      newCtaLink.id = ctaLink.id;
      newCtaLink.classList.add('cmp-button', 'analytics_cta_click', 'text-center', 'cta-layout');
      newCtaLink.setAttribute('data-link-region', ctaLink.getAttribute('data-link-region') || 'CTA');
      newCtaLink.setAttribute('data-is-internal', ctaLink.getAttribute('data-is-internal') || 'true');
      newCtaLink.setAttribute('data-enable-gating', ctaLink.getAttribute('data-enable-gating') || 'false');
      newCtaLink.href = ctaLink.href;
      newCtaLink.target = ctaLink.target;

      const span = document.createElement('span');
      span.classList.add('cmp-button__text', 'primary-btn', 'w-75', 'p-5', 'rounded-pill', 'd-inline-flex', 'justify-content-center', 'align-items-center', 'famlf-cta-btn');
      span.textContent = ctaText;
      newCtaLink.append(span);
      textCenterDiv.append(newCtaLink);

      const popUpDiv = document.createElement('div');
      popUpDiv.classList.add('pop-up', 'd-none');
      // Add hidden inputs for popup messages if they exist in the original HTML
      const popupMessageInput = row.querySelector('.popup-message');
      if (popupMessageInput) {
        const newPopupMessageInput = document.createElement('input');
        moveInstrumentation(popupMessageInput, newPopupMessageInput);
        newPopupMessageInput.type = 'hidden';
        newPopupMessageInput.classList.add('popup-message');
        popUpDiv.append(newPopupMessageInput);
      }
      const proceedButtonLabelInput = row.querySelector('.proceed-button-label');
      if (proceedButtonLabelInput) {
        const newProceedButtonLabelInput = document.createElement('input');
        moveInstrumentation(proceedButtonLabelInput, newProceedButtonLabelInput);
        newProceedButtonLabelInput.type = 'hidden';
        newProceedButtonLabelInput.classList.add('proceed-button-label');
        popUpDiv.append(newProceedButtonLabelInput);
      }
      const cancelButtonLabelInput = row.querySelector('.cancel-button-label');
      if (cancelButtonLabelInput) {
        const newCancelButtonLabelInput = document.createElement('input');
        moveInstrumentation(cancelButtonLabelInput, newCancelButtonLabelInput);
        newCancelButtonLabelInput.type = 'hidden';
        newCancelButtonLabelInput.classList.add('cancel-button-label');
        popUpDiv.append(newCancelButtonLabelInput);
      }
      const backgroundColorInput = row.querySelector('.background-color');
      if (backgroundColorInput) {
        const newBackgroundColorInput = document.createElement('input');
        moveInstrumentation(backgroundColorInput, newBackgroundColorInput);
        newBackgroundColorInput.type = 'hidden';
        newBackgroundColorInput.classList.add('background-color');
        popUpDiv.append(newBackgroundColorInput);
      }
      textCenterDiv.append(popUpDiv);
      bannerCtaDiv.append(textCenterDiv);
    }
    ctaWrapper.append(bannerCtaDiv);
    wrapperDiv.append(ctaWrapper);
    section.append(wrapperDiv);
    bannerDiv.append(section);
    swiperSlide.append(bannerDiv);
    swiperWrapper.append(swiperSlide);
  });

  block.textContent = '';

  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative');

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper', 'carousel-primary-swiper');
  swiperContainer.setAttribute('role', 'group');
  swiperContainer.setAttribute('aria-live', 'polite');
  swiperContainer.setAttribute('aria-roledescription', 'carousel');
  swiperContainer.setAttribute('data-is-autoplay', block.getAttribute('data-is-autoplay') || 'true');
  swiperContainer.setAttribute('data-delay', block.getAttribute('data-delay') || '5000');
  swiperContainer.setAttribute('data-autopause-disabled', block.getAttribute('data-autopause-disabled') || 'true');
  swiperContainer.setAttribute('data-is-loop', block.getAttribute('data-is-loop') || 'false');
  swiperContainer.setAttribute('data-placeholder-text', block.getAttribute('data-placeholder-text') || 'false');

  swiperContainer.append(swiperWrapper);

  // Add navigation buttons and pagination if they exist in the original HTML
  const originalSwiper = block.querySelector('.swiper.carousel-primary-swiper');
  if (originalSwiper) {
    const actionsDiv = originalSwiper.querySelector('.cmp-carousel__actions');
    if (actionsDiv) {
      const newActionsDiv = actionsDiv.cloneNode(true);
      swiperContainer.append(newActionsDiv);
    }

    const navContainer = originalSwiper.querySelector('.swiper-container');
    if (navContainer) {
      const newNavContainer = navContainer.cloneNode(true);
      swiperContainer.append(newNavContainer);
    }

    const pagination = originalSwiper.querySelector('.swiper-pagination');
    if (pagination) {
      const newPagination = pagination.cloneNode(true);
      swiperContainer.append(newPagination);
    }
  }

  positionRelativeDiv.append(swiperContainer);
  block.append(positionRelativeDiv);
}
