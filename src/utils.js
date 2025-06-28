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
    clearInterval(intervalRef);
    closeBtn.removeEventListener('click', onCloseBtnClick);
  }

  closeBtn.addEventListener('click', onCloseBtnClick);
}
