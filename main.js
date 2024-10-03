import * as THREE from 'three';
import { KeyBoxGeometry } from './key-box-geometry.js';
import { getUnicodeExampleLetters } from './get-unicode-symbols.js';

const CANVAS_DIM = 256;
const MAX_TILES = 32;
const TILE_WIDTH = 30;
const TILE_HEIGHT = 4;
const TILE_DIM = Math.sqrt((TILE_WIDTH * TILE_WIDTH) + (TILE_WIDTH * TILE_WIDTH));
const CEILING = 120;
const FLOOR = -120;

const STAGE_Z_MIN = -TILE_DIM/2;
const STAGE_Z_MAX = -200 + TILE_DIM/2;

const debug = false;

const fontSpec = `${CANVAS_DIM * 0.8}px Tahoma`;
const letters = ['Keyman', 'Keyman', 'Keyman'].concat(getUnicodeExampleLetters(),['🤣','🚗','⌨','🦘','💩','💣']);
while(letters.length < MAX_TILES) {
  letters.push(...letters);
}

const keymanImage = document.getElementById('keyman-image');
//THREEJS RELATED VARIABLES


var scene,
  camera, fieldOfView, aspectRatio, nearPlane, farPlane,
  globalLight, shadowLight,
  renderer,
  container,
  // frustum,
  backgrounds = [];

var WIDTH, HEIGHT, windowHalfX, windowHalfY;

// OTHER VARIABLES

var PI = Math.PI;
var heroes;
var container;

// MATERIALS

var blackMat = new THREE.MeshPhongMaterial({
    color: 0x401a07,
    shading:THREE.FlatShading,
  });

var whiteMat = new THREE.MeshPhongMaterial({
    color: 0x808588,
    shading:THREE.FlatShading,
  });


//INIT THREE JS, SCREEN AND MOUSE EVENTS

function initScreenAnd3D() {
  container = document.getElementById('world');
  HEIGHT = container.offsetHeight;
  WIDTH = container.width;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;

  scene = new THREE.Scene();

  // scene.fog = new THREE.Fog(0xd6eae6, 150,300);

  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 50;
  nearPlane = 1;
  farPlane = 200;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );

  /*----------------------*/
  function setCameraAbove(camera) {
    camera.position.z = 0;
    camera.position.y = 250;
    camera.rotateX(-PI/2);
  }
  // setCameraAbove(camera);
  /*----------------------*/

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
  renderer.shadowMap.enabled = true;

  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);

  handleWindowResize();

  // frustum = new THREE.Frustum();
  // frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
}

function handleWindowResize() {
  HEIGHT = container.offsetHeight;
  WIDTH = container.offsetWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
  addBackgrounds();
}

function createLights() {
  globalLight = new THREE.AmbientLight(0xffffff, 1);
  shadowLight = new THREE.DirectionalLight(0xffffff, 1);
  shadowLight.position.set(10, 8, 8);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -40;
  shadowLight.shadow.camera.right = 40;
  shadowLight.shadow.camera.top = 40;
  shadowLight.shadow.camera.bottom = -40;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = shadowLight.shadow.mapSize.height = 2048;
  scene.add(globalLight);
  scene.add(shadowLight);
}

class Hero {
  constructor(id) {
    this.mesh = new THREE.Group();
    this.id = id;

    this.mesh.position.y = randomInRange([CEILING, FLOOR]);

    this.canvas = document.createElement('canvas');
    this.canvas.width = CANVAS_DIM;
    this.canvas.height = CANVAS_DIM;
    this.canvas.id = 'frontCanvas'+id.toString();

    this.backCanvas = document.createElement('canvas');
    this.backCanvas.width = CANVAS_DIM;
    this.backCanvas.height = CANVAS_DIM;
    this.backCanvas.id = 'backCanvas'+id.toString();

    this.materials = [
      whiteMat,
      whiteMat,
      whiteMat,
      whiteMat,
      new THREE.MeshPhongMaterial({map: new THREE.CanvasTexture(this.canvas)}),
      debug ? new THREE.MeshPhongMaterial({map: new THREE.CanvasTexture(this.backCanvas)}) : blackMat,
    ];
    const torsoGeom = new KeyBoxGeometry(TILE_WIDTH,TILE_WIDTH,TILE_HEIGHT,6,4);
    this.torso = new THREE.Mesh(torsoGeom, this.materials);
    // this.torso.position.y = 8;
    // this.torso.toNonIndexed().
    this.torso.castShadow = true;
    this.mesh.add(this.torso);
    this.reposition();
  }

