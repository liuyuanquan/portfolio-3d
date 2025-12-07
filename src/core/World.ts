import * as THREE from "three";
import { CameraControl } from "./CameraControl";
import { PhysicsEngine } from "./PhysicsEngine";
import { InteractionManager } from "./InteractionManager";

export class World {
	public readonly scene: THREE.Scene;
	public readonly renderer: THREE.WebGLRenderer;
	public readonly cameraControl: CameraControl;
	public readonly cursorHoverObjects: THREE.Object3D[] = [];
	public readonly cameraHelper: THREE.CameraHelper;
	public readonly directionalLightHelper: THREE.DirectionalLightHelper;
	/** 物理引擎实例 */
	public physicsEngine!: PhysicsEngine;
	/** 交互管理器实例 */
	public interactionManager!: InteractionManager;

	constructor() {
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x000000);

		const axesHelper = new THREE.AxesHelper(200);
		this.scene.add(axesHelper);

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

		this.cameraControl = new CameraControl(this);

		this.cameraHelper = null as any;
		this.directionalLightHelper = null as any;
	}

	/**
	 * 渲染场景
	 */
	public render(): void {
		this.renderer.render(this.scene, this.cameraControl.camera);
	}
}
