import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const mainWrapper = document.createElement('div');
  mainWrapper.classList.add('latestBlogs-article_listing', 'position-relative');
  moveInstrumentation(block, mainWrapper);

  // First section
  const firstSection = document.createElement('div');
  firstSection.classList.add('latestBlogs-article_listing_section--first', 'text-white', 'text-center');

  const title = document.createElement('h2');
  title.classList.add('latestBlogs-article_listing--title', 'boing--text__heading-1', 'text-white', 'pb-3');
  title.textContent = 'More Boings'; // Static content
  firstSection.append(title);

  const desc = document.createElement('p');
  desc.classList.add('latestBlogs-article_listing--desc', 'boing--text__body-2', 'pb-4');
  desc.textContent = 'Stay updated with our latest news, blogs and events'; // Static content
  firstSection.append(desc);

  const btnWrapper = document.createElement('div');
  btnWrapper.classList.add('latestBlogs-article_listing--btnWrapper');
  const viewAllLink = document.createElement('a');
  viewAllLink.href = '/bolte-sitare/boingwale-blogs.html'; // Static link
  viewAllLink.title = 'View All';
  viewAllLink.classList.add('latestBlogs-boing--text__title-3', 'latestBlogs-article_listing--btn', 'analytics_cta_click');
  viewAllLink.textContent = 'View All'; // Static content
  btnWrapper.append(viewAllLink);
  firstSection.append(btnWrapper);
  mainWrapper.append(firstSection);

  // Second section for cards
  const secondSection = document.createElement('div');
  secondSection.classList.add('latestBlogs-article_listing_section--second', 'd-flex');

  [...block.children].forEach((row) => {
    const linkCell = row.children[0];
    const imageCell = row.children[1];
    const dateCell = row.children[2];
    const dateTextCell = row.children[3];
    const titleCell = row.children[4];

    const linkElement = linkCell.querySelector('a');
    const imgElement = imageCell.querySelector('img');
    const dateElement = dateCell.querySelector('p');
    const dateTextElement = dateTextCell.querySelector('p');
    const titleElement = titleCell.querySelector('p');

    if (linkElement && imgElement && dateElement && dateTextElement && titleElement) {
      const cardLink = document.createElement('a');
      cardLink.href = linkElement.href;
      cardLink.classList.add('latestBlogs-article_listing--cardWrapper', 'analytics_cta_click');
      cardLink.setAttribute('data-cta-label', linkElement.textContent.trim());
      moveInstrumentation(row, cardLink);

      const cardDiv = document.createElement('div');
      cardDiv.classList.add('latestBlogs-article_listing--cards');

      const cardImageWrapper = document.createElement('div');
      cardImageWrapper.classList.add('latestBlogs-article_listing--cardImageWrapper');

      const optimizedPic = createOptimizedPicture(imgElement.src, imgElement.alt, false, [{ width: '750' }]);
      optimizedPic.querySelector('img').classList.add('latestBlogs-article_listing--cardImage', 'w-100', 'h-100');
      moveInstrumentation(imgElement, optimizedPic.querySelector('img'));
      cardImageWrapper.append(optimizedPic);
      cardDiv.append(cardImageWrapper);

      const contentWrapper = document.createElement('div');
      contentWrapper.classList.add('latestBlogs-cards_content--wrapper');

      const publishedDate = document.createElement('p');
      publishedDate.classList.add('latestBlogs-boing--text__body-5', 'p-0', 'm-0', 'mb-3', 'latestBlogs-published_date');
      publishedDate.setAttribute('data-date', dateElement.getAttribute('data-date'));
      publishedDate.textContent = dateTextElement.textContent.trim();
      contentWrapper.append(publishedDate);

      const cardTitle = document.createElement('p');
      cardTitle.classList.add('latestBlogs-boing--text__body-2', 'latestBlogs-boing--text__body');
      cardTitle.innerHTML = titleElement.innerHTML; // Use innerHTML for rich text
      contentWrapper.append(cardTitle);

      cardDiv.append(contentWrapper);
      cardLink.append(cardDiv);
      secondSection.append(cardLink);
    }
  });

  mainWrapper.append(secondSection);

  block.textContent = '';
  block.classList.add('latestBlogs-article_listing--wrapper'); // Add the wrapper class to the block itself
  block.append(mainWrapper);
}
