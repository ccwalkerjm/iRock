$(document).ready(function (e) {
    var baseUrl = "https://api.courserv.com/ironrock"; //localhost:58633/api/";
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
    });

    function populateApplicant(r) {
        //id
        $('#applicantIDNumber').val(r.id);
        $('#applicationIDExpirationDate').val('01/01/2020');
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


        //var formData = JSON.stringify($('form').serializeObject());
        //var params = {
        //    FunctionName: 'ironrockquote', //ironrock-quote',
        //    //ClientContext: 'STRING_VALUE',
        //    InvocationType: 'DryRun', //Event | RequestResponse | DryRun',
        //    LogType: 'Tail',
        //    Payload: formData.toString(), // new Buffer('...') || 'STRING_VALUE',
        //    //Qualifier: 'STRING_VALUE'
        //};
        ////public aws credentials
        //AWS.config.update({
        //    accessKeyId: 'AKIAI6GJQG42AVX3WK2Q',
        //    secretAccessKey: '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'
        //});
        //AWS.config.region = 'us-east-1';
        ////cloud services verifications
        ////var lambda;
        //var lambda = new AWS.Lambda();
        //lambda.invoke(params, function (err, data) {
        //    if (err) {
        //        console.log(err, err.stack); // an error occurred
        //        alert(err.message);
        //    }
        //    else {
        //        console.log(data);           // successful response
        //        $.mobile.loading("hide");
        //        $('#get-quotation').hide();
        //        $('#confirmQuotation').show();
        //        if (data.success == true) {
        //            loadQuotation(r);
        //        } else {
        //            alert(data.error_message);
        //        }
        //    }
        //});

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
                if (r.error_message || r.Message) {
                    console.log(r);
                    alert(r.error_message ? r.error_message : '' + r.Message ? r.Message : '');
                } else {
                    loadQuotation(r);
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

    //driver Licence 






});