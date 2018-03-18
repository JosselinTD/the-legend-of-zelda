var door1Origin = [0, 5, 0];
var door1Scale = [0.2, 1, 1];
var door1Rotation = [0, 90, 0];

var doors = [
	{
		id: '#door1',
		position: [21, -11.5, -54],
		scale: [0.2, 0, -0.3],
		rotation: [0, 15, 0]
	}
];

doors.forEach(function(door) {
	var origin = door1Origin;
	var scale = door1Scale;
	var rotation = door1Rotation;
	document.write(`
		<a-entity gltf-model="${door.id}"
		position="${getPosition(door.position, origin)}"
		scale="${getScale(door.scale, scale)}"
		rotation="${getRotation(door.rotation, rotation)}">
		</a-entity>`);
});

function getPosition(door, origin) {
	return (door[0] + origin[0]) + ' ' + (door[1] + origin[1]) + ' ' + (door[2] + origin[2]);
}

function getScale(door, scale) {
	return (door[0] + scale[0]) + ' ' + (door[1] + scale[1]) + ' ' + (door[2] + scale[2]);
}

function getRotation(door, rotation) {
	return (door[0] + rotation[0]) + ' ' + (door[1] + rotation[1]) + ' ' + (door[2] + rotation[2]);
}
