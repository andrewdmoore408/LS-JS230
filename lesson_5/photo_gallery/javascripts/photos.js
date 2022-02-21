document.addEventListener('DOMContentLoaded', () => {
  function displayImage(event) {
    const newImage = event.target;

    const mainImage = document.querySelector('figure img');
    mainImage.src = newImage.src;
    mainImage.alt = newImage.alt;

    document.querySelector('figcaption').textContent = newImage.title;
  }

  function resetActiveClass() {
    thumbnails.forEach(thumbnail => thumbnail.classList.remove('active'));
  }

  const thumbnails = [...document.querySelectorAll('li img')];

  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', event => {
      resetActiveClass();
      event.target.classList.add('active');
      displayImage(event);
    });
  });
});