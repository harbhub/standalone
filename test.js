var Game = require( './game.js' );

var util = require( 'util' );

var game = new Game( {

	players: [ 'P1', 'P2' ],

	emporium: [ 'Pyrite', 'Shield', 'Banish', 'Cycle', 'Wares', 'Blessing', 'Gatherer', 'Invasion', 'Harvest', 'Pestilence' ]

} );

// game.playCard( 'Banish', game.current, [ 'Bronze', 'Bronze' ] );

// game.response( { cards: [ 'Bronze', 'Bronze' ] }, 'P2' );

game.playCard( 'Pestilence' );

// game.playCard( 'Bronze' );

// game.playTreasures();

// game.buyCard( 'Silver' );

// game.endTurn();

console.log( 'game', util.inspect( game, {

	depth: 3

} ) );