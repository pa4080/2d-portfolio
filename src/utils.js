import { TITLE_DEFAULT, TITLE_PREFIX, TITLES } from './constants';

/**
 * @param {string} text
 * @param {function} onDisplayEnd
 */
export function displayDialogue(text, onDisplayEnd) {
  // Display dialogue
  const dialogueUi = document.getElementById('textbox-container');
  dialogueUi.style.display = 'block';

  // Display text within the dialogue
  const dialogue = document.getElementById('dialogue');

  let index = 0;
  let currentText = '';
  const intervalRef = setInterval(() => {
    if (index < text.length) {
      currentText += text[index];
      dialogue.innerHTML = currentText;
      index++;
      return;
    }

    clearInterval(intervalRef);
  }, 5);

  // Handle close button
  const closeBtn = document.getElementById('close');

  function onCloseBtnClick() {
    onDisplayEnd();
    dialogueUi.style.display = 'none';
    dialogue.innerHTML = '';
    document.title = TITLE_DEFAULT;
    clearInterval(intervalRef);
    closeBtn.removeEventListener('click', onCloseBtnClick);
  }

  closeBtn.addEventListener('click', onCloseBtnClick);
}

/**
 * @param {string} titleKey
 */
export function setPageTitle(titleKey) {
  document.title = `${TITLE_PREFIX} ${TITLES[titleKey]}`;
}

export function closeDialogue() {
  const closeBtn = document.getElementById('close');
  closeBtn.click();
}

/**
 * @param {KaplayCtx} kCtx
 */
export function setCamScale(kCtx) {
  const resizeFactor = kCtx.width() / kCtx.height();

  if (resizeFactor < 1) {
    return kCtx.camScale(kCtx.vec2(1));
  }

  kCtx.camScale(kCtx.vec2(1.5));
}
