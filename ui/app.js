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

	camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

	camera.position.set( 0, 0, 10 );

	camera.updateProjectionMatrix();

	camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

	camera.position.set( 0, 0, 100 );

	camera.updateProjectionMatrix();

	renderer.setClearColor( new THREE.Color('black'), 1 );

	var floorGeometry = new THREE.BoxGeometry( window.innerWidth, window.innerHeight, 1, 32, 32, 32 );

	var floorMaterial = new THREE.MeshPhongMaterial( {

		color: new THREE.Color( 'green' )

	} );

	var floorMesh = new THREE.Mesh( floorGeometry, floorMaterial );

	var floor = new THREE.Object3D();

	floor.add( floorMesh );

	scene.add( floor );

	var cursorLight = new THREE.PointLight( new THREE.Color( 'white', 1, 100, 2 ) );

	var cursor = new THREE.Object3D();

	cursor.position.set( 0, 0, 10 );

	cursor.add( cursorLight );

	scene.add( cursor );

	var mouse = new THREE.Vector2();

	document.addEventListener( 'click', function ( event ) {

		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;

		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;	

		var vector = new THREE.Vector3();

		vector.set( mouse.x, mouse.y, 0.5 );

		vector.unproject( camera );

		var dir = vector.sub( camera.position ).normalize();

		var distance = - camera.position.z / dir.z;

		var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

		cursor.position.set( pos.x, pos.y, 100 );

		// cursor.lookAt( new THREE.Vector3( pos.x, pos.y, 0 ) );

		console.log( mouse, event );

	} );

} )();

init();