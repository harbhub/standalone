'use strict';

var extend, socket, app, scope;

extend = function extend( target, source ) {

	target = target || {};

	for ( var key in source ) {

		if ( typeof source[ key ] === 'object' ) {

			target[ key ] = extend( target[ key ], source[ key ] );

		} else {

			target[ key ] = source[ key ];

		}

	}

	return target;

};

socket = io( window.location.origin, { secure: false } );

app = angular.module( 'WebApp', [] );

app.controller( 'WebAppController', [ '$scope', '$window', function ( $scope, $window ) {

	scope = $scope;

	scope.me = {};

	socket.on( 'refresh', function () {

		$window.location.reload();

	} );

} ] );

socket.on( 'update', function (data) {

	console.log('Update', data);

	switch ( data.type ) {

		case 'me':

			extend( scope.me, data.me );

			scope.$apply();

			break;

		default:

			break;

	}

	scope.$apply();
	
} );

( function constructWorld() {

	var world = {};

	var clockAutoStart = true;

	var clock = world.clock = new THREE.Clock( clockAutoStart );

	var scene = world.scene = new THREE.Scene();

	var verticalFieldOfView = 45,

		aspectRatio = window.innerWidth / window.innerHeight,

		nearFrustum = 0.01,

		farFrustum = 10000;

	var camera = world.camera = new THREE.PerspectiveCamera( verticalFieldOfView, aspectRatio, nearFrustum, farFrustum );

	var cameraTarget = new THREE.Vector3( 0, 0, 0 );

	camera.lookAt( cameraTarget );

	camera.position.set( 0, 0, 100 );

	camera.updateProjectionMatrix();

	var renderer = world.renderer = new THREE.WebGLRenderer( {

		alpha: true,

		antialias: true

	} );

	renderer.setPixelRatio( window.devicePixelRatio );

	renderer.setClearColor( new THREE.Color('black'), 0.5 );

	renderer.setSize( window.innerWidth, window.innerHeight );

	document.getElementById( 'canvas' ).appendChild( renderer.domElement );

	var renderToken = world.renderToken = '';

	var render = world.render = function render( elapsed ) {

		var delta = clock.getDelta();

		renderToken = requestAnimationFrame( render );

		renderer.render( scene, camera );

		TWEEN.update( elapsed );

	};

	var resize = world.resize = function resize( event ) {

		if ( event ) {

			event.preventDefault();

		}

		camera.aspect =  window.innerWidth / window.innerHeight;

		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

		renderer.render( scene, camera );

	};

	var init = world.init = function init() {

		resize();

		render();

	};

	window.addEventListener( 'resize', resize );

	window.addEventListener( 'orientationchange', resize );

	// var me;

	( function constructMe() {

		camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

		camera.position.set( 0, 0, 100 );

		camera.updateProjectionMatrix();

		renderer.setClearColor( new THREE.Color('black'), 1 );

		var controls = new THREE.OrbitControls( camera, renderer.domElement );

		controls.enableDamping = true;

		controls.dampingFactor = 0.25;

		controls.enableZoom = true;

		var floorGeometry = new THREE.BoxGeometry( 20, 20, 1, 32, 32, 32 );

		var floorMaterial = new THREE.MeshPhongMaterial( {
			color: new THREE.Color( 'green' )
		} );

		var floorMesh = new THREE.Mesh( floorGeometry, floorMaterial );

		var floor = new THREE.Object3D();

		floor.add( floorMesh );

		scene.add( floor );

		

		// me = new THREE.Object3D();

		// var head, body, arms, legs, hands, feet,
		// fingers, toes, hair, eyes, mouth, lips,
		// chin, cheeks, nose, ears, forehead, neck,
		// beard, mustache, glasses, hats, shoes, gloves,
		// shirts, shorts, pants, socks, rings, necklaces,
		// watches, bracelets, gold, silver, bronze, copper,
		// iron, steel, concrete, rebar, water, diamond, pressure,
		// temperature, heart, lungs, stomach, chest, shoulders,
		// elbows, wrists, knees, ankles, waist, abdomine, muscles,
		// blood, white_blood_cells, red_blood_cells, platelettes, capillaries;

		// var fireball = new THREE.Object3D();

		// fireball.name = 'fireball';

		// var fireballGeometry = new THREE.SphereGeometry( 10, 32, 32 );

		// var fireballMaterial = new THREE.MeshPhongMaterial( {

		// 	color: new THREE.Color( 'red' ),

		// 	emissive: new THREE.Color( 'red' )

		// } );

		// var fireballMesh = new THREE.Mesh( fireballGeometry, fireballMaterial );

		// fireball.add( fireballMesh );

		// scene.add( fireball );

		// var rock = new THREE.Object3D();

		// rock.name = 'rock';

		// var rockGeometry = new THREE.SphereGeometry( 10, 32, 32 );

		// var rockMaterial = new THREE.MeshPhongMaterial( {

		// 	color: new THREE.Color( 'black' )

		// } );

		// var rockMesh = new THREE.Mesh( rockGeometry, rockMaterial );

		// rock.add( rockMesh );

		// // scene.add( rock );

		// var dummy = new THREE.Object3D();

		// dummy.name = 'dummy';

		// var dummyGeometry = new THREE.BoxGeometry( 10, 10, 10, 32, 32, 32 );

		// var dummyMaterial = new THREE.MeshPhongMaterial( {

		// 	color: new THREE.Color( 'blue' )

		// } );

		// var dummyMesh = new THREE.Mesh( dummyGeometry, dummyMaterial );

		// dummy.add( dummyMesh );

		// dummy.position.set( -100, 0, -100 );

		// scene.add( dummy );

		// heatSeek( fireball, dummy, 20 );

		// var dummy2 = dummy.clone();

		// dummy2.name = 'dummy2';

		// dummy2.position.set( -100, 100, 100 );

		// scene.add( dummy2 );

		// heatSeek( dummy, dummy2, 20 );

		// heatSeek( dummy2, fireball, 20 );

		// function heatSeek( object, target, speed ) {

		// 	console.log( 'heatSeek', arguments );

		// 	object.moving = true;

		// 	var distance = calculateDistance( object, target );

		// 	var duration = ( distance / speed ) * 1000;

		// 	console.log( 'heatSeek distance', distance );

		// 	var tween = new TWEEN.Tween( {

		// 		x: object.position.x,

		// 		y: object.position.y,

		// 		z: object.position.z

		// 	} ).to( {

		// 		x: target.position.x,
				
		// 		y: target.position.y,
				
		// 		z: target.position.z

		// 	}, duration ).onUpdate( function() {

		//         object.position.set( this.x, this.y, this.z );

		//         if ( target.moving ) {

		//         	tween.stop();

		//         	heatSeek( object, target, speed );

		//         }

		//     } ).onComplete( function() {

		//     	delete object.moving;

		//     	console.log(object);

		//     } ).start();

		// }

		// function calculateDistance( object3DA, object3DB ) {

		// 	var deltaX = object3DA.position.x - object3DB.position.x;

		// 	var deltaY = object3DA.position.y - object3DB.position.y;

		// 	var deltaZ = object3DA.position.z - object3DB.position.z;

		// 	var distance = Math.sqrt( Math.pow( deltaX, 2 ) + Math.pow( deltaY, 2 ) + Math.pow( deltaZ, 2 ) );

		// 	return distance;

		// };


		// var axis = new THREE.AxisHelper( 1000 );

		// scene.add( axis );

		// var ambientLight = new THREE.AmbientLight( new THREE.Color('white') );

		// scene.add( ambientLight );

		// var gridSize = 100;

		// var gridStep = 100;

		// var grid = new THREE.GridHelper( gridSize, gridStep );

		// scene.add( grid );

		// var arrowOrigin = new THREE.Vector3( 0, 0, 0 );
		
		// var arrowLength = 1500;

		// var xArrowDirection = new THREE.Vector3( 1, 0, 0 );

		// var xArrowColor = new THREE.Color( 'red' );

		// var xArrow = new THREE.ArrowHelper( xArrowDirection, arrowOrigin, arrowLength, xArrowColor );

		// var yArrowDirection = new THREE.Vector3( 0, 1, 0 );

		// var yArrowColor = new THREE.Color( 'green' );

		// var yArrow = new THREE.ArrowHelper( yArrowDirection, arrowOrigin, arrowLength, yArrowColor );

		// var zArrowDirection = new THREE.Vector3( 0, 0, 1 );

		// var zArrowColor = new THREE.Color( 'blue' );

		// var zArrow = new THREE.ArrowHelper( zArrowDirection, arrowOrigin, arrowLength, zArrowColor );

		// scene.add( xArrow );

		// scene.add( yArrow );

		// scene.add( zArrow );

		// // Translucent Ball with Inner Point Light
		// var magicBall = new THREE.Object3D();
		// var shellGeometry = new THREE.SphereGeometry( 20, 32, 32 );
		// var shellMaterial = new THREE.MeshPhongMaterial( {
		// 	color: new THREE.Color( 'blue' )
		// } );
		// // shellMaterial.opacity = 0.2;
		// var shell = new THREE.Mesh( shellGeometry, shellMaterial );
		// magicBall.add( shell );
		// var light = new THREE.PointLight( new THREE.Color( 'white' ), 1, 1000, 2 );
		// magicBall.add( light );
		// scene.add( magicBall );
		// scene.remove( ambientLight );
		// // light.distance = 10;
		// var tweenLight = new TWEEN.Tween( {
		// 	distance: light.distance
		// } ).to( {
		// 	distance: 10
		// }, 3000 ).onUpdate( function() {
	 //        light.distance = this.distance;
	 //    } ).start();

	} )();

	world.init();

} )();