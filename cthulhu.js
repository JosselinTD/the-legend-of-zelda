AFRAME.registerPrimitive('a-cthulhu', {
  defaultComponents: {
    'gltf-model': '#cthulhu',
    'cthulhu': {}
  }
});

AFRAME.registerComponent('cthulhu', {
  init: function() {
    if (userPosition) {
      this.el.object3D.lookAt(userPosition);
    }
  }
});
