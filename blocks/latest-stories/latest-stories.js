import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  const headingRow = children.shift();
  const headingText = headingRow.querySelector('div')?.textContent.trim();

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');

  if (headingText) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.textContent = headingText;
    sectionHeader.appendChild(heading);
    section.appendChild(sectionHeader);
  }

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');

  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  container.appendChild(flickitySliderWrap);

  const twitterFeedSlides = document.createElement('div');
  twitterFeedSlides.classList.add('slides');
  flickitySliderWrap.appendChild(twitterFeedSlides);

  const storySlides = document.createElement('div');
  storySlides.classList.add('slides');
  flickitySliderWrap.appendChild(storySlides);

  children.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 10) { // Twitter Feed Item
      const [userImageCell, userNameCell, userScreenNameCell, userProfileLinkCell, tweetLinkCell, tweetTextCell, tweetMediaCell, repostCountCell, likeCountCell, dateCell] = cells;

      const tweetItem = document.createElement('div');
      tweetItem.classList.add('eapps-twitter-feed-posts-item', 'eapps-twitter-feed-posts-item-media-items-1', 'eapps-twitter-feed-posts-item-media-show', 'eapps-twitter-feed-posts-item-show', 'shuffle-item', 'shuffle-item--visible');

      const tweetItemInner = document.createElement('div');
      tweetItemInner.classList.add('eapps-twitter-feed-posts-item-inner');

      const userDiv = document.createElement('div');
      userDiv.classList.add('eapps-twitter-feed-posts-item-user');

      const userProfileLink = document.createElement('a');
      userProfileLink.rel = 'nofollow';
      userProfileLink.target = '_blank';
      userProfileLink.href = userProfileLinkCell.querySelector('a')?.href || '#';

      const userImageContainer = document.createElement('div');
      userImageContainer.classList.add('eapps-twitter-feed-posts-item-user-image-container');
      const userImage = userImageCell.querySelector('picture > img');
      if (userImage) {
        const optimizedUserPic = createOptimizedPicture(userImage.src, userImage.alt, false, [{ width: '400' }]);
        moveInstrumentation(userImage, optimizedUserPic.querySelector('img'));
        userImageContainer.appendChild(optimizedUserPic);
      }
      userProfileLink.appendChild(userImageContainer);
      userDiv.appendChild(userProfileLink);

      const userNameDiv = document.createElement('div');
      userNameDiv.classList.add('eapps-twitter-feed-posts-item-user-name');
      const userNameLink = document.createElement('a');
      userNameLink.rel = 'nofollow';
      userNameLink.target = '_blank';
      userNameLink.href = userProfileLinkCell.querySelector('a')?.href || '#';
      const userNameSpan = document.createElement('span');
      userNameSpan.textContent = userNameCell.textContent.trim();
      userNameLink.appendChild(userNameSpan);
      userNameDiv.appendChild(userNameLink);

      const userScreenNameDiv = document.createElement('div');
      userScreenNameDiv.classList.add('eapps-twitter-feed-posts-item-user-screen-name');
      const userScreenNameLink = document.createElement('a');
      userScreenNameLink.rel = 'nofollow';
      userScreenNameLink.target = '_blank';
      userScreenNameLink.href = userProfileLinkCell.querySelector('a')?.href || '#';
      const userScreenNameSpan = document.createElement('span');
      userScreenNameSpan.textContent = userScreenNameCell.textContent.trim();
      userScreenNameLink.appendChild(userScreenNameSpan);
      userScreenNameDiv.appendChild(userScreenNameLink);

      const tweetDateSpan = document.createElement('span');
      tweetDateSpan.classList.add('eapps-twitter-feed-posts-item-user-date');
      tweetDateSpan.textContent = dateCell.textContent.trim();
      userScreenNameDiv.appendChild(tweetDateSpan);

      userNameDiv.appendChild(userScreenNameDiv);
      userDiv.appendChild(userNameDiv);

      const tweetPostDiv = document.createElement('div');
      tweetPostDiv.classList.add('eapps-twitter-feed-posts-item-user-post');
      const tweetPostLink = document.createElement('a');
      tweetPostLink.rel = 'nofollow';
      tweetPostLink.href = tweetLinkCell.querySelector('a')?.href || '#';
      tweetPostLink.target = '_blank';
      tweetPostLink.title = 'View on X';
      userDiv.appendChild(tweetPostLink); // Append link directly, not the div
      tweetItemInner.appendChild(userDiv);

      const tweetTextDiv = document.createElement('div');
      tweetTextDiv.classList.add('eapps-twitter-feed-posts-item-text');
      tweetTextDiv.innerHTML = tweetTextCell.innerHTML;
      tweetItemInner.appendChild(tweetTextDiv);

      const tweetMediaDiv = document.createElement('div');
      tweetMediaDiv.classList.add('eapps-twitter-feed-posts-item-media', 'eapps-twitter-feed-posts-item-media-visible');
      const tweetMediaItem = document.createElement('div');
      tweetMediaItem.classList.add('eapps-twitter-feed-posts-item-media-item-type-image', 'eapps-twitter-feed-posts-item-media-item');

      const mediaImage = tweetMediaCell.querySelector('picture > img');
      const mediaLink = tweetMediaCell.querySelector('a');

      if (mediaImage || mediaLink) {
        let mediaElement;
        if (mediaLink && /\.(mp4|webm|ogg|mov)$/i.test(mediaLink.href)) {
          mediaElement = document.createElement('a'); // Wrap video in an anchor if a link is present
          mediaElement.rel = 'nofollow';
          mediaElement.href = mediaLink.href;
          mediaElement.target = '_blank';

          const videoElement = document.createElement('video');
          videoElement.src = mediaLink.href;
          videoElement.autoplay = false;
          videoElement.muted = true;
          videoElement.playsInline = true;
          videoElement.loop = false;
          videoElement.controls = true;
          mediaElement.appendChild(videoElement);
          moveInstrumentation(mediaLink, videoElement); // Instrument the video element
        } else if (mediaImage) {
          mediaElement = document.createElement('a');
          mediaElement.rel = 'nofollow';
          mediaElement.href = mediaLink?.href || mediaImage.src; // Use mediaLink href if available, otherwise image src
          mediaElement.target = '_blank';
          const optimizedMediaPic = createOptimizedPicture(mediaImage.src, mediaImage.alt, false, [{ width: '750' }]);
          optimizedMediaPic.querySelector('img').classList.add('eapps-twitter-feed-posts-item-media-item-image'); // Add missing class
          moveInstrumentation(mediaImage, optimizedMediaPic.querySelector('img'));
          mediaElement.appendChild(optimizedMediaPic);
        }
        if (mediaElement) {
          tweetMediaItem.appendChild(mediaElement);
          tweetMediaDiv.appendChild(tweetMediaItem);
          tweetItemInner.appendChild(tweetMediaDiv);
        }
      }

      const actionsDiv = document.createElement('div');
      actionsDiv.classList.add('eapps-twitter-feed-posts-item-actions');

      const repostAction = document.createElement('a');
      repostAction.classList.add('eapps-twitter-feed-posts-item-actions-item', 'eapps-twitter-feed-posts-item-actions-item-repost');
      repostAction.rel = 'nofollow';
      repostAction.href = '#'; // Placeholder, as per original HTML
      repostAction.title = 'Repost';
      const repostIcon = document.createElement('div');
      repostIcon.classList.add('eapps-twitter-feed-posts-item-actions-item-icon');
      repostAction.appendChild(repostIcon);
      const repostText = document.createElement('div');
      repostText.classList.add('eapps-twitter-feed-posts-item-actions-item-text');
      repostText.textContent = repostCountCell.textContent.trim();
      repostAction.appendChild(repostText);
      actionsDiv.appendChild(repostAction);

      const likeAction = document.createElement('a');
      likeAction.classList.add('eapps-twitter-feed-posts-item-actions-item', 'eapps-twitter-feed-posts-item-actions-item-likes');
      likeAction.rel = 'nofollow';
      likeAction.href = '#'; // Placeholder, as per original HTML
      likeAction.title = 'Like';
      const likeIcon = document.createElement('div');
      likeIcon.classList.add('eapps-twitter-feed-posts-item-actions-item-icon');
      likeAction.appendChild(likeIcon);
      const likeText = document.createElement('div');
      likeText.classList.add('eapps-twitter-feed-posts-item-actions-item-text');
      likeText.textContent = likeCountCell.textContent.trim();
      likeAction.appendChild(likeText);
      actionsDiv.appendChild(likeAction);

      tweetItemInner.appendChild(actionsDiv);

      const postDateDiv = document.createElement('div');
      postDateDiv.classList.add('eapps-twitter-feed-posts-item-date');
      postDateDiv.textContent = dateCell.textContent.trim();
      tweetItemInner.appendChild(postDateDiv);

      tweetItem.appendChild(tweetItemInner);
      moveInstrumentation(row, tweetItem);
      twitterFeedSlides.appendChild(tweetItem);
    } else if (cells.length === 5) { // Story Item
      const [imageCell, categoryCell, textCell, linkCell, dateCell] = cells;

      const wrap = document.createElement('div');
      wrap.classList.add('wrap');

      const imageWrap = document.createElement('div');
      imageWrap.classList.add('image-wrap');
      const image = imageCell.querySelector('picture > img');
      if (image) {
        const optimizedPic = createOptimizedPicture(image.src, image.alt, false, [{ width: '750' }]);
        moveInstrumentation(image, optimizedPic.querySelector('img'));
        imageWrap.appendChild(optimizedPic);
      }
      wrap.appendChild(imageWrap);

      const contentWrap = document.createElement('div');
      contentWrap.classList.add('content-wrap');

      const category = document.createElement('div');
      category.classList.add('category');
      category.textContent = categoryCell.textContent.trim();
      contentWrap.appendChild(category);

      const text = document.createElement('div');
      text.classList.add('text');
      text.textContent = textCell.textContent.trim();
      contentWrap.appendChild(text);

      const link = document.createElement('a');
      link.classList.add('btn', 'btn-link');
      link.href = linkCell.querySelector('a')?.href || '#';
      link.textContent = linkCell.querySelector('a')?.textContent.trim() || 'Read more'; // Read from link cell, fallback to 'Read more'
      contentWrap.appendChild(link);

      const date = document.createElement('div');
      date.classList.add('date');
      const time = document.createElement('time');
      time.datetime = dateCell.textContent.trim(); // Assuming date-time field provides ISO format
      time.textContent = dateCell.textContent.trim();
      date.appendChild(time);
      contentWrap.appendChild(date);

      wrap.appendChild(contentWrap);
      moveInstrumentation(row, wrap);
      storySlides.appendChild(wrap);
    }
  });

  block.innerHTML = '';
  block.appendChild(section);
  section.appendChild(container);
}
