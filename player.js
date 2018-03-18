var basicSwordOrigin = [0, 0, 0];
var basicSwordScale = [0.04, 0.04, 0.04];
var basicSwordRotation = [0, 0, 0];

var items = [
	{
		id: '#basicSword',
		position: [18.5, 0.5, -67.5],
		scale: [0, 0, 0],
		rotation: [0, 15, 180]
	}
];

items.forEach(function(item) {
	var origin;
	var scale;
	var rotation;

	switch (item.id) {
		case '#basicSword':
			origin = basicSwordOrigin;
			scale = basicSwordScale;
			rotation = basicSwordRotation;
			break;
	}
	document.write(`
		<a-entity gltf-model="${item.id}"
		position="${getAttribute(item.position, origin)}"
		scale="${getAttribute(item.scale, scale)}"
		rotation="${getAttribute(item.rotation, rotation)}"
		${item.options ? item.options : ''}>
		${item.inside ? item.inside : ''}
		</a-entity>`);
});

