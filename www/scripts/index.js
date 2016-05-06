// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
////////////outside functions




//$(document).on("mobileinit", function () {
//    $.mobile.autoInitializePage = false;
//});

var baseUrl = "https://api.courserv.com/ironrock"; //localhost:58633/api/";

document.addEventListener('deviceready', onDeviceReady.bind(this), false);

function onPause() {
    // TODO: This application has been suspended. Save application state here.
};

function onResume() {
    // TODO: This application has been reactivated. Restore application state here.
};


function onDeviceReady() {
    // Handle the Cordova pause and resume events
    document.addEventListener('pause', onPause.bind(this), false);
    document.addEventListener('resume', onResume.bind(this), false);



    //window.location.hash = 'main-page';
    ////// #initialise jQM
    //$.mobile.initializePage();

}

//initialize signature app
$('#page-signature').on('pageshow', function (e, data) {
    if ($('#signature').find('.jSignature').length == 0) {
        $('#signature').jSignature({ 'UndoButton': false, color: "#000000", lineWidth: 1 });
    }
});


//go tp home page
$('[data-role=header]').on('click', '.home', function (event, ui) {
    location.reload();
    //$.mobile.changePage('#main-page');
    //global_vars = default_global_vars;
});


////////Reset Quotation Page////////////////
$(document).on("pagebeforeshow", "#page-quotation", function () { // When entering pagetwo
    $('#quotation').html('');
    $('#get-quotation').show();
    $('#confirmQuotation').hide();

});



