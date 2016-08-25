if ( typeof module !== 'undefined' ) {

	require( './shuffle.js' );

	require( './remove.js' );

	require( './clone.js' );

}

function Game( config ) {

	this.config = config;

	this.init();

};

Game.prototype.init = function init() {

	this.log = [];

	this.stack = [];

	for ( var key in this.cards ) {

		if ( key !== 'list' ) {

			this.cards.list.push( key );

			this.cards[ key ].name = key;

		}

	}

	this.outOfStock = 0;

	this.exiled = [];

	this.hasVirus = false;

	this.await = {

		card: '',

		players: []

	};

	this.player = {};

	this.players = this.config.players;

	this.emporium = {

		'Bronze': 60,

		'Silver': 40,

		'Gold': 30,

		'Farm': 24,

		'Homestead': 12,

		'Plantation': 12,

		'Virus': 30

	};

	if ( this.players.length === 2 ) {

		this.emporium[ 'Farm' ] -= 10;

		this.emporium[ 'Homestead' ] -= 4;

		this.emporium[ 'Plantation' ] -= 4;

		this.emporium[ 'Virus' ] -= 20;

	} else if ( this.players.length === 3 ) {

		this.emporium[ 'Farm' ] -= 3;

		this.emporium[ 'Virus' ] -= 10;

	}

	for ( var i = 0; i < this.config.emporium.length; ++i ) {

		var name = this.config.emporium[ i ];

		if ( this.players.length === 2 ) {

			this.emporium[ name ] = 8;

		} else {

			this.emporium[ name ] = 10;

		}

		if ( name === 'Pestilence' ) {

			this.hasVirus = true;

		}

	}

	if ( !this.hasVirus ) {

		delete this.emporium[ 'Virus' ];

	}

	for ( var i = 0; i < this.players.length; ++i ) {

		this.player[ this.players[ i ] ] = {

			name: this.players[ i ],

			hand: [ 'Pestilence' ],

			discard: [],

			play: [],

			deck: [].shuffle(),

			coins: 0,

			stamina: 0,

			bells: 0,

			clout: 0,

			duration: []

		};

		this.gainCard( 'Bronze', this.players[ i ] );
		this.gainCard( 'Bronze', this.players[ i ] );
		this.gainCard( 'Bronze', this.players[ i ] );
		this.gainCard( 'Bronze', this.players[ i ] );
		this.gainCard( 'Bronze', this.players[ i ] );
		this.gainCard( 'Bronze', this.players[ i ] );
		this.gainCard( 'Bronze', this.players[ i ] );

		this.gainCard( 'Farm', this.players[ i ] );
		this.gainCard( 'Farm', this.players[ i ] );
		this.gainCard( 'Farm', this.players[ i ] );

		this.drawCards( 5, this.players[ i ] );

	}

	this.players.shuffle();

	// TODO Better Turn Order Message
	this.addToLog( 'Turn Order: ' + this.players.toString() );

	this.current = this.player[ this.players[ 0 ] ];

	this.startTurn();

};

Game.prototype.buyCard = function buyCard( card ) {

	if ( typeof card === 'string' ) {

		card = this.cards[ card ];

	}

	if ( this.current.coins >= card.cost && this.current.bells >= 1 && this.emporium[ card.name ] >= 1 ) {

		this.current.coins -= card.cost;

		this.current.bells -= 1;

		this.gainCard( card );

	} else {

		throw new Error( 'Player (' + this.current.name + ') Cannot Buy Card: ' + card.name );

	}

};

Game.prototype.gainCard = function gainCard( card, player ) {

	if ( typeof card === 'string' ) {

		card = this.cards[ card ];

	}

	if ( typeof player !== 'undefined' ) {

		if ( typeof player === 'string' ) {

			player = this.player[ player ];

		}

	} else {

		player = this.current;

	}

	if ( this.emporium[ card.name ] > 0 ) {

		this.emporium[ card.name ] -= 1;

		player.discard.push( card.name );

		if ( this.emporium[ card.name ] === 0 ) {

			this.outOfStock += 1;

			if ( card.name === 'Plantation' || this.outOfStock === 3 ) {

				this.gameOver();

			}

		}

	}

};

Game.prototype.response = function response( object, player ) {

	if ( typeof player !== 'undefined' ) {

		if ( typeof player === 'string' ) {

			player = this.player[ player ];

		}

	} else {

		player = this.current;

	}

	if ( this.await.card === 'Wares' ) {

		this.discardCard( object.card, player );

		this.await.card = '';

		this.await.players = [];

	}

	if ( this.await.card === 'Invasion' ) {

		for ( var i = 0; i < object.cards.length; ++i ) {

			this.discardCard( object.cards[ i ], player );

		}

		this.await.players.remove( player.name );

		if ( this.await.players.length === 0 ) {

			this.await.card = '';

		}

	}

};

