"use strict";
/**
 * @class  elFinder command "help"
 * "About" dialog
 *
 * @author Dmitry (dio) Levashov
 **/
elFinder.prototype.commands.ul = function() {
	var fm   = this.fm,
		self = this;
	
	this.getstate = function() {
		return 0;
	}
	
	this.exec = function() {
		var code = '<ul><li></li</ul>';

		var tab = $('#tabs-files li.active a[data-toggle=tab]').attr('href').replace('#', '');

		var currentPos = codeMirrorArr[tab].doc.getCursor();

		codeMirrorArr[tab].doc.replaceRange(code, currentPos);

		currentPos.ch = currentPos.ch + 8;

		codeMirrorArr[tab].doc.setCursor(currentPos);
	}

}