$(document).ready(function (e) {
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



    //resetRegularDriver
    /*$('#regularDriver').change(function () {
        var select_value = $(this).val();
        if (select_value == 'no') {
            $('#regularDriversId').show();
        } else if (select_value == 'yes') {
            $('#regularDriversId').hide();
        }
    });*/

    function add_driver($this, id, callback) {
        var $this = $(this),
            theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme,
            msgText = $this.jqmData("msgtext") || $.mobile.loader.prototype.options.text,
            textVisible = $this.jqmData("textvisible") || $.mobile.loader.prototype.options.textVisible,
            textonly = !!$this.jqmData("textonly");
        html = $this.jqmData("html") || "";
        $.mobile.loading("show", {
            text: msgText,
            textVisible: textVisible,
            theme: theme,
            textonly: textonly,
            html: html
        });

        var serverUrl = baseUrl + "/trn/?id=" + id;
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: serverUrl,
            dataType: "json",
            success: function (r) {
                //success handling
                $.mobile.loading("hide");
                var json = JSON.parse(r);
                if (json.error_message) {
                    alert("Invalid ID!!");
                } else if (json.Message) {
                    alert("Invalid ID!!");
                } else {
                    callback(json);
                }
            },
            error: function (data) {
                //error handling
                $.mobile.loading("hide");
                alert("error: " + data.statusText);
            }
        });
    }


    ////create first driver from applicant details
    $(document).one("pagebeforeshow", "#vehicle-driver-details-page", function () {
        if (!$('#regularDriversId').is(":visible") && $('#applicantIDType').val() == 'TRN') {
            $('#regularDriversId').show();
            $('.regularDriversCls:last .name input').val($('#applicantFirstName').val() + ' ' + $('#applicantSurname').val());
            $('.regularDriversCls:last .occupation input').val($('#applicantOccupation').val());
            $('.regularDriversCls:last .DateOfBirth input').val($('#applicantDateOfBirth').val());
            $('.regularDriversCls:last .DriversDL input').val($('#applicantIDNumber').val());
            $('.regularDriversCls:last .DriversDLExpirationDate input').val($('#applicationIDExpirationDate').val());
            $('.regularDriversCls:last .DriversDLOriginalDateOfIssue input').val('2000-06-22');
        }
    });

    //regular driver
    $('#regularDriversBtns').on('click', '.Add', function () {
        var $this = $('#regularDriversBtns .Add');
        var id = $('#regularDriverQueryID').val();
        add_driver($this, id, function (r) {
            $('#regularDriverQueryID').val('');
            var elementGroup = $('.regularDriversCls:last');
            if ($('#regularDriversId').is(':visible')) {
                elementGroup.clone().insertAfter(elementGroup).show().find('input:text').val('');
                resetRegularDriver();
            } else {
                $('#regularDriversId').show();
            }
            $('.regularDriversCls:last .name input').val(r.firstName + ' ' + r.lastName);
            $('.regularDriversCls:last .occupation input').val('');
            $('.regularDriversCls:last .DateOfBirth input').val(r.birthDate.substring(0, 10));
            $('.regularDriversCls:last .DriversDL input').val(id);
            
            $('.regularDriversCls:last .DriversDLExpirationDate input').val('2020-06-22');
            $('.regularDriversCls:last .DriversDLOriginalDateOfIssue input').val('2000-06-22');

        });
    });

    $('#regularDriversBtns').on('click', '.Reset', function () {
        $('.regularDriversCls').not('.regularDriversCls:first').remove();
        $('.regularDriversCls').find('input:text').val('');
        $('#regularDriversId').hide()
        resetRegularDriver();
    });



    ////inexperienced driver
    //$('#inexperiencedDriversBtns').on('click', '.Add', function () {
    //    var $this = $('#inexperiencedDriversBtns .Add');
    //    var id = $('#inexperiencedDriverQueryID').val();
    //    add_driver($this, id, function (r) {
    //        $('#inexperiencedDriverQueryID').val('');
    //        var elementGroup = $('.inexperiencedDriversCls:last');
    //        if ($('#inexperiencedDriversId').is(':visible')) {
    //            elementGroup.clone().insertAfter(elementGroup).show().find('input:text').val('');
    //            resetInexperiencedDriver();
    //        } else {
    //            $('#inexperiencedDriversId').show()
    //        }
    //        $('.inexperiencedDriversCls:last .name input').val(r.firstName + ' ' + r.lastName);
    //        $('.inexperiencedDriversCls:last .occupation input').val('');
    //        $('.inexperiencedDriversCls:last .DateOfBirth input').val(r.birthDate.substring(0, 10));
    //        $('.inexperiencedDriversCls:last .DriversDL input').val(id);
    //        $('.inexperiencedDriversCls:last .DriversDLOriginalDateOfIssue input').val('');

    //    });
    //});

    //$('#inexperiencedDriversBtns').on('click', '.Reset', function () {
    //    $('.inexperiencedDriversCls').not('.inexperiencedDriversCls:first').remove();
    //    $('.inexperiencedDriversCls').find('input:text').val('');
    //    $('#inexperiencedDriversId').hide()
    //    resetInexperiencedDriver();
    //});

    ////Inexperienced Driver
    //$('#InexperiencedDriverBlock input').change(function () {
    //    var isChecked = false;
    //    $('.inexperiencedDriver').each(function (index, element) {
    //        var checked_value = $(element).is(':checked');
    //        if (checked_value) {
    //            isChecked = true;
    //            return true;
    //        }
    //    })
    //    if (isChecked) {
    //        $('#inexperiencedDriversBtns').show();
    //    } else {
    //        $("#inexperiencedDriversBtns .Reset").trigger("click");
    //        //$('#inexperiencedDriversId').hide();
    //    }
    //});


    ////TRN///////
    $('#personal-main-page').on('click', '#getTRNDetails', function () {
        var $this = $(this),
            theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme,
            msgText = $this.jqmData("msgtext") || $.mobile.loader.prototype.options.text,
            textVisible = $this.jqmData("textvisible") || $.mobile.loader.prototype.options.textVisible,
            textonly = !!$this.jqmData("textonly");
        html = $this.jqmData("html") || "";
        $.mobile.loading("show", {
            text: msgText,
            textVisible: textVisible,
            theme: theme,
            textonly: textonly,
            html: html
        });

        var id = $('#applicantTRN').val();
        var serverUrl = baseUrl + "/trn/?id=" + id;
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: serverUrl,
            dataType: "json",
            success: function (r) {
                //success handling
                $.mobile.loading("hide");
                var json = JSON.parse(r);
                if (json.error_message) {
                    alert("Invalid ID!!");
                } else if (json.Message) {
                    alert("Invalid ID!!");
                } else {
                    json.id = id;
                    populateApplicant(json);
                }
            },
            error: function (data) {
                //error handling
                $.mobile.loading("hide");
                alert("error: " + data.statusText);
            }
        });
    });

    $('#personal-main-page').on('click', '#clearTRNDetails', function () {
        SetTRnDetails(false);
        $('#applicantTRNDetails input').val('');
        $('#applicantTRN').val('');
        $('#applicantIDNumber').val('');
        $('#applicationIDExpirationDate').val('');
        $('#applicantHomeStreetName').val('');
    });

    function populateApplicant(r) {
        //id
        $('#applicantIDNumber').val(r.id);
        $('#applicationIDExpirationDate').val('2010-01-01');
        //address
        $('#applicantSurname').val(r.lastName);
        $('#applicantFirstName').val(r.firstName);
        $('#applicantMiddleName').val(r.middleName);
        $('#applicantDateOfBirth').val(r.birthDate.substring(0, 10));
        $('#applicantTitle').val(r.genderType == 'M' ? 'Mr.' : 'Ms.');
        //$('#applicantHomeCountry').val(r.CountryCode.toLowerCase()=='jamaica'?'JM':).trigger("change");
        //        $('#applicantHomeCountry option[value=' + r.CountryCode + ']').prop('selected', 'selected');
        //        $('#applicantHomeParish option[value=' + r.ParishCode + ']').prop('selected', 'selected');
        $('#applicantHomeStreetName').val(r.StreetNo + ' ' + r.StreetName);
        SetTRnDetails(true);
    }

    function SetTRnDetails(state) {
        $("#applicantTRN").attr("readonly", state);
        if (state) {
            $('#getTRNDetails').hide();
            $('#clearTRNDetails').show();
        } else {
            $('#getTRNDetails').show();
            $('#clearTRNDetails').hide();
        }
    }
    ////////////////////////////////////////
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    //clear signature
    $('#page-signature').on('click', '#clear-canvas', function () {
        $('#signature').jSignature('clear');
    });
    /////Final//////////////////////


    $('#page-signature').on('click', '#submit-btn', function () {
        var $this = $(this),
            theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme,
            msgText = $this.jqmData("msgtext") || $.mobile.loader.prototype.options.text,
            textVisible = $this.jqmData("textvisible") || $.mobile.loader.prototype.options.textVisible,
            textonly = !!$this.jqmData("textonly");
        html = $this.jqmData("html") || "";
        $.mobile.loading("show", {
            text: msgText,
            textVisible: textVisible,
            theme: theme,
            textonly: textonly,
            html: html
        });
        //get signature data
        var sig = $('#signature').jSignature("getData", "base30");
        $('#signatureImageType').val(sig[0]);
        $('#signatureBytes').val(sig[1]);
        //serilize form and convert to json
        var formData = $('form').serialize();
        var formData = JSON.stringify($('form').serializeObject());
        var serverUrl = baseUrl + "/Policy/"; // + $('#quotation-number').val();
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: serverUrl,
            dataType: "json",
            data: formData,
            success: function (data) {
                //success handling
                $.mobile.loading("hide");
                alert(data);
            },
            error: function (err) {
                //error handling
                $.mobile.loading("hide");
                alert("error: " + err.statusText);
            }
        });

    });



    ////////Validate and Get Quotation ////////////////
    $('#page-quotation').on('click', '#get-quotation', function () {
        var $this = $(this),
            theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme,
            msgText = $this.jqmData("msgtext") || $.mobile.loader.prototype.options.text,
            textVisible = $this.jqmData("textvisible") || $.mobile.loader.prototype.options.textVisible,
            textonly = !!$this.jqmData("textonly");
        html = $this.jqmData("html") || "";
        $.mobile.loading("show", {
            text: msgText,
            textVisible: textVisible,
            theme: theme,
            textonly: textonly,
            html: html
        });

        //var formData = $('form').serialize();
        var formData = JSON.parse(JSON.stringify($('form').serializeObject()));
        //remove all empty nodes
        $.each(formData, function (key, value) {
            if (value === "" || value === null) {
                delete formData[key];
            }
        });
        //formData = "signatureBytes=&insuranceType=motor&applicantTRN=&applicantSurname=&FirstName=&applicantMiddleName="; // $("form").serialize();
        var serverUrl = baseUrl + "/ironrockquote/";
        var data = JSON.stringify(formData);
        console.log(formData);
        console.log(data);
        $.ajax({
            type: 'post',
            contentType: 'application/json',
            url: serverUrl,
            dataType: 'json',
            data: data,
            success: function (results) {
                //success handling
                $.mobile.loading("hide");
                var r = JSON.parse(results);
                if (!r.success) {
                    console.log(r);
                    alert(r.error_message ? r.error_message : '' + r.Message ? r.Message : '');
                } else {
                    loadQuotation(r);
                    $('#quotation-number').val(r.quotation_number);
                    $('#get-quotation').hide();
                    $('#confirmQuotation').show();
                }
            },
            error: function (err) {
                //error handling
                console.log(err);
                $.mobile.loading("hide");
                alert("error: " + err.statusText);
            }
        });

    });

    /* premium_calculation = new PremiumCalculation
                     {
                         net_premium = 10000,
                         stamp_duty = 1000,
                         tax = 500,
                         total_premium = 11500
                     },
                     quotation_number = 5345435,
                     success = true,*/
    /*  code": "ME_AOE",
              "heading": "Medical Expenses ",
              "limit": 30000,
              "description": "I*/


    function loadQuotation(r) {
        $('#quotation-number').val(r.quotation_number);
        var container = $('#quotation');
        container.append('<h4>Note the Policy Limits</h4>');
        var table = $('<table/>'); //data-role="table" class="ui-responsive"
        table.attr('data-role', "table");
        table.addClass('ui-responsive');
        table.append('<tr><th>Quotation No:</th><td>' + r.quotation_number + '</td></tr>');
        //table.append('<tr><th style="text-align: right;">Net Premium:</th><td style="text-align: right;">' + r.premium_calculation.net_premium + '</td></tr>');
        //table.append('<tr><th style="text-align: right;">Stamp Duty:</th><td style="text-align: right;">' + r.premium_calculation.stamp_duty + '</td></tr>');
        //table.append('<tr><th style="text-align: right;">Tax:</th><td style="text-align: right;">' + r.premium_calculation.tax + '</td></tr>');
        //table.append('<tr><th style="text-align: right;">Total Premium:</th><td style="text-align: right;">' + r.premium_calculation.total_premium + '</td></tr>');
        table.appendTo(container);
        if (r.limits.length > 0) {
            var limitHeader = $('<h4/>').text('Limits');
            limitHeader.appendTo(container);
            var limittable = $('<table/>').attr('data-role', "table").addClass('ui-responsive').html('<tr><th>Code</th><th>Heading</th><th  style="text-align:right">Limit</th><th>Description</th></tr>');

            $.each(r.limits, function (i, item) {
                limittable.append('<tr><td>' + item.code + '</td><td>' + item.heading + '</td><td style="text-align:right">' + accounting.formatMoney(item.limit) + '</td><td>' + item.description + '</td></tr>');
            });
            limittable.appendTo(container);
        }
    }




    //////////////////////////////////Insert vehicle
    $('#taxOfficeVehicleRefresh').click(function () {
        $('#vehiclesToBeInsured .vehicle').remove();
        $('#taxOfficeVehicleRefresh').hide();
    });

    //check whether new
    $('#isNewVehicle').change(function () {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('#taxOfficeVehicleDialog .chassis').hide();
            $('#taxOfficeVehicleDialog .registration').show();
        } else {
            $('#taxOfficeVehicleDialog .chassis').show();
            $('#taxOfficeVehicleDialog .registration').hide();
        }
    });


    //dummy
    $('#taxOfficeVehicleDialog').on("click", "#dummyTaxiVehicle", function () {
        var r = {};

        r.plateNo = "6775HK";
        r.chassisNo = "ksdfsa9873982432kjsdf";
        r.make = "Toyota";
        r.model = "Corolla";
        r.year = "2002";
        r.vehicleBodyType = "Sedan";
        r.vehicleType = "Sedan";
        r.engineNo = "jdfsjdfsjf99034329";
        r.colour = "White";
        r.vehicleStatus = "";
        r.sumInsured = $('#QueryVehicleSumInsured').val();
        insertVehicle(r);
    });


    $('#taxOfficeVehicleDialog').on("click", "#queryTaxiVehicle", function () {
        var $this = $(this),
            theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme,
            msgText = $this.jqmData("msgtext") || $.mobile.loader.prototype.options.text,
            textVisible = $this.jqmData("textvisible") || $.mobile.loader.prototype.options.textVisible,
            textonly = !!$this.jqmData("textonly");
        html = $this.jqmData("html") || "";
        $.mobile.loading("show", {
            text: msgText,
            textVisible: textVisible,
            theme: theme,
            textonly: textonly,
            html: html
        });

        var serverUrl = baseUrl + "/Vehicle/";

        if ($('#isNewVehicle').val() == "yes") {
            serverUrl = serverUrl + '?plateno=' + $('#QueryVehicleRegistrationNo').val(); // = null, string chassisNo
        } else {
            serverUrl = serverUrl + '?chassisno=' + $('#QueryVehicleChassisNo').val(); // = null, string chassisNo
        }

        /*if (!VehicleRegistrationNo) {
            alert("Not valid!");
        } else if (IsDuplicate(VehicleRegistrationNo)) {
            alert('Duplicate!');
        }*/

        if ($('#QueryVehicleSumInsured').val() < 1000) {
            alert('Invalid Sum Insured!');
            $.mobile.loading("hide");
            return;
        }


        $.ajax({
            type: 'GET',
            url: serverUrl,
            dataType: "json",
            success: function (r) {
                $.mobile.loading("hide");
                var json = JSON.parse(r);
                if (json.error_message) {
                    alert("Invalid Chassis/Plate No!!");
                } else if (json.Message) {
                    alert("Invalid Chassis/Plate No!!");
                } else {
                    json.sumInsured = $('#QueryVehicleSumInsured').val();
                    insertVehicle(json);
                }

            },
            error: function (data) {
                //error handling
                $.mobile.loading("hide");
                alert("error: " + data.statusText);
            }
        });


    }).on("click", "#queryTaxiVehicleStop", function () {
        $.mobile.loading("hide");
    });



    //insert vehicle
    function insertVehicle(r) {



        var cnt = $('#vehiclesToBeInsured .vehicle').length;
        var CaptionBaseVehicleRegistrationNo = 'vehicleRegistrationNo';
        var CaptionBaseVehicleChassisNo = 'vehicleChassisNo';
        var CaptionBaseVehicleMake = 'vehicleMake';
        var CaptionBaseVehicleModel = 'vehicleModel';
        var CaptionBaseVehicleYear = 'vehicleYear';
        var CaptionBaseVehicleEngineNo = 'vehicleEngineType';
        var CaptionBaseVehicleBody = 'vehicleBody';
        var CaptionBaseVehicleType = 'vehicleType';
        var CaptionBaseVehicleColour = 'vehicleColour';
        var CaptionBaseVehicleStatus = 'vehicleStatus';
        var CaptionBaseVehicleValue = 'vehicleValue';

       

        var htmlValues = '<span>' + r.plateNo + '</span>' +
            '<input type="hidden" id="' + CaptionBaseVehicleRegistrationNo + cnt + '" name="' + CaptionBaseVehicleRegistrationNo + cnt + '" value="' + r.plateNo + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleChassisNo + cnt + '" name="' + CaptionBaseVehicleChassisNo + cnt + '" value="' + r.chassisNo + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleMake + cnt + '" name="' + CaptionBaseVehicleMake + cnt + '" value="' + r.make + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleModel + cnt + '" name="' + CaptionBaseVehicleModel + cnt + '" value="' + r.model + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleYear + cnt + '" name="' + CaptionBaseVehicleYear + cnt + '" value="' + r.year + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleBody + cnt + '" name="' + CaptionBaseVehicleBody + cnt + '" value="' + r.vehicleBodyType + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleType + cnt + '" name="' + CaptionBaseVehicleType + cnt + '" value="' + r.vehicleType + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleEngineNo + cnt + '" name="' + CaptionBaseVehicleEngineNo + cnt + '" value="' + r.engineNo + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleColour + cnt + '" name="' + CaptionBaseVehicleColour + cnt + '" value="' + r.colour + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleValue + cnt + '" name="' + CaptionBaseVehicleValue + cnt + '" value="' + r.sumInsured + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleStatus + cnt + '" name="' + CaptionBaseVehicleStatus + cnt + '" value="' + r.vehicleStatus + '" />';


        var gridRow = $('<div/>');
        gridRow.addClass('ui-grid-d vehicle').attr('data-id', r.chassisNo);
        var registrationCell = $('<div/>');
        registrationCell.addClass('ui-block-a');
        registrationCell.html(htmlValues);
        registrationCell.appendTo(gridRow);
        //
        var makeModelCell = $('<div/>');
        makeModelCell.addClass('ui-block-b');
        makeModelCell.html(r.make + ' ' + r.model);
        makeModelCell.appendTo(gridRow);
        //
        var detailsCell = $('<div/>');
        detailsCell.addClass('ui-block-c');
        detailsCell.html(r.year + ' ' + r.vehicleBodyType + ' ' + r.colour);
        detailsCell.appendTo(gridRow);
        //            
        var chassisCell = $('<div/>');
        chassisCell.addClass('ui-block-d');
        chassisCell.html(r.chassisNo + '/' + r.engineNo);
        chassisCell.appendTo(gridRow);
        //
        var sumInsuredCell = $('<div/>');
        sumInsuredCell.addClass('ui-block-e');
        sumInsuredCell.html('<input type="text" "style="margin-left:auto; margin-right:0;" value="' + accounting.formatMoney(r.sumInsured) + '" disabled/>');
        sumInsuredCell.appendTo(gridRow);
        //
        if (IsDuplicate(r.chassisNo)) {
            alert('Duplicate!');
        } else {
            gridRow.appendTo($('#vehiclesToBeInsured'));
            $('#taxOfficeVehicleRefresh').show();
            $(':mobile-pagecontainer').pagecontainer('change', '#vehicle-particulars-page');
        }
    }





    //check duplicate
    function IsDuplicate(val) {
        var returnVal = false;
        $('#vehiclesToBeInsured .ui-grid-d').each(function (index, element) {
            var rowVal = $(this).attr('data-id');
            if (rowVal == val) {
                returnVal = true;
                return false;
            }
        });
        return returnVal;
    }

    //return count
    function GetCount() {
        var i = 0;
        $('#vehiclesToBeInsured .ui-grid-d').each(function (index, element) {
            var rowVal = $(this).attr('data-id');
            if (rowVal == val) {
                returnVal = true;
                return false;
            }
        });
        return returnVal;
    }

    //driver Licence 



});