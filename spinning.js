AFRAME.registerComponent('spinning', {
	schema: {
		speed: {default: 1}
	},
	tick: function(t, dt) {
		var rotation = this.el.getAttribute('rotation');
		rotation.y += this.data.speed;
		this.el.setAttribute('rotation', rotation);
	}
});
