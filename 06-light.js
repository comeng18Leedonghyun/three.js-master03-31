import * as THREE from '../build/three.module.js';
import {OrbitControls} from '../examples/jsm/controls/OrbitControls.js';
import {RectAreaLightUniformsLib} from '../examples/jsm/lights/RectAreaLightUniformsLib.js';
import {RectAreaLightHelper} from '../examples/jsm/helpers/RectAreaLightHelper.js';

class App {
	constructor() {
		const divContainer = document.querySelector('#webgl-container');
		this._divContainer = divContainer;

		const renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setPixelRatio(window.devicePixelRatio);
		divContainer.appendChild(renderer.domElement);
		this._renderer = renderer;

		const scene = new THREE.Scene();
		this._scene = scene;

		this._setupCamera();
		this._setupLight();
		this._setupModel();
		this._setupControls();

		window.onresize = this.resize.bind(this);
		this.resize();

		requestAnimationFrame(this.render.bind(this));
	}

	_setupControls() {
		new OrbitControls(this._camera, this._divContainer);
	}

	_setupCamera() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		
		camera.position.set(7, 7, 0);
		
		camera.lookAt(0, 0, 0);
		this._camera = camera;
	}

	_setupLight() {
		
		RectAreaLightUniformsLib.init();
		const light = new THREE.RectAreaLight(0xffffff, 10, 6, 1);
		light.position.set(0, 5, 0);
		light.rotation.x = THREE.MathUtils.degToRad(-90);

		
		const helper = new RectAreaLightHelper(light);
		this._scene.add(helper);
		this._lightHelper = helper;

		this._scene.add(light);
		this._light = light;
	}

	_setupModel() {
		const groundGeometry = new THREE.PlaneGeometry(10, 10);
		const groundMaterial = new THREE.MeshStandardMaterial({
			color: '#7E41D9',
			roughness: 0.5,
			metalness: 0.5,
			side: THREE.DoubleSide,
		});

		const ground = new THREE.Mesh(groundGeometry, groundMaterial);
		ground.rotation.x = THREE.MathUtils.degToRad(-90);
		this._scene.add(ground);

		const bigSphereGeometry = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI);
		const bigSphereMaterial = new THREE.MeshStandardMaterial({
			color: '#FFE400',
			roughness: 0.1,
			metalness: 0.2,
		});

		const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
		bigSphere.rotation.x = THREE.MathUtils.degToRad(-90);
		this._scene.add(bigSphere);

		const torusGeometry = new THREE.TorusGeometry(0.4, 0.1, 32, 32);
		const torusMaterial = new THREE.MeshStandardMaterial({
			color: '#47C83E',
			roughness: 0.5,
			metalness: 0.9,
		});

		for (let i = 0; i < 8; i++) {
			const torusPivot = new THREE.Object3D();
			const torus = new THREE.Mesh(torusGeometry, torusMaterial);
			torusPivot.rotation.y = THREE.MathUtils.degToRad(45 * i);
			torus.position.set(3, 0.5, 0);
			torusPivot.add(torus);
			this._scene.add(torusPivot);
		}

		const smallSphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
		const smallSphereMaterial = new THREE.MeshStandardMaterial({
			color: '#664B00',
			roughness: 0.2,
			metalness: 0.5,
		});

		const smallSpherePivot = new THREE.Object3D();
		const smallSphere = new THREE.Mesh(smallSphereGeometry, smallSphereMaterial);
		smallSpherePivot.add(smallSphere)
		
		smallSpherePivot.name = 'smallSpherePivot';
		smallSphere.position.set(3, 0.5, 0);
		this._scene.add(smallSpherePivot);
	}

	resize() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;

		this._camera.aspect = width / height;
		this._camera.updateProjectionMatrix();

		this._renderer.setSize(width, height);
	}

	render(time) {
		this._renderer.render(this._scene, this._camera);
		this.update(time);
		requestAnimationFrame(this.render.bind(this));
	}

	update(time) {
		time *= 0.001; // second unit

		const smallSpherePivot = this._scene.getObjectByName('smallSpherePivot');
		if (smallSpherePivot) {
			smallSpherePivot.rotation.y = THREE.MathUtils.degToRad(time * 50);

			
			if (this._light.target) {
				const smallSphere = smallSpherePivot.children[0];
				
				smallSphere.getWorldPosition(this._light.target.position);

				if (this._lightHelper) {
					this._lightHelper.update();
				}
			}
			
		}

	}
}

window.onload = function() {
	new App();
}