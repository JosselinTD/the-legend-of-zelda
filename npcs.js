var wiseManOrigin = [0, 0, 0];
var wiseManScale = [1, 1, 1];
var wiseManRotation = [0, 0, 0];

var npcs = [
	{
		id: '#wiseMan',
		position: [18.5, 0, -69.5],
		scale: [0, 0, 0],
		rotation: [0, 180, 0],
		options: 'animation-mixer="clip: Breathing;"'
	}
];

npcs.forEach(function(npc) {
	var origin;
	var scale;
	var rotation;

	switch (npc.id) {
		case '#wiseMan':
			origin = wiseManOrigin;
			scale = wiseManScale;
			rotation = wiseManRotation;
			break;
	}
	document.write(`
		<a-entity gltf-model="${npc.id}"
		position="${getAttribute(npc.position, origin)}"
		scale="${getAttribute(npc.scale, scale)}"
		rotation="${getAttribute(npc.rotation, rotation)}"
		${npc.options ? npc.options : ''}>
		${npc.inside ? npc.inside : ''}
		</a-entity>`);
});

function getAttribute(a, b) {
	return (a[0] + b[0]) + ' ' + (a[1] + b[1]) + ' ' + (a[2] + b[2]);
}
