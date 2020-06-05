// ==UserScript==
// @name         Argonauta++
// @namespace    https://itsmte.tor.telefonica.es
// @version      0.3
// @description  RemedyUI modification
// @author       Raúl Díez Martín (raul.diez-martin@capgemini.com)
// @match        https://itsmte.tor.telefonica.es/arsys/forms/onbmc-s/SHR%3ALandingConsole/Default+Administrator+View/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @require      https://cdn.rawgit.com/zenorocha/clipboard.js/master/dist/clipboard.min.js
// @run-at       document-end
// @grant        GM_addStyle
// @noframes
// ==/UserScript==

// Initial variables declaration
var myUser = "";
var myINC = "";
var myResumen = "";
var myGrupoAsignado = "";
var myUsuarioAsignado = "";
var myEstado = "";
var myComentario = "";
var myRegistro = "";
var myDate = new Date();
var myDateStr = myDate.toLocaleDateString();
var myCurrentView = "";

// Elements
var myButton = document.createElement("Button");

// Incident registration button
myButton.innerHTML = "Copiar INC 📋";
myButton.style = "font-size:15px;bottom:15px;left:15px;position:fixed;z-index:99999;padding:5px;";
document.body.appendChild(myButton);

// Button funcionality
myButton.onclick = function(){

    // Examina la vista actual
    getCurrentView();
    if (myCurrentView == "Página de Inicio de TI"){
        alert("No estás visualizando ninguna incidencia");
    } else {
        // Get logged  user name
        cleanMyVariables();
        // Get current INC type of view
        getLoggedUser();
        // Get INC number (ID de la incidencia*+)
        getINC();
        // Get ticket title (Resumen*)
        getResumen();
        // Get assigned group (Grupo asignado*+)
        getGrupoAsignado();
        // Get assigned user (Usuario asignado+)
        getUsuarioAsignado();
        // Get status (Estado*)
        getEstado();

        // Set the read-to-copy-paste register
        var myRegistro = [myUser, myDateStr, myINC, myResumen, myGrupoAsignado, myEstado, myComentario];
        console.log (myRegistro);

        // Set button to "copied" status
        var self = $(this);
        if (!self.data('add')) {
            self.data('add', true);
            self.text('INC copiada ✔️');
//             self.style.backgroundColor = "#9de398"; # ToDo -> Cambiar color con OK

            // Place myRegister in the clipboard
            var dummy = $('<input>').val(myRegistro).appendTo('body').select()
            document.execCommand('copy')

            // Set button to "ready to copy" status
            setTimeout(function() {
                self.text('Copiar INC 📋').data('add', false);
            }, 3000);
        }
    }
};

////////////////////////////
///      FUNCIONES       ///
////////////////////////////

function cleanMyVariables(){
    myUser = undefined;
    myINC = undefined;
    myResumen = undefined;
    myGrupoAsignado = undefined;
    myUsuarioAsignado = undefined;
    myEstado = undefined;
    myComentario = undefined;
    myRegistro = undefined;
}

function getCurrentView() {
    myCurrentView = $("#label80137").text();
    if (myCurrentView) {
        console.log ("Vista Actual: " + myCurrentView);
    }
}

function getLoggedUser(){
    myUser = $("#label301354000").text();
}

function getINC() {
    myINC = $("#T304261000").text();
    myINC = myINC.substring(9,24);
    if (myINC) {
        console.log ("Incidencia: " + myINC);
    }
}

function getResumen() {
    myResumen = document.querySelector("#T304261000 > tbody > tr.SelPrimary > td:nth-child(2) > nobr > span").textContent;
    if (myResumen) {
        console.log ("Resumen: " + myResumen);
    }
}

function getGrupoAsignado() {
    var checkMyGrupoAsignado = document.querySelector("#T1020 > tbody > tr.SelPrimary > td:nth-child(9) > nobr > span") !== null;
    if (checkMyGrupoAsignado){
        // Vista "Buscar"
        myGrupoAsignado = document.querySelector("#T1020 > tbody > tr.SelPrimary > td:nth-child(9) > nobr > span").innerText;
        console.log ("Grupo Asignado: " + myGrupoAsignado);
    } else {
        // Vista "Incidencia"
        checkMyGrupoAsignado = document.querySelector("#arid_WIN_3_1000000217") !== null;
        if (checkMyGrupoAsignado) {
            myGrupoAsignado = document.querySelector("#arid_WIN_3_1000000217").value;
            console.log ("Grupo Asignado: " + myGrupoAsignado);
        } else {
            // Vista "Incidencia en nueva pestaña"
            myGrupoAsignado = document.querySelector("#arid_WIN_1_1000000217").value;
            console.log ("Grupo Asignado: " + myGrupoAsignado);
        }
    }
}

