var worldDepth = 87;
var worldWidth = 255;
var terrainData = generateHeight(worldWidth, worldDepth);
var mapWidth = 16;
var mapDepth = 11;

/**
 * Mountain component.
 */
var terrainData;
AFRAME.registerComponent('mountain', {
  schema: {
    color: {default: 'rgb(92, 32, 0)'},
    start: {default: 0}
  },

  init: function () {
    var data = this.data;
    var subTerrain = getSubTerrain(data.start);
    // Create geometry.
    var geometry = new THREE.PlaneGeometry(mapWidth, mapDepth, mapWidth, mapDepth);
    geometry.mergeVertices();
    CustomMesh.flatshadeGeometry(geometry);
    geometry.faces = geometry.faces.filter(function(face) {
      return subTerrain[face.a] !== -1 || subTerrain[face.b] !== -1 || subTerrain[face.c] !== -1;
    });
		var vertices = geometry.vertices;
		for (var i = 0, l = vertices.length; i < l; i ++) {
      if (subTerrain[i] !== 3 && (i === 0 || subTerrain[i-1] !== 3) &&
          subTerrain[i] !== -3 && (i === 0 || subTerrain[i-1] !== -3)) {
        vertices[i].z = subTerrain[i] * 10;
      } else { // entrance
        vertices[i].z = 7;
        vertices[i].y-=0.5;
      }
      if (subTerrain[i] === -3 || (i !== 0 && subTerrain[i-1] === -3)) {
        vertices[i].z = -10;
        vertices[i].y+=1;
      }
    }
    // Create mesh.
    var mat = new THREE.MeshPhongMaterial({
      color: data.color,
      transparent: data.opacity < 1,
      opacity: data.opacity,
      flatShading: true,
      shininess: 0
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
      if (currentLine[j].indexOf('entrance') !== -1) {
        data[(i * currentLine.length) + j] = 3;
      }
      if (i !== 0 && map[i-1][j].indexOf('entrance') !== -1) {
        data[(i * currentLine.length) + j] = -3;
      }
    }
  }

  return data;
}

function getSubTerrain(start) {
  var data = [];
  for (var i = start; i < (worldWidth * worldDepth) - mapWidth; i = i + worldWidth + 1) {
    for (var j = 0; j <= mapWidth; j++) {
      data.push(terrainData[i + j]);
    }
  }
  return data;
}

/**
 * <a-mountain>
 */
AFRAME.registerPrimitive('a-mountains', {
  defaultComponents: {
    mountains: {},
    rotation: {x: -90, y: 0, z: 0},
    scale: {x: 5, y: 5, z: 0.6}
  }
});

AFRAME.registerComponent('mountains', {
  init: function() {
    var el = this.el;
    var i = 0;
    var previ = 0;
    var avanceX = 0
    var avanceY = 0;
    while (i < worldWidth * worldDepth) {
      var newMountain = document.createElement('a-mountain');
      newMountain.setAttribute('start', i);
      newMountain.setAttribute('position', {
        x: avanceX,
        y: -avanceY,
        z: 0
      });
      el.appendChild(newMountain);

      i+=mapWidth;
      avanceX+=mapWidth;

      var currentLine = Math.floor(i / worldWidth);
      if (currentLine % mapDepth !== 0) {
        i = previ;
        i = i + (worldWidth+1) * (mapDepth);
        previ = i;
        avanceX = 0;
        avanceY+=mapDepth;
      }
    }
  }
});

AFRAME.registerPrimitive('a-mountain', {
  defaultComponents: {
    mountain: {}
  },
  mappings: {
    color: 'mountain.color',
    start: 'mountain.start'
  }
});
