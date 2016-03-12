

function init(size)
{
    // SCENE
    scene = new Physijs.Scene;
    scene.setGravity(new THREE.Vector3(0, -30, 0));

    // CAMERA
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45;
    ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
    NEAR = 0.1;
    FAR = 20000;

    var friction = 0; // low friction
    var restitution = 0; // low restitution

    var material = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({color: 0x888888}),
            friction,
            restitution
            );

    var collisionBox = new Physijs.BoxMesh(
            new THREE.CubeGeometry(25, 25, 25),
            material
            );
    collisionBox.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
    // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
    alert("Collision detected");
});
    
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.set(0, cameraHeight, 0);
    
    var cameraBox = new THREE.Object3D();
    cameraBox.add(collisionBox);
    cameraBox.add(camera);
    controls = new THREE.FirstPersonControls(cameraBox);
    controls.movementSpeed = 50;
    controls.lookSpeed = 0.05;
    controls.lookVertical = true;
    controls.constrainVertical = true;
    controls.noFly = true;

    scene.add(cameraBox);
    // RENDERER
    if (Detector.webgl) {
        renderer = new THREE.WebGLRenderer({antialias: true});
    }

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container = document.getElementById('ThreeJS');
    container.appendChild(renderer.domElement);
    //renderer.renderer.shadowMap.enabled = true;
    //renderer.shadowMapSoft = true;
    // EVENTS
    THREEx.WindowResize(renderer, camera);
    THREEx.FullScreen.bindKey({charCode: 'm'.charCodeAt(0)});

    // CONTROLS
    // ORBIT
    //controls = new THREE.OrbitControls(camera, renderer.domElement);

    // STATS
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    stats.domElement.style.zIndex = 100;
    container.appendChild(stats.domElement);

    // LIGHTS
    var light = new THREE.PointLight(0xffffff);
    light.position.set(0, 250, 0);
    scene.add(light);

    /// ROOF
    var roofTexture = new THREE.ImageUtils.loadTexture('textures/stoneWall1.png');
    roofTexture.wrapS = roofTexture.wrapT = THREE.RepeatWrapping;
    roofTexture.repeat.set(100, 100);
    var roofMaterial = new THREE.MeshBasicMaterial({map: roofTexture, side: THREE.DoubleSide});
    var roofGeometry = new THREE.PlaneGeometry(40 * (size + 2), 40 * (size + 2), 10, 0);
    var roof = new Physijs.PlaneMesh(roofGeometry, roofMaterial);
    roof.position.y = 40;
    roof.rotation.x = Math.PI / 2;
    scene.add(roof);

// FLOOR
    var floorTexture = new THREE.ImageUtils.loadTexture('textures/ground1.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(100, 100);
    var floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, side: THREE.DoubleSide});
    var floorGeometry = new THREE.PlaneGeometry(40 * (size + 2), 40 * (size + 2), 10, 0);
    var floor = new Physijs.PlaneMesh(floorGeometry, floorMaterial);
    floor.position.y = 0;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);

    // SKYBOX/FOG
    var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
    var skyBoxMaterial = new THREE.MeshBasicMaterial({color: 0x9999ff, side: THREE.BackSide});
    skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);

    scene.add(skyBox);
    scene.fog = new THREE.FogExp2(0x9999ff, 0.0005);

    //Andrew
    //TODO: Get x dimension, z dimension, and map file from external source
    //TEMP: Hardcoded map
    /*
     map =  Map.getMap();
     xDim = Map.getXDim();
     zDim = Map.getZDim();
     */
    var xDim = 15;
    var zDim = 15;
    var testMapWalls = [['6', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '11', '2', '2', '5'],
        ['1', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '1', '0', '0', '1'],
        ['1', '0', '6', '2', '2', '5', '0', '0', '6', '2', '2', '4', '0', '0', '1'],
        ['1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '0', '0', '0', '1'],
        ['1', '0', '1', '0', '2', '4', '0', '0', '1', '0', '6', '2', '2', '2', '4'],
        ['1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '1', '0', '0', '0', 'F'],
        ['1', '0', '3', '2', '2', '5', '0', '2', '4', '0', '1', '0', '0', '0', '1'],
        ['1', '0', '0', '0', '0', '1', '0', '0', '0', '0', '1', '0', '6', '2', '8'],
        ['1', '0', '0', '6', '2', '8', '0', '2', '2', '2', '4', '0', '1', '0', '1'],
        ['1', '0', '0', '1', '0', '1', '0', '0', '0', '0', '0', '0', '1', '0', '1'],
        ['1', '0', '0', '1', '0', '1', '0', '6', '2', '2', '5', '0', '1', '0', '1'],
        ['1', '0', '0', '1', '0', '1', '0', '1', '0', '0', '1', '0', '1', '0', '1'],
        ['1', '0', '2', '4', '0', '1', '0', '1', '0', '2', '4', '0', '0', '0', '1'],
        ['1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1'],
        ['3', '2', '2', '2', '2', '9', '2', '9', '2', '2', '2', '2', '9', '2', '4']];




//buildLabyrinth(testMapWalls, xDim, zDim);

    ////////////
    // CUSTOM //
    ////////////
    /*	var hitboxDim = 2;
     MovingCube = new THREE.Object3D();
     var hitboxMaterial = new THREE.MeshBasicMaterial( { color: 0xff88ff, opacity: 0, transparent: true } );
     var MovingCubeGeom = new THREE.CubeGeometry( hitboxDim, hitboxDim, hitboxDim);
     hitboxCube = new Physijs.BoxMesh( MovingCubeGeom, hitboxMaterial );
     //var PointerCube = new THREE.Mesh(new THREE.CubeGeometry( 1,1,1), hitboxMaterial);
     //PointerCube.position.z = -hitboxDim/2;
     
     MovingCube.add(hitboxCube);
     //MovingCube.add(PointerCube);
     
     // TODO: Place the cube/camera at the starting position, looking into the labyrinth
     MovingCube.position.set(0, 25, 0); 
     scene.add( MovingCube );*/
}