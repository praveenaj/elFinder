"use strict";
/**
 * @class  elFinder command "help"
 * "About" dialog
 *
 * @author Dmitry (dio) Levashov
 **/
elFinder.prototype.commands.bold = function() {
	var fm   = this.fm,
		self = this;
	
	this.getstate = function() {
		return 0;
	}
	
	this.exec = function() {
		var tab = $('#tabs-files li.active a[data-toggle=tab]').attr('href').replace('#','');

		codeMirrorArr[tab].doc.replaceRange("<strong></strong>", codeMirrorArr[tab].doc.getCursor() );
	}

}
