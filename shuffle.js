Array.prototype.shuffle = function shuffle() {

	var m = this.length, t, i;

	while ( m ) {

	    i = Math.floor( Math.random() * m-- );

	    t = this[ m ];

	    this[ m ] = this[ i ];

	    this[ i ] = t;

	};

	return this;
	
};