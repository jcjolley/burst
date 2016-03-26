/*
* The MIT License (MIT)
* Copyright (c) 2016 Andrew Rindfleisch  (http://ajrind.github.io)
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
* and associated documentation files (the "Software"), to deal in the Software without restriction, 
* including without limitation the rights to use, copy, modify, merge, publish, distribute, 
* sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is 
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all copies or 
* substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT 
* NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
* DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var LabyrinthBuilder = function (wallMap) {
	this.wallMap = wallMap;
	
	this.xLen = this.zLen = 40; // the length/width of a square
	this.yLen = 40;             // height of the wall
	this.startCoords  = {x:0, y:25, z:0};
	this.finishCoords = {x:0, y:25, z:0};
	this.minimap;
	this.teapot;
	this.labyrinth;
	this.wallWidth = 1; // The width of the labyrinth walls. Use 1 for cube walls. 0 < wallWidth <= 1

	// set up the wall material
	wallTexture = new THREE.ImageUtils.loadTexture( 'textures/stoneWall1.png' );
	wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
	wallTexture.repeat.set( 1, 1);
	this.wallMaterial = new THREE.MeshLambertMaterial( { map: wallTexture } );

	this.setWallTexture = function(mat)
	{
		console.log("called setWallTexture!")
		if (wallTexture)
		{
			this.changeMaterial(this.labyrinth, mat);
		}

		else
		{
			console.error("Unable to set texture: texture is undefined.")
		}
	};

	this.build = function() 
	{
		// the starting locations are calculated based on the size of the map
		this.labyrinth = new THREE.Object3D();
		var xDim = this.wallMap[0].length;
		var zDim = this.wallMap.length;
		
		var wallMeshCount = 0;
		var zLocation = -zDim * this.zLen / 2
		for (var zCoord = 0; zCoord < zDim; zCoord++)
	    {
	    	var xLocation = -xDim * this.xLen / 2
	    	for (var xCoord = 0; xCoord < xDim; xCoord++)
	        {
	        	var wallMesh = undefined;
	        	switch(this.wallMap[zCoord][xCoord])
	        	{
	        		case '0': // empty wall
	        			// do nothing
	        			break;
	        		case '1': // vertical wall
	        			wallMesh = this.createWall(1);
	        			break;
	        		case '2': // horizontal wall
	        			wallMesh = this.createWall(2);
	        			break;
	        		case '3': // cross
	        			wallMesh = this.createWall(3);
	        			break;
	        		case '4': // botton-right corner
	        			wallMesh = this.createWall(4);
	        			break;
	        		case '5': // top-right corner
	        			wallMesh = this.createWall(5);
	        			break;
	        		case '6': // top-left corner
	        			wallMesh = this.createWall(6);
	        			break;
	        		case '7': // botton-left corner
	        			wallMesh = this.createWall(7);
	        			break;
	        		case '8': // cross w/out right arm
	        			wallMesh = this.createWall(8);
	        			break;
	        		case '9': // cross w/out bottom arm
	        			wallMesh = this.createWall(9);
	        			break;
					case '10': // cross w/out left arm
	        			wallMesh = this.createWall(10);
	        			break;
	        		case '11': // cross w/out top arm
	        			wallMesh = this.createWall(11);
	        			break;
	        		case 'S': // starting square
	        			// set coordinates for the start
	        			this.startCoords.x = xLocation;
	        			this.startCoords.z = zLocation;
	        			break;
	        		case 'F': // finish square
	        			// set coordinates for the finish
	        			this.finishCoords.x = xLocation;
	        			this.finishCoords.z = zLocation;
		    			
		    			// add the golden teapot
		    			var teapotTexture = new THREE.ImageUtils.loadTexture( 'textures/goldGlitter.png' );
						teapotTexture.wrapS = teapotTexture.wrapT = THREE.RepeatWrapping;
						teapotTexture.repeat.set( 1, 1);
		    			var teapotMaterial = new THREE.MeshPhongMaterial( { map: teapotTexture } );
						//teapotMaterial.shininess = 100;

						var teapotSize = 7;
						var tess = 15;
						var teapotGeometry = new THREE.TeapotBufferGeometry( teapotSize, tess, true, true, true, true, true);
						this.teapot = new THREE.Mesh(teapotGeometry, teapotMaterial);
						this.teapot.rotation.x = Math.PI / 8;
						wallMesh = this.teapot;						
	        			break;
	        		default:
	        			console.log("ERROR: ", this.wallMap[zCoord][xCoord], " is not a valid wall type!")
	        	}
	        	
	        	if (wallMesh)
	        	{
	        		wallMeshCount++;	
		        	wallMesh.position.x = xLocation;
		        	wallMesh.position.y = this.yLen/2;
		        	wallMesh.position.z = zLocation;
		        	wallMesh.castShadow = true;
		        	this.labyrinth.add( wallMesh );
	   	        	//console.log("added wallMesh!");
	        	}
	        	xLocation += this.xLen
	        	//console.log("xCoord = ", xCoord)
	    	}
	    	zLocation += this.zLen
	    }	    
	    console.log("Labyrinth:");
	    this.labyrinth.castShadow = true;
	    this.labyrinth.receiveShadow = true;
	    console.log(this.labyrinth);
	    this.createMinimap();
	}

	// I decided to just create the wall segments on an as-needed basis (instead of at the top of function)
	// It may be a some duplicated code, but it's faster than instantiating uneeded materials
	// TODO: Stress test this to see how much faster it really is...
	// TODO: regression tests to make sure that we're really getting the correct walls.
	// TODO: finish algebraic reductions
	this.createWall = function(wallNumber)
	{
		var wallMesh;
		switch(wallNumber)
		{
			case 1: // vertical wall
				wallMesh = new THREE.Mesh(new THREE.CubeGeometry(this.wallWidth*this.xLen, this.yLen, this.zLen), this.wallMaterial);			
				break;
			case 2: // horizontal wall
				wallMesh = new THREE.Mesh(new THREE.CubeGeometry(this.xLen, this.yLen, this.wallWidth*this.zLen), this.wallMaterial);
				break;
			case 3: // botton-left corner
				wallMesh = new THREE.Object3D();
				var verticalWall = new THREE.Mesh(new THREE.CubeGeometry(this.xLen * this.wallWidth, 
																		 this.yLen, 
																		 this.zLen/2 +  this.zLen * this.wallWidth/2), this.wallMaterial);
				verticalWall.position.z = (-(this.zLen/2 +  this.zLen * this.wallWidth/2)/2 + this.zLen * this.wallWidth/2);
				
				var horizontalWall = new THREE.Mesh(new THREE.CubeGeometry(this.xLen/2 * (1 - this.wallWidth), 
																		   this.yLen, 
																		   this.zLen * this.wallWidth), this.wallMaterial); 
				horizontalWall.position.x = ((this.xLen/2 - this.xLen * this.wallWidth/2)/2 + this.wallWidth*this.xLen/2); // top arm
				wallMesh.add(verticalWall);
				wallMesh.add(horizontalWall);
				break;
			case 4: // botton-right corner
				wallMesh = new THREE.Object3D();
				var verticalWall = new THREE.Mesh(new THREE.CubeGeometry(this.xLen * this.wallWidth, 
																		 this.yLen, 
																		 this.zLen/2 +  this.zLen * this.wallWidth/2), this.wallMaterial);
				verticalWall.position.z = (-(this.zLen/2 +  this.zLen * this.wallWidth/2)/2 + this.zLen * this.wallWidth/2);
				
				var horizontalWall = new THREE.Mesh(new THREE.CubeGeometry(this.xLen/2 * (1 - this.wallWidth), 
																		   this.yLen, 
																		   this.zLen * this.wallWidth), this.wallMaterial); 
				horizontalWall.position.x = -((this.xLen/2 - this.xLen * this.wallWidth/2)/2 + this.wallWidth*this.xLen/2); // top arm
				wallMesh.add(verticalWall);
				wallMesh.add(horizontalWall);
				break;
			case 5: // top-right corner
				wallMesh = new THREE.Object3D();
				var verticalWall = new THREE.Mesh(new THREE.CubeGeometry(this.xLen * this.wallWidth, 
																		 this.yLen, 
																		 this.zLen/2 +  this.zLen * this.wallWidth/2), this.wallMaterial);
				verticalWall.position.z = -(-(this.zLen/2 +  this.zLen * this.wallWidth/2)/2 + this.zLen * this.wallWidth/2);
				
				var horizontalWall = new THREE.Mesh(new THREE.CubeGeometry(this.xLen/2 * (1 - this.wallWidth), 
																		   this.yLen, 
																		   this.zLen * this.wallWidth), this.wallMaterial); 
				horizontalWall.position.x = -((this.xLen/2 - this.xLen * this.wallWidth/2)/2 + this.wallWidth*this.xLen/2); // top arm
				wallMesh.add(verticalWall);
				wallMesh.add(horizontalWall);
				break;
			case 6: // top-left corner
				wallMesh = new THREE.Object3D();
				var verticalWall = new THREE.Mesh(new THREE.CubeGeometry(this.xLen * this.wallWidth, 
																		 this.yLen, 
																		 this.zLen/2 +  this.zLen * this.wallWidth/2), this.wallMaterial);
				verticalWall.position.z = -(-(this.zLen/2 +  this.zLen * this.wallWidth/2)/2 + this.zLen * this.wallWidth/2);
				
				var horizontalWall = new THREE.Mesh(new THREE.CubeGeometry(this.xLen/2 * (1 - this.wallWidth), 
																		   this.yLen, 
																		   this.zLen * this.wallWidth), this.wallMaterial); 
				horizontalWall.position.x = ((this.xLen/2 - this.xLen * this.wallWidth/2)/2 + this.wallWidth*this.xLen/2); // top arm
				wallMesh.add(verticalWall);
				wallMesh.add(horizontalWall);
				break;
			case 7: // cross
				wallMesh = new THREE.Object3D();
				verticalWall = new THREE.Mesh(new THREE.CubeGeometry(this.wallWidth*this.xLen, 
																	 this.yLen, 
																	 this.zLen), this.wallMaterial);
				horizontalLeftWall  = new THREE.Mesh(new THREE.CubeGeometry(this.xLen/2 * (1 - this.wallWidth), 
																			this.yLen, 
																			this.zLen * this.wallWidth), this.wallMaterial);
				horizontalRightWall = new THREE.Mesh(new THREE.CubeGeometry(this.xLen/2 - (this.wallWidth * this.xLen / 2), 
																			this.yLen, 
																			this.zLen * this.wallWidth), this.wallMaterial);
													 			// position the side walls so that they look attached to the long wall		
				horizontalLeftWall.position.x  =  this.xLen/4 * (1 + this.wallWidth); // this was a fun algrebraic reduction
				horizontalRightWall.position.x = -(this.xLen/4 * (1 + this.wallWidth));
				// add the walls to the object
				wallMesh.add(verticalWall);
				wallMesh.add(horizontalLeftWall);
				wallMesh.add(horizontalRightWall);
				break;

			case 8: // T shape (stick points left)
				wallMesh = new THREE.Object3D();
				var verticalWall = new THREE.Mesh(new THREE.CubeGeometry(this.xLen * this.wallWidth, 
																		 this.yLen, 
																		 this.zLen), this.wallMaterial);
				verticalWall.position.z = 0;
				
				var horizontalWall = new THREE.Mesh(new THREE.CubeGeometry(this.xLen/2 * (1 - this.wallWidth), 
																		   this.yLen, 
																		   this.zLen * this.wallWidth), this.wallMaterial); 
				horizontalWall.position.x = -((this.xLen/2 - this.xLen * this.wallWidth/2)/2 + this.wallWidth*this.xLen/2); // top arm
				wallMesh.add(verticalWall);
				wallMesh.add(horizontalWall);
				break;
			case 9: // T shape (stick points up)
				wallMesh = new THREE.Object3D();
				var verticalWall = new THREE.Mesh(new THREE.CubeGeometry(this.xLen * this.wallWidth, 
																		 this.yLen, 
																		 this.zLen/2 * (1 - this.wallWidth)), this.wallMaterial);
				verticalWall.position.z = -((this.zLen/2 - this.zLen * this.wallWidth/2)/2 + this.wallWidth*this.zLen/2);;
				
				var horizontalWall = new THREE.Mesh(new THREE.CubeGeometry(this.xLen, 
																		   this.yLen, 
																		   this.zLen * this.wallWidth), this.wallMaterial); 
				horizontalWall.position.x = 0;
				wallMesh.add(verticalWall);
				wallMesh.add(horizontalWall);
				break;
			case 10: // T shape (stick points right)
				wallMesh = new THREE.Object3D();
				var verticalWall = new THREE.Mesh(new THREE.CubeGeometry(this.xLen * this.wallWidth, 
																		 this.yLen, 
																		 this.zLen), this.wallMaterial);
				verticalWall.position.z = 0;
				
				var horizontalWall = new THREE.Mesh(new THREE.CubeGeometry(this.xLen/2 * (1 - this.wallWidth), 
																		   this.yLen, 
																		   this.zLen * this.wallWidth), this.wallMaterial); 
				horizontalWall.position.x = ((this.xLen/2 - this.xLen * this.wallWidth/2)/2 + this.wallWidth*this.xLen/2); // top arm
				wallMesh.add(verticalWall);
				wallMesh.add(horizontalWall);
				break;
			case 11: // T shape (stick points down)
				wallMesh = new THREE.Object3D();
				var verticalWall = new THREE.Mesh(new THREE.CubeGeometry(this.xLen * this.wallWidth, 
																		 this.yLen, 
																		 this.zLen/2 * (1 - this.wallWidth)), this.wallMaterial);
				verticalWall.position.z = ((this.zLen/2 - this.zLen * this.wallWidth/2)/2 + this.wallWidth*this.zLen/2);
				
				var horizontalWall = new THREE.Mesh(new THREE.CubeGeometry(this.xLen, 
																		   this.yLen, 
																		   this.zLen * this.wallWidth), this.wallMaterial); 
				horizontalWall.position.x = 0;
				wallMesh.add(verticalWall);
				wallMesh.add(horizontalWall);
				break;

			default:
				console.log("ERROR: requested invalid wall: ", wallNumber);

		}

	/*
		// TEST CODE: poles added to help see the dimensions of the square
		// add poles to the wall to show where the points are of the square
		poleGeometry = new THREE.CylinderGeometry( 1, 1, this.yLen*2, 4 );
		poleMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
		poleMesh = new THREE.Mesh(poleGeometry, poleMaterial);
		poleMesh.position.y = this.yLen;
		poleMeshArray = [];


		for (var i = 0; i < 9; i++)
			poleMeshArray.push(poleMesh.clone())
		// top left
		poleMeshArray[0].position.x = -this.xLen/2
		poleMeshArray[0].position.z = this.zLen/2
		// top middle
		poleMeshArray[1].position.x = 0
		poleMeshArray[1].position.z = this.zLen/2
		// top right
		poleMeshArray[2].position.x = this.xLen/2
		poleMeshArray[2].position.z = this.zLen/2
		// middle left
		poleMeshArray[3].position.x = -this.xLen/2
		poleMeshArray[3].position.z = 0
		// center
		poleMeshArray[4].position.x = 0 
		poleMeshArray[4].position.z = 0
		// middle right
		poleMeshArray[5].position.x = this.xLen/2
		poleMeshArray[5].position.z = 0
		// bottom left
		poleMeshArray[6].position.x = -this.xLen/2
		poleMeshArray[6].position.z = -this.zLen/2
		// bottom middle
		poleMeshArray[7].position.x = 0
		poleMeshArray[7].position.z = -this.zLen/2
		// bottom right
		poleMeshArray[8].position.x = this.xLen/2
		poleMeshArray[8].position.z = -this.zLen/2
		// place the poles
		for (var i = 0; i < 9; i++)
			wallMesh.add(poleMeshArray[i])
		*/

		return wallMesh;
	};

	this.createMinimap = function()
	{
		var xyScale = 0.0002;
		// the map is a clone of the original maze
		this.minimap = this.labyrinth.clone();
		this.minimap.castShadow = false;
		this.minimap.receiveShadow = false;

		// scale the map (shrink and flatten it)
		this.minimap.scale.set(xyScale, 0.00001, xyScale);

		// make it face the camera
		this.minimap.rotation.x = Math.PI/2;
		this.minimap.name = "minimap";
		//this.minimap.rotation.z = Math.PI/1200;
		
		//console.log("original minimap:");
		//console.log(this.minimap);
		//scene.add(this.minimap);

		// change the color of the minimap
		newMaterial = new THREE.MeshBasicMaterial( {color: 0x000000} );
		console.log(this.minimap)
		for (var i = 0; i < this.minimap.children.length; i++)
		{
			this.changeMaterial(this.minimap.children[i], newMaterial);
		}

	};

	this.changeMaterial = function(mesh, newMaterial)
	{
		if (mesh.geometry) // a singular mesh, not an aggregate type (singular meshs have a geometry attribute.)
		{
			mesh.material = newMaterial;
		}

		else // recurse on each child mesh
		{
			for (var i = 0; i < mesh.children.length; i++)
			{
				this.changeMaterial(mesh.children[i], newMaterial);
			}
		}

		return;
	};
};
