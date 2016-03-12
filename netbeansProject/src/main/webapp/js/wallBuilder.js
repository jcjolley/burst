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
	var cubeGeometry = new THREE.CubeGeometry(xLen, yLen, zLen) 
	for (var zCoord = 0; zCoord < zDim; zCoord++) {
		var xLocation = -xDim * xLen / 2;
		for (var xCoord = 0; xCoord < xDim; xCoord++) {
			var wallMesh;
			switch (goodMaze[zCoord][xCoord]) {
				case 'X':
					wallMesh = new Physijs.BoxMesh(cubeGeometry, wallMaterial);
					break;
				case '.':
				case '/':
				default:
					wallMesh = new THREE.Object3D();
			}
			wallMesh.position.x = xLocation;
			wallMesh.position.y = yLen / 2
			wallMesh.position.z = zLocation;
			Labyrinth.add(wallMesh);
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
	var wallTexture = new THREE.ImageUtils.loadTexture('textures/stoneWall1.png');
	wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
	wallTexture.repeat.set(1, 1);
	wallMaterial = new THREE.MeshBasicMaterial({map: wallTexture});
}

function buildLabyrinth(wallMap, xDim, zDim)
{
	// the starting locations are calculated based on the size of the map
	var Labyrinth = new THREE.Object3D();

	var zLocation = -zDim * zLen / 2
	for (var zCoord = 0; zCoord < zDim; zCoord++)
	{
		var xLocation = -xDim * xLen / 2
		for (var xCoord = 0; xCoord < xDim; xCoord++)
		{
			//console.log("xCoord: ", xCoord, "    zCoord: ", zCoord);
			var wallMesh;
			switch (wallMap[zCoord][xCoord])
			{
				case '0': // empty wall
					wallMesh = new THREE.Object3D();
					break;
				case '1': // vertical wall
					wallMesh = createWall(1)
					break;
				case '2': // horizontal wall
					wallMesh = createWall(2)
					break;
				case '3': // cross
					wallMesh = createWall(3)
					break;
				case '4': // botton-right corner
					wallMesh = createWall(4)
					break;
				case '5': // top-right corner
					wallMesh = createWall(5)
					break;
				case '6': // top-left corner
					wallMesh = createWall(6)
					break;
				case '7': // botton-left corner
					wallMesh = createWall(7)
					break;
				case '8': // cross w/out right arm
					wallMesh = createWall(8)
					break;
				case '9': // cross w/out bottom arm
					wallMesh = createWall(9)
					break;
				case '10': // cross w/out left arm
					wallMesh = createWall(10)
					break;
				case '11': // cross w/out top arm
					wallMesh = createWall(11)
					break;
				case 's': // starting square
					wallMesh = new THREE.Object3D();
					break;
				case 'f': // finish square
					wallMesh = new THREE.Object3D();
					break;
				default:
					console.log("ERROR: ", wallMap[zCoord][xCoord], " is not a valid wall type!")
			}

			wallMesh.position.x = xLocation;
			wallMesh.position.y = yLen / 2
			wallMesh.position.z = zLocation;
			Labyrinth.add(wallMesh);
			xLocation += xLen
		}
		zLocation += zLen;
	}
	scene.add(Labyrinth);
}

// I decided to just create the wall segments on an as-needed basis (instead of at the top of function)
// It may be a lot of duplicated code, but it's faster than instantiating uneeded materials
// TODO: Stress test this to see how much faster it really is...
// TODO: regression tests for this to make sure that we're really getting the correct walls.
// TODO: algebraic reductions
function createWall(wallNumber)
{
var wallMesh;
	switch (wallNumber)
{
case 1: // vertical wall
	wallMesh = new THREE.Mesh(new THREE.CubeGeometry(wallWidthRatio * xLen, yLen, zLen), wallMaterial);
	break;
	case 2: // horizontal wall
	wallMesh = new THREE.Mesh(new THREE.CubeGeometry(xLen, yLen, wallWidthRatio * zLen), wallMaterial);
	break;
	case 3: // botton-left corner
	wallMesh = new THREE.Object3D();
	var verticalWall = new THREE.Mesh(new THREE.CubeGeometry(xLen * wallWidthRatio,
		yLen,
		zLen / 2 + zLen * wallWidthRatio / 2), wallMaterial);
	verticalWall.position.z = ( - (zLen / 2 + zLen * wallWidthRatio / 2) / 2 + zLen * wallWidthRatio / 2);
	var horizontalWall = new THREE.Mesh(new THREE.CubeGeometry(xLen / 2 * (1 - wallWidthRatio),
		yLen,
		zLen * wallWidthRatio), wallMaterial);
	horizontalWall.position.x = ((xLen / 2 - xLen * wallWidthRatio / 2) / 2 + wallWidthRatio * xLen / 2); // top arm
	wallMesh.add(verticalWall);
	wallMesh.add(horizontalWall);
	break;
	case 4: // botton-right corner
	wallMesh = new THREE.Object3D();
	var verticalWall = new THREE.Mesh(new THREE.CubeGeometry(xLen * wallWidthRatio,
		yLen,
		zLen / 2 + zLen * wallWidthRatio / 2), wallMaterial);
	verticalWall.position.z = ( - (zLen / 2 + zLen * wallWidthRatio / 2) / 2 + zLen * wallWidthRatio / 2);
	var horizontalWall = new THREE.Mesh(new THREE.CubeGeometry(xLen / 2 * (1 - wallWidthRatio),
		yLen,
		zLen * wallWidthRatio), wallMaterial);
	horizontalWall.position.x = - ((xLen / 2 - xLen * wallWidthRatio / 2) / 2 + wallWidthRatio * xLen / 2); // top arm
	wallMesh.add(verticalWall);
	wallMesh.add(horizontalWall);
	break;
	case 5: // top-right corner
	wallMesh = new THREE.Object3D();
	var verticalWall = new THREE.Mesh(new THREE.CubeGeometry(xLen * wallWidthRatio,
		yLen,
		zLen / 2 + zLen * wallWidthRatio / 2), wallMaterial);
	verticalWall.position.z = - ( - (zLen / 2 + zLen * wallWidthRatio / 2) / 2 + zLen * wallWidthRatio / 2);
	var horizontalWall = new THREE.Mesh(new THREE.CubeGeometry(xLen / 2 * (1 - wallWidthRatio),
		yLen,
		zLen * wallWidthRatio), wallMaterial);
	horizontalWall.position.x = - ((xLen / 2 - xLen * wallWidthRatio / 2) / 2 + wallWidthRatio * xLen / 2); // top arm
	wallMesh.add(verticalWall);
	wallMesh.add(horizontalWall);
	break;
	case 6: // top-left corner
	wallMesh = new THREE.Object3D();
	var verticalWall = new THREE.Mesh(new THREE.CubeGeometry(xLen * wallWidthRatio,
		yLen,
		zLen / 2 + zLen * wallWidthRatio / 2), wallMaterial);
	verticalWall.position.z = - ( - (zLen / 2 + zLen * wallWidthRatio / 2) / 2 + zLen * wallWidthRatio / 2);
	var horizontalWall = new THREE.Mesh(new THREE.CubeGeometry(xLen / 2 * (1 - wallWidthRatio),
		yLen,
		zLen * wallWidthRatio), wallMaterial);
	horizontalWall.position.x = ((xLen / 2 - xLen * wallWidthRatio / 2) / 2 + wallWidthRatio * xLen / 2); // top arm
	wallMesh.add(verticalWall);
	wallMesh.add(horizontalWall);
	break;
	case 7: // cross
	wallMesh = new THREE.Object3D();
	verticalWall = new THREE.Mesh(new THREE.CubeGeometry(wallWidthRatio * xLen,
		yLen,
		zLen), wallMaterial);
	horizontalLeftWall = new THREE.Mesh(new THREE.CubeGeometry(xLen / 2 * (1 - wallWidthRatio),
		yLen,
		zLen * wallWidthRatio), wallMaterial);
	horizontalRightWall = new THREE.Mesh(new THREE.CubeGeometry(xLen / 2 - (wallWidthRatio * xLen / 2),
		yLen,
		zLen * wallWidthRatio), wallMaterial);
	// position the side walls so that they look attached to the long wall		
	horizontalLeftWall.position.x = xLen / 4 * (1 + wallWidthRatio); // this was a fun algrebraic reduction
	horizontalRightWall.position.x = - (xLen / 4 * (1 + wallWidthRatio));
	// add the walls to the object
	wallMesh.add(verticalWall);
	wallMesh.add(horizontalLeftWall);
	wallMesh.add(horizontalRightWall);
	break;
	case 8: // T shape (stick points left)
	wallMesh = new THREE.Object3D();
	var verticalWall = new THREE.Mesh(new THREE.CubeGeometry(xLen * wallWidthRatio,
		yLen,
		zLen), wallMaterial);
	verticalWall.position.z = 0;
	var horizontalWall = new THREE.Mesh(new THREE.CubeGeometry(xLen / 2 * (1 - wallWidthRatio),
		yLen,
		zLen * wallWidthRatio), wallMaterial);
	horizontalWall.position.x = - ((xLen / 2 - xLen * wallWidthRatio / 2) / 2 + wallWidthRatio * xLen / 2); // top arm
	wallMesh.add(verticalWall);
	wallMesh.add(horizontalWall);
	break;
	case 9: // T shape (stick points up)
	wallMesh = new THREE.Object3D();
	var verticalWall = new THREE.Mesh(new THREE.CubeGeometry(xLen * wallWidthRatio,
		yLen,
		zLen / 2 * (1 - wallWidthRatio)), wallMaterial);
	verticalWall.position.z = - ((zLen / 2 - zLen * wallWidthRatio / 2) / 2 + wallWidthRatio * zLen / 2);
	;
	var horizontalWall = new THREE.Mesh(new THREE.CubeGeometry(xLen,
		yLen,
		zLen * wallWidthRatio), wallMaterial);
	horizontalWall.position.x = 0;
	wallMesh.add(verticalWall);
	wallMesh.add(horizontalWall);
	break;
	case 10: // T shape (stick points right)
	wallMesh = new THREE.Object3D();
	var verticalWall = new THREE.Mesh(new THREE.CubeGeometry(xLen * wallWidthRatio,
		yLen,
		zLen), wallMaterial);
	verticalWall.position.z = 0;
	var horizontalWall = new THREE.Mesh(new THREE.CubeGeometry(xLen / 2 * (1 - wallWidthRatio),
		yLen,
		zLen * wallWidthRatio), wallMaterial);
	horizontalWall.position.x = ((xLen / 2 - xLen * wallWidthRatio / 2) / 2 + wallWidthRatio * xLen / 2); // top arm
	wallMesh.add(verticalWall);
	wallMesh.add(horizontalWall);
	break;
	case 11: // T shape (stick points down)
	wallMesh = new THREE.Object3D();
	var verticalWall = new THREE.Mesh(new THREE.CubeGeometry(xLen * wallWidthRatio,
		yLen,
		zLen / 2 * (1 - wallWidthRatio)), wallMaterial);
	verticalWall.position.z = ((zLen / 2 - zLen * wallWidthRatio / 2) / 2 + wallWidthRatio * zLen / 2);
	var horizontalWall = new THREE.Mesh(new THREE.CubeGeometry(xLen,
		yLen,
		zLen * wallWidthRatio), wallMaterial);
	horizontalWall.position.x = 0;
	wallMesh.add(verticalWall);
	wallMesh.add(horizontalWall);
	break;
	default:
	console.log("ERROR: requested invalid wall: ", wallNumber);
}

/*
 // TEST CODE: poles added to help see the dimensions of the square
 // WHEN YOU START, YOU ARE LOOKING DOWN
 // add poles to the wall to show where the points are of the square
 poleGeometry = new THREE.CylinderGeometry( 1, 1, yLen*2, 4 );
 poleMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
 poleMesh = new THREE.Mesh(poleGeometry, poleMaterial);
 poleMesh.position.y = yLen;
 poleMeshArray = [];
 
 
 for (var i = 0; i < 9; i++)
 poleMeshArray.push(poleMesh.clone())
 // top left
 poleMeshArray[0].position.x = -xLen/2
 poleMeshArray[0].position.z = zLen/2
 // top middle
 poleMeshArray[1].position.x = 0
 poleMeshArray[1].position.z = zLen/2
 // top right
 poleMeshArray[2].position.x = xLen/2
 poleMeshArray[2].position.z = zLen/2
 // middle left
 poleMeshArray[3].position.x = -xLen/2
 poleMeshArray[3].position.z = 0
 // center
 poleMeshArray[4].position.x = 0 
 poleMeshArray[4].position.z = 0
 // middle right
 poleMeshArray[5].position.x = xLen/2
 poleMeshArray[5].position.z = 0
 // bottom left
 poleMeshArray[6].position.x = -xLen/2
 poleMeshArray[6].position.z = -zLen/2
 // bottom middle
 poleMeshArray[7].position.x = 0
 poleMeshArray[7].position.z = -zLen/2
 // bottom right
 poleMeshArray[8].position.x = xLen/2
 poleMeshArray[8].position.z = -zLen/2
 // place the poles
 for (var i = 0; i < 9; i++)
 wallMesh.add(poleMeshArray[i])
 */
 return wallMesh;
 }