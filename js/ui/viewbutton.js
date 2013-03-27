"use strict"
/**
 * @class  elFinder toolbar button to switch current directory view.
 *
 * @author Dmitry (dio) Levashov
 **/
$.fn.elfinderviewbutton = function(cmd) {
	return this.each(function() {
		var button = $(this).addClass('ui-widget-content elfinder-button '+cmd.fm.res('class', 'changeviewbtn')+'').elfinderbutton(cmd),
			icon   = button.children('.elfinder-button-icon');

		cmd.change(function() {
			var icons = cmd.value == 'icons';

			icon.toggleClass('elfinder-button-icon-view-list', icons);
			button.attr('title', cmd.fm.i18n(icons ? 'viewlist' : 'viewicons'));
		});
		
		// wait when button will be added to DOM
		setTimeout(function() {
			button.parent().detach();
			cmd.fm.getUI('toolbar').prepend(button.show());
			// TODO: position icons for ie7
			/*
			if (cmd.fm.UA.ltIE7) {
				var icon = button.children(cmd.fm.direction == 'ltr' ? '.ui-icon-close' : '.ui-icon-search');
				icon.css({
					right : '',
					left  : parseInt(button.width())-icon.outerWidth(true)
				});
			}
			*/
		}, 200);
		
	});
}

