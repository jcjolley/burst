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

var SkyAnimator = function (skyboxReference, scene) 
{
	this.scene = scene;
	this.mesh = skyboxReference;

	this.tints = [{r: 1,   g: 1,   b: 3  , o:0.00, h: 0.1},  // 12 AM Midnight
				  {r: 1,   g: 1,   b: 3  , o:0.00, h: 0.1},  // 1 AM
	  			  {r: 1,   g: 1,   b: 3  , o:0.00, h: 0.1},  // 2 AM
	  			  {r: 1,   g: 1,   b: 3  , o:0.00, h: 0.1},  // 3 AM
				  {r: 2,   g: 10,  b: 19 , o:0.10, h: 0.2},  // 4 AM
				  {r: 20,  g: 30,  b: 70 , o:0.30, h: 0.3},  // 5 AM
				  {r: 35,  g: 50,  b: 100, o:0.45, h: 0.4},  // 6 AM
				  {r: 50,  g: 90,  b: 165, o:0.80, h: 0.6},  // 7 AM
				  {r: 100, g: 102, b: 173, o:1.00, h: 0.7},  // 8 AM
				  {r: 120, g: 160, b: 216, o:1.00, h: 0.8},  // 9 AM
				  {r: 133, g: 197, b: 231, o:1.00, h: 0.8},  // 10 AM
				  {r: 133, g: 197, b: 231, o:1.00, h: 0.8},  // 11 AM
				  {r: 133, g: 197, b: 231, o:1.00, h: 0.8},  // 12 PM Noon
				  {r: 133, g: 197, b: 231, o:1.00, h: 0.8},  // 1 PM
				  {r: 133, g: 197, b: 231, o:1.00, h: 0.8},  // 2 PM
				  {r: 133, g: 197, b: 231, o:1.00, h: 0.8},  // 3 PM
				  {r: 120, g: 160, b: 216, o:0.90, h: 0.7},  // 4 PM
				  {r: 100, g: 102, b: 173, o:0.70, h: 0.55},  // 5 PM
				  {r: 50,  g: 90,  b: 165, o:0.40, h: 0.38},  // 6 PM
				  {r: 25,  g: 45,  b: 75 , o:0.20, h: 0.2},  // 7 PM
				  {r: 0,   g: 0,   b: 3  , o:0.05, h: 0.12},  // 8 PM
				  {r: 0,   g: 0,   b: 3  , o:0.00, h: 0.1},  // 9 PM
				  {r: 0,   g: 0,   b: 3  , o:0.00, h: 0.1},  // 10 PM
				  {r: 0,   g: 0,   b: 3  , o:0.00, h: 0.1}]; // 11 PM 

	// TIME AND SPEEDS
	this.hourLength = 300;
	this.currentHour = 14;
	this.totalHours = this.tints.length;
	this.nextHour = (this.currentHour + 1) % this.totalHours;
	this.timeElapsed = 0;
	this.skyRotationSpeed = Math.PI/(this.totalHours*this.hourLength*2);
	this.sunRevSpeed  = Math.PI/(this.totalHours*this.hourLength);
	this.moonRevSpeed = Math.PI/(this.totalHours*this.hourLength);
	
	// SUN
	this.theSun  = new THREE.Object3D(); // the object stays centered at the origin. Think of it like the arm of ferris wheel, connecting from the center to the rim.
	this.theSun.position = new THREE.Vector3(0,0,0);
	this.sunOrbitHeight = 150;

	var sunLight = new THREE.DirectionalLight( 0xffffff, 0.9 );
	sunLight.color.setHSL( 0.1, 1, 0.95 );
	sunLight.position.set( 0, this.sunOrbitHeight, 0 );
	sunLight.castShadow = true; 
	//this.scene.add( sunLight );
	//this.theSun.add( sunLight );
	//this.scene.add( this.theSun );
	
	// MOON
	this.theMoon = new THREE.Object3D();
	this.theMoon.position = new THREE.Vector3(0,0,0);
	this.moonOrbitHeight = 1500;

	this.moonScalar = 50;
	var moonLight = new THREE.DirectionalLight( 0xcccccc, 0.3 );
	moonLight.color.setHSL( 0.1, 1, 0.95 );
	moonLight.position.set( 0, -this.moonOrbitHeight, 0 );

	//this.theMoon.add( moonLight );
	//this.scene.add(theMoon);

	// ambient
	this.hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
	this.hemiLight.color.setHSL( 0.6, 1, 0.6 );
	this.hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
	this.hemiLight.position.set( 0, 500, 0 );
	scene.add( this.hemiLight );


	// STARBOX
	var materialArray = [];
	materialArray.push(new THREE.MeshBasicMaterial( { map: loader.load( 'textures/sky/nightSky_right1.png' ), side: THREE.BackSide }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: loader.load( 'textures/sky/nightSky_left2.png' ), side: THREE.BackSide }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: loader.load( 'textures/sky/nightSky_top3.png' ), side: THREE.BackSide }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: loader.load( 'textures/sky/nightSky_bottom4.png' ), side: THREE.BackSide }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: loader.load( 'textures/sky/nightSky_front5.png' ), side: THREE.BackSide }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: loader.load( 'textures/sky/nightSky_back6.png' ), side: THREE.BackSide }));
	for (var i = 0; i < materialArray.length; i++)
	{
		materialArray[i].wrapS = materialArray[i].wrapT = THREE.RepeatWrapping;
	}
	var starBoxMaterial = new THREE.MeshFaceMaterial(materialArray);
	var starBoxGeometry = new THREE.CubeGeometry( 4096, 4096, 4096, 1, 1, 1, materialArray );
	this.starBox = new THREE.Mesh( starBoxGeometry, starBoxMaterial);
	this.starBox.rotation.y = Math.PI/3;
	this.starBox.rotation.z = Math.PI/3;
	this.scene.add( this.starBox );
	
	// OPACITY
	this.mesh.material.transparent = true;	
	this.mesh.material.opacity = this.tints[this.currentHour].o;

	this.animateSky = function()
	{
		if (this.timeElapsed % this.hourLength === 0) // reached the end of the hour: set up the vars for the next hour
		{
			this.currentHour = this.nextHour;
			this.nextHour = this.calcNextHour();
			
			this.currentR = this.tints[this.currentHour].r;
			this.currentG = this.tints[this.currentHour].g;
			this.currentB = this.tints[this.currentHour].b;
			this.currentO = this.tints[this.currentHour].o;
			this.currentH = this.tints[this.currentHour].h;

			this.nextR = this.tints[this.nextHour].r;
			this.nextG = this.tints[this.nextHour].g;
			this.nextB = this.tints[this.nextHour].b;
			this.nextO = this.tints[this.nextHour].o;
			this.nextH = this.tints[this.nextHour].h;

			this.deltaR = (this.nextR - this.currentR)/this.hourLength;
			this.deltaG = (this.nextG - this.currentG)/this.hourLength;
			this.deltaB = (this.nextB - this.currentB)/this.hourLength;
			this.deltaO = (this.nextO - this.currentO)/this.hourLength;
			this.deltaH = (this.nextH - this.currentH)/this.hourLength;

			this.timeElapsed = 0; // to avoid overflow
		}

		else // animate the color change
		{
			// linear fade
			this.currentR += this.deltaR;
			this.currentG += this.deltaG;
			this.currentB += this.deltaB;
			this.currentO += this.deltaO;
			this.currentH += this.deltaH;
			this.setColor(this.currentR, this.currentG, this.currentB, this.currentO, this.currentH);
		}
		
		// rotate the starbox and celestial bodies
		this.starBox.rotation.x += this.skyRotationSpeed;
		//this.theSun.rotation.x  += this.sunRotationSpeed;
		this.timeElapsed++;
	};

	this.calcNextHour = function()
	{
		return (this.currentHour + 1) % this.totalHours;
	};

	this.setColor = function(r,g,b,o,h)
	{
		r = Math.floor(r);
		g = Math.floor(g);
		b = Math.floor(b);
		this.mesh.material.color.setRGB( r/255, g/255, b/255);
		this.mesh.material.opacity = o;
		this.hemiLight.intensity = h;
	};
};