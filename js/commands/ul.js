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
        var cm = getCodeMirror();
		var currentPos = cm.doc.getCursor();
		cm.doc.replaceRange(code, currentPos);
		currentPos.ch = 5;
		currentPos.line += 2;
		cm.doc.setCursor(currentPos);
		cm.focus();
	}

}
