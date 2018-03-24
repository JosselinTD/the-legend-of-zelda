/**
 * Flat-shaded ocean primitive.
 *
 * Based on a Codrops tutorial:
 * http://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/
 */


AFRAME.registerPrimitive('a-ocean-3', {
  defaultComponents: {
    'ocean-3': {},
    rotation: {x: -90, y: 0, z:0},
    scale: {x: 5, y: -5, z: 1},
    position: {x: 2.5, y: -0.2, z: 2.5}
  },
  mappings: {
    width: 'ocean-tile.width',
    depth: 'ocean-tile.depth',
    density: 'ocean-tile.density',
    amplitude: 'ocean-tile.amplitude',
    'amplitude-variance': 'ocean-tile.amplitude-variance',
    speed: 'ocean-tile.speed',
    'speed-variance': 'ocean-tile.speed-variance',
    color: 'ocean-tile.color',
    opacity: 'ocean-tile.opacity'
  }
});
var first = true;
AFRAME.registerComponent('ocean-3', {
  schema: {
    // Dimensions of the ocean area.
    width: {default: 255, min: 0},
    depth: {default: 87, min: 0},

    // Density of waves.
    density: {default: 10},

    // Wave amplitude and variance.
    amplitude: {default: 0.05},
    'amplitude-variance': {default: 0.3},

    // Wave speed and variance.
    speed: {default: 0.5},
    'speed-variance': {default: 2},

    // Material.
    color: {default: '#7AD2F7', type: 'color'},
    opacity: {default: 0.8}
  },

  /**
   * Use play() instead of init(), because component mappings – unavailable as dependencies – are
   * not guaranteed to have parsed when this component is initialized.
   */
  play: function () {
    const el = this.el,
        data = this.data;
    let material = el.components.material;

    const geometry = new THREE.PlaneGeometry(data.width, data.depth, data.width, data.depth);
    
    geometry.scale(1, -1, 1);
    geometry.translate(data.width / 2, data.depth / 2, 0);

    this.vertexToUpdate = geometry.vertices.filter(function(v, index) {
      v.index = index;
      var nice = map[v.y][v.x] === 'water';
      return nice;
    });
    this.waves = [];
    for (let v, i = 0, l = geometry.vertices.length; i < l; i++) {
      v = geometry.vertices[i];
      this.waves.push({
        z: v.z,
        ang: Math.random() * Math.PI * 2,
        amp: data.amplitude + Math.random() * data['amplitude-variance'],
        speed: (data.speed + Math.random() * data['speed-variance']) / 1000 // radians / frame
      });
    }
    if (!material) {
      material = {};
      material.material = new THREE.MeshPhongMaterial({
        color: data.color,
        transparent: data.opacity < 1,
        opacity: data.opacity,
        flatShading: true,
        side: THREE.DoubleSide
      });
    }

    this.mesh = new THREE.Mesh(geometry, material.material);
    el.setObject3D('mesh', this.mesh);
  },

  remove: function () {
    this.el.removeObject3D('mesh');
  },

  tick: function (t, dt) {
    if (!dt) return;
    for (let v, vprops, i = 0; (v = this.vertexToUpdate[i]); i++){
      vprops = this.waves[v.index];
      v.z = vprops.z + Math.sin(vprops.ang) * vprops.amp;
      vprops.ang += vprops.speed * dt;
    }
    this.mesh.geometry.verticesNeedUpdate = true;
  }
});


AFRAME.registerPrimitive('a-tiled-ocean', {
  defaultComponents: {
    'tiled-ocean': {}
  },
  mappings: {
    distance: 'tiled-ocean.distance'
  }
});

