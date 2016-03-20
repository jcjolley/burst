raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);
forwardRaycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(1, 0, 0));
backwardRaycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(-1, 0, 0));
rightRaycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, -1));
leftRaycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, -1));

function checkForCollisions() {

	raycaster.ray.origin.copy(controls.getObject().position);
	raycaster.ray.origin.y -= 10;

	var cameraPosition = controls.getObject().position;
	var cameraDirection = controls.getObject().getWorldDirection();

	var forwardVector = cameraDirection.negate();
	forwardVector.setY(cameraPosition.y);
	forwardRaycaster.set(cameraPosition, forwardVector.normalize());

	var backwardVector = cameraDirection;
	backwardVector.setY(cameraPosition.y);
	backwardRaycaster.set(cameraPosition, backwardVector.normalize());

	var leftVector = cameraDirection.applyAxisAngle(new THREE.Vector3(1, 0, 0), (3* Math.PI / 2));
	leftVector.setY(cameraPosition.y);
	leftRaycaster.set(cameraPosition, leftVector.normalize());

	var rightVector = cameraDirection.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
	rightVector.setY(cameraPosition.y);
	rightRaycaster.set(cameraPosition, rightVector.normalize());

	var intersections = raycaster.intersectObjects(objects);
	var forwardIntersections = forwardRaycaster.intersectObjects(objects);
	var backwardIntersections = backwardRaycaster.intersectObjects(objects);
	var rightIntersections = rightRaycaster.intersectObjects(objects);
	var leftIntersections = leftRaycaster.intersectObjects(objects);

	var isOnObject = intersections.length > 0;

	var objectForward = forwardIntersections.length > 0;
	var objectBackward = backwardIntersections.length > 0;
	var objectRight = rightIntersections.length > 0;
	var objectLeft = leftIntersections.length > 0;

	var time = performance.now();
	var delta = (time - prevTime) / 1000;

	velocity.x -= velocity.x * 10.0 * delta;
	velocity.z -= velocity.z * 10.0 * delta;

	velocity.y -= 9.8 * 50.0 * delta; // 100.0 = mass

	if (moveForward)
		velocity.z -= 400.0 * delta;
	if (moveBackward)
		velocity.z += 400.0 * delta;

	if (moveLeft)
		velocity.x -= 400.0 * delta;
	if (moveRight)
		velocity.x += 400.0 * delta;

	if (isOnObject === true) {
		velocity.y = Math.max(0, velocity.y);

		canJump = true;
	}

	if (objectLeft) {
		//console.log("Intersecting Left?");
		velocity.x = Math.max(0, velocity.x);
	}

	if (objectForward) {
		//console.log("Intersecting forward");
		velocity.z = Math.max(0, velocity.z);
	}

	if (objectBackward) {
		//console.log("Intersecting backward");
		velocity.z = Math.min(0, velocity.z);
	}

	if (objectRight) {
	//	console.log("Intesecting right");
		velocity.x = Math.min(0, velocity.x);
	}

	controls.getObject().translateX(velocity.x * delta);
	controls.getObject().translateY(velocity.y * delta);
	controls.getObject().translateZ(velocity.z * delta);

	if (controls.getObject().position.y < 10) {

		velocity.y = 0;
		controls.getObject().position.y = 10;

		canJump = true;
	}
	prevTime = time;
}