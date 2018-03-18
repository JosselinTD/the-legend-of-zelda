var mountain3Origin = [50, -25, 100];
var mountain3Scale = [0.5, 0.5, 0.5];
var mountain3Rotation = [0, 0, 0];

var mountain5Origin = [0, 0, 0];
var mountain5Scale = [0.5, 0.5, 0.5];
var mountain5Rotation = [0, 0, 0];

var mountains = [
	{
		id: '#mountain3',
		position: [0, 0, 50],
		scale: [0, 0, 0],
		rotation: [0, 0, 0]
	},
	{
		id: '#mountain3',
		position: [30, 0, 50],
		scale: [0, 0, 0],
		rotation: [0, 0, 0]
	},
	{
		id: '#mountain3',
		position: [60, 0, 50],
		scale: [0, 0, 0],
		rotation: [0, 0, 0]
	},
	{
		id: '#mountain3',
		position: [-30, 0, 50],
		scale: [0, 0, 0],
		rotation: [0, 0, 0]
	},
	{
		id: '#mountain3',
		position: [-60, 0, 50],
		scale: [0, 0, 0],
		rotation: [0, 0, 0]
	},
	{
		id: '#mountain3',
		position: [-40, 0, 30],
		scale: [0, 0, 0],
		rotation: [0, 0, 0]
	},
	{
		id: '#mountain3',
		position: [50, 0, 30],
		scale: [0, 0, 0],
		rotation: [0, 0, 0]
	},
	{
		id: '#mountain3',
		position: [40, 0, 0],
		scale: [0, 0, 0],
		rotation: [0, 0, 0]
	},
	{
		id: '#mountain3',
		position: [-45, 0, 0],
		scale: [0, 0, 0],
		rotation: [0, 0, 0]
	},
	{
		id: '#mountain3',
		position: [-30, 0, -60],
		scale: [0, 0, 0],
		rotation: [0, 0, 0]
	},
	{
		id: '#mountain5',
		position: [20, 0, -70],
		scale: [0, 0, 0],
		rotation: [0, 180, 0]
	},
];

mountains.forEach(function(mountain) {
	var origin;
	var scale;
	var rotation;

	switch (mountain.id) {
		case '#mountain3':
			origin = mountain3Origin;
			scale = mountain3Scale;
			rotation = mountain3Rotation;
			break;
		case '#mountain5':
			origin = mountain5Origin;
			scale = mountain5Scale;
			rotation = mountain5Rotation;
			break;
	}
	document.write(`
		<a-entity gltf-model="${mountain.id}"
		position="${getPosition(mountain.position, origin)}"
		scale="${getPosition(mountain.scale, scale)}"
		rotation="${getRotation(mountain.rotation, rotation)}">
		</a-entity>`);
});

function getPosition(mountain, origin) {
	return (mountain[0] + origin[0]) + ' ' + (mountain[1] + origin[1]) + ' ' + (mountain[2] + origin[2]);
}

function getScale(mountain, scale) {
	return (mountain[0] + scale[0]) + ' ' + (mountain[1] + scale[1]) + ' ' + (mountain[2] + scale[2]);
}

function getRotation(mountain, rotation) {
	return (mountain[0] + rotation[0]) + ' ' + (mountain[1] + rotation[1]) + ' ' + (mountain[2] + rotation[2]);
}