Game.prototype.discardCard = function discardCard( card, player ) {

	if ( typeof card === 'string' ) {

		card = this.cards[ card ];

	}
	
	if ( typeof player !== 'undefined' ) {

		if ( typeof player === 'string' ) {

			player = this.player[ player ];

		}

	} else {

		player = this.current;

	}

	if ( player.hand.indexOf( card.name ) ) {

		player.hand.remove( card.name );

		player.discard.push( card.name );

	}

};

Game.prototype.gameOver = function gameOver() {
	
	// TODO Calculate Scores
	// TODO Determine Winner

};

Game.prototype.drawCards = function drawCards( amount, player ) {
	
	if ( typeof player !== 'undefined' ) {

		if ( typeof player === 'string' ) {

			player = this.player[ player ];

		}

	} else {

		player = this.current;

	}

	for ( var i = amount; i > 0; --i ) {

		if ( player.deck.length > 0 ) {

			player.hand.push( player.deck.shift() );

		} else {

			if ( player.discard.length > 0 ) {

				player.deck = player.discard.clone();

				player.discard = [];

				this.drawCards( i, player );

				break;

			} else {

				break;

			}

		}

	}

};

Game.prototype.addToLog = function addToLog( message ) {

	this.log.push( message );
	
};

Game.prototype.playTreasures = function playTreasures() {

	for ( var i = this.current.hand.length - 1; i >= 0 ; --i ) {

		var card = this.cards[ this.current.hand[ i ] ];

		if ( card.type === 'treasure' ) {

			this.playCard( card );

		}

	}

};

Game.prototype.playCard = function playCard( card, player, extra ) {

	if ( typeof player !== 'undefined' ) {

		if ( typeof player === 'string' ) {

			player = this.player[ player ];

		}

	} else {

		player = this.current;

	}

	if ( typeof card === 'string' ) {

		card = this.cards[ card ];

	}

	if ( player.hand.indexOf( card.name ) !== -1 && ( player.stamina > 0 || card.type !== 'spell' ) ) {

		this.addToStack( {

			action: 'play',

			player: player,

			card: card,

			extra: extra

		} );

	}
	
};

Game.prototype.addToStack = function addToStack( item ) {

	this.stack.push( item );

	this.analyzeStack();

};

Game.prototype.analyzeStack = function analyzeStack() {

	var item = this.stack[ this.stack.length - 1 ];

	if ( item.action === 'play' ) {

		if ( item.card.type === 'treasure' ) {

			item.player.coins += item.card.coins || 0;

			if ( item.card.name === 'Pyrite' && item.player.play.indexOf( 'Pyrite' ) !== -1) {

				item.player.coins += 2;

			}

			this.moveFromHandToPlay( item.card, item.player );

		} else if ( item.card.type === 'spell' ) {

			item.player.stamina -= 1;

			item.player.stamina += item.card.stamina || 0;

			item.player.coins += item.card.coins || 0;

			item.player.bells += item.card.bells || 0;

			item.player.clout += item.card.clout || 0;

			if ( item.card.cards ) {

				this.drawCards( item.card.cards, item.player );

			}

			if ( item.card.duration ) {

				item.player.duration.push( item.card.name );

			}

			if ( item.card.name === 'Wares' ) {

				this.await.card = 'Wares';

				this.await.players.push( item.player.name );

			}

			if ( item.card.name === 'Banish' ) {

				item.extra = item.extra || [];

				for ( var i = 0; i < item.extra.length; ++i ) {

					if ( item.player.hand.indexOf( item.extra[ i ] ) ) {

						item.player.hand.remove( item.extra[ i ] );

						this.exiled.push( item.extra[ i ] );

					}

				}

			}

			if ( item.card.name === 'Invasion' ) {

				for ( var i = 0; i < this.players.length; ++i ) {

					if ( this.players[ i ] === item.player.name ) {

						continue;

					}

					if ( this.player[ this.players[ i ] ].hand.indexOf( 'Shield') !== -1 ) {

						continue;

					}

					if ( this.player[ this.players[ i ] ].hand.length <= 3 ) {

						continue;

					}

					this.await.card = 'Invasion';

					this.await.players.push( this.players[ i ] );

				}

			}

			if ( item.card.name === 'Harvest' ) {

				for ( var i = 0; i < this.players.length; ++i ) {

					if ( this.players[ i ] === item.player.name ) {

						continue;

					}

					this.drawCards( 1, this.players[ i ] );

				}

			}

			if ( item.card.name === 'Pestilence' ) {

				var index = this.players.indexOf( item.player.name );

				var order = this.players.clone();

				var hold = order.splice( index, order.length - 1 );

				order = hold.concat( order ).remove( item.player.name );

				for ( var i = 0; i < order.length; ++i ) {

					if ( this.player[ order[ i ] ].hand.indexOf( 'Shield') !== -1 ) {

						continue;

					}

					this.gainCard( 'Virus', order[ i ] );

				}

			}

			this.moveFromHandToPlay( item.card, item.player );
		
		}

	}

};

