import './style.css';

import * as THREE from 'three';

import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

let camera, scene, renderer, controls;

init();

function init() {
  const container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    20,
  );
  camera.position.set(-10, 20, 40);

  scene = new THREE.Scene();

  // model

  new GLTFLoader().setPath('models/gltf/').load('scene.gltf', function (gltf) {
    gltf.scene.scale.setScalar(0.1);
    gltf.scene.position.set(0, 10, 0);

    scene.add(gltf.scene);
  });

  new GLTFLoader()
    .setPath('models/gltf/')
    .load('landscape.glb', function (gltf) {
      //gltf.scene.scale.setScalar(1);

      scene.add(gltf.scene);
    });

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  container.appendChild(renderer.domElement);

  const environment = new RoomEnvironment();
  const pmremGenerator = new THREE.PMREMGenerator(renderer);

  scene.background = new THREE.Color(0xbbbbbb);
  scene.environment = pmremGenerator.fromScene(environment).texture;

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 1;
  controls.maxDistance = 50;
  controls.target.set(0, 0.35, 0);
  controls.update();

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

camera.near = 0.01;
camera.far = 1000;
camera.updateProjectionMatrix();

function animate() {
  controls.update(); // required if damping enabled

  renderer.render(scene, camera);
}
