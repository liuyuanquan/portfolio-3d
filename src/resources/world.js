// use Three.js to set up graphics
import * as THREE from "three";
import Stats from "stats.js";
import galaxyVertexShader from "../shaders/vertex.glsl?raw";
import galaxyFragmentShader from "../shaders/fragment.glsl?raw";
import { SCENE_CONFIG, GAMEPLAY_CONFIG } from "../config";
import { loadTexture } from "../utils/textureLoader";

//threejs variable declaration
export let clock,
	scene,
	camera,
	renderer,
	stats,
	particleGroup,
	particleAttributes,
	particleSystemObject,
	lensFlareObject,
	galaxyClock;

//generic temporary transform to begin

export let manager = new THREE.LoadingManager();

export function createWorld() {
	clock = new THREE.Clock();
	galaxyClock = new THREE.Clock();

	// init new Three.js scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color(SCENE_CONFIG.backgroundColor);

	// camera
	const camConfig = SCENE_CONFIG.camera;
	camera = new THREE.PerspectiveCamera(
		camConfig.fov,
		window.innerWidth / window.innerHeight,
		camConfig.near,
		camConfig.far
	);
	camera.position.set(
		camConfig.initialPosition.x,
		camConfig.initialPosition.y,
		camConfig.initialPosition.z
	);
	//camera.lookAt(scene.position);

	//Add hemisphere light
	const hemiConfig = SCENE_CONFIG.hemisphereLight;
	let hemiLight = new THREE.HemisphereLight(
		hemiConfig.color,
		hemiConfig.groundColor,
		hemiConfig.intensity
	);
	hemiLight.color.setHSL(
		hemiConfig.colorHSL.h,
		hemiConfig.colorHSL.s,
		hemiConfig.colorHSL.l
	);
	hemiLight.groundColor.setHSL(
		hemiConfig.groundColorHSL.h,
		hemiConfig.groundColorHSL.s,
		hemiConfig.groundColorHSL.l
	);
	hemiLight.position.set(
		hemiConfig.position.x,
		hemiConfig.position.y,
		hemiConfig.position.z
	);
	scene.add(hemiLight);

	//Add directional light
	const dirConfig = SCENE_CONFIG.directionalLight;
	let dirLight = new THREE.DirectionalLight(
		dirConfig.color,
		dirConfig.intensity
	);
	dirLight.color.setHSL(
		dirConfig.colorHSL.h,
		dirConfig.colorHSL.s,
		dirConfig.colorHSL.l
	);
	dirLight.position.set(
		dirConfig.position.x,
		dirConfig.position.y,
		dirConfig.position.z
	);
	dirLight.position.multiplyScalar(dirConfig.multiplyScalar);
	scene.add(dirLight);

	dirLight.castShadow = dirConfig.castShadow;

	dirLight.shadow.mapSize.width = dirConfig.shadow.mapSize.width;
	dirLight.shadow.mapSize.height = dirConfig.shadow.mapSize.height;

	const shadowCam = dirConfig.shadow.camera;
	dirLight.shadow.camera.left = shadowCam.left;
	dirLight.shadow.camera.right = shadowCam.right;
	dirLight.shadow.camera.top = shadowCam.top;
	dirLight.shadow.camera.bottom = shadowCam.bottom;
	dirLight.shadow.camera.far = shadowCam.far;

	//Setup the renderer
	const rendererConfig = SCENE_CONFIG.renderer;
	renderer = new THREE.WebGLRenderer({ antialias: rendererConfig.antialias });
	//renderer.setClearColor(0xbfd1e5);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	//renderer.shadowMap.type = THREE.BasicShadowMap;
	document.body.appendChild(renderer.domElement);

	stats = new Stats();
	document.body.appendChild(stats.dom);

	// gammaInput 和 gammaOutput 已被移除，使用 outputEncoding 替代
	renderer.outputEncoding = THREE[rendererConfig.outputEncoding];

	renderer.shadowMap.enabled = rendererConfig.shadowMap.enabled;
}

