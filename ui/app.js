'use strict';

var socket, app, scope;

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

function extend ( target, source ) {

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