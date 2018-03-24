var itemsArray = [
  'tree',
  'stairway',
  'green_knight',
  'entrance',
  'plank',
  'white_knight',
  'green_strange',
  'brown_knight',
  'white_tree',
  'brown_strange',
  'white_tomb',
  'brown_tree'
];

AFRAME.registerPrimitive('a-ground', {
  defaultComponents: {
    ground: {},
    rotation: {x: -90, y: 0, z: 0},
    scale: {x: 5, y: 5, z: 0.6},
    position: {x: (256 * 5 / 2), y: 0, z: (88 * 5 / 2)}
  }
});

AFRAME.registerComponent('ground', {
  schema: {
    width: {default: 255},
    depth: {default: 87}
  },
  init: function() {
    var self = this;
    var geometry = new THREE.PlaneGeometry(this.data.width, this.data.depth, this.data.width, this.data.depth);
    
    geometry.vertices.forEach(function(v, index) {
      v.index = index;
      var correspondanceX = v.x + self.data.width / 2
      var correspondanceY = -v.y + self.data.depth / 2
      var tile = map[correspondanceY][correspondanceX]
      if (tile !== 'sand' && tile.indexOf('mountain') === -1 && itemsArray.indexOf(tile) === -1) {
        v.z = -10
      }
    });
    
    var waves = [];
    for (let v, i = 0, l = geometry.vertices.length; i < l; i++) {
      v = geometry.vertices[i];
      waves.push({
        z: v.z,
        ang: Math.random() * Math.PI * 2,
        amp: 0.05 + Math.random() * 0.3,
        speed: (0.5 + Math.random() * 2) / 1000 // radians / frame
      });
    }

    for (let v, vprops, i = 0; (v = geometry.vertices[i]); i++){
      vprops = waves[v.index];
      v.z = vprops.z + Math.sin(vprops.ang) * vprops.amp;
    }

    var mat = new THREE.MeshPhongMaterial({
      color: Colors.yellow_m,
      flatShading: true,
      side: THREE.DoubleSide,
      emissive: Colors.yellow_d,
      emissiveIntensity: 0.1,
      shininess: 0
    });
    var mesh = new THREE.Mesh(geometry, mat);
    this.el.setObject3D('mesh', mesh);
  }
})
