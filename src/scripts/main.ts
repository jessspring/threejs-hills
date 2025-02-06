import * as THREE from 'three';
import * as Input from './input';
import { createSkybox } from './skybox';
import { Terrain } from './terrain';
import { Player } from './player';

const backgroundColor = new THREE.Color().setHex(0xA8C8F2);

//Scene setup
const renderer = createRenderer();
const scene = createScene();
// scene.add(new THREE.AmbientLight(backgroundColor, 0.5));

const size = 10;
const player = new Player(new THREE.Vector3(32 * size, 1, 32 * size));
scene.add(player.getMesh());

//Sunlight
// const sunLight = new THREE.DirectionalLight(0xFFFFFF, 2);
// sunLight.castShadow = true;
// sunLight.position.set(-1.6, 1, 0.4);
// sunLight.position.multiplyScalar(30);
// sunLight.shadow.mapSize.set(4096 * 4, 4096 * 4);
// sunLight.shadow.bias = -0.0001;
// scene.add(sunLight);

// const sunlightShadowCamera = sunLight.shadow.camera;
// sunlightShadowCamera.far = 100;
// sunlightShadowCamera.top = 70;
// sunlightShadowCamera.right = 70;
// sunlightShadowCamera.left = 0;
// sunlightShadowCamera.bottom = 0;

// const lightHelper = new THREE.DirectionalLightHelper(sunLight);
// scene.add(lightHelper);
// const lightCameraHelper = new THREE.CameraHelper(sunLight.shadow.camera);
// scene.add(lightCameraHelper);

//Hemisphere light
// const hemisphereLight = new THREE.HemisphereLight(0xccddff, 0xcc7777);
// const hemisphereLight = new THREE.HemisphereLight(0x00ffff, 0xffff55, 1);
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x007700, 1);
hemisphereLight.position.set(100, 100, 100);
scene.add(hemisphereLight);

//World geometry
const terrain = new Terrain(63, 63, size);
scene.add(terrain.getMesh());

function animate() {
    player.update(terrain);

    renderer.render(scene, player.getCamera());
    Input.update();
}

renderer.setAnimationLoop(animate);

function createScene() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(backgroundColor, 0, 500);
    scene.background = createSkybox();

    return scene;
}

function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    document.body.appendChild(renderer.domElement);

    return renderer;
}
