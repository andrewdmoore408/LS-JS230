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

  function setUpHandlebarsTemplatesPartials() {
    [...document.querySelectorAll("script[type='text/x-handlebars']")].filter(element => !element.dataset.type).forEach(tmpl => {
      templates[tmpl.id] = Handlebars.compile(tmpl.innerHTML);
    });

    [...document.querySelectorAll('script[type="text/x-handlebars"]')].filter(element => element.dataset.type === 'partial').forEach(tmpl => {
      templates[tmpl.id] = Handlebars.registerPartial(tmpl.id, tmpl.innerHTML);
    });
  }

  function renderPhotos() {
    document.querySelector('#slides').innerHTML = templates.photos({ photos: photos });
  }

  function renderPhotoInfo(photo) {
    document.querySelector('section > header').innerHTML = templates.photo_information(photo);
  }

  function renderPhotoComments(commentsArray) {
    document.querySelector('#comments > ul').innerHTML = templates.photo_comments({ comments: commentsArray });
  }

  const photos = [];
  const templates = {};

  setUpHandlebarsTemplatesPartials();

  fetch('/photos')
    .then(response => response.json())
    .then(photosArray => {
      photosArray.forEach(photo => {
        photo.src = photo.src.replace('placehold.it', 'via.placeholder.com');
        photos.push(Object.create(Photo).init(photo));
      });

      renderPhotos();
      renderPhotoInfo(photos[0]);

      fetch(`comments?photo_id=${photos[0].id}`)
        .then(response => response.json())
        .then(commentsArray => renderPhotoComments(commentsArray));
    });
});