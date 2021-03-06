"use strict";
elFinder.prototype.commands.indent = function () {
    var fm = this.fm, self = this;

    this.getstate = function () {
        return 0;
    }

    this.exec = function () {


        var cm = getCodeMirror();
        var form = cm.doc.getCursor();
        var to = cm.doc.getCursor("end");

        if (cm.doc.getSelection().length == 0) {
            cm.autoFormatRange(
                {line: 0, ch: 0},
                {line: cm.lineCount() - 1}
            );
        } else {
            cm.autoFormatRange(form, to);
        }
        cm.focus();

    }
}