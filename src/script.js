import "./style.css";
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

window.addEventListener("keyup", (e) => {
	const keyCode = e.which || e.keyCode || 0;
	keyCode === 32 && handleGeometry();
});

// Debug
// const gui = new dat.GUI();

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.6,
	1200
);
camera.position.z = 25;

// Renderer
const canvas = document.querySelector("canvas.default");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setClearColor("#181818");
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// document.querySelector("canvas.webgl").appendChild(renderer.domElement);

// Make Canvas Responsive
window.addEventListener("resize", () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
});

// Light
const lights = [];
const lightHelpers = [];

const lightValues = [
	{ colour: 0x2d33d3, intensity: 4, dist: 12, x: 1, y: 0, z: 8 },
	{ colour: 0x8142f5, intensity: 6, dist: 12, x: -2, y: 1, z: -10 },
	{ colour: 0x6d22b3, intensity: 3, dist: 10, x: 0, y: 10, z: 1 },
	{ colour: 0x251c8a, intensity: 6, dist: 12, x: 0, y: -10, z: -1 },
	{ colour: 0x9e42f5, intensity: 5, dist: 12, x: 10, y: 3, z: 0 },
	{ colour: 0x2d33d3, intensity: 6, dist: 12, x: -10, y: -1, z: 0 },
];

for (let i = 0; i < lightValues.length; i++) {
	lights[i] = new THREE.PointLight(
		lightValues[i]["colour"],
		lightValues[i]["intensity"],
		lightValues[i]["dist"]
	);
	lights[i].position.set(
		lightValues[i]["x"],
		lightValues[i]["y"],
		lightValues[i]["z"]
	);
	scene.add(lights[i]);

	lightHelpers[i] = new THREE.PointLightHelper(lights[i], 0.5);
	scene.add(lightHelpers[i]);
}

// Create Box
const boxGeometry = new THREE.BoxGeometry(4, 4, 4);
const boxMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.rotation.set(40, 0, 40);

// Create Sphere
const sphereLargeGeometry = new THREE.SphereGeometry(4, 12, 12);
const sphereLargeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const sphereLarge = new THREE.Mesh(sphereLargeGeometry, sphereLargeMaterial);
sphereLarge.rotation.set(40, 0, 40);
scene.add(sphereLarge);

// Create Torus
const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
const torusMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.rotation.set(40, 0, 40);
scene.add(torus);

// Create Cone
const coneGeometry = new THREE.ConeGeometry(2, 10, 16);
const coneMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const cone = new THREE.Mesh(coneGeometry, coneMaterial);

// Create torusknot
const torusKnotGeometry = new THREE.TorusKnotGeometry(
	12.293,
	2.3364,
	190,
	20,
	6,
	14
);
const torusKnotMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);

// Create Cylinder
const cylinderGeometry = new THREE.CylinderGeometry(5, 5, 20, 32);
const cylinderMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

// Trocar formas
let counter = 0;

const handleGeometry = () => {
	counter += 1;
	console.log(counter);

	if (counter == 1) {
		scene.remove(torus);
		scene.add(sphereLarge);
		camera.position.z = 10;
	} else if (counter == 2) {
		scene.remove(sphereLarge);
		scene.add(boxMesh);
	} else if (counter == 3) {
		scene.remove(boxMesh);
		scene.add(cone);
	} else if (counter == 4) {
		scene.remove(cone);
		scene.add(torusKnot);
		camera.position.z = 35;
	} else if (counter == 5) {
		scene.remove(torusKnot);
		camera.position.z = 25;
		scene.add(cylinder);
	} else if (counter > 5) {
		scene.remove(cylinder);
		scene.add(torus, sphereLarge);
		counter = 0;
	}
};

// Create spheres
const sphereMeshes = [];
const sphereGeometry = new THREE.SphereGeometry(0.2, 64, 64);
const sphareMaterial = new THREE.MeshLambertMaterial({ color: 0x251c8a });

for (let i = 0; i < 4; i++) {
	sphereMeshes[i] = new THREE.Mesh(sphereGeometry, sphareMaterial);
	sphereMeshes[i].position.set(0, 0, 0);
	scene.add(sphereMeshes[i]);
}

// Trigonometry Constants for Orbital Paths
let theta = 0;
const dTheta = (2 * Math.PI) / 200;

// Trackball Controls for Camera
const controls = new TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 2;
controls.dynamicDampingFactor = 0.15;

// Rendening (!important)
const rendering = () => {
	requestAnimationFrame(rendering);

	scene.rotation.z -= 0.005;
	scene.rotation.x -= -0.01;
	theta += dTheta;

	// Update trackball controls
	controls.update();

	// Store trig functions for sphere orbits
	const trigs = [
		{
			x: Math.cos(theta * 1.05),
			y: Math.sin(theta * 1.05),
			z: Math.cos(theta * 1.05),
			r: 2,
		},
		{
			x: Math.cos(theta * 0.8),
			y: Math.sin(theta * 0.8),
			z: Math.sin(theta * 0.8),
			r: 2.25,
		},
		{
			x: Math.cos(theta * 1.25),
			y: Math.cos(theta * 1.25),
			z: Math.sin(theta * 1.25),
			r: 2.5,
		},
		{
			x: Math.sin(theta * 0.6),
			y: Math.cos(theta * 0.6),
			z: Math.sin(theta * 0),
			r: 2.75,
		},
	];

	for (let i = 0; i < 4; i++) {
		sphereMeshes[i].position.x = trigs[i]["r"] * trigs[i]["x"];
		sphereMeshes[i].position.y = trigs[i]["r"] * trigs[i]["y"];
		sphereMeshes[i].position.z = trigs[i]["r"] * trigs[i]["z"];
	}

	renderer.render(scene, camera);
};

rendering();
