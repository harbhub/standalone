'use strict';

var path = require( 'path' ),
	fs = require( 'fs' ),
	bcrypt = require( 'bcrypt' ),
	app = require( 'express' )(),
	server = require( 'http' ).createServer( app ),
	io = require( 'socket.io' ).listen( server ),
	redisClient = require( 'redis' ).createClient(),
	expressSession = require( 'express-session' ),
	RedisStore = require( 'connect-redis' )( expressSession ),
	redisStore = new RedisStore( {
		client: redisClient
	} ),
	session = expressSession( {
		store: redisStore,
		key: 'Secret Cookie String',
		secret: 'Secret Session String',
		resave: true,
		saveUninitialized: true
	} ),
	sharedSession = require( 'express-socket.io-session' );

app.use( require( 'errorhandler' )() );

app.use( require( 'compression' )() );

app.use( function ( request, response, next ) {

    response.header('Access-Control-Allow-Origin', 'localhost:8888' );

    response.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');

    response.header('Access-Control-Allow-Headers', 'Content-Type');

    response.header('Access-Control-Allow-Credentials', 'true');

    next();

} );

app.use( require( 'body-parser' ).urlencoded( { extended: true } ) );

app.use( require( 'body-parser' ).json() );

app.use( require( 'cookie-parser' )('Secret Cookie String') );

app.use( session );

app.get( '/', function ( request, response ) {

	response.sendFile( path.join( __dirname, 'ui', '/app.html' ) );

});

app.get( '*', function ( request, response ) {

	response.sendFile( path.join( __dirname, 'ui', request.url ) );

} );

io.use( sharedSession( session, {

    autoSave: true

} ) ); 

io.on( 'connection', function (socket) {

	fs.watch( path.join( __dirname, 'ui' ), {}, function ( event, name ) {

		socket.emit( 'refresh', {} );

	} );

	var session = socket.handshake.session;

	if ( typeof session.me !== 'object' ) {

		session.me = {};

	}

	socket.emit( 'update', {

		type: 'me',

		me: session.me

	} );

} );

server.listen( 8888, function () {

	console.log( 'Server Port', server.address().port );

} );