"use strict";
/**
 * @class  elFinder command "help"
 * "About" dialog
 *
 * @author Dmitry (dio) Levashov
 **/
elFinder.prototype.commands.previewapp = function() {
	var fm = this.fm, self = this;

	this.getstate = function() {
		return 0;
	}

	this.exec = function() {

        var url = $('.tab-pane.active').attr('data-path');
		window.open('/' + url, '_blank');
		window.focus();
	}
}
