/**
 * Mountain component.
 */
var terrainData;
AFRAME.registerComponent('mountain', {
  schema: {
    color: {default: 'rgb(92, 32, 0)'},
    shadowColor: {default: 'rgb(128, 96, 96)'},
    sunPosition: {type: 'vec3', default: {x: 1, y: 1, z: 1}},
    worldDepth: {default: 87},
    worldWidth: {default: 255}
  },

  init: function () {
    var data = this.data;

    var worldDepth = data.worldDepth;
    var worldWidth = data.worldWidth;

    // Generate heightmap.
    terrainData = generateHeight(worldWidth, worldDepth);
    // Create geometry.
    var geometry = new THREE.PlaneGeometry(worldWidth, worldDepth, worldWidth, worldDepth);
    geometry.mergeVertices();
    CustomMesh.flatshadeGeometry(geometry);
    geometry.faces = geometry.faces.filter(function(face) {
      return terrainData[face.a] !== -1 || terrainData[face.b] !== -1 || terrainData[face.c] !== -1;
    });
		var vertices = geometry.vertices;
		for (var i = 0, l = vertices.length; i < l; i ++) {
		  vertices[i].z = terrainData[i] * 10;
    }
    // Create mesh.
    var mat = new THREE.MeshPhongMaterial({
      color: data.color,
      transparent: data.opacity < 1,
      opacity: data.opacity,
      flatShading: true,
    });
    var mesh = new THREE.Mesh(geometry, mat);
    this.el.setObject3D('mesh', mesh);
  }
});

function generateHeight(width, height) {
  noise.seed(Math.random());

  var data = [];

  for (var x = 0; x <= width; x++) {
    for (var y = 0; y <= height; y++) {
      data.push(noise.simplex2(x, y) + 1);
    }
  }

  for (var i = 0; i < map.length; i++) {
    var currentLine = map[i];
    for (var j = 0; j < currentLine.length; j++) {
      if (currentLine[j].indexOf('mountain') === -1) {
        data[(i * currentLine.length) + j] = -1;
      }
    }
  }

  return data;
}

/**
 * <a-mountain>
 */
AFRAME.registerPrimitive('a-mountain', {
  defaultComponents: {
    mountain: {},
    rotation: {x: -90, y: 0, z: 0},
    scale: {x: 5, y: 5, z: 0.6},
    position: {x: (255 * 5 / 2) + 2.5, y: 2, z: (87 * 5 / 2) + 2.5}
  },

  mappings: {
    color: 'mountain.color',
    'shadow-color': 'mountain.shadowColor',
    'sun-position': 'mountain.sunPosition',
    'world-depth' :'mountain.worldDepth',
    'world-width' :'mountain.worldWidth'
  }
});
