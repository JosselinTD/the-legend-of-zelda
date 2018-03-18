var torch1Origin = [0, 1.1, 0];
var torch1Scale = [0.2, 0.2, 0.2];
var torch1Rotation = [0, 0, 0];

var fire1Origin = [0, 1.1, 0];
var fire1Scale = [0.2, 0.2, 0.2];
var fire1Rotation = [0, 0, 0];

var fire2Origin = [0, 1.1, 0];
var fire2Scale = [0.2, 0.2, 0.2];
var fire2Rotation = [0, 0, 0];

var torchs = [
	{
		id: '#torch-statue-1',
		position: [22, 0, -68],
		scale: [0, 0, 0],
		rotation: [0, 15, 0]
	},
	{
		id: '#torch-statue-1',
		position: [15, 0, -66],
		scale: [0, 0, 0],
		rotation: [0, 15, 0]
	},
	{
		id: '#fire1',
		position: [22, 0.1, -68],
		scale: [0, 0, 0],
		rotation: [0, 15, 0],
		options: 'spinning emissive-light material',
	},
	{
		id: '#fire2',
		position: [15, 1.5, -66],
		scale: [0, 0, 0],
		rotation: [0, 15, 0],
		options: 'spinning emissive-light material'
	},
];

torchs.forEach(function(torch) {
	var origin;
	var scale;
	var rotation;

	switch (torch.id) {
		case '#torch-statue-1':
			origin = torch1Origin;
			scale = torch1Scale;
			rotation = torch1Rotation;
			break;
		case '#fire1':
			origin = fire1Origin;
			scale = fire1Scale;
			rotation = fire1Rotation;
			break;
		case '#fire2':
			origin = fire2Origin;
			scale = fire2Scale;
			rotation = fire2Rotation;
			break;
	}
	document.write(`
		<a-entity gltf-model="${torch.id}"
		position="${getPosition(torch.position, origin)}"
		scale="${getScale(torch.scale, scale)}"
		rotation="${getRotation(torch.rotation, rotation)}"
		${torch.options ? torch.options : ''}>
		${torch.inside ? torch.inside : ''}
		</a-entity>`);
});

function getPosition(torch, origin) {
	return (torch[0] + origin[0]) + ' ' + (torch[1] + origin[1]) + ' ' + (torch[2] + origin[2]);
}

function getScale(torch, scale) {
	return (torch[0] + scale[0]) + ' ' + (torch[1] + scale[1]) + ' ' + (torch[2] + scale[2]);
}

function getRotation(torch, rotation) {
	return (torch[0] + rotation[0]) + ' ' + (torch[1] + rotation[1]) + ' ' + (torch[2] + rotation[2]);
}
