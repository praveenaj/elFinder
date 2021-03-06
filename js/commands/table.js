"use strict";
/**
 * @class  elFinder command "help"
 * "About" dialog
 *
 * @author Dmitry (dio) Levashov
 **/
elFinder.prototype.commands.table = function() {
	var fm = this.fm, self = this;

	this.getstate = function() {
		return 0;
	}

	this.exec = function() {

		var code = '\n<table>\n\t<tr>\n\t\t<td></td>\n\t</tr>\n</table>';
        var cm = getCodeMirror();
		var currentPos = cm.doc.getCursor();
		cm.doc.replaceRange(code, currentPos);
		currentPos.ch = 6;
		currentPos.line += 3;
		cm.doc.setCursor(currentPos);
		cm.focus();
	}
}
