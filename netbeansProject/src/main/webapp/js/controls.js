function getMovement()
{
	var delta = clock.getDelta(); // seconds.
	var moveDistance = 100 * delta; // 300 pixels per second
	var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
	
	// local transformations
	// move forwards/backwards/left/right
	if ( keyboard.pressed("W") )
		MovingCube.translateZ( -moveDistance );
	if ( keyboard.pressed("S") )
		MovingCube.translateZ(  moveDistance );
	if ( keyboard.pressed("Q") )
		MovingCube.translateX( -moveDistance );
	if ( keyboard.pressed("E") )
		MovingCube.translateX(  moveDistance );
	if ( keyboard.pressed('space') )
		MovingCube.translateY( moveDistance );
	if ( keyboard.pressed("N") )
		MovingCube.translateY( -moveDistance);

	if ( keyboard.pressed("P") ) // test 
	{
		//console.log(camera.position);
		var paused = true;
		var teapotTexture = new THREE.ImageUtils.loadTexture( 'textures/goldGlitter.png' );
		teapotTexture.wrapS = teapotTexture.wrapT = THREE.RepeatWrapping;
		teapotTexture.repeat.set( 1, 1);
		var teapotMaterial = new THREE.MeshPhongMaterial( { map: teapotTexture } );
		console.log("Attempting to change material to:");
		console.log(teapotMaterial);
		lb.setWallTexture(teapotMaterial);
		minimap.changeMapMaterial(new THREE.MeshBasicMaterial( {color: 0xcc2222} ));
	}

	// rotate left/right
	var rotation_matrix = new THREE.Matrix4().identity();
	if ( keyboard.pressed("A") )
	{
		MovingCube.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
		camera.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
	}
	if ( keyboard.pressed("D") )
	{
		MovingCube.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
		camera.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
	}

	// rotate up/down *DISABLE*
	if ( keyboard.pressed("R") )
	{
		MovingCube.rotateOnAxis( new THREE.Vector3(1,0,0), rotateAngle);
		camera.rotateOnAxis( new THREE.Vector3(1,0,0), rotateAngle);
	}
	if ( keyboard.pressed("F") )
	{
		MovingCube.rotateOnAxis( new THREE.Vector3(1,0,0), -rotateAngle);
		camera.rotateOnAxis( new THREE.Vector3(1,0,0), -rotateAngle);
	}
	
	// TODO: Menu toggle button
	if ( keyboard.pressed("Z") )
	{
		MovingCube.position.set(startX,25,startZ);
		MovingCube.rotation.set(0,0,0);
		camera.rotation.set(0,0,0);
	}
}