AFRAME.registerComponent('emissive-material', {
	init: function() {
		this.el.getObject3D('mesh').receiveShadow = false;
	}
});
