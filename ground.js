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
      if (tile !== 'sand' && tile.indexOf('mountain') === -1 && tile !== 'tree') {
        v.z = -10
      }
    });
    /*geometry.faces = geometry.faces.filter(function(face) {
      return terrainData[face.a] !== -1 || terrainData[face.b] !== -1 || terrainData[face.c] !== -1;
    });*/
    var mat = new THREE.MeshPhongMaterial({
      color: Colors.yellow_m,
      flatShading: true,
      side: THREE.DoubleSide
    });
    var mesh = new THREE.Mesh(geometry, mat);
    this.el.setObject3D('mesh', mesh);
  }
})
