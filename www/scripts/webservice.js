$(document).ready(function (e) {
    var baseUrl = "http://10.0.1.5/api/"; //localhost:58633/api/";
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
        var serverUrl = baseUrl + "TRN/" + $('#applicantTRN').val();
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: serverUrl,
            dataType: "json",
            success: function (r) {
                //success handling
                $.mobile.loading("hide");
                populateApplicant(r);
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
        $('#applicantTRN').val('');
        $('#applicantSurname').val('');
        $('#applicantFirstName').val('');
        $('#applicantMiddleName').val('');
    });

    function populateApplicant(r) {
        $('#applicantSurname').val(r.lastName);
        $('#applicantFirstName').val(r.firstName);
        $('#applicantMiddleName').val(r.middleName);
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


    ////////Reset Quotation Page////////////////
    $(document).on("pagebeforeshow", "#page-quotation", function () { // When entering pagetwo
        $('#quotation').html('');
        $('#get-quotation').show();
        $('#confirmQuotation').hide();

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
        //var sig = sigCapture.toString();
        //$('#signatureBytes').val(sig);
        //var formData = $('form').serialize();
        //var formData = JSON.stringify($('form').serializeObject());
        var serverUrl = baseUrl + "Policy/" + $('#quotation-number').val();
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: serverUrl,
            dataType: "json",
            data: formData,
            success: function (data) {
                //success handling
                $.mobile.loading("hide");
            },
            error: function (data) {
                //error handling
                $.mobile.loading("hide");
                alert("error: " + data.statusText);
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


        var formData = JSON.stringify($('form').serializeObject());
        var serverUrl = baseUrl + "Quotation/";
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: serverUrl,
            dataType: "json",
            data: formData,
            success: function (r) {
                //success handling
                $.mobile.loading("hide");
                $('#get-quotation').hide();
                $('#confirmQuotation').show();
                if (r.success == true) {
                    loadQuotation(r);
                } else {
                    alert(r.error_message);
                }


            },
            error: function (data) {
                //error handling
                $.mobile.loading("hide");
                alert("error: " + data.statusText);
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


    function loadQuotation(r) {
        $('#quotation-number').val(r.quotation_number);
        var container = $('#quotation');
        container.append('<h4>Quotation</h4>');
        var table = $('<table/>'); //data-role="table" class="ui-responsive"
        table.attr('data-role', "table");
        table.addClass('ui-responsive');
        table.append('<tr><th>Quotation No:</th><td>' + r.quotation_number + '</td></tr>');
        table.append('<tr><th style="text-align: right;">Net Premium:</th><td style="text-align: right;">' + r.premium_calculation.net_premium + '</td></tr>');
        table.append('<tr><th style="text-align: right;">Stamp Duty:</th><td style="text-align: right;">' + r.premium_calculation.stamp_duty + '</td></tr>');
        table.append('<tr><th style="text-align: right;">Tax:</th><td style="text-align: right;">' + r.premium_calculation.tax + '</td></tr>');
        table.append('<tr><th style="text-align: right;">Total Premium:</th><td style="text-align: right;">' + r.premium_calculation.total_premium + '</td></tr>');
        table.appendTo(container);
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

        var serverUrl = baseUrl + "/FslVehicle/";

        if ($('#isNewVehicle').val() == "yes") {
            serverUrl = serverUrl + '?plateNo=' + $('#QueryVehicleRegistrationNo').val(); // = null, string chassisNo
        } else {
            serverUrl = serverUrl + '?chassisNo=' + $('#QueryVehicleChassisNo').val(); // = null, string chassisNo
        }

        /*if (!VehicleRegistrationNo) {
            alert("Not valid!");
        } else if (IsDuplicate(VehicleRegistrationNo)) {
            alert('Duplicate!');
        }*/


        $.ajax({
            type: 'GET',
            url: serverUrl,
            dataType: "json",
            success: function (r) {
                $.mobile.loading("hide");
                insertVehicle(r);
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
        var CaptionBaseVehicleCCRating = 'vehicleCCRating';
        var CaptionBaseVehicleValue = 'vehicleValue';



        var htmlValues = '<span>' + r.plateNo + '</span>' +
            '<input type="hidden" id="' + CaptionBaseVehicleRegistrationNo + cnt + '" name="' + CaptionBaseVehicleRegistrationNo + cnt + '" value="' + r.plateNo + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleChassisNo + cnt + '" name="' + CaptionBaseVehicleChassisNo + cnt + '" value="' + r.chassisNo + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleMake + cnt + '" name="' + CaptionBaseVehicleMake + cnt + '" value="' + r.make + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleModel + cnt + '" name="' + CaptionBaseVehicleModel + cnt + '" value="' + r.model + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleYear + cnt + '" name="' + CaptionBaseVehicleYear + cnt + '" value="' + r.year + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleCCRating + cnt + '" name="' + CaptionBaseVehicleCCRating + cnt + '" value="' + r.CCRating + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleEngineNo + cnt + '" name="' + CaptionBaseVehicleEngineNo + cnt + '" value="' + r.engineNo + '" />'

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
        var yearCell = $('<div/>');
        yearCell.addClass('ui-block-c');
        yearCell.html(r.year);
        yearCell.appendTo(gridRow);
        //

        //CCRating
        var CCRatingCell = $('<div/>');
        CCRatingCell.addClass('ui-block-d');
        CCRatingCell.html(r.CCRating);
        CCRatingCell.appendTo(gridRow);
        //
        var sumInsuredCell = $('<div/>');
        sumInsuredCell.addClass('ui-block-e');
        sumInsuredCell.html('<input  data-mini="true" data-clear-btn="true" type="number" id="' + CaptionBaseVehicleValue + cnt + '" name="' + CaptionBaseVehicleValue + cnt + '" value="" />');
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






});