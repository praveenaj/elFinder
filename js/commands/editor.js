"use strict";
/**
 * @class elFinder command "info".
 * Display dialog with file properties.
 *
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elFinder.prototype.commands.editor = function() {
	var fm = this.fm, self = this;

	this.getstate = function() {
		return 0;
	}

	this.exec = function(hashes) {
		var file = this.files(hashes)[0];
	

		var win = window.open('dashboard/new-page.jag?sitehash=' + file.hash, '_blank');
		win.focus();

	}
}
