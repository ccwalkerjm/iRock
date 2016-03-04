﻿// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.

var sigCapture = null;

$(document).ready(function (e) {
    sigCapture = new SignatureCapture("signature");

    $(':mobile-pagecontainer').pagecontainer('change', '#main-page');

    $('#submit-btn').click(function () {
        var sig = sigCapture.toString();
        alert(sig);

    });

});


document.addEventListener('deviceready', onDeviceReady.bind(this), false);

function onDeviceReady() {
    // Handle the Cordova pause and resume events
    document.addEventListener('pause', onPause.bind(this), false);
    document.addEventListener('resume', onResume.bind(this), false);
       
};

function onPause() {
    // TODO: This application has been suspended. Save application state here.
};

function onResume() {
    // TODO: This application has been reactivated. Restore application state here.
};