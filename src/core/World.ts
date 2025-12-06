import * as THREE from "three";

export class World {
	private static instance: World | null = null;

	public readonly scene: THREE.Scene;
	public readonly camera: THREE.PerspectiveCamera;
	public readonly renderer: THREE.WebGLRenderer;
	public readonly cameraHelper: THREE.CameraHelper;
	public readonly directionalLightHelper: THREE.DirectionalLightHelper;
	public readonly manager: THREE.LoadingManager;

	private constructor() {
		this.manager = new THREE.LoadingManager();

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x000000);

		const axesHelper = new THREE.AxesHelper(200);
		this.scene.add(axesHelper);

		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
		this.camera.position.set(0, 30, 70);

		const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
		hemiLight.color.setHSL(0.6, 0.6, 0.6);
		hemiLight.groundColor.setHSL(0.1, 1, 0.4);
		hemiLight.position.set(0, 50, 0);
		this.scene.add(hemiLight);

		const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
		dirLight.color.setHSL(0.1, 1, 0.95);
		dirLight.position.set(-10, 100, 50);
		dirLight.position.multiplyScalar(100);
		this.scene.add(dirLight);

		dirLight.castShadow = true;
		dirLight.shadow.mapSize.width = 4096;
		dirLight.shadow.mapSize.height = 4096;
		dirLight.shadow.camera.left = -200;
		dirLight.shadow.camera.right = 200;
		dirLight.shadow.camera.top = 200;
		dirLight.shadow.camera.bottom = -200;
		dirLight.shadow.camera.far = 15000;

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		this.renderer.shadowMap.enabled = true;
		document.body.appendChild(this.renderer.domElement);

		window.addEventListener("resize", this.onWindowResize.bind(this));

		this.cameraHelper = null as any;
		this.directionalLightHelper = null as any;
	}

	public static getInstance(): World {
		if (World.instance === null) {
			World.instance = new World();
		}
		return World.instance;
	}

	private onWindowResize(): void {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
}

const world = World.getInstance();

export const scene = world.scene;
export const camera = world.camera;
export const renderer = world.renderer;
export const cameraHelper = world.cameraHelper;
export const directionalLightHelper = world.directionalLightHelper;
export const manager = world.manager;

export function createWorld(): void {
	World.getInstance();
}
