"use strict";
/**
 * @class  elFinder command "help"
 * "About" dialog
 *
 * @author Dmitry (dio) Levashov
 **/
elFinder.prototype.commands.img = function () {
    var fm = this.fm, self = this;

    this.getstate = function () {
        return 0;
    }

    this.exec = function () {

        var cm = getCodeMirror();
        var code = '<img src="">';
        var currentPos = cm.doc.getCursor();
        cm.doc.replaceRange(code, currentPos);
        currentPos.ch = currentPos.ch + 10;
        cm.doc.setCursor(currentPos);
        cm.focus();
    }
}
