function init(size) {

	scene = new THREE.Scene();
	scene.add(new THREE.AmbientLight(0x202020));

	spotlight = new THREE.SpotLight(0xFFFFAA, 0);
	spotlight.castShadow = true;
	spotlight.exponet = 1000000;
	spotlight.angle = Math.PI / 4;
	spotlight.distance = 200;

	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45;
	ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
	NEAR = 0.1;
	FAR = 20000;
	LIGHTSTATUS = false;
	var cameraboxMaterial = new THREE.MeshBasicMaterial({opacity: 0, transparent: true});
	var cameraBoxGeometry = new THREE.CubeGeometry(1, 1, 1);
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	camera.position.set(0, 10, 0);
	camera.add(spotlight);
	spotlight.position.set(0, 0, 1);
	spotlight.target = camera;
	controls = new THREE.PointerLockControls(camera);
	scene.add(controls.getObject());
	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);

	renderer = new THREE.WebGLRenderer({antialias: true});

	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	renderer.shadowMap.enabled = true;
	document.body.appendChild(renderer.domElement);

/// ROOF
//	var roofTexture = loader.load('textures/ceiling.jpg');
//	roofTexture.wrapS = roofTexture.wrapT = THREE.RepeatWrapping;
//	roofTexture.repeat.set(100, 100);
//	var roofMaterial = new THREE.MeshPhongMaterial({map: roofTexture, side: THREE.DoubleSide});
//	var roofGeometry = new THREE.PlaneGeometry(40 * (size + 2), 40 * (size + 2), 10, 0);
//	var roof = new THREE.Mesh(roofGeometry, roofMaterial);
//	roof.position.y = 40;
//	roof.rotation.x = Math.PI / 2;
//	roof.recieveShadow = true;
//	roof.castShadow = true;
//	scene.add(roof);
//
	// FLOOR
	var floorTexture = loader.load('textures/ground1.jpg');
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
	floorTexture.repeat.set(100, 100);
	var floorMaterial = new THREE.MeshPhongMaterial({map: floorTexture, side: THREE.DoubleSide});
	var floorGeometry = new THREE.PlaneGeometry(40 * (size + 2), 40 * (size + 2), 10, 0);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = 0;
	floor.rotation.x = Math.PI / 2;
	floor.castShadow = true;
	scene.add(floor);

	// SKYBOX/FOG
	var skyBoxGeometry = new THREE.CubeGeometry(2000, 2000, 2000);
	var skyBoxMaterial = new THREE.MeshBasicMaterial({color: 0x9999ff, side: THREE.BackSide});
	skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
	scene.add(skyBox);

	window.addEventListener('resize', onWindowResize, false);

	skyAnimator = new SkyAnimator(skyBox, scene);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {

	skyAnimator.animateSky();
	if (ajaxReturned) {
		minimap.animateMap();
	}

	requestAnimationFrame(animate);
	if (controlsEnabled) {
		checkForCollisions();
	}
	renderer.render(scene, camera);
}