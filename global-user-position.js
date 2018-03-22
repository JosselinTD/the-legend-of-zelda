var userPosition;
AFRAME.registerComponent('save-position', {
	init: function() {
		userPosition = this.el.getAttribute('position');
	},
	tick: function() {
		userPosition = this.el.getAttribute('position');
	}
});
