"use strict";
/**
 * @class  elFinder command "help"
 * "About" dialog
 *
 * @author Dmitry (dio) Levashov
 **/
elFinder.prototype.commands.italic = function() {
	var fm = this.fm, self = this;

	this.getstate = function() {
		return 0;
	}

	this.exec = function() {
				var tab = $('#tabs-files li.active a[data-toggle=tab]').attr('href').replace('#', '');

		var selection = codeMirrorArr[tab].doc.getSelection();

		var code = '<i>' + selection + '</i>';

		var currentPos = codeMirrorArr[tab].doc.getCursor();

		var to = currentPos.ch;

		currentPos.ch -= selection.length;

		codeMirrorArr[tab].doc.replaceRange(code, currentPos, {
			line : currentPos.line,
			ch : to
		});

		currentPos.ch = currentPos.ch + 3;

		codeMirrorArr[tab].doc.setCursor(currentPos);
	}
}
