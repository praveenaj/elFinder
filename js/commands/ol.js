"use strict";
/**
 * @class  elFinder command "help"
 * "About" dialog
 *
 * @author Dmitry (dio) Levashov
 **/
elFinder.prototype.commands.ol = function() {
	var fm   = this.fm,
		self = this;
	
	this.getstate = function() {
		return 0;
	}
	
	this.exec = function() {
		var code = '\n<ol>\n\t<li></li>\n</ol>';

		var tab = $('#tabs-files li.active a[data-toggle=tab]').attr('href').replace('#', '');

		var currentPos = codeMirrorArr[tab].doc.getCursor();

		codeMirrorArr[tab].doc.replaceRange(code, currentPos);

		currentPos.ch = 5;
		currentPos.line += 2;

		codeMirrorArr[tab].doc.setCursor(currentPos);
		codeMirrorArr[tab].focus();
	}

}