  // TODO: This is still not quite working
  willCatch(hero) {
    // if(this.descentSpeed <= hero.descentSpeed) return false; // we're slower than it

    const distance1 = this.mesh.position.y - hero.mesh.position.y - TILE_DIM/2;
    // if(distance1 < -TILE_DIM) return false;  // we're ahead of the other tile...

    const distance2 = hero.mesh.position.y - FLOOR;

    return distance1 / (this.descentSpeed - hero.descentSpeed) < Math.abs(distance2 / hero.descentSpeed);
  }

  overlaps(hero) {
    if(Math.abs(this.mesh.position.x - hero.mesh.position.x) < TILE_DIM/2 && Math.abs(this.mesh.position.z - hero.mesh.position.z) < TILE_DIM/2 &&
      this.willCatch(hero)) {
        return true;
      }
    return false;
  }

  redrawFace() {
    const ctx = this.canvas.getContext('2d');
    ctx.strokeStyle = 'black';
    if(this.overlapping) ctx.fillStyle = 'yellow'; else ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, CANVAS_DIM, CANVAS_DIM);
    ctx.strokeRect(0, 0, CANVAS_DIM, CANVAS_DIM);
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = this.fontSpec;

    if(this.text == 'Keyman') {
      ctx.drawImage(keymanImage, CANVAS_DIM * 0.1, CANVAS_DIM * 0.1, CANVAS_DIM * 0.8, CANVAS_DIM * 0.8);
    } else {
      const tx = ctx.measureText(this.text);

      // Constrain this to fit in the box
      const oldSize = (CANVAS_DIM * 0.8);
      const newWidth = oldSize / (tx.actualBoundingBoxRight + tx.actualBoundingBoxLeft) * oldSize;
      const newHeight = oldSize / (tx.actualBoundingBoxBottom + tx.actualBoundingBoxTop) * oldSize;
      ctx.font= `${Math.min(newWidth,newHeight)}px Tahoma`;
      ctx.fillText(this.text, CANVAS_DIM / 2, CANVAS_DIM / 2);
    }

    if(debug) {
      this.writeDebug(this.canvas);

      const bctx = this.backCanvas.getContext('2d');
      bctx.strokeStyle = 'black';
      bctx.fillStyle = 'green';
      bctx.fillRect(0, 0, CANVAS_DIM, CANVAS_DIM);
      bctx.strokeRect(0, 0, CANVAS_DIM, CANVAS_DIM);
      bctx.fillStyle = 'black';
      bctx.textAlign = 'center';
      bctx.textBaseline = 'middle';
      bctx.font = this.fontSpec;
      bctx.fillText(this.text, CANVAS_DIM / 2, CANVAS_DIM / 2);
      this.writeDebug(this.backCanvas);
    }