export function glowingParticles() {
	var particleTextureLoader = new THREE.TextureLoader(manager);
	const BASE_URL = import.meta.env.BASE_URL;
	var particleTexture = loadTexture(
		particleTextureLoader,
		`${BASE_URL}img/spark.png`
	);

	particleGroup = new THREE.Object3D();
	particleGroup.position.x = -1;
	particleGroup.position.y = 7;
	particleGroup.position.z = 45;
	particleAttributes = { startSize: [], startPosition: [], randomness: [] };

	const particlesConfig = GAMEPLAY_CONFIG.particles;
	var totalParticles = particlesConfig.total;
	var radiusRange = particlesConfig.radiusRange;
	for (var i = 0; i < totalParticles; i++) {
		var spriteMaterial = new THREE.SpriteMaterial({
			map: particleTexture,
			color: particlesConfig.materialColor,
		});

		var sprite = new THREE.Sprite(spriteMaterial);
		sprite.scale.set(
			particlesConfig.spriteScale.x,
			particlesConfig.spriteScale.y,
			particlesConfig.spriteScale.z
		);
		sprite.position.set(
			Math.random() - 0.5,
			Math.random() - 0.5,
			Math.random() - 0.5
		);

		sprite.position.setLength(radiusRange * (Math.random() * 0.1 + 0.9));

		sprite.material.color.setHSL(Math.random(), 0.9, 0.7);

		sprite.material.blending = THREE.AdditiveBlending; // "glowing" particles
		sprite.renderOrder = 1;
		particleGroup.add(sprite);
		// add variable qualities to arrays, if they need to be accessed later
		particleAttributes.startPosition.push(sprite.position.clone());
		particleAttributes.randomness.push(Math.random());
	}

	scene.add(particleGroup);
}

export function createLensFlare(x, y, z, xScale, zScale, boxTexture) {
	const boxScale = { x: xScale, y: 0.1, z: zScale };
	let quat = { x: 0, y: 0, z: 0, w: 1 };
	let mass = 0; //mass of zero = infinite mass

	var geometry = new THREE.PlaneBufferGeometry(xScale, zScale);

	const loader = new THREE.TextureLoader();
	const texture = loadTexture(loader, boxTexture);
	texture.encoding = THREE.sRGBEncoding;
	const loadedTexture = new THREE.MeshBasicMaterial({
		map: texture,
		transparent: true,
		opacity: 0.9,
	});
	loadedTexture.depthWrite = true;
	loadedTexture.depthTest = true;

	lensFlareObject = new THREE.Mesh(geometry, loadedTexture);
	lensFlareObject.position.set(x, y, z);
	lensFlareObject.renderOrder = 1;

	lensFlareObject.receiveShadow = true;
	scene.add(lensFlareObject);
}

export function addParticles() {
	var geometry = new THREE.Geometry();

	for (let i = 0; i < 3000; i++) {
		var vertex = new THREE.Vector3();
		vertex.x = getRandomArbitrary(-1100, 1100);
		vertex.y = getRandomArbitrary(-1100, 1100);
		vertex.z = getRandomArbitrary(-1100, -500);
		geometry.vertices.push(vertex);
	}

	var material = new THREE.PointsMaterial({ size: 3 });
	particleSystemObject = new THREE.Points(geometry, material);

	scene.add(particleSystemObject);
}

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

export let galaxyMaterial = null;
export let galaxyPoints = null;

