

function init(size)
{
	// SCENE
	scene = new THREE.Scene();

// LIGHTS
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

	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	camera.position.set(0, cameraHeight, 0);
	camera.add(spotlight);
	spotlight.position.set(0, 0, 1);
	spotlight.target = camera;
	controls = new THREE.PointerLockControls( camera );
	scene.add( controls.getObject() );
	
	var onKeyDown = function ( event ) {
		
		switch ( event.keyCode ) {
			
			case 38: // up
			case 87: // w
				moveForward = true;
				break;
				
			case 37: // left
			case 65: // a
				moveLeft = true; break;
				
			case 40: // down
			case 83: // s
				moveBackward = true;
				break;
				
			case 39: // right
			case 68: // d
				moveRight = true;
				break;
				
			case 32: // space
				if ( canJump === true ) velocity.y += 350;
				canJump = false;
				break;
				
		}
		
	};
	
	var onKeyUp = function ( event ) {
		
		switch( event.keyCode ) {
			
			case 38: // up
			case 87: // w
				moveForward = false;
				break;
				
			case 37: // left
			case 65: // a
				moveLeft = false;
				break;
							
			case 40: // down
			case 83: // s
				moveBackward = false;
				break;
				
			case 39: // right
			case 68: // d
				moveRight = false;
				break;
				
		}
		
	};
	
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );
				
	


	// RENDERER
	renderer = new THREE.WebGLRenderer({antialias: true});

	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	renderer.shadowMap.enabled = true;
	container = document.getElementById('ThreeJS');
	container.appendChild(renderer.domElement);
	
	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild(stats.domElement);

	/// ROOF
	var roofTexture = loader.load('textures/ceiling.jpg');
	roofTexture.wrapS = roofTexture.wrapT = THREE.RepeatWrapping;
	roofTexture.repeat.set(100, 100);
	var roofMaterial = new THREE.MeshPhongMaterial({map: roofTexture, side: THREE.DoubleSide});
	var roofGeometry = new THREE.PlaneGeometry(40 * (size + 2), 40 * (size + 2), 10, 0);
	var roof = new THREE.Mesh(roofGeometry, roofMaterial);
	roof.position.y = 40;
	roof.rotation.x = Math.PI / 2;
	roof.recieveShadow = true;
	roof.castShadow = true;
	scene.add(roof);

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
	var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
	var skyBoxMaterial = new THREE.MeshBasicMaterial({color: 0x9999ff, side: THREE.BackSide});
	skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);

	scene.add(skyBox);
	scene.fog = new THREE.FogExp2(0x202020, 0.01);
}