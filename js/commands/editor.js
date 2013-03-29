"use strict";
/**
 * @class elFinder command "info".
 * Display dialog with file properties.
 *
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elFinder.prototype.commands.editor = function() {
	var m = 'msg', fm = this.fm, spclass = 'elfinder-info-spinner', msg = {
		calc : fm.i18n('calc'),
		size : fm.i18n('size'),
		unknown : fm.i18n('unknown'),
		path : fm.i18n('path'),
		aliasfor : fm.i18n('aliasfor'),
		modify : fm.i18n('modify'),
		perms : fm.i18n('perms'),
		locked : fm.i18n('locked'),
		dim : fm.i18n('dim'),
		kind : fm.i18n('kind'),
		files : fm.i18n('files'),
		folders : fm.i18n('folders'),
		items : fm.i18n('items'),
		yes : fm.i18n('yes'),
		no : fm.i18n('no'),
		link : fm.i18n('link')
	};

	this.tpl = {
		main : '<div class="ui-helper-clearfix elfinder-info-title"><span class="elfinder-cwd-icon {class} ui-corner-all"/>{title}</div><table class="elfinder-info-tb">{content}</table>',
		itemTitle : '<strong>{name}</strong><span class="elfinder-info-kind">{kind}</span>',
		groupTitle : '<strong>{items}: {num}</strong>',
		row : '<tr><td>{label} : </td><td>{value}</td></tr>',
		spinner : '<span>{text}</span> <span class="' + spclass + '"/>'
	}

	this.alwaysEnabled = true;
	this.updateOnSelect = false;
	this.shortcuts = [{
		pattern : 'ctrl+i'
	}];

	this.init = function() {
		$.each(msg, function(k, v) {
			msg[k] = fm.i18n(v);
		});
	}

	this.getstate = function() {
		return 0;
	}

	this.exec = function(hashes) {
		var file = this.files(hashes)[0];
	

		var win = window.open('dashboard/new-page.jag?sitehash=' + file.hash, '_blank');
		win.focus();

	}
}