    this.materials[4].map.needsUpdate = true;
    if(debug) this.materials[5].map.needsUpdate = true;
  }

  writeDebug(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.font = '24px Arial';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`id:${this.id} x:${Math.round(this.mesh.position.x)} z:${Math.round(this.mesh.position.z)} d:${Math.round(this.descentSpeed * 100)/100 }`, 6, CANVAS_DIM-6);
    // ctx.fillText(`xr:${Math.round(this.xt*10000)/10000} r:${Math.round(this.torso.rotation.x * 180 / Math.PI)}\n`, 6, CANVAS_DIM-26);
    ctx.fillText(`x:${Math.round(this.torso.rotation.x * 180 / Math.PI)} y:${Math.round(this.torso.rotation.y * 180 / Math.PI)} z:${Math.round(this.torso.rotation.z * 180 / Math.PI)}\n`, 6, CANVAS_DIM-26);
    ctx.fillText(this.overlapping ? `O:${this.overlapping.id}=${Math.round(this.overlapping.mesh.position.x)},${Math.round(this.overlapping.mesh.position.z)}` : '', 6, CANVAS_DIM-46);
  }

  reposition(resetTop) {
    if(resetTop) {
      this.mesh.position.y = CEILING;
    }

    let n = 0;
    do {
      this.descentSpeed = Math.random() + 0.4; //0.1; //05; // Math.random() + 0.5;
      this.mesh.position.z = randomInRange([STAGE_Z_MIN, STAGE_Z_MAX]); // Math.random() * 200 - 120; // Math.random() * 150;

      const v1 = new THREE.Vector2();
      const v2 = new THREE.Vector2();
      camera.getViewBounds(this.mesh.position.z, v1, v2);

      this.mesh.position.x = randomInRange([v1.x + TILE_DIM / 4, v2.x - TILE_DIM/4]); // Math.random() * zFactor - zFactor / 2; // 120 - 60;
      this.overlapping = heroes.find(hero => this != hero && this.overlaps(hero));
    } while(this.overlapping && ++n < 50);

    // if(this.overlapping) {
      // scene.remove(this.mesh);
      // console.log(`${this.id} collides with ${this.overlapping.id}: ${this.mesh.position.x - this.overlapping.mesh.position.x} == ${this.mesh.position.x} - ${this.overlapping.mesh.position.x}; descent = ${this.descentSpeed} :: ${this.overlapping.descentSpeed}`);
      // debugger;
    // }

    // if(!found) {
      // this.overlapping = null;
      // this.text += '!!!';
      // return;
    // }

    /*------------------------------*/
    // this.descentSpeed = 0.4;
    // this.mesh.position.x = (this.id % 8) * 32 - 128;
    // this.mesh.position.y = CEILING;
    // this.mesh.position.z = Math.trunc(this.id / 8) * 32 - 128;
    /*------------------------------*/

    const rotationWindows = {
      x: [-0.75, 0.75],
      y: [-0.75, 0.75],
      z: [-0.5, 0.5]
    };

    this.hasRotation = true;
    if(!this.hasRotation) {
      this.torso.rotation.set(-PI/2, 0, 0);
    } else {
      this.startRotation = {
        x: randomInRange(rotationWindows.x),
        y: randomInRange(rotationWindows.y),
        z: randomInRange(rotationWindows.z),
      };
      this.endRotation = {
        x: randomInRange(rotationWindows.x),
        y: randomInRange(rotationWindows.y),
        z: randomInRange(rotationWindows.z),
      };
      this.torso.rotation.set(this.startRotation.x, this.startRotation.y, this.startRotation.z);
    }
    /*this.torso.rotateX(this.startRotation.x);
    this.torso.rotateY(this.startRotation.y);
    this.torso.rotateZ(this.startRotation.z);*/

    // this.endRotation = this.startRotation;

    // this.descentSpeed = 0.1;

    this.startY = CEILING;
    this.endY = FLOOR;
    this.steps = Math.abs(Math.ceil((this.endY - this.startY) / this.descentSpeed));

    if(this.hasRotation) {
      this.xt = (this.endRotation.x - this.startRotation.x) / this.steps;
      this.yt = (this.endRotation.y - this.startRotation.y) / this.steps;
      this.zt = (this.endRotation.z - this.startRotation.z) / this.steps;
    }

    this.letterIndex = null;
    do {
      this.letterIndex = Math.trunc(Math.random() * letters.length);
    } while(heroes.find(hero => hero != this && hero.letterIndex == this.letterIndex));
    this.text = letters[this.letterIndex];
    if(debug) {
      this.text = this.id.toString();
    }
    this.fontSpec = fontSpec;
    this.redrawFace();
    // console.log(`REPOSITION ${this.id} DONE O:${this.overlapping?.id}`);

    if(this.overlapping) {
      scene.remove(this.mesh);
    } else {
      scene.add(this.mesh);
    }
  }

  run(){
    if(this.hasRotation) {
      if(this.xt) this.torso.rotateX(this.xt); // rotation.x = this.xt * t; //Math.sin( t ) * amp;
      if(this.yt) this.torso.rotateY(this.yt); //rotation.y = this.yt * t; //Math.sin( t ) * amp;
      if(this.zt) this.torso.rotateZ(this.zt); //rotation.z = this.zt * t; // Math.sin( t ) * amp;
    }

    this.mesh.translateY(-this.descentSpeed);

  //  this.redrawFace();

    // this.torso.updateMatrix(); //computeBoundingSphere();

    // Your 3d point to check
    // if(frustum.intersectsObject(this.torso) &&
    if(this.mesh.position.y < FLOOR) {
      this.reposition(true);
    }
  }
}

