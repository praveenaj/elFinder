"use strict";
/**
 * @class  elFinder command "help"
 * "About" dialog
 *
 * @author Dmitry (dio) Levashov
 **/
elFinder.prototype.commands.bold = function() {
	var fm = this.fm, self = this;

	this.getstate = function() {
		return 0;
	}

	this.exec = function() {

        var cm = getCodeMirror();
		var selection = cm.doc.getSelection();
		var code = '<strong>' + selection + '</strong>';
		var currentPos = cm.doc.getCursor();
		var to = currentPos.ch;
		currentPos.ch -= selection.length;
		cm.doc.replaceRange(code, currentPos, {
			line : currentPos.line,
			ch : to
		});
		currentPos.ch = currentPos.ch + 8;
		cm.doc.setCursor(currentPos);
		cm.focus();

	}
}
