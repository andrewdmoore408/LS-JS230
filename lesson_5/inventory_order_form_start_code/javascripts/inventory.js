let inventory;

(function() {
  inventory = {
    lastId: 0,
    collection: [],
    setDate: function() {
      let date = new Date();
      document.getElementById('order_date').textContent = date.toUTCString();
    },
    cacheTemplate: function() {
      const template = document.getElementById('inventory_item');
      const makeItemTemplate = Handlebars.compile(template.innerHTML);
      // this.template = template.innerHTML;
      this.makeItemTemplate = makeItemTemplate;
      template.remove();
    },
    add: function() {
      this.lastId++;
      let item = {
        id: this.lastId,
        name: "",
        stock_number: "",
        quantity: 1
      };
      this.collection.push(item);

      return item;
    },
    remove: function(idx) {
      this.collection = this.collection.filter(function(item) {
        return item.id !== idx;
      });
    },
    get: function(id) {
      let found_item;

      this.collection.forEach(function(item) {
        if (item.id === id) {
          found_item = item;
          return false;
        }
      });

      return found_item;
    },
    getValue(element, selector) {
      return element.querySelector(selector).value;
    },
    update: function(item) {
      let id = this.findID(item),
          newItem = this.get(id);

      newItem.name = this.getValue(item, '[name^=item_name]');
      newItem.stock_number = +(this.getValue(item, '[name^=item_stock_number]'));
      newItem.quantity = +(this.getValue(item, '[name^=item_quantity]'));
    },
    // May need updating
    newItem: function(e) {
      e.preventDefault();
      var item = this.add(),
          item = this.makeItemTemplate({id: item.id});

      document.getElementById('inventory').innerHTML += item;

      [...document.querySelectorAll('a.delete')].forEach(deleteAnchor => {
        deleteAnchor.addEventListener('click', event => {
          this.deleteItem(event);
        });
      });
    },
    findParent: function(e) {
      return e.target.closest('tr');
    },
    findID: function(item) {
      return +(this.getValue(item, 'input[type=hidden'));
    },
    deleteItem: function(e) {
      e.preventDefault();
      let item = this.findParent(e);
      item.remove();
      this.remove(this.findID(item));
    },
    updateItem: function(e) {
      var item = this.findParent(e);

      this.update(item);
    },
    bindEvents: function() {
      document.getElementById('add_item').addEventListener('click', event => {
        this.newItem(event);
      });
      document.getElementById('inventory').addEventListener('focusout', event => {
        if (event.target.tagName === 'INPUT') {
          this.updateItem(event);
        }
      });
    },
    init: function() {
      this.setDate();
      this.cacheTemplate();
      this.bindEvents();
    }
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  inventory.init();
});
