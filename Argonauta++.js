// ==UserScript==
// @name         Argonauta++
// @namespace    http://itsmte/
// @version      0.1
// @description  BMC Remedy Customization
// @author       Raúl Díez Martín
// @match        https://itsmte.tor.telefonica.es/*
// @require http://code.jquery.com/jquery-latest.js
// @run-at       document-end
// @grant        GM_addStyle
// @noframes
// ==/UserScript==

// Variables
var myUser="";
var myINC="";
var myResumen="";
var myGrupoAsignado="";
var myUsuarioAsignado="";
var myEstado="";

// Arrays
var myRegistro="";

//Elements
var myButton = document.createElement("Button");

// Incident registration button
myButton.innerHTML = "+INC";
myButton.style = "top:28px;right:24px;position:absolute;z-index:99999;padding:5px;";
document.body.appendChild(myButton);

myButton.onclick = function(){

    // Get logged  user name
    waitForKeyElements("#label301354000", getUser);
    // Get INC number (ID de la incidencia*+)
    //waitForKeyElements("#label1000000161", getINC);
    getINC();
    // Get ticket title (Resumen*)
    //waitForKeyElements("#WIN_3_1000000000", getResumen);
    getResumen();
    // Get assigned group (Grupo asignado*+)
    // waitForKeyElements("#WIN_3_1000000217", getGrupoAsignado);
    getGrupoAsignado();
    // Get assigned user (Usuario asignado+)
    // waitForKeyElements("#arid_WIN_3_1000000218", getUsuarioAsignado);
    getUsuarioAsignado();
    // Get status (Estado*)
    //waitForKeyElements("#WIN_3_7", getEstado);
    getEstado();

    myRegistro = [myUser, myINC, myResumen, myGrupoAsignado, myEstado];
    window.alert(myRegistro);

};

//////////////////////////////////////////////////////////////////////////////

function getUser(jNode) {
    myUser = jNode.text ().trim ();
    if (myUser) {
        console.log ("Usuario: " + myUser);
    }
    else
        return true; //-- Keep waiting.
}

function getINC(jNode) {
    myINC = document.getElementById("arid_WIN_3_1000000161").value;
    document.getElementById("arid_WIN_3_1000000161").style.color = "green";
    if (myINC) {
        console.log ("Incidencia: " + myINC);

    }
    else
        return true; //-- Keep waiting.
}

function getResumen(jNode) {
    myResumen = document.getElementById("arid_WIN_3_1000000000").value;
    if (myResumen) {
        console.log ("Resumen: " + myResumen);
    }
    else
        return true; //-- Keep waiting.
}

function getGrupoAsignado(jNode) {
    myGrupoAsignado = document.getElementById("arid_WIN_3_1000000217").value;
    if (myGrupoAsignado) {
        console.log ("Grupo Asignado: " + myGrupoAsignado);
    }
    else
        return true; //-- Keep waiting.
}

function getUsuarioAsignado(jNode) {
    myUsuarioAsignado = document.getElementById("arid_WIN_3_1000000218").value;
    if (myUsuarioAsignado) {
        console.log ("Usuario Asignado: " + myUsuarioAsignado);
    }
    else
        return true;  //-- Keep waiting.
}

function getEstado(jNode) {
    myEstado = document.getElementById("arid_WIN_3_7").value;
    if (myEstado) {
        console.log ("Estado: " + myEstado);
    }
    else
        return true; //-- Keep waiting.
}

//////////////////////////
/*Reference link: https://gist.github.com/raw/2625891/waitForKeyElements.js */
/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
selectorTxt,     /* Required: The jQuery selector string that
                        specifies the desired element(s). */

 actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element. */

 bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found. */

 iframeSelector  /* Optional: If set, identifies the iframe to
                        search. */

) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
            .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                waitForKeyElements (    selectorTxt,
                                    actionFunction,
                                    bWaitOnce,
                                    iframeSelector
                                   );
            },
                                       300
                                      );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}
