/*
Step 1: Fetch Photos Data and Render Photos on Page Load

For this step, we're going to issue an AJAX request to the server to get the JSON data for all the photos on page load, then use that to:

    Render the photos template, and write it to the #slides div
    Render the photo_information template using the first photo's data, and write it to section > header element that needs to contain the photo information

The API end point that we need to use for this step:

    Path: /photos
    HTTP method: GET
    Returns: an array of photos data in JSON format

Since this is an HTTP GET, feel free to type http://localhost:3000/photos in your browser to see the data that it returns. If you're stuck or need a hint, check out the solution below.

A couple of hints on how to approach the implementation:

    Spend some time looking through the Handlebars templates to understand the data that needs to be supplied to each
    Using your browser, make some calls to the various API endpoints. Use the DevTools network tab to see what json data is returned
*/
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

  const photos = [];
  const templates = {};

  [...document.querySelectorAll("script[type='text/x-handlebars']")].filter(element => !element.dataset.type).forEach(tmpl => {
    templates[tmpl.id] = Handlebars.compile(tmpl.innerHTML);
  });

  [...document.querySelectorAll('script[type="text/x-handlebars"]')].filter(element => element.dataset.type === 'partial').forEach(tmpl => {
    templates[tmpl.id] = Handlebars.registerPartial(tmpl.id, tmpl.innerHTML);
  });

  fetch('/photos')
    .then(response => response.json())
    .then(photosArray => {
      photosArray.forEach(photo => {
        photos.push(Object.create(Photo).init(photo));
      });

      document.querySelector('#slides').innerHTML = templates.photos({photos: photos});

      document.querySelector('section > header').innerHTML = templates.photo_information(photos[0]);

      fetch(`comments?photo_id=${photos[0].id}`)
        .then(response => response.json())
        .then(commentsArray => {
          document.querySelector('#comments > ul').innerHTML = templates.photo_comments({comments: commentsArray});
        });
    });
});