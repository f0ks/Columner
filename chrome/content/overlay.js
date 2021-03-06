var columner = {

    prefManager: Components.classes['@mozilla.org/preferences-service;1'].
                 getService(Components.interfaces.nsIPrefBranch),

    tabNodes: Array(),
    isPrefMouseWheel: false,
    isPrefKeyboard: false,
    isShiftPressed: false,

    onLoad: function() {
        // set prefs if not yet set

        try {
            Services.prefs.getCharPref("extensions.columner.PREF_MOUSE_WHEEL");
        } catch(e) {
            Services.prefs.setCharPref("extensions.columner.PREF_MOUSE_WHEEL", "false");
        }

    },

    getPrefs: function() {
        columner.isPrefMouseWheel = columner.prefManager.
            getBoolPref('extensions.columner.prefMouseWheel');

        columner.isPrefKeyboard = columner.prefManager.
            getBoolPref('extensions.columner.prefKeyboard');

        columner.isPrefAlignLeft = columner.prefManager.
            getBoolPref('extensions.columner.prefAlignLeft');

        // having error with these two :(
        /*
        columner.isPrefAlignCenter = columner.prefManager.
            getBoolPref('extensions.columner.prefAlignCenter');
        columner.isPrefAlignRight = columner.prefManager.
            getBoolPref('extensions.columner.prefAlignRight');
        */
    },

    WrapBody: function() {
        var contentWrapper = content.document.createElement('div');
        contentWrapper.id = 'columnerContentWrapper';
        
        while (content.document.body.firstChild) {
            contentWrapper.appendChild(content.document.body.firstChild);
        }
        
        content.document.body.appendChild(contentWrapper);
    },


    CreateTabNode: function() {
        var isNodeExist = false;

        for (var i = 0; i < columner.tabNodes.length; i++) {
            if (content.document.URL === columner.tabNodes[i].url) {
                isNodeExist = true;
            }
        } 

        if (!isNodeExist) {
            columner.tabNodes[columner.tabNodes.length] = 
            {
                'url' : content.document.URL,
                'columnScale' : 100
            };

            columner.WrapBody();
        }
        
        return isNodeExist;
    },


    GetTabId: function() {
        for (var i = 0; i < columner.tabNodes.length; i++) {
            if (content.document.URL === columner.tabNodes[i].url) {
                return i;
            }
        } 
    },


    Narrow: function() {
        columner.getPrefs();

        // loging into firefox's developer tools console (not firebug)
        console.log( "isLeft " + columner.isPrefAlignLeft);
        console.log( "isCenter " + columner.isPrefAlignCenter);
        console.log( "isRight " + columner.isPrefAlignRight);

        if (columner.isShiftPressed === true) {
            columner.CreateTabNode();
            var curTab = columner.GetTabId();
            if (columner.tabNodes[curTab].columnScale > 10) { 
                columner.tabNodes[curTab].columnScale -= 5;
                content.document.getElementById('columnerContentWrapper')
                .style.width = columner.tabNodes[curTab].columnScale + '%';
            }
        } else {
            if (columner.isPrefKeyboard !== false) {
                columner.CreateTabNode();
                var curTab = columner.GetTabId();
                if (columner.tabNodes[curTab].columnScale > 10) { 
                    columner.tabNodes[curTab].columnScale -= 5;
                    content.document.getElementById('columnerContentWrapper')
                        .style.width = columner.tabNodes[curTab].columnScale + '%';
                }
            }
        }
    },

    Wide: function() {
        columner.getPrefs();

        if (columner.isShiftPressed === true) {
            columner.CreateTabNode();
            var curTab = columner.GetTabId();
            if (columner.tabNodes[curTab].columnScale < 100) { 
                columner.tabNodes[curTab].columnScale += 10;
                content.document.getElementById( 'columnerContentWrapper' )
                    .style.width = columner.tabNodes[curTab].columnScale + '%';
            }
        } else {
            if (columner.isPrefKeyboard !== false) {
                columner.CreateTabNode();
                var curTab = columner.GetTabId();
                if (columner.tabNodes[curTab].columnScale < 100) { 
                    columner.tabNodes[curTab].columnScale += 10;
                    content.document.getElementById('columnerContentWrapper')
                        .style.width = columner.tabNodes[curTab].columnScale + '%';
                }
            }
        }
    },

    mouseWheel: function(e) {
        e.preventDefault();
        if (columner.isShiftPressed === true && columner.isPrefMouseWheel === true) {
            if (e.detail < 0) {
                columner.Wide();
            } else {
                columner.Narrow();
            }
        }
    },


    keyDown: function(e) {
        columner.getPrefs();
        if (e.keyCode == 16 && columner.isPrefMouseWheel == true) {
            columner.isShiftPressed = true;
            window.addEventListener('DOMMouseScroll', columner.mouseWheel, false);
        }
    },


    keyUp: function(e) {
        columner.getPrefs();
        if (e.keyCode == 16 && columner.isPrefMouseWheel == true) {
            columner.isShiftPressed = false;
            window.removeEventListener('DOMMouseScroll', columner.mouseWheel, false);
        }
    }


};

window.addEventListener('load', columner.onLoad, false);
window.addEventListener('keydown', columner.keyDown, false);
window.addEventListener('keyup', columner.keyUp, false);

