AFRAME.registerPrimitive('a-ocean-2', {
  defaultComponents: {
    'ocean-2': {}
  }
});

AFRAME.registerComponent('ocean-2', {
  init: function() {
    var el = this.el;
    var waterGeometry = new THREE.PlaneBufferGeometry( 10000, 10000 );
    var water = new THREE.Water(
      waterGeometry,
      {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load('images/waternormals.jpg', function ( texture ) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
        alpha: 1.0,
        sunDirection: new THREE.Vector3(0.43, 1, 1),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale:  3.7
      }
    );
    el.setObject3D('mesh', water);
  }
});

