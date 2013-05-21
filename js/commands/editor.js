"use strict";
/**
 * @class elFinder command "info".
 * Display dialog with file properties.
 *
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elFinder.prototype.commands.editor = function() {
	var fm = this.fm, self = this;

	this.getstate = function(sel) {
		var sel = this.files(sel),
			cnt = sel.length;

		return cnt && $.map(sel, function(f) { return f.phash && f.read ? f : null  }).length == cnt ? 0 : -1;
	}

	this.exec = function(hashes) {
		var file = this.files(hashes)[0];
	

		var win = window.open('editor.jag?sitehash=' + file.hash, '_blank');
		win.focus();

	}
}
