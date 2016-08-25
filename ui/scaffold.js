'use strict';

var clock = new THREE.Clock( true );

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 135, window.innerWidth / window.innerHeight, 0.01, 10000 );

camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

camera.position.set( 0, 0, 100 );

camera.updateProjectionMatrix();

var renderer = new THREE.WebGLRenderer( {

	alpha: true,

	antialias: true

} );

renderer.setPixelRatio( window.devicePixelRatio );

renderer.setClearColor( new THREE.Color('black'), 1 );

renderer.setSize( window.innerWidth, window.innerHeight );

document.getElementById( 'canvas' ).appendChild( renderer.domElement );

var renderToken = '';

var render = function render( elapsed ) {

	var delta = clock.getDelta();

	renderToken = requestAnimationFrame( render );

	renderer.render( scene, camera );

	TWEEN.update( elapsed );

};

var stopRender = function () {
	
	cancelAnimationFrame( renderToken );

};

var resize = function ( event ) {

	if ( event ) {

		event.preventDefault();

	}

	camera.aspect =  window.innerWidth / window.innerHeight;

	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	renderer.render( scene, camera );

};

var controls = new THREE.OrbitControls( camera, renderer.domElement );

controls.enableDamping = true;

controls.dampingFactor = 0.25;

controls.enableZoom = true;

var init = function init() {

	resize();

	render();

};

window.addEventListener( 'resize', resize );

window.addEventListener( 'orientationchange', resize );