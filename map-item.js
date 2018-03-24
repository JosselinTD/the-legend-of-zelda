AFRAME.registerPrimitive('a-map-item', {
  defaultComponents: {
    'map-item': {}
  },
  mappings: {
    distance: 'map-item.distance'
  }
});

AFRAME.registerComponent('map-item', {
  schema: {
    distance: {default: 0}
  },
  init: function() {
    var self = this;
    self.items = [];

    var itemCount = 0;
    map.forEach(function(line, i) {
      line.forEach(function(tile, j) {
        if (tile === 'tree' || tile === 'stairway' || tile === 'green_knight' ||
            tile === 'entrance' || tile === 'plank' || tile === 'white_knight' ||
            tile === 'green_strange' || tile === 'brown_knight' || tile === 'white_tree' ||
            tile === 'brown_strange' || tile === 'white_tomb' || tile === 'brown_tree') {
          self.items.push({
            x: j * 5,
            y: 0,
            z: i * 5,
            id: itemCount,
            tile: tile
          });
          itemCount++;
        }
      });
    });
  },
  tick: function() {
    var self = this;
    var neededPositions = [];
    this.items.forEach(function(item) {
      if (Math2.distance(item, userPosition) <= self.data.distance) {
        neededPositions.push(item);
      }
    });
    var currentItems = Array.prototype.slice.call(this.el.childNodes, 0);
    neededPositions = neededPositions.filter(function(p) {
      return !currentItems.find(c => c.getAttribute('item-id') == p.id);
    });
    currentItems.filter(function(c) {
      return Math2.distance(c.getAttribute('position'), userPosition) > self.data.distance;
    }).forEach(function(item) {
      self.el.removeChild(item);
    });

    neededPositions.forEach(function(p) {
      var newItem;
      switch (p.tile) {
        case 'tree':
          newItem = document.createElement('a-tree');
          break;
        case 'green_strange':
          newItem = document.createElement('a-cthulhu');
          break;
        case 'green_knight':
          newItem = document.createElement('a-ares');
          break;
        case 'entrance':
          newItem = document.createElement('a-entrance');
          break;
      }
      if (newItem) {
        newItem.setAttribute('position', p.x + ' ' + p.y + ' ' + p.z);
        newItem.setAttribute('item-id', p.id);
        newItem.setAttribute('shadow', 'cast: true');
        self.el.appendChild(newItem);
      } else {
        // console.error(`${p.tile} (${p.x}, ${p.z}) not added`);
      }
    });
  }
});