Game.prototype.startTurn = function startTurn() {

	this.current.bells += 1;

	this.current.stamina += 1;

	if ( this.current.duration.length > 0 ) {

		for ( var i = this.current.duration.length - 1; i >= 0; --i ) {

			switch ( this.current.duration[ i ] ) {

				case 'Gatherer':

					this.current.stamina += 1;

					this.drawCards( 1, this.current );

					this.current.duration.remove( 'Gatherer' );

					break;

				default:

					break;

			}

		}

	}
	
};

Game.prototype.endTurn = function endTurn() {

	this.current.coins = 0;

	this.current.bells = 0;

	this.current.stamina = 0;

	this.current.discard = this.current.discard.concat( this.current.play.clone(), this.current.hand.clone() );

	this.current.play = [];

	this.current.hand = [];

	this.drawCards( 5, this.current );

	var index = this.players.indexOf( this.current.name );

	if ( index === this.players.length - 1 ) {

		index = 0;

	} else {

		index += 1;

	}

	this.current = this.player[ this.players[ index ] ];

	this.startTurn();
	
};

Game.prototype.quit = function quit( player ) {

	// TODO Remove Player
	// TODO Shift Turn (If Necessary)
	
};

Game.prototype.moveFromHandToPlay = function moveFromHandToPlay( card, player ) {

	player.hand.remove( card.name );

	player.play.push( card.name );
	
};

Game.prototype.cards = {

	list: [],

	'Bronze': {

		cost: 0,

		type: 'treasure',

		coins: 1

	},

	'Silver': {

		cost: 3,

		type: 'treasure',

		coins: 2

	},

	'Gold': {

		cost: 6,

		type: 'treasure',

		coins: 3

	},

	'Farm': {

		cost: 2,

		type: 'clout',

		clout: 1

	},

	'Homestead': {

		cost: 5,

		type: 'clout',

		clout: 3

	},

	'Plantation': {

		cost: 8,

		type: 'clout',

		clout: 6

	},

	'Virus': {

		cost: 0,

		type: 'virus',

		clout: -1

	},

	'Shield': {

		cost: 2,

		type: 'spell',

		cards: 2,

		text: 'Immune to attacks while Shield is in your hand'

	},

	'Pyrite': {

		cost: 2,

		type: 'treasure',

		coins: 1,

		text: '+2 additional coins if you have played another Pyrite this turn\n\nWhen an opponent gains a Plantation you may exile this card from your hand to gain a Gold'

	},

	'Banish': {

		cost: 3,

		type: 'spell',

		text: 'Exile up to 4 cards from your hand'

	},

	'Cycle': {

		cost: 3,

		type: 'spell',

		stamina: 2,

		cards: 1

	},

	'Wares': {

		cost: 3,

		type: 'spell',

		cards: 3,

		stamina: 1,

		text: 'Discard a card'

	},

	'Invasion': {

		cost: 4,

		type: 'spell',

		coins: 2,

		attack: true,

		text: 'Opponents discard down to 3 cards'

	},

	'Gatherer': {

		cost: 4,

		type: 'spell',

		cards: 1,

		stamina: 1,

		duration: true,

		text: 'Draw a card at the start of your next turn'

	},

	'Blessing': {

		cost: 4,

		type: 'spell',

		coins: 2,

		clout: 1

	},

	'Harvest': {

		cost: 5,

		type: 'spell',

		bells: 1,

		cards: 4,

		text: 'Opponents draw a card'

	},

	'Pestilence': {

		cost: 5,

		type: 'spell',

		cards: 2,

		text: 'Opponents gain a Virus'

	}

}

if ( typeof module !== 'undefined' ) {

	module.exports = Game;

}