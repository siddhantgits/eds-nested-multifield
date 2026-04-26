import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    mainIconCell,
    userIconCell,
    isLoggedInCell,
    timerCell,
    signinMsgCell,
    signoutMsgCell,
    userMessageCell,
  ] = [...block.children];

  const isLoggedIn = isLoggedInCell?.textContent.trim();
  const timer = timerCell?.textContent.trim();
  const signinMsg = signinMsgCell?.textContent.trim();
  const signoutMsg = signoutMsgCell?.textContent.trim();
  const userMessage = userMessageCell?.textContent.trim();

  block.classList.add('toaster', 'toaster-signin');
  block.setAttribute('data-is-loggedin', isLoggedIn);
  block.setAttribute('data-timer', timer);
  block.setAttribute('data-signin-msg', signinMsg);
  block.setAttribute('data-signout-msg', signoutMsg);
  block.setAttribute('aria-label', 'Toaster Signin Module');

  const toasterOverlay = document.createElement('div');
  toasterOverlay.classList.add('toaster--overlay', 'js-close-toaster');
  block.append(toasterOverlay);

  const toasterContainer = document.createElement('div');
  toasterContainer.classList.add('toaster--container');
  block.append(toasterContainer);

  const mainIcon = mainIconCell?.querySelector('picture');
  if (mainIcon) {
    const img = mainIcon.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(mainIcon, optimizedPic.querySelector('img'));
    toasterContainer.append(optimizedPic);
  }

  const toasterContainerInner = document.createElement('div');
  toasterContainerInner.classList.add('toaster--container-inner');
  toasterContainer.append(toasterContainerInner);

  const toasterMessageWrapper = document.createElement('div');
  toasterMessageWrapper.classList.add('toaster--message-wrapper');
  toasterContainerInner.append(toasterMessageWrapper);

  const toasterUser = document.createElement('div');
  toasterUser.classList.add('toaster--user');
  toasterMessageWrapper.append(toasterUser);

  const userIcon = userIconCell?.querySelector('picture');
  if (userIcon) {
    const img = userIcon.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(userIcon, optimizedPic.querySelector('img'));
    toasterUser.append(optimizedPic);
  }

  const toasterUserMessage = document.createElement('div');
  toasterUserMessage.classList.add('toaster--user-message', 'bodySmallRegular');
  toasterUserMessage.textContent = userMessage;
  toasterMessageWrapper.append(toasterUserMessage);

  const toasterClose = document.createElement('div');
  toasterClose.classList.add('toaster--close');
  toasterContainerInner.append(toasterClose);

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.classList.add('icon', 'cross-icon-black', 'toaster--close-btn', 'js-close-toaster');
  closeButton.setAttribute('aria-label', 'Close tooltip');
  toasterClose.append(closeButton);

  const closeToaster = () => {
    block.classList.remove('active');
  };

  toasterOverlay.addEventListener('click', closeToaster);
  closeButton.addEventListener('click', closeToaster);

  // Remove original block content
  [...block.children].forEach((child) => {
    if (child !== toasterOverlay && child !== toasterContainer) {
      child.remove();
    }
  });
}