AFRAME.registerComponent('tiled-ocean', {
  schema: {
    distance: {defaults: 50}
  },
  init: function() {
    var self = this;
    self.tiles = [];

    var tilesCount = 0;
    map.forEach(function(line, i) {
      line.forEach(function(tile, j) {
        if (tile === 'water') {
          self.tiles.push({
            x: j * 5,
            y: 0,
            z: i * 5,
            id: tilesCount
          });
          tilesCount++;
        }
      });
    });
  },
  tick: function() {
    var self = this;
    var neededPositions = [];
    this.tiles.forEach(function(tile) {
      if (Math2.distance(tile, userPosition) <= self.data.distance) {
        neededPositions.push(tile);
      }
    });
    var currentTiles = Array.prototype.slice.call(this.el.childNodes, 0);
    neededPositions = neededPositions.filter(function(p) {
      return !currentTiles.find(c => c.getAttribute('tile-id') == p.id);
    });
    currentTiles.filter(function(c) {
      return Math2.distance(c.getAttribute('position'), userPosition) > self.data.distance;
    }).forEach(function(tile) {
      self.el.removeChild(tile);
    });

    neededPositions.forEach(function(p) {
      var newTile = document.createElement('a-ocean-tile');
      newTile.setAttribute('position', p.x + ' ' + p.y + ' ' + p.z);
      newTile.setAttribute('tile-id', p.id);
      self.el.appendChild(newTile);
    });
  }
})

AFRAME.registerPrimitive('a-ocean-tile', {
  defaultComponents: {
    'ocean-tile': {},
    rotation: {x: -90, y: 0, z:0}
  },
  mappings: {
    width: 'ocean-tile.width',
    depth: 'ocean-tile.depth',
    density: 'ocean-tile.density',
    amplitude: 'ocean-tile.amplitude',
    'amplitude-variance': 'ocean-tile.amplitude-variance',
    speed: 'ocean-tile.speed',
    'speed-variance': 'ocean-tile.speed-variance',
    color: 'ocean-tile.color',
    opacity: 'ocean-tile.opacity'
  }
});