function getUsuarioAsignado() {
    var checkUsuarioAsignado = document.querySelector("#T1020 > tbody > tr.SelPrimary > td:nth-child(10) > nobr > span") !== null;
    if (checkUsuarioAsignado) {
        // Vista "Buscar"
        myUsuarioAsignado = document.querySelector("#T1020 > tbody > tr.SelPrimary > td:nth-child(10) > nobr > span").innerText;
        console.log ("Usuario Asignado: " + myUsuarioAsignado);
        myComentario = "Técnico Asignado: " + myUsuarioAsignado;
    } else {
        checkUsuarioAsignado = document.querySelector("#arid_WIN_3_1000000218") !== null;
        if (checkUsuarioAsignado) {
            // Vista "Incidencia"
            myUsuarioAsignado = document.querySelector("#arid_WIN_3_1000000218").value;
            console.log ("Usuario Asignado: " + myUsuarioAsignado);
            myComentario = "Técnico Asignado: " + myUsuarioAsignado;
        } else {
            // Vista "Incidencia en nueva pestaña"
            myUsuarioAsignado = document.querySelector("#arid_WIN_1_1000000218").value;
            console.log ("Usuario Asignado: " + myUsuarioAsignado);
            myComentario = "Técnico Asignado: " + myUsuarioAsignado;
        }
    }
}

function getEstado() {
    var checkMyEstado = document.querySelector("#T1020 > tbody > tr.SelPrimary > td:nth-child(8) > nobr > span") !== null;
    if (checkMyEstado){
        // Vista "Buscar"
        myEstado = document.querySelector("#T1020 > tbody > tr.SelPrimary > td:nth-child(8) > nobr > span").innerText;
        console.log ("Estado: " + myEstado);
    } else {
        // Vista "Incidencia"
        checkMyEstado = document.querySelector("#arid_WIN_3_7") !== null;
        if (checkMyEstado) {
            myEstado = document.querySelector("#arid_WIN_3_7").value;
            console.log ("Estado: " + myEstado);
        } else {
            // Vista "Incidencia en nueva pestaña"
            myEstado = document.querySelector("#arid_WIN_1_7").value;
            console.log ("Estado: " + myEstado);
        }
    }
}


////////////////////////////
///     CUSTOMIZACIÓN    ///
////////////////////////////

// Ocultar barra superior inútil
document.querySelector("#WIN_0_303635200").style.display = 'none'; // --> OK

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

var usrText="";
//Get logged in users name
waitForKeyElements("#label301354000", getUser);

function getUser(jNode) {
    usrText = jNode.text ().trim ();
    if (usrText) {
        console.log ("User is " + usrText);
        //Process all rows
        waitForKeyElements("#T301444200 > tbody > tr", setStyle);  //overview console
        waitForKeyElements("#T302087200 > tbody > tr", setStyle);  //incident console
        waitForKeyElements("#T1020 > tbody > tr", setStyle);       //incident search
        document.title = "Argonauta++"
    }
    else
        return true;  //-- Keep waiting.
}

function setStyle (jNode) {
    var reLow = new RegExp(".*Baja.*"+usrText+".*", 'ig');
    var reMed = new RegExp(".*Media.*"+usrText+".*", 'ig');
    var reHigh = new RegExp(".*Alta.*"+usrText+".*", 'ig');
    var reCritical = new RegExp(".*Crítica.*"+usrText+".*", 'ig');

    //remove highlighting selected row
    jNode.removeClass("SelPrimary");
    jNode.click(function(){
        $(this).removeClass("SelPrimary");
    });

    //Process all columns
    jNode.each(function (k, v) {

        if ($(this).text().match(reLow)) {  //Hightlight current signed in user
            $(this).css ("color", "#000000");  // Verde Claro
            //             $(this).find("td").css("background-color", "#aed581");
        }else if($(this).text().match(reMed)){
            $(this).css ("color", "#885201");  // Marrón
            //             $(this).find("td").css("background-color", "#ffb74d");
        }else if($(this).text().match(reHigh)){
            $(this).css ("color", "#ff0303");  // Rojo #ff0303
            //             $(this).find("td").css("background-color", "#e57373");
        }else if($(this).text().match(reCritical)){
            $(this).css ("color", "#ef03ff");  // Fucsia #ef03ff
            //             $(this).find("td").css("background-color", "#d32f2f");
        }else if($(this).text().match("Baja")){  //Hightlight Other users
            $(this).css ("color", "#000000");  //light green 900
            //             $(this).find("td").css("background-color", "#dcedc8");
        }else if($(this).text().match("Media")){
            $(this).css ("color", "#885201");  //orange 900
            //             $(this).find("td").css("background-color", "#ffe0b2");
        }else if($(this).text().match("Alta")){
            $(this).css ("color", "#ff0303");  //red 900
            //             $(this).find("td").css("background-color", "#ffcdd2");
        }else if($(this).text().match("Crítica")){
            $(this).css ("color", "#ef03ff");  //white
            //             $(this).find("td").css("background-color", "#ef5350");
        }
    });
}

GM_addStyle("                                       \
/*hide annoying summary tooltip*/                   \
#artooltip{                                         \
visibility: hidden !important                     \
}                                                   \
/*highlight on mouse hover*/                        \
#T301444200 > tbody > tr:nth-child(n+1):hover td,   \
#T302087200 > tbody > tr:nth-child(n+1):hover td,   \
#T1020 > tbody > tr:nth-child(n+1):hover td{        \
background-color: #c7c7c7 !important;             \
}                                                   \
/*Increase text size in Notes window*/  \
#editor{                                \
font-size: 11px;                      \
}                                       \
");