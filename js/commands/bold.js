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
	

		var tab = $('#tabs-files li.active a[data-toggle=tab]').attr('href').replace('#', '');

		var selection = codeMirrorArr[tab].doc.getSelection();

		var code = '<strong>' + selection + '</strong>';

		var currentPos = codeMirrorArr[tab].doc.getCursor();

		var to = currentPos.ch;

		currentPos.ch -= selection.length;

		codeMirrorArr[tab].doc.replaceRange(code, currentPos, {
			line : currentPos.line,
			ch : to
		});

		currentPos.ch = currentPos.ch + 8;

		codeMirrorArr[tab].doc.setCursor(currentPos);
		
		codeMirrorArr[tab].focus();

	}
}
