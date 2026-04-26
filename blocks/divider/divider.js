import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const dividerComp = document.createElement('div');
  dividerComp.classList.add('divider-comp', 'paddingBottom24', 'paddingTop24', 'mobile-padding14');
  moveInstrumentation(block, dividerComp);

  const dividerLineLg = document.createElement('div');
  dividerLineLg.classList.add('divider-line', 'd-lg-block', 'd-none');
  dividerLineLg.style.backgroundColor = '#eaeaec';
  dividerComp.append(dividerLineLg);

  const dividerLineSm = document.createElement('div');
  dividerLineSm.classList.add('divider-line', 'd-none', 'd-lg-none', 'd-sm-block');
  dividerLineSm.style.backgroundColor = '#eaeaec';
  dividerComp.append(dividerLineSm);

  const dividerLineXs = document.createElement('div');
  dividerLineXs.classList.add('divider-line', 'd-block', 'd-sm-none');
  dividerLineXs.style.backgroundColor = '#eaeaec';
  dividerComp.append(dividerLineXs);

  block.innerHTML = '';
  block.append(dividerComp);
}