AFRAME.registerComponent('ocean-tile', {
  schema: {
    // Dimensions of the ocean area.
    width: {default: 5, min: 0},
    depth: {default: 5, min: 0},

    // Density of waves.
    density: {default: 10},

    // Wave amplitude and variance.
    amplitude: {default: 0.05},
    'amplitude-variance': {default: 0.3},

    // Wave speed and variance.
    speed: {default: 0.5},
    'speed-variance': {default: 2},

    // Material.
    color: {default: '#7AD2F7', type: 'color'},
    opacity: {default: 0.8}
  },

  /**
   * Use play() instead of init(), because component mappings – unavailable as dependencies – are
   * not guaranteed to have parsed when this component is initialized.
   */
  play: function () {
    const el = this.el,
        data = this.data;
    let material = el.components.material;

    const geometry = new THREE.PlaneGeometry(data.width, data.depth, data.density, data.density);
    geometry.mergeVertices();
    this.waves = [{"z":0,"ang":38.96313607511857,"amp":0.3397750979394567,"speed":0.0017748458291883785},{"z":0,"ang":38.670562325554116,"amp":0.3239677172201531,"speed":0.0017063456439909647},{"z":0,"ang":48.08888756173141,"amp":0.17716206183477523,"speed":0.00223272119829643},{"z":0,"ang":49.719144203896484,"amp":0.20344574965838452,"speed":0.0021780764814912563},{"z":0,"ang":43.893295667796274,"amp":0.38237705818054546,"speed":0.0019704489755633207},{"z":0,"ang":28.81550060725732,"amp":0.12384849934254581,"speed":0.0013242134653912033},{"z":0,"ang":29.50307050468951,"amp":0.2661233359405602,"speed":0.0013235836414382915},{"z":0,"ang":31.282629253715047,"amp":0.3170682529705995,"speed":0.001458071088952742},{"z":0,"ang":38.3900173634972,"amp":0.22886112602919276,"speed":0.0017121947536967762},{"z":0,"ang":52.5862166003296,"amp":0.19453932464405893,"speed":0.002345219367258973},{"z":0,"ang":34.48582739924734,"amp":0.3918628439749081,"speed":0.001642224613968521},{"z":0,"ang":49.72008485664924,"amp":0.2040317633269378,"speed":0.0021959311575763425},{"z":0,"ang":61.916282146754,"amp":0.34818280799015333,"speed":0.002885875365014019},{"z":0,"ang":44.849132876910524,"amp":0.11548928119872014,"speed":0.0019739906775505093},{"z":0,"ang":29.378247229283293,"amp":0.12289294047840159,"speed":0.0012378288614683871},{"z":0,"ang":27.68948177900288,"amp":0.21884753049435113,"speed":0.001189422574835005},{"z":0,"ang":39.784125219862155,"amp":0.12214099330755704,"speed":0.0018407587044910626},{"z":0,"ang":35.14252514492007,"amp":0.24827984410180057,"speed":0.0013906708183736942},{"z":0,"ang":50.48500322965871,"amp":0.3054837172647902,"speed":0.0022075983630315092},{"z":0,"ang":39.494374944392135,"amp":0.1334893905514895,"speed":0.0017167587146567223},{"z":0,"ang":27.430063151336803,"amp":0.24699058052828957,"speed":0.0011995370393458585},{"z":0,"ang":32.51074743633838,"amp":0.31118622813818175,"speed":0.0013367287974552751},{"z":0,"ang":42.530616980406535,"amp":0.14100662343012058,"speed":0.00184336725212825},{"z":0,"ang":61.544411304409415,"amp":0.1267793001715692,"speed":0.0029306228535237225},{"z":0,"ang":61.35103882941005,"amp":0.2377214036746725,"speed":0.002929256795113001},{"z":0,"ang":25.511210377186835,"amp":0.2883210386054631,"speed":0.0010617692737269597},{"z":0,"ang":37.313693444579414,"amp":0.3776379181273575,"speed":0.00160028529953439},{"z":0,"ang":34.43111746036216,"amp":0.28788765704407693,"speed":0.001606640027372697},{"z":0,"ang":43.56954389863525,"amp":0.2347831068267562,"speed":0.0018264868708917578},{"z":0,"ang":45.34244763284227,"amp":0.19620588461973842,"speed":0.0020944734942455498},{"z":0,"ang":34.39973866763357,"amp":0.2699000234447327,"speed":0.0016034521829708989},{"z":0,"ang":59.79169327560328,"amp":0.1988156866282344,"speed":0.002717939456366129},{"z":0,"ang":61.71834609121278,"amp":0.17970367195215242,"speed":0.0028992936986540646},{"z":0,"ang":24.78991557988155,"amp":0.17545960473404904,"speed":0.0010051459506663979},{"z":0,"ang":56.93895779729489,"amp":0.1327295239018076,"speed":0.002484966648688222},{"z":0,"ang":64.90479391287406,"amp":0.13651993912441054,"speed":0.0029946336267052693},{"z":0,"ang":55.33577491218127,"amp":0.22177939553636516,"speed":0.0024434056244023233},{"z":0,"ang":32.40446068545595,"amp":0.15126887530253746,"speed":0.0014104329371576218},{"z":0,"ang":24.060904763560085,"amp":0.30121919976512157,"speed":0.0010053069207088172},{"z":0,"ang":40.28098846098525,"amp":0.3622079158971564,"speed":0.0017257647798419717},{"z":0,"ang":48.35377744997191,"amp":0.11557121259043449,"speed":0.002265542547478915},{"z":0,"ang":23.03260211004417,"amp":0.21558371640147722,"speed":0.0010992850444607276},{"z":0,"ang":26.11822056167653,"amp":0.1475361524295671,"speed":0.0012062862135875853},{"z":0,"ang":30.981450488673737,"amp":0.2821551625920615,"speed":0.0014047369237485698},{"z":0,"ang":60.36135382876976,"amp":0.1918485430375079,"speed":0.002837335410338573},{"z":0,"ang":56.385104751576996,"amp":0.1846514313519036,"speed":0.002465449863152868},{"z":0,"ang":37.950713738272,"amp":0.38634177169940465,"speed":0.0015263697287108858},{"z":0,"ang":29.717580223870982,"amp":0.1783437669778281,"speed":0.0014162282868509283},{"z":0,"ang":62.9012929173996,"amp":0.21113846342144355,"speed":0.0028104687438103688},{"z":0,"ang":58.15238355324017,"amp":0.25402526130012537,"speed":0.0025657532413107765},{"z":0,"ang":27.916249084513826,"amp":0.1296668292623818,"speed":0.001200320612974887},{"z":0,"ang":36.940250964894965,"amp":0.18325887306926597,"speed":0.001756770878116126},{"z":0,"ang":31.308395716112248,"amp":0.37470171650157524,"speed":0.0013193902559701497},{"z":0,"ang":58.66100932948562,"amp":0.3648964299421298,"speed":0.002782743676354733},{"z":0,"ang":34.23643378842312,"amp":0.3526086252610895,"speed":0.0014298531897978192},{"z":0,"ang":62.043071361257695,"amp":0.270417325873954,"speed":0.0029424403908952486},{"z":0,"ang":28.482330995678165,"amp":0.33518026667080164,"speed":0.0010963861573024633},{"z":0,"ang":24.51598247902881,"amp":0.27547735099172205,"speed":0.0011640905230563905},{"z":0,"ang":58.381293868447145,"amp":0.22987898060235584,"speed":0.002783257841446286},{"z":0,"ang":41.97628313428538,"amp":0.33808817582107586,"speed":0.0018218017192178455},{"z":0,"ang":56.282121459234716,"amp":0.17833902034865673,"speed":0.002597358263153822},{"z":0,"ang":68.00636482583037,"amp":0.22468000924904658,"speed":0.002959141366885462},{"z":0,"ang":40.77070107162621,"amp":0.3386380896494581,"speed":0.0017483938407518306},{"z":0,"ang":34.663496193112934,"amp":0.3637018424169205,"speed":0.0015599663911265505},{"z":0,"ang":60.76976267458787,"amp":0.34817489649403244,"speed":0.0028806650477124687},{"z":0,"ang":60.36492164154909,"amp":0.15860557350028875,"speed":0.002812262913465793},{"z":0,"ang":48.95184550847539,"amp":0.12362377114627479,"speed":0.002183269279729012},{"z":0,"ang":43.60118693102438,"amp":0.12107169410593116,"speed":0.0018040191697861082},{"z":0,"ang":43.70594488715529,"amp":0.3967595296823787,"speed":0.0019852662284905193},{"z":0,"ang":49.71300244407961,"amp":0.21692185916497342,"speed":0.002079168829969638},{"z":0,"ang":54.63957413455682,"amp":0.2227457022791205,"speed":0.0024417296343155993},{"z":0,"ang":60.79506841016103,"amp":0.37624009049535445,"speed":0.002775659912291935},{"z":0,"ang":62.51628908271409,"amp":0.2640254894282456,"speed":0.002890228342955614},{"z":0,"ang":44.168136325747206,"amp":0.23306782366486917,"speed":0.002008236277254117},{"z":0,"ang":53.22513066579689,"amp":0.11840885238000275,"speed":0.0023576375831422447},{"z":0,"ang":53.19554471094956,"amp":0.29925250328321407,"speed":0.0024190860572713166},{"z":0,"ang":28.470977107138292,"amp":0.24286274131376437,"speed":0.001084788679734967},{"z":0,"ang":66.34678950617786,"amp":0.1590597267071921,"speed":0.002982694257619814},{"z":0,"ang":61.394330214279975,"amp":0.3597916180824067,"speed":0.0026462292311497547},{"z":0,"ang":59.73575737042734,"amp":0.10564687675223378,"speed":0.002641569257458735},{"z":0,"ang":45.497791728326796,"amp":0.15505873056468414,"speed":0.0020883194675351715},{"z":0,"ang":36.04070633033787,"amp":0.2975988708285233,"speed":0.0016067879583839138},{"z":0,"ang":29.09457175053344,"amp":0.3650557187382235,"speed":0.0013215619270594634},{"z":0,"ang":55.57200785098798,"amp":0.26778535909247425,"speed":0.0026127762482051945},{"z":0,"ang":47.309104793720124,"amp":0.10656168964584266,"speed":0.0019801391458469223},{"z":0,"ang":22.137384780575807,"amp":0.1677742959849124,"speed":0.0010385208471478417},{"z":0,"ang":49.272775264187956,"amp":0.1892164264667987,"speed":0.0022877963578648423},{"z":0,"ang":50.93016324137285,"amp":0.1432412500143286,"speed":0.002202339716971164},{"z":0,"ang":66.41775570919089,"amp":0.116572227984007,"speed":0.002950043491488855},{"z":0,"ang":31.964143839445118,"amp":0.2739235932434257,"speed":0.0013253682309418092},{"z":0,"ang":49.896032208818774,"amp":0.3883574397076466,"speed":0.002179312629119806},{"z":0,"ang":48.913844686265456,"amp":0.13260327286846932,"speed":0.002306790953433573},{"z":0,"ang":61.51655822491882,"amp":0.15746365459787612,"speed":0.0027385549336550767},{"z":0,"ang":35.15894511409512,"amp":0.1651101401509329,"speed":0.001558909736216329},{"z":0,"ang":40.11636681189216,"amp":0.20674406167293757,"speed":0.0016755356595363135},{"z":0,"ang":29.173256655447187,"amp":0.19665378132770278,"speed":0.0013845021672906342},{"z":0,"ang":26.42939529486963,"amp":0.21826489793337484,"speed":0.0011621756519443842},{"z":0,"ang":57.65829995391661,"amp":0.20576108416249766,"speed":0.0027059951210446865},{"z":0,"ang":31.173755911457214,"amp":0.32309282555866164,"speed":0.0014519402651643092},{"z":0,"ang":36.72477938268866,"amp":0.25390209666781105,"speed":0.0016886167332882663},{"z":0,"ang":29.5950120794508,"amp":0.22053615641301363,"speed":0.0012885353965284788},{"z":0,"ang":44.45781484057523,"amp":0.2597175044272777,"speed":0.0019524024721373618},{"z":0,"ang":38.30308574888036,"amp":0.25150557610157664,"speed":0.0018067150205527574},{"z":0,"ang":33.0426248501351,"amp":0.3767406829121839,"speed":0.001521258985541999},{"z":0,"ang":56.6506731921522,"amp":0.16560224482009817,"speed":0.002501887848250609},{"z":0,"ang":36.22621629384233,"amp":0.257079647305113,"speed":0.0015998379507643596},{"z":0,"ang":59.05317756923937,"amp":0.2885966973062816,"speed":0.0026521561749043034},{"z":0,"ang":28.594369392746408,"amp":0.15860844951988284,"speed":0.0013480262856649739},{"z":0,"ang":29.185641959401707,"amp":0.17995941026661905,"speed":0.0012789669570670563},{"z":0,"ang":41.468703735626455,"amp":0.3186949544844394,"speed":0.001980861609253392},{"z":0,"ang":31.13157235894531,"amp":0.14244695259868037,"speed":0.001323806686255704},{"z":0,"ang":63.85568664658212,"amp":0.3410348320278528,"speed":0.0028878480629006193},{"z":0,"ang":38.24084856247083,"amp":0.3964229396001494,"speed":0.0015590633887870764},{"z":0,"ang":42.797425530647075,"amp":0.2826630520629084,"speed":0.0018117055152111813},{"z":0,"ang":29.13974782222524,"amp":0.3480337024183054,"speed":0.0011071713095417311},{"z":0,"ang":65.29802142582905,"amp":0.30863956683216115,"speed":0.002914957531439373},{"z":0,"ang":64.99324684271863,"amp":0.24658057081053036,"speed":0.002909429996923806},{"z":0,"ang":51.759688394274114,"amp":0.3720480220977552,"speed":0.0022334832027957204},{"z":0,"ang":60.75760302946518,"amp":0.342168660022775,"speed":0.0028997085271972906},{"z":0,"ang":43.67940510146687,"amp":0.23724787404576814,"speed":0.0018737636099013643},{"z":0,"ang":31.89528099544778,"amp":0.15547750385938935,"speed":0.0014664822254097762}];

    if (!material) {
      material = {};
      material.material = new THREE.MeshPhongMaterial({
        color: data.color,
        transparent: data.opacity < 1,
        opacity: data.opacity,
        flatShading: true,
      });
    }

    this.mesh = new THREE.Mesh(geometry, material.material);
    el.setObject3D('mesh', this.mesh);
  },

  remove: function () {
    this.el.removeObject3D('mesh');
  },

  tick: function (t, dt) {
    if (!dt) return;

    const verts = this.mesh.geometry.vertices;
    for (let v, vprops, i = 0; (v = verts[i]); i++){
      if (i === 10 || i === 110 || i === 120) {
        vprops = this.waves[0];
        v.z = vprops.z + Math.sin(vprops.ang) * vprops.amp;
      } else if (i >= 110) {
        vprops = this.waves[i - 110];
        v.z = vprops.z + Math.sin(vprops.ang) * vprops.amp;
      } else if ((i - 10) % 11 === 0) {
        vprops = this.waves[i - 10];
        v.z = vprops.z + Math.sin(vprops.ang) * vprops.amp;
      } else {
        vprops = this.waves[i];
        v.z = vprops.z + Math.sin(vprops.ang) * vprops.amp;
        vprops.ang += vprops.speed * dt;
      }
    }
    this.mesh.geometry.verticesNeedUpdate = true;
  }
});
