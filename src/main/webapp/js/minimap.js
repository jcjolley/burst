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

// How to use this class:
// 1. Create a new instance of Minimap
// 	  Parameters:
//       - walls:a THREE.Object3D that contains all the objects you want displayed on the minimap.
//		 - playerReference: is the THREE.Object3D which represents the player (must have a geometry!)
// 2. Call createMinimap() to instantiate the minimap.
//       - After the minimap is created, you can access this.minimap to display it.
// 3. Call animateMinimap() in your animate loop.
var Minimap = function (walls, playerReference)
{
	this.map = walls.clone();
	this.xzScale = 0.0002;
	this.mapColor = 0x000000;
	this.mapOpacity = 100;
	this.player = playerReference;
	this.playerBlip = null;
	this.playerBlipColor = 0xFFFF00;

	// Call this function first
	this.createMinimap = function()
	{
		// add the blip that represents the player to the map
		var playerBlipGeo = new THREE.SphereGeometry( 20, 30, 5 ); 
		var playerBlipMaterial = new THREE.MeshBasicMaterial( {color: this.playerBlipColor, transparent: true, opacity: this.mapOpacity} );
		this.playerBlip = new THREE.Mesh(playerBlipGeo, playerBlipMaterial);

		//this.playerBlip = playerReference.clone();
		this.playerBlip.transparent = false;
		this.playerBlip.opacity = 100;
		this.map.add(this.playerBlip);
			
		// we don't want the map to receive or cast shadows
		this.map.castShadow = false;
		this.map.receiveShadow = false;

		// scale the map (shrink and flatten it)
		this.map.scale.set(this.xzScale, 0.00001, this.xzScale);

		// make it face the camera
		this.map.rotation.x = Math.PI/2;

		// change the color of the minimap
		this.changeMapColor(this.mapColor);
		this.changeMapOpacity(this.mapOpacity);

		this.changeMaterial(this.playerBlip, playerBlipMaterial);
	};

	// call this to change the color of the minimap (opacity )
	this.changeMapColor = function(newColor)
	{
		this.mapColor = newColor;
		var newMaterial = new THREE.MeshBasicMaterial( {color: this.mapColor, transparent: true, opacity: this.mapOpacity} );
		this.applyChanges();

		// change the color of the player blip
		var playerBlipMaterial = new THREE.MeshBasicMaterial( {color: this.playerBlipColor, transparent: true, opacity: this.mapOpacity} );
		this.changeMaterial(this.playerBlip, playerBlipMaterial);
	};

	// call this to change the opacity of the minimap
	this.changeMapOpacity = function(newOpacity)
	{
		this.mapOpacity = newOpacity;
		var newMaterial = new THREE.MeshBasicMaterial( {color: this.mapColor, transparent: true, opacity: this.mapOpacity} );
		this.applyChanges(newMaterial);
		
		// change the color of the player blip
		var playerBlipMaterial = new THREE.MeshBasicMaterial( {color: this.playerBlipColor, transparent: true, opacity: this.mapOpacity} );
		this.changeMaterial(this.playerBlip, playerBlipMaterial);
	};

	// call this to change the material of the minimap
	this.changeMapMaterial = function(newMaterial)
	{
		this.applyChanges(newMaterial);
		
		// change the color of the player blip
		var playerBlipMaterial = new THREE.MeshBasicMaterial( {color: this.playerBlipColor, transparent: true, opacity: this.mapOpacity} );
		this.changeMaterial(this.playerBlip, playerBlipMaterial);
	};


	this.applyChanges = function(newMaterial)
	{
		for (var i = 0; i < this.map.children.length; i++)
		{
			this.changeMaterial(this.map.children[i], newMaterial);
		}
	};

	// call this in your animate loop
	this.animateMap = function()
	{
		this.playerBlip.position.x = this.player.position.x ;
		this.playerBlip.position.z = this.player.position.z ;
	};

	// private function used in changeMapOpacity and changeMapColor
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