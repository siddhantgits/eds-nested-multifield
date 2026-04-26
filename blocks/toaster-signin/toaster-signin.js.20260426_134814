import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Use content detection for root rows instead of direct index access
  const rootRows = [...block.children];

  const backgroundIconCell = rootRows.find(row => row.querySelector('picture') && row.textContent.includes('Background Icon'))?.firstElementChild;
  const userIconCell = rootRows.find(row => row.querySelector('picture') && row.textContent.includes('User Icon'))?.firstElementChild;
  const isLoggedInCell = rootRows.find(row => row.textContent.includes('Is Logged In'))?.firstElementChild;
  const timerCell = rootRows.find(row => row.textContent.includes('Timer (ms)'))?.firstElementChild;
  const signinMsgCell = rootRows.find(row => row.textContent.includes('Sign In Message'))?.firstElementChild;
  const signoutMsgCell = rootRows.find(row => row.textContent.includes('Sign Out Message'))?.firstElementChild;
  const currentUserMessageCell = rootRows.find(row => row.textContent.includes('Current User Message'))?.firstElementChild;

  const isLoggedIn = isLoggedInCell?.textContent.trim() === 'true';
  const timer = timerCell?.textContent.trim() || '2000';
  const signinMsg = signinMsgCell?.textContent.trim() || '';
  const signoutMsg = signoutMsgCell?.textContent.trim() || '';
  const currentUserMessage = currentUserMessageCell?.textContent.trim() || '';

  const section = document.createElement('section');
  section.classList.add('toaster', 'toaster-signin');
  section.setAttribute('data-is-loggedin', isLoggedIn);
  section.setAttribute('data-timer', timer);
  section.setAttribute('data-signin-msg', signinMsg);
  section.setAttribute('data-signout-msg', signoutMsg);
  section.setAttribute('aria-label', 'Toaster Signin Module');

  const overlay = document.createElement('div');
  overlay.classList.add('toaster--overlay', 'js-close-toaster');
  section.append(overlay);

  const container = document.createElement('div');
  container.classList.add('toaster--container');

  const bgImg = backgroundIconCell?.querySelector('img');
  if (bgImg) {
    const optimizedBgPic = createOptimizedPicture(bgImg.src, bgImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(bgImg.closest('picture'), optimizedBgPic.querySelector('img'));
    container.append(optimizedBgPic.querySelector('img'));
  }

  const containerInner = document.createElement('div');
  containerInner.classList.add('toaster--container-inner');

  const messageWrapper = document.createElement('div');
  messageWrapper.classList.add('toaster--message-wrapper');

  const userDiv = document.createElement('div');
  userDiv.classList.add('toaster--user');

  const userImg = userIconCell?.querySelector('img');
  if (userImg) {
    const optimizedUserPic = createOptimizedPicture(userImg.src, userImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(userImg.closest('picture'), optimizedUserPic.querySelector('img'));
    userDiv.append(optimizedUserPic.querySelector('img'));
  }
  messageWrapper.append(userDiv);

  const userMessage = document.createElement('div');
  userMessage.classList.add('toaster--user-message', 'bodySmallRegular');
  userMessage.textContent = currentUserMessage;
  messageWrapper.append(userMessage);

  containerInner.append(messageWrapper);

  const closeDiv = document.createElement('div');
  closeDiv.classList.add('toaster--close');

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.classList.add('icon', 'cross-icon-black', 'toaster--close-btn', 'js-close-toaster');
  closeButton.setAttribute('aria-label', 'Close tooltip');
  closeDiv.append(closeButton);

  containerInner.append(closeDiv);
  container.append(containerInner);
  section.append(container);

  block.innerHTML = '';
  moveInstrumentation(block, section);
  block.append(section);

  const closeTriggers = section.querySelectorAll('.js-close-toaster');
  closeTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      section.classList.remove('is-open');
    });
  });
}
