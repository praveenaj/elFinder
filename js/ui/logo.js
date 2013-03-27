"use strict";
/**
 * @class elFinder ui
 * Display number of files/selected files and its size in statusbar
 *
 * @author Dmitry (dio) Levashov
 **/
$.fn.elfinderlogo = function(fm) {
	var logo = '&copy; 2013&nbsp;&nbsp;<a target="_blank" href="http://www.wso2.com"></a>';
	var div = $('<div class="elfinder-logo">').html(logo);
	return this.each(function() {
		$('.elfinder-statusbar').append(div);
				
	});
}