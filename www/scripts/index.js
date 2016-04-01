// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
////////////outside functions


////stop default initialization
//$(document).on("mobileinit", function () {
//    $.mobile.autoInitializePage = false;
//});

//$(document).one("pagebeforeshow", "#page-signature", function () {
//    $(':mobile-pagecontainer').pagecontainer('change', '#main-page');
//});

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




var sigCapture = null;

$(document).ready(function (e) {
    //window.location.hash = 'main-page';
    //// #initialise jQM
    //$.mobile.initializePage();
           
    $('form').validate({
        rules: {
            applicantSurname: {
                required: true
            },
            applicantFirstName: {
                required: true
            },
            applicantIDNumber: {
                required: true
            }
        },
        messages: {
            applicantSurname: {
                required: "Please enter your surname."
            },
            applicantFirstName: {
                required: "Please enter your first name."
            },
            applicantIDNumber: {
                required: "Please enter your ID Number."
            }
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parent().prev());
        },
        submitHandler: function (form) {
            $(':mobile-pagecontainer').pagecontainer('change', '#success', {
                reload: false
            });
            return false;
        }
    });

    //sigCapture = new SignatureCapture("signature");

    //$('#submit-btn').click(function () {
    //    var sig = sigCapture.toString();
    //    $('#signatureBytes').val(sig);
    //    var data = $('form').serialize();
    //    alert(data);
    //});

    //$('#clear-canvas').click(function () {
    //    var sig = sigCapture.clear();
    //});

    //applicantRelativeInPublicOffice
    $('#applicantRelativeInPublicOffice').change(function () {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('#publicofficerelation').show();
        }
        else if (select_value == 'no') {
            $('#publicofficerelation').hide();
        }
    });

    $('#publicofficerelation').on('click', '.applicantRelativeInPublicOfficeAdd', function () {
        var elementGroup = $(this).parent().parent().parent();
        elementGroup.clone().insertAfter(elementGroup).show().find('input:text').val('');
        resetApplicantRelativeInPublicOffice();
    });

    $('#publicofficerelation').on('click', '.applicantRelativeInPublicOfficeDelete', function () {
        var elementGroup = $(this).parent().parent().parent();
        elementGroup.remove();
        resetApplicantRelativeInPublicOffice();
    });

    function resetApplicantRelativeInPublicOffice() {
        var Office = "applicantRelativeTypePublicOffice";
        var Address = "applicantRelativeTypePublicAddress";
        var Relation = "applicantRelativeTypePublicRelation";
        var OfficeName = "applicantRelativeInPublicOfficeName";

        var elementClass = $('.publicofficerelations');
        var firstElement = elementClass.first();
        var lastElement = elementClass.last();
        var i = 0;

        elementClass.each(function (index, e) {
            var element = $(this);
            //change ids and names
            element.find(".office input").attr('id', Office + i).attr('name', Office + i);
            element.find(".office label").attr('for', Office + i);
            element.find(".address input").attr('id', Address + i).attr('name', Address + i);
            element.find(".address label").attr('for', Address + i);
            element.find(".name input").attr('id', OfficeName + i).attr('name', OfficeName + i);
            element.find(".name label").attr('for', OfficeName + i);
            element.find(".relation input").attr('id', Relation + i).attr('name', Relation + i);
            element.find(".relation label").attr('for', Relation + i);

            //set controls
            if (element.is(firstElement) && element.is(lastElement)) {
                firstElement.find(".applicantRelativeInPublicOfficeDelete").hide();
                lastElement.find(".applicantRelativeInPublicOfficeAdd").show();
            }
            else if (element.is(firstElement)) {
                element.find(".applicantRelativeInPublicOfficeDelete").hide();
                element.find(".applicantRelativeInPublicOfficeAdd").hide();
            } else if (element.is(lastElement)) {
                element.find(".applicantRelativeInPublicOfficeDelete").show();
                element.find(".applicantRelativeInPublicOfficeAdd").show();
            }
            else {
                element.find(".applicantRelativeInPublicOfficeDelete").hide();
                element.find(".applicantRelativeInPublicOfficeAdd").hide();
            }
            //change title
            element.find('h4').text('Relative ' + ++i);
        });
    }


    //vehicle to be insured
    $('#isOwnerOfVehicle').change(function () {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('#vehicleNameAddressOfOwner').show();
        }
        else if (select_value == 'no') {
            $('#vehicleNameAddressOfOwner').hide();
        }
    });

    $('#vehicleToBeInsuredCtrl').on('click', '.Add', function () {
        var elementGroup = $(this).parent().parent().parent();
        elementGroup.clone().insertAfter(elementGroup).show().find('input:text').val('');
        resetVehiclesToBeInsured();
    });

    $('#vehicleToBeInsuredCtrl').on('click', '.Delete', function () {
        var elementGroup = $(this).parent().parent().parent();
        elementGroup.remove();
        resetVehiclesToBeInsured();
    });

    function resetVehiclesToBeInsured() {
        var registration = "vehicleRegistrationNo";
        var make = "vehicleMake";
        var model = "vehicleModel";
        var engine = "vehicleEngineNo";
        var chassis = "vehicleChassisNo";

        var year = "vehicleYearOfMake";
        var rating = "vehicleCcRating";

        var seating = "vehicleSeating";
        var body = "vehicleTypeOfBody";

        var insured = "vehicleSumInsured";
        var trailer = "vehicleTrailerUsed";



        var elementClass = $('.vehicleToBeInsured');
        var firstElement = elementClass.first();
        var lastElement = elementClass.last();
        var i = 0;
        elementClass.each(function (index, e) {
            var element = $(this);
            //change ids and names
            element.find(".year input").attr('id', year + i).attr('name', year + i);
            element.find(".year label").attr('for', year + i);

            element.find(".rating input").attr('id', rating + i).attr('name', rating + i);
            element.find(".rating label").attr('for', rating + i);

            element.find(".seating input").attr('id', seating + i).attr('name', seating + i);
            element.find(".seating label").attr('for', seating + i);

            element.find(".body input").attr('id', body + i).attr('name', body + i);
            element.find(".body label").attr('for', body + i);

            element.find(".insured input").attr('id', insured + i).attr('name', insured + i);
            element.find(".insured label").attr('for', insured + i);

            element.find(".trailer input").attr('id', trailer + i).attr('name', trailer + i);
            element.find(".trailer label").attr('for', trailer + i);

            element.find(".registration input").attr('id', registration + i).attr('name', registration + i);
            element.find(".registration label").attr('for', registration + i);

            element.find(".make input").attr('id', make + i).attr('name', make + i);
            element.find(".make label").attr('for', make + i);

            element.find(".model input").attr('id', model + i).attr('name', model + i);
            element.find(".model label").attr('for', model + i);

            element.find(".engine input").attr('id', engine + i).attr('name', engine + i);
            element.find(".engine label").attr('for', engine + i);

            element.find(".chassis input").attr('id', chassis + i).attr('name', chassis + i);
            element.find(".chassis label").attr('for', chassis + i);

            //set controls
            if (element.is(firstElement) && element.is(lastElement)) {
                firstElement.find(".Delete").hide();
                lastElement.find(".Add").show();
            }
            else if (element.is(firstElement)) {
                element.find(".Delete").hide();
                element.find(".Add").hide();
            } else if (element.is(lastElement)) {
                element.find(".Delete").show();
                element.find(".Add").show();
            }
            else {
                element.find(".Delete").hide();
                element.find(".Add").hide();
            }
            //change title
            element.find('h4').text('Vehicle ' + ++i);
        });
    }

    $('#menu-vehicle').click(function () {
        setmenu(getVehicleMenu(), "Vehicle Insurance");
        SetPageHeaderFooter(getVehicleMenu());
        $.mobile.changePage($("#personal-main-page"), "none");
    });

    $('#menu-property').click(function () {
        setmenu(getPropertyMenu(), "Property Insurance");
        SetPageHeaderFooter(getPropertyMenu());
        $.mobile.changePage($("#personal-main-page"), "none");
    });

    function getAllMenu() {
        return [
           // { "name": "Start Page", "value": "main-page" },
            { "name": "Personal Details", "value": "personal-main-page" },
            { "name": "Contact Details", "value": "personal-contact-page" },
            { "name": "Home Address", "value": "personal-home-address-page" },
            { "name": "Mailing Address", "value": "personal-mailing-address-page" },
            { "name": "Employer Details", "value": "personal-employer-details-page" },
            { "name": "Public Office Association", "value": "personal-relative-public-office-page" },
            { "name": "Vehicle Particulars", "value": "vehicle-particulars-page" },
            { "name": "Vehicle Mortgagee Details", "value": "vehicle-mortgagee-details-page" },
            { "name": "Vehicle Particular Con't", "value": "vehicle-particular-continued" },
            { "name": "Other Drivers", "value": "vehicle-other-drivers-page" },
            { "name": "Driver Details", "value": "vehicle-driver-details-page" },
            { "name": "Vehicles Owner", "value": "vehicles-owned-page" },
            { "name": "Accidents", "value": "vehicle-accidents-page" },
            { "name": "Medical History", "value": "vehicle-medical-history-page" },
            { "name": "Home Particulars", "value": "home-particulars-page" },
            { "name": "Home Particulars Con't", "value": "home-particulars-continued-page" },
            { "name": "Home Property Details", "value": "home-property-details-page" },
            { "name": "All Risk Insurance", "value": "home-all-risk-insurance-page" },
            { "name": "Signature", "value": "page-signature" }
        ];
    }

    function getVehicleMenu() {
        return [
           // { "name": "Start Page", "value": "main-page" },
            { "name": "Personal Details", "value": "personal-main-page" },
            { "name": "Contact Details", "value": "personal-contact-page" },
            { "name": "Home Address", "value": "personal-home-address-page" },
            { "name": "Mailing Address", "value": "personal-mailing-address-page" },
            { "name": "Employer Details", "value": "personal-employer-details-page" },
            { "name": "Public Office Association", "value": "personal-relative-public-office-page" },
            { "name": "Vehicle Particulars", "value": "vehicle-particulars-page" },
            { "name": "Vehicle Mortgagee Details", "value": "vehicle-mortgagee-details-page" },
            { "name": "Vehicle Particular Con't", "value": "vehicle-particular-continued" },
            { "name": "Other Drivers", "value": "vehicle-other-drivers-page" },
            { "name": "Driver Details", "value": "vehicle-driver-details-page" },
            { "name": "Vehicles Owner", "value": "vehicles-owned-page" },
            { "name": "Accidents", "value": "vehicle-accidents-page" },
            { "name": "Medical History", "value": "vehicle-medical-history-page" },
            { "name": "Signature", "value": "page-signature" }
        ];
    }


    function getPropertyMenu() {
        return [
           // { "name": "Start Page", "value": "main-page" },
            { "name": "Personal Details", "value": "personal-main-page" },
            { "name": "Contact Details", "value": "personal-contact-page" },
            { "name": "Home Address", "value": "personal-home-address-page" },
            { "name": "Mailing Address", "value": "personal-mailing-address-page" },
            { "name": "Employer Details", "value": "personal-employer-details-page" },
            { "name": "Public Office Association", "value": "personal-relative-public-office-page" },
            { "name": "Home Particulars", "value": "home-particulars-page" },
            { "name": "Home Particulars Con't", "value": "home-particulars-continued-page" },
            { "name": "Home Property Details", "value": "home-property-details-page" },
            { "name": "All Risk Insurance", "value": "home-all-risk-insurance-page" },
            { "name": "Signature", "value": "page-signature" }
        ];
    }


    function SetPageHeaderFooter(menu_list) {
        // <a href="#main-page" class="ui-btn ui-btn-left ui-btn-corner-all ui-icon-arrow-l ui-btn-icon-notext" rel="prev">Home</a>
        //<a href="#personal-contact-page" class="ui-btn ui-btn-right ui-btn-corner-all ui-icon-arrow-r ui-btn-icon-notext" rel="next">Next</a>       
        for (var i = 0; i < menu_list.length; i++) {
            var currentPage = $('#' + menu_list[i].value);
            currentPage.find("[data-role=header]").find("h1").text(menu_list[i].name);
            var prevI = i - 1;
            var nextI = i + 1;
            if (i > 0) {
                //insert previous link               
                var prevLink = '<a href="#' + menu_list[prevI].value + '" class="ui-btn ui-btn-left ui-btn-corner-all ui-icon-arrow-l ui-btn-icon-notext" rel="prev">Home</a>';
                currentPage.find('[data-role=footer]').append(prevLink);
            }
            if (i < menu_list.length - 1) {
                //insert next link
                var nextLink = '<a href="#' + menu_list[nextI].value + '" class="ui-btn ui-btn-right ui-btn-corner-all ui-icon-arrow-r ui-btn-icon-notext" rel="next">Next</a>';
                currentPage.find('[data-role=footer]').append(nextLink);
            }
        }
    }


    function setmenu(menu_list, menu_header) {
        var panelItems = "";
        $.each(menu_list, function (key, item) {
            panelItems = panelItems + '<li><a href="#' + item.value + '">' + item.name + '</a></li>';
        });
        var p = 1;
        var last_page_dom = $("#" + menu_list[menu_list.length - 1].value).get(0);
        $.each(menu_list, function (key, item) {
            var currentPage = $('#' + item.value);
            var current_page_dom = currentPage.get(0);
            if (currentPage.find('[data-role=panel]').length == 0 && last_page_dom != current_page_dom) {
                var panel = '<div data-role="panel" data-mini="true" class="menu" id="panel' + p + '" data-dismissible="true" data-swipe-close="true" data-position="right">';
                panel = panel + '<h2>' + menu_header + '</h2><ol data-role="listview" data-inset="true" data-mini="true">' + panelItems + '</ol></div>';
                currentPage.prepend(panel);
                var panelBtn = '<a href="#panel' + p + '" class="ui-btn ui-btn-right ui-btn-corner-all ui-icon-bars ui-btn-icon-notext" rel="search">Menu</a>'
                currentPage.find('[data-role=header]').append(panelBtn);
            }
            p++;
        });
    }


    //validate function
   

});
