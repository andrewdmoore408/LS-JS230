document.addEventListener('DOMContentLoaded', event => {
  function addItemToList(name, quantity) {
    if (quantity === '') {
      quantity = '1';
    }

    const list = document.getElementById('grocery-list');
    const newItem = document.createElement('li');
    newItem.textContent = `${quantity} ${name}`;
    list.appendChild(newItem);
  }

  const form = document.querySelector('form');

  form.addEventListener('submit', event => {
    event.preventDefault();

    const [ name, quantity ] = [...form.querySelectorAll('input')].map(element => element.value);

    addItemToList(name, quantity);
    form.reset();
  });
});