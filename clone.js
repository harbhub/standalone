Array.prototype.clone = function () {

	var input = this;

	var output = [];

	for ( var i = 0; i < input.length; ++i ) {

		output[i] = input[i];

	};

	return output;

};