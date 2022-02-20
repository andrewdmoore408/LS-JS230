document.addEventListener('DOMContentLoaded', event => {
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');
  const closeModalBtn = modalContent.querySelector('img.closeModal');

  let modalDisplayed = false;

  function displayModal(staffLink) {
    modalDisplayed = true;

    const staffName = staffLink.alt;
    const staffText = document.querySelector(`p[data-about*="${staffName}"]`).textContent.trim();
    const modalImage = modal.querySelector('img.modalPhoto');
    const modalName = modal.querySelector('h3');
    const modalText = modal.querySelector('p');

    modalImage.setAttribute('src', staffLink.src);
    modalName.textContent = staffName;
    modalText.textContent = staffText;

    modal.style.display = 'block';
  }

  function clearModal() {
    modalDisplayed = false;
    modal.style.display = 'none';
  }

  closeModalBtn.addEventListener('click', event => {
    clearModal();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modalDisplayed) {
      event.preventDefault();
      clearModal();
    }
  });

  const teamList = document.querySelector('main ul');

  teamList.addEventListener('click', event => {
    event.preventDefault();

    if (event.target.classList.contains('triggerModal')) {
      if (event.target.tagName === 'A') {
        displayModal(event.target.querySelector('img.triggerModal'));
      } else {
        displayModal(event.target);
      }
    }
  });

  document.addEventListener('click', event => {
    event.preventDefault();

    if (event.target.classList.contains('modalOverlay')) {
      clearModal();
    }
  });
});