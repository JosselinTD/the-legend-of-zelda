AFRAME.registerPrimitive('a-entrance', {
  defaultComponents: {
    'gltf-model': '#arch',
    scale: {x: 0.01, y: 0.01, z: 0.01},
    entrance: {}
  }
});


AFRAME.registerComponent('entrance', {
  init: function() {
    var position = this.el.getAttribute('position');
    position.z = position.z + 5.5;
    position.x = position.x + 4.5
    this.el.setAttribute('position', position);

    var geometry = new THREE.PlaneGeometry(300, 500);
	var material = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.DoubleSide});

	var blackPannel = new THREE.Mesh(geometry, material);
	blackPannel.position.set(0, 200, -40);

	this.el.setObject3D('blackPannel', blackPannel);
  }
});
