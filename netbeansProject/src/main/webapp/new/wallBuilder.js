// global wall variables
var wallWidthRatio; // The width of the labyrinth walls
var xLen; // length of a square
var zLen; // height of a square
var yLen; // height of the wall
var wallMaterial;     // texture used for the labyrinth walls
var goodMaze;

function buildSimpleLaby(goodMaze)
{
	var Labyrinth = new THREE.Object3D();
	var zLocation = -zDim * zLen / 2;
	var cubeGeometry = new THREE.CubeGeometry(xLen, yLen, zLen);
	var collisionGeometry = new THREE.CubeGeometry(xLen + 20, yLen + 20, zLen + 20);
	for (var zCoord = 0; zCoord < zDim; zCoord++) {
		var xLocation = -xDim * xLen / 2;
		for (var xCoord = 0; xCoord < xDim; xCoord++) {
			var wallMesh;
			switch (goodMaze[zCoord][xCoord]) {
				case 'X':
					wallMesh = new THREE.Mesh(cubeGeometry, wallMaterial);
					wallMesh.position.x = xLocation;
					wallMesh.position.y = yLen / 2
					wallMesh.position.z = zLocation;
					wallMesh.castShadow = true;
					wallMesh.recieveShadow = true;
					var collisionMesh = new THREE.Mesh(collisionGeometry, collisionMaterial);
					collisionMesh.position.x = xLocation;
					collisionMesh.position.y = yLen / 2
					collisionMesh.position.z = zLocation;
					objects.push(collisionMesh);
					Labyrinth.add(wallMesh);
					Labyrinth.add(collisionMesh);
					break;
				case '.':
				case '/':
			}

			xLocation += xLen
		}
		zLocation += zLen
	}
	scene.add(Labyrinth);
}

function initWallVars(size)
{
	xLen = zLen = 40;    // the length/width of a square
	yLen = 40;           // wall height
	wallWidthRatio = 1; // Must be between 0 and 1. Change this to 1 to create "cube" walls.
	xDim = size + 2;
	zDim = size + 2;

	// TODO: Fix texture ratio for long walls


	var DiffuseTexture = loader.load("textures/stoneWall1.png");

	wallMaterial = new THREE.MeshPhongMaterial(
			{
				map: DiffuseTexture,
			});
    wallMaterial.side = THREE.DoubleSide;
	collisionMaterial = new THREE.MeshBasicMaterial();
	collisionMaterial.visible = false;
}