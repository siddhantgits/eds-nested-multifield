import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    mainIconRow,
    userIconRow,
    timerRow,
    signinMsgRow,
    signoutMsgRow,
    userMessageRow,
  ] = [...block.children];

  // Read content from cells
  const mainIconPicture = mainIconRow?.querySelector('picture');
  const userIconPicture = userIconRow?.querySelector('picture');
  const timer = timerRow?.textContent.trim();
  const signinMsg = signinMsgRow?.textContent.trim();
  const signoutMsg = signoutMsgRow?.textContent.trim();
  const userMessage = userMessageRow?.textContent.trim();

  // Create the main section element
  const section = document.createElement('section');
  section.classList.add('toaster', 'toaster-signin');
  section.setAttribute('aria-label', 'Toaster Signin Module');

  // Set data attributes
  if (timer) {
    section.setAttribute('data-timer', timer);
  }
  if (signinMsg) {
    section.setAttribute('data-signin-msg', signinMsg);
  }
  if (signoutMsg) {
    section.setAttribute('data-signout-msg', signoutMsg);
  }

  // Toaster Overlay
  const overlay = document.createElement('div');
  overlay.classList.add('toaster--overlay', 'js-close-toaster');
  section.append(overlay);

  // Toaster Container
  const toasterContainer = document.createElement('div');
  toasterContainer.classList.add('toaster--container');

  // Main Icon
  if (mainIconPicture) {
    const mainIconImg = mainIconPicture.querySelector('img');
    if (mainIconImg) {
      const optimizedMainIcon = createOptimizedPicture(mainIconImg.src, mainIconImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(mainIconPicture, optimizedMainIcon.querySelector('img'));
      toasterContainer.append(optimizedMainIcon);
    }
  }

  // Toaster Container Inner
  const toasterContainerInner = document.createElement('div');
  toasterContainerInner.classList.add('toaster--container-inner');

  // Message Wrapper
  const messageWrapper = document.createElement('div');
  messageWrapper.classList.add('toaster--message-wrapper');

  // User Icon
  const toasterUser = document.createElement('div');
  toasterUser.classList.add('toaster--user');
  if (userIconPicture) {
    const userIconImg = userIconPicture.querySelector('img');
    if (userIconImg) {
      const optimizedUserIcon = createOptimizedPicture(userIconImg.src, userIconImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(userIconPicture, optimizedUserIcon.querySelector('img'));
      toasterUser.append(optimizedUserIcon);
    }
  }
  messageWrapper.append(toasterUser);

  // User Message
  const userMessageDiv = document.createElement('div');
  userMessageDiv.classList.add('toaster--user-message', 'bodySmallRegular');
  userMessageDiv.textContent = userMessage || '';
  messageWrapper.append(userMessageDiv);

  toasterContainerInner.append(messageWrapper);

  // Close Button
  const toasterClose = document.createElement('div');
  toasterClose.classList.add('toaster--close');
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.classList.add('icon', 'cross-icon-black', 'toaster--close-btn', 'js-close-toaster');
  closeButton.setAttribute('aria-label', 'Close tooltip');
  toasterClose.append(closeButton);
  toasterContainerInner.append(toasterClose);

  toasterContainer.append(toasterContainerInner);
  section.append(toasterContainer);

  // Replace the block content with the new structure
  block.innerHTML = '';
  block.append(section);

  // Add event listeners for closing the toaster
  const closeTriggers = block.querySelectorAll('.js-close-toaster');
  closeTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      block.classList.remove('active');
    });
  });
}
