/* Assignment 3 Music Visualization */

/* VARIABLES */

//setup scene and camera
var renderer, scene, camera, sphereCam;
var camDistance = 20;
var cameraTheta 	= 0;
var lastTime = 0;

var clock 	= new THREE.Clock();

//Circle
var circleA, circleGeometry, circleMaterial, circleMesh, sceneCircle;
var circleCount 	= 10;

//Rectangle :  A - red, B - blue, C - yellow, D - green
var rectA,rectB, rectC, rectD, rectGeometry, rectMaterialA, rectMeshA,rectCam;
var rectMaterialB, rectMaterialC,rectMaterialD;
var rectCount	= 20;
var rectArrayA 	= new Array();
var rectArrayB 	= new Array();
var rectArrayC 	= new Array();
var rectArrayD 	= new Array();

var ambientLight;

/* Music */
var audioContext = new AudioContext();
var fft =  audioContext.createAnalyser();
var SAMPLES = 128;
fft.fftSize = SAMPLES;
var buffer = new Uint8Array(SAMPLES);

//start 
function init() 
{
	/* Renderer */
	renderer	= new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth , window.innerHeight );
	renderer.autoClear	= false;
	document.body.appendChild( renderer.domElement );

	/* Window Listener*/
	window.addEventListener( 'resize', function () {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	  }, false );
	  
	  /* Scene */
	scene 			= new THREE.Scene();
	  
	// add subtle blue ambient lighting
	var ambientLight = new THREE.AmbientLight(0x707070);
	scene.add(ambientLight);

	// directional lighting
	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(1, 1, 1).normalize();
	scene.add(directionalLight);
	
	var directionalLightA = new THREE.DirectionalLight(0xffffff);
	directionalLightA.position.set(1, 0,1).normalize();
	scene.add(directionalLightA);
	  
	/* Camera */
	camera 				= new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 10000);
	camera.position.z	= 300;
	camera.position.y 	= 200;

	// camera.position.y	= camDistance;

	scene.add(camera);

	//Geometry - Circle
	var radius, segWidth, segHeight,circleColor;

	radius 			= 200;
	segWidth 		= 200;
	segHeight 		= 200;
	circleColor 	= 'grey';

	circleGeometry 	= new THREE.SphereGeometry(radius, segWidth, segHeight);
	//circleMaterial			= new THREE.MeshBasicMaterial({color:circleColor});  
	var circleTexture = THREE.ImageUtils.loadTexture('./texture/fire.jpg');
	circleMaterial = new THREE.MeshPhongMaterial({
		 map: circleTexture,
		 opacity: 1,
		 transparent: true,
		 blending: THREE.AdditiveBlending,
	   });
	//circleMaterial 	= new THREE.MeshLambertMaterial({color:circleColor});
	circleA				= new THREE.Mesh(circleGeometry,circleMaterial);

	scene.add(circleA);
	
	//Geometry - rectangle : A - red, B - blue, C - yellow, D - green
	var rectColorA = 'red';
	var rectColorB = 'blue';
	var rectColorC = 'yellow';
	var rectColorD = 'green';
	
	var rectXA 	= 0;
	var rectXB	= 0;
	var rectXC	= 0;
	var rectXD	= 0;
	var rectYA	= -1000;
	var rectYB 	= -1000;
	var rectYC	= -1000;
	var rectYD 	= -1000;
	var rectZA 	= 0;
	var rectZB	= 0;
	var rectZC 	= 0;
	var rectZD 	= 0;

	for(var l = 0; l < rectCount ; l++)
	{
		rectGeometry 	= new THREE.BoxGeometry(100,100,100);
		rectMaterialA 	= new THREE.MeshLambertMaterial({color:rectColorA});
		rectMaterialB 	= new THREE.MeshLambertMaterial({color:rectColorB});
		rectMaterialC 	= new THREE.MeshLambertMaterial({color:rectColorC});
		rectMaterialD 	= new THREE.MeshLambertMaterial({color:rectColorD});
		
		rectArrayA[l] 	= new THREE.Mesh(rectGeometry, rectMaterialA);
		rectArrayB[l] 	= new THREE.Mesh(rectGeometry, rectMaterialB);
		rectArrayC[l] 	= new THREE.Mesh(rectGeometry, rectMaterialC);
		rectArrayD[l] 	= new THREE.Mesh(rectGeometry, rectMaterialD);
		
		rectArrayA[l].position.x	= rectXA + 500 ;// north, south, east, west
		rectArrayA[l].position.y 	= rectYA +150;
		rectArrayA[l].position.z 	= rectZA;
		
		rectArrayB[l].position.x 	= rectXB ;
		rectArrayB[l].position.y 	= rectYB+ 150;
		rectArrayB[l].position.z 	= rectZB + 500;// north, south, east, west
		
		rectArrayC[l].position.x 	= rectXC -  500 ;// north, south, east, west
		rectArrayC[l].position.y 	= rectYC +    150;
		rectArrayC[l].position.z 	= rectZC;
		
		rectArrayD[l].position.x 	= rectXD ;
		rectArrayD[l].position.y 	= rectYD+ 150;
		rectArrayD[l].position.z 	= rectZD - 500;// north, south, east, west
		
		rectYA 	= rectArrayA[l].position.y;
		rectYB 	= rectArrayB[l].position.y;
		rectYC 	= rectArrayC[l].position.y;
		rectYD 	= rectArrayD[l].position.y;
		
		//add 4 cube array to the scene
		scene.add(rectArrayA[l]);
		scene.add(rectArrayB[l]);
		scene.add(rectArrayC[l]);
		scene.add(rectArrayD[l]);
		
	}

};