export const generateGalaxy = () => {
	const parameters = {};
	parameters.count = 50000;
	parameters.size = 0.005;
	parameters.radius = 100;
	parameters.branches = 3;
	parameters.spin = 1;

	parameters.randomnessPower = 3;
	parameters.insideColor = "#ff6030";
	parameters.outsideColor = "#1b3984";
	parameters.randomness = 0.2;

	let geometry = null;
	galaxyMaterial = null;
	galaxyPoints = null;
	if (galaxyPoints !== null) {
		geometry.dispose();
		galaxyMaterial.dispose();
		scene.remove(galaxyPoints);
	}

	/**
	 * Geometry
	 */
	geometry = new THREE.BufferGeometry();

	const positions = new Float32Array(parameters.count * 3);
	const randomness = new Float32Array(parameters.count * 3);

	const colors = new Float32Array(parameters.count * 3);
	const scales = new Float32Array(parameters.count * 1);

	const insideColor = new THREE.Color(parameters.insideColor);
	const outsideColor = new THREE.Color(parameters.outsideColor);

	for (let i = 0; i < parameters.count; i++) {
		const i3 = i * 3;

		// Position
		const radius = Math.random() * parameters.radius;

		const branchAngle =
			((i % parameters.branches) / parameters.branches) * Math.PI * 2;

		const randomX =
			Math.pow(Math.random(), parameters.randomnessPower) *
			(Math.random() < 0.5 ? 1 : -1) *
			parameters.randomness *
			radius;
		const randomY =
			Math.pow(Math.random(), parameters.randomnessPower) *
			(Math.random() < 0.5 ? 1 : -1) *
			parameters.randomness *
			radius;
		const randomZ =
			Math.pow(Math.random(), parameters.randomnessPower) *
				(Math.random() < 0.5 ? 1 : -1) *
				parameters.randomness *
				radius -
			50;

		positions[i3] = Math.cos(branchAngle) * radius;
		positions[i3 + 1] = 0;
		positions[i3 + 2] = Math.sin(branchAngle) * radius;

		randomness[i3] = randomX;
		randomness[i3 + 1] = randomY;
		randomness[i3 + 2] = randomZ;

		// Color
		const mixedColor = insideColor.clone();
		mixedColor.lerp(outsideColor, radius / parameters.radius);

		colors[i3] = mixedColor.r;
		colors[i3 + 1] = mixedColor.g;
		colors[i3 + 2] = mixedColor.b;

		// Scale
		scales[i] = Math.random();
	}

	geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
	geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
	geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
	geometry.setAttribute(
		"aRandomness",
		new THREE.BufferAttribute(randomness, 3)
	);

	/**
	 * Material
	 */
	galaxyMaterial = new THREE.ShaderMaterial({
		depthWrite: false,
		blending: THREE.AdditiveBlending,
		vertexColors: true,
		vertexShader: galaxyVertexShader,
		fragmentShader: galaxyFragmentShader,
		uniforms: {
			uTime: { value: 0 },
			uSize: { value: 30 * renderer.getPixelRatio() },
		},
	});

	/**
	 * Points
	 */
	galaxyPoints = new THREE.Points(geometry, galaxyMaterial);
	galaxyPoints.position.y = -50;
	scene.add(galaxyPoints);
};

export function moveParticles() {
	particleSystemObject.rotation.z += 0.0003;
	lensFlareObject.rotation.z += 0.0002;
	if (lensFlareObject.position.x < 750) {
		lensFlareObject.position.x += 0.025;
		lensFlareObject.position.y -= 0.001;
	} else {
		lensFlareObject.position.x = -750;
		lensFlareObject.position.y = -50;
	}

	//move stemkoski particles
	var time = 7 * clock.getElapsedTime();

	for (var c = 0; c < particleGroup.children.length; c++) {
		var sprite = particleGroup.children[c];

		// pulse away/towards center
		// individual rates of movement
		var a = particleAttributes.randomness[c] + 0.75;
		var pulseFactor = Math.sin(a * time) * 0.1 + 0.9;
		sprite.position.x = particleAttributes.startPosition[c].x * pulseFactor;
		sprite.position.y =
			particleAttributes.startPosition[c].y * pulseFactor * 1.5;
		sprite.position.z = particleAttributes.startPosition[c].z * pulseFactor;
	}

	// rotate the entire group
	//particleGroup.rotation.x = time * 0.5;
	particleGroup.rotation.y = time * 0.75;
	// particleGroup.rotation.z = time * 1.0;
}