function randomInRange(range) {
  return Math.random() * (range[1] - range[0]) + range[0];
}

function createHero() {
  heroes = [];
  for(let i = 0; i < MAX_TILES; i++) {
    let hero = new Hero(i);
    heroes.push(hero);
  }
}

function addBackgrounds() {
  if(backgrounds.length) {
    backgrounds.forEach(bg => scene.remove(bg));
  }

  backgrounds = [
    createBackground(0x00f68924, 0+30/2, 30),
    createBackground(0x00cc3846, 30+45/2, 45),
    createBackground(0x0079C3DA, 75+25/2, 25)
  ];

  backgrounds.forEach(bg => scene.add(bg));
}

function createBackground(colour, x, width) {
  const v1 = new THREE.Vector2();
  const v2 = new THREE.Vector2();
  camera.getViewBounds(camera.far, v1, v2);
  let geometry = new THREE.BoxGeometry(width * (v2.x - v1.x) / 100, (v2.y - v1.y) * 0.8, 1, 1);
  let material = new THREE.MeshBasicMaterial({color: colour});
  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = x * (v2.x - v1.x) / 100 + v1.x;
  mesh.position.y = (v2.y - v1.y) * 0.1;
  mesh.position.z = -camera.far;
  return mesh;
}

var rot = -1;

function print_rad(x) {
  return x.toFixed(3);
}

function to_deg(x) {
  return Math.round(x * 180 / Math.PI);
}

function dd(r) {
  return `x:${print_rad(r.x)} y:${print_rad(r.y)} z:${print_rad(r.z)}`;
}

function loop(){

  let txt = '';
  for(let i = 0; i < heroes.length; i++) {
    let h = heroes[i];
    h.run();

    if(debug) {
      const r = h.torso.rotation;
      const sr = h.startRotation;
      const er = h.endRotation;
      txt += `${i}: R[${dd(r)}]\tS[${dd(sr)}]\tE[${dd(er)}]\t[dx:${h.xt}, dy:${h.yt}] ${h.steps}\n`;
    }
  }

  if(debug) {
    document.getElementById('debug').innerHTML = txt;
  }
  // rot+=.01;
  // hero.mesh.rotation.y = -Math.PI/4 + Math.sin(rot * Math.PI/8);
  render();

  if(!isPaused) {
    requestAnimationFrame(loop);
  }
}

function render(){
  renderer.render(scene, camera);
}

let isPaused = false;
window.addEventListener('load', init, false);
window.addEventListener('keydown', function(event) {
  if(event.key == ' ') {
    isPaused = !isPaused;
    if(!isPaused) loop();
  } else if(event.key == 'd') {
    debugger;
  }
});

function init(event){
  initScreenAnd3D();
  createLights();
  createHero();
  addBackgrounds();
  loop();
}