//animate
function animate() 
{
	requestAnimationFrame( animate );
	
	var current = Date.now();
	var time = current - lastTime;
	lastTime = current;
	  
	cameraTheta += time * .002;
	camera.position.x = Math.sin(cameraTheta)* 1000;
	camera.position.z = Math.cos(cameraTheta)* 1000;

	camera.lookAt( scene.position );

	renderer.render(scene, camera);

	// load music data
	fft.getByteFrequencyData(buffer);

	for(var k = 0 ; k < rectCount ; k++)
	{
		var musicConvert = buffer[k]/255;
			
			//if theres no music
			if(musicConvert == 0)
			{
				musicConvert=.1;
			}
			
			//scale the sphere 
			circleA.scale.x 	= musicConvert;
			circleA.scale.y 	= musicConvert;
			circleA.scale.z 	= musicConvert;
			
			//change the red cube length
			rectArrayA[k].scale.x 	= musicConvert*3;
			
			//change the blue cube height
			rectArrayB[k].scale.y 	= musicConvert*2;
			
			//change the yellow cube width
			rectArrayC[k].scale.z 	= musicConvert*2;
			
			//change the overall scale of the green cube
			rectArrayD[k].scale.x 	= musicConvert*2;
			rectArrayD[k].scale.y 	= musicConvert*2;
			rectArrayD[k].scale.z 	= musicConvert*2;
			
			//gradually increase the cube to ascend
			rectArrayA[k].position.y += 5;
			rectArrayB[k].position.y += 5;
			rectArrayC[k].position.y += 5;
			rectArrayD[k].position.y += 5;
			
			// when the cubes reach the top, return to the bottom	
			if (rectArrayA[k].position.y > 2000 || rectArrayB[k].position.y > 2000 || rectArrayC[k].position.y > 2000 || rectArrayD[k].position.y > 2000 )
			{
				rectArrayA[k].position.y = -1000;
				rectArrayB[k].position.y = -1000;
				rectArrayC[k].position.y = -1000;
				rectArrayD[k].position.y = -1000;
			}

	}

};

//when screnn loads, then music play
window.onload = function() 
{
	var req = new XMLHttpRequest();
	req.open('GET', 'mp3/Pulses.mp3', true);
	req.responseType = 'arraybuffer';
	req.onload = function () 
	{
		audioContext.decodeAudioData(req.response, function (data) 
		{
			var src = audioContext.createBufferSource();
			src.buffer = data;

			src.connect(fft);
			fft.connect(audioContext.destination);
			
			//Play the beat!
			src.start();

		});
	};
	req.send();

};

//run functions
init();
animate();

