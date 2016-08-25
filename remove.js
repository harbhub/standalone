Array.prototype.remove = function (str) {
	if (this.indexOf(str) !== -1) {
		this.splice(this.indexOf(str), 1);
	};
	return this;
};

Array.prototype.removeAll = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};