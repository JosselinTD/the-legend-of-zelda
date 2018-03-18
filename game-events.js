var triggers = [
	{
		name: 'sword-announce',
		center: [18.5, 0.5, -67.5],
		distance: 5,
		triggered: false,
		execute: function() {
			var audio = new Audio('sound/wiseman.mp3');
			audio.play();
			document.querySelector('a-scene').insertAdjacentHTML('beforeend', `
				<a-entity position="18.5 3 -67.5"
			      rotation="0 15 0"
			      text="color: red; align: center; value: IT'S DANGEROUS TO GO ALONE\n TAKE THIS; width: 10;">
			    </a-entity>
			`);
		}
	}
];

AFRAME.registerComponent('game-events', {
	tick: function() {
		var position = this.el.object3D.position;
		triggers.forEach(function(event) {
			if (!event.triggered && isDistanceOk(event, position)) {
				event.triggered = true;
				event.execute();
			}
		});
	}
});

function isDistanceOk(event, position) {
	var distance = Math.sqrt(Math.pow(event.center[0] - position.x, 2) + Math.pow(event.center[2] - position.z, 2));
	return distance <= event.distance;
}
