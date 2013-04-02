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
		var code = '\n<ul>\n\t<li></li>\n</ul>';

		var tab = $('#tabs-files li.active a[data-toggle=tab]').attr('href').replace('#', '');

		var currentPos = codeMirrorArr[tab].doc.getCursor();

		codeMirrorArr[tab].doc.replaceRange(code, currentPos);

		currentPos.ch = 5;
		currentPos.line += 2;

		codeMirrorArr[tab].doc.setCursor(currentPos);
		codeMirrorArr[tab].focus();
	}

}
