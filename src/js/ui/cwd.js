/**
 * Current working directory.
 *
 * @author Dmitry (dio) Levashov
 **/
$.fn.elfindercwd = function(fm) {
	// @TODO on cut add disable class to files?
	return this.each(function() {
		
		var 
			/**
			 * Select event full name
			 *
			 * @type String
			 **/
			evtSelect = 'select.'+fm.namespace,
			
			/**
			 * Unselect event full name
			 *
			 * @type String
			 **/
			evtUnselect = 'select.'+fm.namespace,
			
			/**
			 * Selected css class
			 *
			 * @type String
			 **/
			clSelected = 'ui-selected',
			
			/**
			 * Disabled css class
			 *
			 * @type String
			 **/
			clDisabled = 'ui-state-disabled',
			
			/**
			 * Draggable css class
			 *
			 * @type String
			 **/
			clDraggable = 'ui-draggable',
			
			/**
			 * Hover css class
			 *
			 * @type String
			 **/
			clHover     = 'ui-state-hover',

			/**
			 * Base thumbnails url
			 * New API only
			 *
			 * @type String
			 **/
			tmbUrl = '',
			
			/**
			 * File templates
			 *
			 * @type Object
			 **/
			templates = {
				icon : '<div id="{hash}" class="elfinder-cwd-file {permsclass} {dirclass} ui-corner-all"><div class="elfinder-cwd-file-wrapper ui-corner-all"><div class="elfinder-cwd-icon {mime} ui-corner-all" unselectable="on" {style}/>{marker}</div><div class="elfinder-cwd-filename ui-corner-all" title="{name}">{name}</div></div>',
				row  : '<tr id="{hash}" class="elfinder-file {permsclass} {dirclass}"><td><div class="elfinder-cwd-file-wrapper"><span class="elfinder-cwd-icon {mime}"/>{marker}<span class="elfinder-filename">{name}</span></div></td><td>{perms}</td><td>{date}</td><td>{size}</td><td>{kind}</td></tr>'
			},
			
			/**
			 * Template placeholders replacement rules
			 *
			 * @type Object
			 **/
			replacement = {
				permsclass : function(f) {
					return fm.perms2class(f);
				},
				perms : function(f) {
					return fm.formatPermissions(f);
				},
				dirclass : function(f) {
					return f.mime == 'directory' ? 'directory' : '';
				},
				mime : function(f) {
					return fm.mime2class(f.mime);
				},
				size : function(f) {
					return fm.formatSize(f.size);
				},
				date : function(f) {
					return fm.formatDate(f.date);
				},
				kind : function(f) {
					return fm.mime2kind(f.mime);
				},
				marker : function(f) {
					return (f.link || f.mime == 'symlink-broken' ? '<span class="elfinder-symlink"/>' : '')+(!f.read || !f.write ? '<span class="elfinder-perms"/>' : '');
				},
				style : function(f) {
					return typeof(f.tmb) == 'string' ? ' style="background:url(\''+tmbUrl+f.tmb+'\') center center no-repeat"' : '';
				}
			},
			
			/**
			 * Return file html
			 *
			 * @param  Object  file info
			 * @return String
			 **/
			itemhtml = function(f) {
				return templates[fm.view == 'list' ? 'row' : 'icon']
						.replace(/\{([a-z]+)\}/g, function(s, e) { 
							return replacement[e] ? replacement[e](f) : (f[e] ? f[e] : ''); 
						});
			},
			
			/**
			 * Flag. Required for msie to avoid unselect files on dragstart
			 *
			 * @type Boolean
			 **/
			selectLock = false,
			
			/**
			 * Move selection to prev/next file
			 *
			 * @param String  move direction
			 * @param Boolean append to current selection
			 * @return void
			 * @rise select			
			 */
			select = function(keyCode, append) {
				var code     = $.ui.keyCode,
					prev     = keyCode == code.LEFT || keyCode == code.UP,
					sel      = cwd.find('[id].'+clSelected),
					selector = prev ? 'first' : 'last',
					list     = fm.view == 'list',
					s, n, top, left;

				if (sel.length) {
					s = sel.filter(prev ? ':first' : ':last');

					if (!s[prev ? 'prev' : 'next']('[id]').length) {
						// there is no sibling on required side - do not move selection
						n = s;
					} else if (list || keyCode == code.LEFT || keyCode == code.RIGHT) {
						// find real prevoius file
						n = s[prev ? 'prev' : 'next']('[id]');
					} else {
						// find up/down side file in icons view
						top = s.position().top;
						left = s.position().left;

						n = s;
						if (prev) {
							do {
								n = n.prev('[id]');
							} while (n.length && !(n.position().top < top && n.position().left <= left))
							
						} else {
							do {
								n = n.next('[id]');
							} while (n.length && !(n.position().top > top && n.position().left >= left))
							// there is row before last one - select last file
							if (!n.length && cwd.find('[id]:last').position().top > top) {
								n = cwd.find('[id]:last');
							}
						}
					}
					
				} else {
					// there are no selected file - select first/last one
					n = cwd.find('[id]:'+(prev ? 'last' : 'first'))
				}
				
				if (n && n.length) {

					if (append) {
						// append new files to selected
						n = s.add(s[prev ? 'prevUntil' : 'nextUntil']('#'+n.attr('id'))).add(n);
					} else {
						// unselect selected files
						sel.trigger(evtUnselect)
					}
					// select file(s)
					n.trigger(evtSelect);
					// set its visible
					scrollToView(n.filter(prev ? ':first' : ':last'));
					// update cache/view
					trigger();
				}
			},
			
			/**
			 * Unselect all files
			 *
			 * @return void
			 */
			unselectAll = function() {
				cwd.find('[id].'+clSelected).trigger(evtUnselect); 
			},
			
			/**
			 * Return selected files hashes list
			 *
			 * @return Array
			 */
			selected = function() {
				return $.map(cwd.find('[id].'+clSelected), function(n) {
					n = $(n);
					return n.is('.'+clDisabled) ? null : $(n).attr('id');
				});
			},
			
			/**
			 * Fire elfinder "select" event and pass selected files to it
			 *
			 * @return void
			 */
			trigger = function() {
				fm.trigger('select', {selected : selected()});
			},
			
			/**
			 * Scroll file to set it visible
			 *
			 * @param DOMElement  file/dir node
			 * @return void
			 */
			scrollToView = function(o) {
				var t   = o.position().top;
					h   = o.outerHeight(true);
					ph  = cwd.innerHeight();
					st  = cwd.scrollTop();
				
				if (t < 0) {
					cwd.scrollTop(Math.ceil(t + st) - 9);
				} else if (t + h > ph) {
					cwd.scrollTop(Math.ceil(t + h - ph + st));
				}
			},
			
			/**
			 * Compare two files based on elFinder.sort
			 *
			 * @param Object  file
			 * @param Object  file
			 * @return Number
			 */
			compare = function(f1, f2) {
				var m1 = f1.mime,
					m2 = f2.mime,
					d1 = m1 == 'directory',
					d2 = m2 == 'directory',
					n1 = f1.name,
					n2 = f2.name,
					s1 = f1.size || 0,
					s2 = f2.size || 0;
				
				// dir first	
				if (fm.sort <= 3) {
					if (d1 && !d2) {
						return -1;
					}
					if (!d1 && d2) {
						return 1;
					}
				}
				// by mime
				if ((fm.sort == 2 ||fm. sort == 5) && m1 != m2) {
					return m1 > m2 ? 1 : -1;
				}
				// by size
				if ((fm.sort == 3 || fm.sort == 6) && s1 != s2) {
					return s1 > s2 ? 1 : -1;
				}
				
				return f1.name.localeCompare(f2.name);
			},
			
			/**
			 * Last rendered file 
			 * Required to start lazy load
			 *
			 * @type JQuery
			 **/
			last,
			
			/**
			 * Files we get from server but not show yet
			 *
			 * @type Array
			 **/
			buffer = [],
			
			/**
			 * Return index of elements with required hash in buffer 
			 *
			 * @param String  file hash
			 * @return Number
			 */
			index = function(hash) {
				var l = buffer.length;
				
				while (l--) {
					if (buffer[l].hash == hash) {
						return l;
					}
				}
				return -1;
			},
			
			/**
			 * Flag to aviod unnessesary paralell scroll event handlers cals
			 *
			 * @type  Boolean
			 */
			scrollLock = false,
			
			/**
			 * Flag to aviod cwd scrolled into prev position after page reload
			 *
			 * @type  Boolean
			 */
			scrollTop = false,

			/**
			 * Cwd scroll event handler.
			 * Lazy load - append to cwd not shown files
			 *
			 * @return void
			 */
			scroll = function() {
				var html = [],  
					tmbs = [],
					dirs = false, 
					files;
				
				if (buffer.length) {
					if (!scrollLock) {
						scrollLock = true;
						
						while ((!last || cwd.innerHeight() - last.position().top + fm.options.showThreshold > 0) 
							&& (files = buffer.splice(0, fm.options.showFiles)).length) {
							
							html = $.map(files, function(f) {
								if (f.hash && f.name) {
									if (f.mime == 'directory') {
										dirs = true;
									}
									if (f.tmb === 1) {
										tmbs.push(f.hash)
									}
									return itemhtml(f);
								}
								return null;
							});

							(fm.view == 'list' ? cwd.children('table').children('tbody') : cwd).append(html.join(''));
							
							last = cwd.find('[id]:last');
							scrollTop && cwd.scrollTop(0);
							
						}
						scrollLock = false;
						if (dirs) {
							setTimeout(function() {
								cwd.find('.directory:not(.ui-droppable,.elfinder-na,.elfinder-ro)').droppable(droppable);
							}, 20);
						}
						if (tmbs.length || fm.cwd().tmb) {
							fm.ajax({cmd : 'tmb', current : fm.cwd().hash, files : tmbs}, 'silent');
						} 
						
					}
				} else {
					cwd.unbind('scroll', scroll);
				}
			},
			
			/**
			 * Draggable options
			 *
			 * @type Array
			 **/
			draggable = $.extend({}, fm.draggable, {
				stop   : function(e) { 
					cwd.selectable('enable').droppable('enable');
					selectLock = false;
				},
				helper : function(e, ui) {
					var element  = this.id ? $(this) : $(this).parents('[id]:first'),
						helper   = $('<div class="elfinder-drag-helper"><span class="elfinder-drag-helper-icon-plus"/></div>'),
						selected = [],
						icon     = function(mime) { return '<div class="elfinder-cwd-icon '+fm.mime2class(mime)+' ui-corner-all"/>'; }, l;

					cwd.selectable('disable').droppable('disable').removeClass(clDisabled);

					// select dragged file if no selected
					if (!element.is('.'+clSelected)) {
						!(e.ctrlKey||e.metaKey||e.shiftKey) && unselectAll();
						element.trigger(evtSelect);
						trigger();
					}
					selectLock = true;
					
					if ((selected = fm.selected()).length) {
						l = selected.length;
						
						helper.append(icon(fm.file(selected[0]).mime))
							.data({
								files : selected,
								src   : fm.cwd().hash
							});
							
						l > 1 && helper.append(icon(fm.file(selected[l-1]).mime)+'<span class="elfinder-drag-num">'+l+'</span>');
					}
					return helper;
				}
			}),

			/**
			 * Droppable options
			 *
			 * @type Array
			 **/
			droppable = $.extend({}, fm.droppable, {
				hoverClass : 'elfinder-dropable-active',
				over       : function() { cwd.droppable('disable').removeClass(clDisabled); },
				// out        : function() { cwd.droppable('enable'); }
			}),
			
			/**
			 * CWD node itself
			 *
			 * @type JQuery
			 **/
			cwd = $(this)
				.addClass('elfinder-cwd')
				.attr('unselectable', 'on')
				// fix ui.selectable bugs and add shift+click support 
				.delegate('[id]', 'click', function(e) {
					var p    = this.id ? $(this) : $(this).parents('[id]:first'), 
						prev = p.prevAll('.'+clSelected+':first'),
						next = p.nextAll('.'+clSelected+':first'),
						pl   = prev.length,
						nl   = next.length,
						sib;

					e.stopImmediatePropagation();

					if (e.shiftKey && (pl || nl)) {
						sib = pl ? p.prevUntil('#'+prev.attr('id')) : p.nextUntil('#'+next.attr('id'));
						sib.add(p).trigger(evtSelect);
					} else if (e.ctrlKey || e.metaKey) {
						p.trigger((p.is('.'+clSelected) ? 'unselect' : 'select') + '.elfinder');
					} else {
						cwd.find('[id].'+clSelected).trigger(evtUnselect);
						p.trigger(evtSelect);
					}

					trigger();
				})
				// call fm.open()
				.delegate('[id]', 'dblclick', function(e) {
					fm.trigger('dblclick', {file : this.id});
				})
				// attach draggable
				.delegate('[id]', 'mouseenter', function(e) {
					var target = fm.view == 'list' 
							? $(this) 
							: $(this).children();

					!target.is('.'+clDraggable) && target.draggable(draggable);
				})
				// add hover class to selected file
				.delegate('[id]', evtSelect, function(e) {
					var $this = $(this);

					!selectLock && !$this.is('.'+clDisabled) && $this.addClass(clSelected).children().addClass(clHover);
				})
				// remove hover class from unselected file
				.delegate('[id]', evtUnselect, function(e) {
					!selectLock && $(this).removeClass(clSelected).children().removeClass(clHover);
				})
				// make files selectable
				.selectable({
					filter     : '[id]',
					stop       : trigger,
					selected   : function(e, ui) { $(ui.selected).trigger(evtSelect); },
					unselected : function(e, ui) { $(ui.unselected).trigger(evtUnselect); }
				})
				// make cwd itself droppable for folders from nav panel
				.droppable($.extend({}, fm.droppable));
		

		fm
			// update directory content
			.bind('open', function(e) {
				var list  = fm.view == 'list', 
					phash = e.data.cwd.hash; 
				
				tmbUrl = fm.param('tmbUrl')||'';
			
				cwd.empty()
					.removeClass('elfinder-cwd-view-icons elfinder-cwd-view-list')
					.addClass('elfinder-cwd-view-'+(list ? 'list' :'icons'));
			
				if (list) {
					cwd.html('<table><thead><tr><td class="ui-widget-header">'+fm.i18n('Name')+'</td><td class="ui-widget-header">'+fm.i18n('Permissions')+'</td><td class="ui-widget-header">'+fm.i18n('Modified')+'</td><td class="ui-widget-header">'+fm.i18n('Size')+'</td><td class="ui-widget-header">'+fm.i18n('Kind')+'</td></tr></thead><tbody/></table>');
				}

				buffer = fm.oldAPI
					? e.data.cdc
					: $.map(e.data.files, function(f) { return f.phash == phash ? f : null });
					
				buffer = buffer.sort(compare);
				scrollTop = true;
				cwd.bind('scroll', scroll).trigger('scroll');
				scrollTop = false;
				trigger();
			})
			// add thumbnails
			.bind('tmb', function(e) {
				if (fm.view != 'list' && e.data.current == fm.cwd().hash) {
					$.each(e.data.images, function(hash, url) {
						var node = cwd.find('#'+hash), ndx;

						if (node.length) {
							node.find('.elfinder-cwd-icon').css('background', "url('"+tmbUrl+url+"') center center no-repeat");
						} else {
							e.data.tmb = false;
						
							if ((ndx = indexof(hash)) != -1) {
								buffer[ndx].tmb = url;
							}
						}
					});
					// old api
					e.data.tmb && fm.ajax({cmd : 'tmb', current : fm.cwd().hash}, 'silent');
				}
			})
			// add new files
			.bind('added', function(e) {
				var phash   = fm.cwd().hash,
					l       = e.data.added.length, f,
					tmbs    = [],
					append  = function(f) {
						var node = itemhtml(f),
							i, first, curr;
					
						if ((first = cwd.find('[id]:first')).length) {
							curr = first;
							while (curr.length) {
								if (compare(f, fm.file(curr.attr('id'))) < 0) {
									return curr.before(node);
								}
								curr = curr.next('[id]');
							}
						} 
					
						if (buffer.length) {
							for (i = 0; i < buffer.length; i++) {
								if (compare(f, buffer[i]) < 0) {
									return buffer.splice(i, 0, f);
								}
							}
							return buffer.push(f);
						}
					
						(fm.view == 'list' ? cwd.find('tbody') : cwd).append(node);
					};
			
				while (l--) {
					f = e.data.added[l];
					if (f.phash == phash && !cwd.find('#'+f.hash).length) {
						append(f);
						f.tmb === 1 && tmbs.push(f.hash);
					}
				}
			
				tmbs.length && fm.ajax({cmd : 'tmb', current : fm.cwd().hash, files : tmbs}, 'silent');
			})
			// remove files
			.bind('removed', function(e) {
				var rm = e.data.removed,
					l = rm.length, hash, n;
				
				while (l--) {
					hash = rm[l].hash;
					
					if ((n = cwd.find('#'+hash)).length) {
						n.remove();
					} else if ((n = index(hash)) != -1) {
						buffer.splice(n, 1);
					}
				}
			})
			// on some commands make target files disabled
			.bind('ajaxstart', function(e) {
				var cmd   = e.data.request.cmd,
					files = [];
				
				if (cmd == 'rm') {
					files = e.data.request.targets;
				}
				
				$.each(files, function(i, hash) {
					var node = cwd.find('#'+hash),
						list = fm.view == 'list',
						drag = list 
							? node 
							: node.children();
							
					node.addClass(clDisabled).trigger(evtUnselect);
					drag.is('.'+clDraggable) && drag.draggable('disable');
					node.is('.directory') && node.droppable('disable');
					!list && drag.removeClass(clDisabled);
				});
				fm.trigger('select', {selected : selected()});
			})
			// enable files disabled in ajaxstart handler
			.bind('ajaxstop', function(e) {
				var cmd     = e.data.request.cmd,
					removed = e.data.response.removed || [],
					files   = [];
				
				if (cmd == 'rm') {
					files = e.data.request.targets;
				}
				
				$.each(files, function(i, hash) {
					var node = cwd.find('#'+hash),
						drag = fm.view == 'list' 
							? node 
							: node.children();
					
					if ($.inArray(hash, removed) === -1) {
						node.removeClass(clDisabled);
						drag.is('.'+clDraggable) && drag.draggable('enable');
						node.is('.directory') && node.droppable('enable');
					}
				});
			})
			.shortcut({
				pattern     :'ctrl+a', 
				description : 'Select all files',
				callback    : function() { 
					cwd.find('[id]:not(.'+clSelected+')').trigger(evtSelect); 
					fm.trigger('select', {selected : selected()}); 
				}
			})
			.shortcut({
				pattern     : 'left right up down shift+left shift+right shift+up shift+down',
				description : 'Control selection by arrows and shift key',
				type        : $.browser.mozilla || $.browser.opera ? 'keypress' : 'keydown',
				callback    : function(e) { select(e.keyCode, e.shiftKey); }
			})
			.shortcut({
				pattern     : 'home',
				description : 'Select first file',
				callback    : function(e) { 
					unselectAll();
					cwd.find('[id]:first').trigger(evtSelect) 
					fm.trigger('select', {selected : selected()}); 
				}
			})
			.shortcut({
				pattern     : 'end',
				description : 'Select last file',
				callback    : function(e) { 
					unselectAll();
					cwd.find('[id]:last').trigger(evtSelect) 
					fm.trigger('select', {selected : selected()}); 
				}
			});
		
	});
	
}