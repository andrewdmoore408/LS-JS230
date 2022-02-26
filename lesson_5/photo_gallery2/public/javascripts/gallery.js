document.addEventListener('DOMContentLoaded', () => {
  const Photo = {
    init({ src, title, created_at, caption, likes, favorites, id }) {
      this.src = src;
      this.created_at = created_at;
      this.title = title;
      this.caption = caption;
      this.likes = likes;
      this.favorites = favorites;
      this.id = id;

      return this;
    }
  };

  function attachSlideshowControls() {
    document.querySelector('a.prev').addEventListener('click', prev);
    document.querySelector('a.next').addEventListener('click', next);

    function next(event) {
      event.preventDefault();

      let activeIndex = photos.findIndex(photo => photo === activePhoto);

      activeIndex = (activeIndex === photos.length - 1) ? 0 : activeIndex += 1;

      activePhoto = photos[activeIndex];

      const activePhotoElement = document.querySelector(`#slides > figure[data-id="${activePhoto.id}"]`);
      document.querySelector('#slides').insertAdjacentElement('afterbegin', activePhotoElement);

      renderActivePhotoInfo();
      renderActivePhotoComments();
    }

    function prev(event) {
      event.preventDefault();

      let activeIndex = photos.findIndex(photo => photo === activePhoto);
      const precedingIndex = (activeIndex === 0) ? photos.length - 1 : activeIndex - 1;
      const precedingPhoto = photos[precedingIndex];

      const precedingPhotoElement = document.querySelector(`#slides > figure[data-id="${precedingPhoto.id}"]`);
      document.querySelector('#slides').insertAdjacentElement('afterbegin', precedingPhotoElement);

      activePhoto = precedingPhoto;

      renderActivePhotoInfo();
      renderActivePhotoComments();
    }
  }

  function setUpHandlebarsTemplatesPartials() {
    [...document.querySelectorAll("script[type='text/x-handlebars']")].filter(element => !element.dataset.type).forEach(tmpl => {
      templates[tmpl.id] = Handlebars.compile(tmpl.innerHTML);
    });

    [...document.querySelectorAll('script[type="text/x-handlebars"]')].filter(element => element.dataset.type === 'partial').forEach(tmpl => {
      templates[tmpl.id] = Handlebars.registerPartial(tmpl.id, tmpl.innerHTML);
    });
  }

  function renderPhotos() {
    document.querySelector('#slides').innerHTML = templates.photos({photos: photos});
  }

  function renderActivePhotoInfo() {
    document.querySelector('section > header').innerHTML = templates.photo_information(activePhoto);
  }

  async function renderActivePhotoComments() {
    const commentsArray = await getActivePhotoComments();

    document.querySelector('#comments > ul').innerHTML = templates.photo_comments({comments: commentsArray});
  }

  async function getActivePhotoComments() {
    return await fetch(`comments?photo_id=${activePhoto.id}`)
                                  .then(response => response.json());
  }

  const photos = [];
  const templates = {};
  let activePhoto;

  attachSlideshowControls();
  setUpHandlebarsTemplatesPartials();

  fetch('/photos')
    .then(response => response.json())
    .then(photosArray => {
      const localPhotoFilenames = ['./images/cows_on_road_country.jpg', './images/sete_cidades_daylight.jpg', './images/sete_cidades_sunset.jpg'];

      photosArray.forEach((photo, index) => {
        // use local photos
        photo.src = localPhotoFilenames[index];
        // photo.src = photo.src.replace('placehold.it', 'via.placeholder.com');
        photos.push(Object.create(Photo).init(photo));
      });

      activePhoto = photos[0];

      renderPhotos();
      renderActivePhotoInfo();
      renderActivePhotoComments();
    });
});