'use strict';

var extend, world, socket, app, scope;

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

}

world = {

	init: function init() {

		console.log('start init', this);

		var scene = this.scene,
			
			camera = this.camera,
			
			renderer = this.renderer,

			render = this.render,

			clock = this.clock;

		scene.add( camera );

		this.resize();

		window.addEventListener( 'resize', this.resize );

		// clock, scene, camera, renderer
		render( clock, renderer, scene, camera );

		// this.renderToken = requestAnimationFrame( render );

		console.log('end init', this);

	},

	clock: ( function() {

		var autoStart = true;

		var clock = new THREE.Clock( autoStart );

		return clock;

	})(),

	scene: ( function() {

		var scene = new THREE.Scene();

		return scene;

	})(),

	camera: ( function() {

		var verticalFieldOfView = 45,

			aspectRatio = window.innerWidth / window.innerHeight,

			nearFrustum = 0.01,

			farFrustum = 1000,

			camera = new THREE.PerspectiveCamera( verticalFieldOfView, aspectRatio, nearFrustum, farFrustum ),

			cameraTarget = new THREE.Vector3( 0, 0, 0 );

		camera.lookAt( cameraTarget );

		camera.position.set( 0, 0, 100 );

		camera.updateProjectionMatrix();

		return camera;

	})(),

	renderer: ( function() {

		var renderer = new THREE.WebGLRenderer( {

			alpha: true,

			antialias: true

		} );

		renderer.setPixelRatio( window.devicePixelRatio );

		renderer.setClearColor( new THREE.Color('black'), 0.5 );

		renderer.setSize( window.innerWidth, window.innerHeight );

		document.body.appendChild( renderer.domElement );

		return renderer;

	})(),

	renderToken: '',

	render: function render( clock, renderer, scene, camera ) {

		console.log('clock', clock);

		var delta = clock.getDelta();

		requestAnimationFrame( render );

		renderer.render( scene, camera );

	},

	resize: function resize( event ) {

		if ( event ) {

			event.preventDefault();

		}

		var scene = this.scene,

			camera = this.camera,

			renderer = this.renderer;

		camera.aspect =  window.innerWidth / window.innerHeight;

		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

		renderer.render( scene, camera );

	}

}

world.init();

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

			break;

		default:

			break;

	}

	scope.$apply();
	
} );