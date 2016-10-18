var _IronRockPreliminaryData = "PreliminaryData";
var g_ironrock_service; //AWS services
var g_profile;

var g_signatureChangeCount = 0; //signature based data;

$(document).ready(function(e) {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    } else {
        onDeviceReady();
    }
});

function onPause() {
    // TODO: This application has been suspended. Save application state here.
}

function onResume() {
    // TODO: This application has been reactivated. Restore application state here.
}

function onBack() {
    navigator.app.exitApp();
}


function onDeviceReady() {
    // Handle the Cordova pause and resume events
    document.addEventListener('pause', onPause.bind(this), false);
    document.addEventListener('resume', onResume.bind(this), false);
    document.addEventListener('backbutton', onBack.bind(this), false);
    /////////loading
    //setPrimaryEvents();
    //special events
    //$(':mobile-pagecontainer').pagecontainer('change', '#main-page');
    ////
    loadingSpinner(true, $('#main-page'));

    g_ironrock_service = new ironrockcloudservice(ENVIRONMENT_TYPE_PRODUCTION, function(err, $this) {
        if (err) {
            loadingSpinner();
            g_ironrock_service.signoff();
            ///show login page
            $('#main-page-login').hide();
            $('#main-page-selection').hide();
            alert("Network/System Error Detected! Please reboot!");
            return;
        }
        setPrimaryEvents();
        if ($this.getUsername()) {
            //login
            setUserProfile($this);
        } else {
            //not login
            setBrokerLogo();
            $('#main-page-login').show();
            $('#main-page-selection').hide();
            loadingSpinner();
        }
    });
}

function setBrokerLogo(imgData) {
    if (imgData) {
        $('#brokerLogo').attr('src', imgData);
        $('#ironrockLogo').show();
        $('#PoweredBy').text('Powered By');
    } else {
        $('#brokerLogo').attr('src', 'images/IronRockLogo.png');
        $('#ironrockLogo').hide();
        $('#PoweredBy').text('');
    }
}

//set when user is logged in
function setUserProfile(obj) {
    obj = obj || g_ironrock_service;
    g_profile = obj.getProfile(); //data;
    if (g_profile && g_profile.brokerDetails && g_profile.brokerDetails.logo) {
        setBrokerLogo(g_profile.brokerDetails.logo);
    } else {
        setBrokerLogo();
    }
    //load miscellaneous items
    loadOptions(obj, function(err) {
        if (err) {
            obj.signoff();
            $('#main-page-login').show();
            $('#main-page-selection').hide();
            loadingSpinner();
            alert("Network/System Error Detected! Please Try Again!");
        } else {
            $('#main-page-login').hide();
            $('#main-page-selection').show();
            ////
            //setVehicleUsedAs();
            //vehicle-all-accidents
            setAllAccidentsYears();
            //validate function
            loadCountriesOptions();
            loadParishes();
            //set Last Three Years of Ownership()
            setLastThreeYearsOwnership();

            setTown('employerParish', $('#employerParish').val());
            setTown('applicantHomeParish', $('#applicantHomeParish').val());
            setTown('applicantMailParish', $('#applicantMailParish').val());
            if (insuranceType != "motor")
                setTown('homeRiskAddressParish', $('#homeRiskAddressParish').val());
            ////
            setSpecialEvents();
            loadingSpinner();
        }
    });
}


//$(document).ready(function (e) {
function setPrimaryEvents(callback) {

    $('#main-page').on('click', '#login-submit', function() {
        //set loading
        loadingSpinner(true, $(this));


        var username = $('#main-page #username').val();
        var password = $('#main-page #password').val();

        g_ironrock_service.signin(username, password, function(err, $this) {
            if (err) {
                loadingSpinner();
                alert(err.message);
            } else {
                setUserProfile($this);
                //location.reload();
            }
        });
    });


    ////create first driver from applicant details
    $(document).one("pagebeforeshow", "#vehicle-driver-details-page", function() {
        if (!$('#regularDriversId').is(":visible")) {
            //var occupation = $('#applicantOccupation').val();
            var occupationIndex = $("#applicantOccupation option:selected").index();
            var elel = $('.regularDriversCls:last .occupation select');
            elel.eq(occupationIndex).prop('selected', true);

            $('#regularDriversId').show();
            $('.regularDriversCls:last .name input').val($('#applicantFirstName').val() + ' ' + $('#applicantSurname').val());
            //$('.regularDriversCls:last .occupation select').val(occupation);
            //$('#regularDriversOccupation0').val(occupation);
            $('.regularDriversCls:last .DateOfBirth input').val($('#applicantDateOfBirth').val());
            $('.regularDriversCls:last .DriversDL input').val($('#applicantIDNumber').val());
            $('.regularDriversCls:last .DriversDLExpirationDate input').val($('#applicationIDExpirationDate').val());
            $('.regularDriversCls:last .DriversDLOriginalDateOfIssue input').val($('#dateFirstIssued').val());
        }
    });

    //regular driver
    $('#regularDriversBtns').on('click', '.Add', function() {
        var $this = $('#regularDriversBtns .Add');
        var id = $('#regularDriverQueryID').val();
        addDriver($this, id, function(err, r) {
            if (err) {
                alert("error: " + err.message);
            }
            if (!err) {
                $('#regularDriverQueryID').val('');
                var elementGroup = $('.regularDriversCls:last');
                if ($('#regularDriversId').is(':visible')) {
                    cloneElement(elementGroup);
                    resetRegularDriver();
                } else {
                    $('#regularDriversId').show();
                }
                $('.regularDriversCls:last .name input').val(r.firstName + ' ' + r.lastName);
                $('.regularDriversCls:last .occupation input').val('');
                $('.regularDriversCls:last .DateOfBirth input').val(r.dateOfBirth.substring(0, 10));
                $('.regularDriversCls:last .DriversDL input').val(id);

                $('.regularDriversCls:last .DriversDLExpirationDate input').val(r.expiryDate);
                $('.regularDriversCls:last .DriversDLOriginalDateOfIssue input').val(r.dateFirstIssued);
            }
        });
    });

    $('#regularDriversId').on('click', '.Delete', function() {
        var elementGroup = $(this).closest('.regularDriversCls');
        var allElements = $('#regularDriversId').find('.regularDriversCls');
        if (allElements.length == 1) {
            elementGroup.find('input:text').val('');
            $('#regularDriversId').hide();
        } else {
            elementGroup.remove();
            resetRegularDriver();
        }
    });

    ///
    ///////
    $('#personal-main-page').on('click', '#getTRNDetails', function() {
        loadingSpinner(true, $(this));

        var id = $('#applicantTRN').val();
        g_ironrock_service.getDriverLicenseDetails(id, function(err, r) {
            if (err) {
                loadingSpinner();
                callback(err);
            } else {
                //success handling
                loadingSpinner();
                //var json = JSON.parse(r);
                r = ConvertToJson(r);
                if (r.error_message) {
                    alert("Invalid ID!!");
                } else if (r.Message) {
                    alert("Invalid ID!!");
                } else {
                    r.id = id;
                    populateApplicant(r);
                }
            }
        });

    });

    $('#personal-main-page').on('click', '#clearTRNDetails', function() {
        SetTRnDetails(false);
        var imageSrc = "images/dummy.jpg";
        $('#applicantPhoto').attr('src', imageSrc); //
        $('#applicantTRNDetails input').val('');
        $('#applicantTRN').val('');
        $('#applicantIDNumber').val('');
        $('#dateFirstIssued').val('');
        $('#applicationIDExpirationDate').val('');
        $('#applicantHomeStreetName').val('');
    });

    //clear signature
    $('#page-signature').on('click', '#clear-canvas', function() {
        $('#signature').jSignature('clear');
        g_signatureChangeCount = 0;
    });


    /////Final//////////////////////
    $('#page-signature').on('click', '#submit-btn', function() {
        //add signature to form
        var sig = $('#signature').jSignature("getData", "svgbase64"); // jSignature("getData", "base30");
        if (g_signatureChangeCount === 0) {
            alert('Please Enter Signature..');
            return;
        }
        $('#signatureImageType').val(sig[0]);
        $('#signatureBytes').val(sig[1]);

        //test
        console.log("signature count: " + g_signatureChangeCount);
        ///image source is src = "data:" + sig[0] + "," + sig[1]
        //serilize form and convert to r
        //var formData = $('form').serialize();
        var formData = JSON.stringify($('form').serializeObject());

        //var formData = JSON.stringify(formData);
        //console.log(formData);
        loadingSpinner(true, $(this));
        g_ironrock_service.submitQuote(formData, function(err, r) {
            loadingSpinner();
            if (err) {
                alert("error: " + err.message);
                return;
            }

            //var r = JSON.parse(data);
            r = ConvertToJson(r);
            if (!r.success) {
                console.log(r);
                alert(r.error_message ? r.error_message : '' + r.Message ? r.Message : '');
            } else {
                loadQuotation(r);
                $('#page-signature').find('[data-role=footer] a').hide();
                $('#clear-canvas').hide();
                $('#submit-btn').hide();
            }
        });

    });


    //////////////////////////////////Insert vehicle
    $('#taxOfficeVehicleDelete').click(function() {
        $(this).nearest('.vehicle').remove();
        reIndexVehicles(CaptionBaseVehicleValue);
    });

    //check whether new
    $('#isNewVehicle').change(function() {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('#taxOfficeVehicleDialog .chassis').hide();
            $('#taxOfficeVehicleDialog .registration').show();
        } else {
            $('#taxOfficeVehicleDialog .chassis').show();
            $('#taxOfficeVehicleDialog .registration').hide();
        }
    });

    $(document).on("pagebeforeshow", "#taxOfficeVehicleDialog", function() {
        $('#queryVehicleAdd').hide();
        $('#queryVehicleSearch').show();
        $('#taxOfficeQueryManualEntry').hide();
        $('#QueryVehicleRegistrationNo').val('');
        $('#QueryVehicleChassisNo').val('');
        $('#QueryVehicleYear').val('');
        //r.vehicleType = "Sedan";
        $('#QueryVehicleEngineNo').val('');
        //$('#QueryVehicleColour').val('');
        $('#QueryVehicleSumInsured').val('');
    });


    $('#QueryVehicleMake').change(function() {
        loadVehicleModels();
    });


    //manual entry
    $('#taxOfficeVehicleDialog').on("click", "#queryVehicleAdd", function() {
        var r = {};

        r.plateNo = $('#QueryVehicleRegistrationNo').val();
        r.chassisNo = $('#QueryVehicleChassisNo').val();
        r.make = $('#QueryVehicleMake').val();
        r.model = $('#QueryVehicleModel').val();
        r.year = $('#QueryVehicleYear').val();
        r.vehicleBodyType = $('#QueryVehicleBodyType').val();
        //r.vehicleType = "Sedan";
        r.engineNo = $('#QueryVehicleEngineNo').val();
        r.colour = $('#QueryVehicleColour').val();
        r.vehicleStatus = "";
        r.sumInsured = $('#QueryVehicleSumInsured').val();

        if (r.sumInsured < 1000) {
            alert('Invalid Sum Insured!');
            return;
        }

        if (!r.chassisNo || !r.engineNo) {
            alert('Invalid Entries!');
            return;
        }

        var mostRecentYear = new Date().getFullYear() + 1;
        if (r.year > mostRecentYear || r.year < mostRecentYear - 100) {
            alert('Invalid Year!');
            return;
        }
        insertVehicle(r);
    });


    $('#taxOfficeVehicleDialog').on("click", "#queryVehicleSearch", function() {
        var plateno = $('#QueryVehicleRegistrationNo').val().replace(/ /g, '').toUpperCase();
        var chassisno = $('#QueryVehicleChassisNo').val();

        //validate first
        if (plateno === null && chassisno === null) {
            alert("Registration No and Chassis No cannot be blank");
            return;
        }

        if ($('#QueryVehicleSumInsured').val() < 1000) {
            alert('Invalid Sum Insured!');
            return;
        }
        //set loading
        loadingSpinner(true, $(this));
        //use lambda to get vehcile details
        g_ironrock_service.getVehicleDetails(plateno, chassisno, function(err, data) {
            loadingSpinner();
            if (err) {
                alert("Err:" + err.message);
            } else {
                //var json = JSON.parse(r);
                r = ConvertToJson(data);
                if (r.error_message || r.Message) {
                    if (confirm("Chassis/Plate Number Not Found! Press OK to enter the details manually?")) {
                        $('#queryVehicleAdd').show();
                        $('#queryVehicleSearch').hide();
                        $('#taxOfficeQueryManualEntry').show();
                        loadVehicleMakes();
                        loadVehicleModels();
                        loadBodyTypes();
                        loadColours();
                    }
                } else {
                    r.sumInsured = $('#QueryVehicleSumInsured').val();
                    insertVehicle(r);
                    $(':mobile-pagecontainer').pagecontainer('change', '#vehicle-particulars-page');
                }

            }
        });

    }).on("click", "#queryVehicleSearchStop", function() {
        loadingSpinner();
    });


    $('.parish').change(function() {
        var parishValue = $(this).val();
        var parishId = $(this).attr("id");
        setTown(parishId, parishValue);
    });


    $('#insuranceCoverage').change(function() {
        var options = ConvertToJson(localStorage.getItem(_IronRockPreliminaryData));
        var usages;
        switch ($(this).val()) {
            case "mpc":
                usages = options.usagelist_mpc;
                break;
            case "mptft":
                usages = options.usagelist_mptft;
                break;
            case "mpt":
                usages = options.usagelist_mpt;
                break;
            default:
                usages = [];
                break;
        }
        var $select = $('#vehicleUsedAs').empty();
        $.each(usages.data, function(idx, value) {
            $select.append('<option value="' + value.code + '">' + value.description + '</option>');
        });
    });

    //vehicle Used As
    // $('#vehicleUsedAs').change(function() {
    //     var select_value = $(this).val();
    //     setVehicleUsedAs(select_value);
    // });

    ///
    $('#personal-employer-details-page').on('change', '#applicantOccupation', function() {
        var applicantOccupation = $("#applicantOccupation option:selected");
        var occupationIndex = applicantOccupation.index();
        var occupationValue = applicantOccupation.val();
        //$('.selDiv option:eq(1)').prop('selected', true)
        var driverOccupation = $('#vehicle-driver-details-page').find('#regularDriversOccupation0');
        driverOccupation.find('option').eq(occupationIndex).prop('selected', true);
    });



    //set menu
    $('#menu-vehicle').click(function() {
        $('#insuranceType').val('motor');
        setmenu(getVehicleMenu(), "Vehicle Insurance");
        loadOccupations(true);
        loadFinanceCodes(true);
        $.mobile.changePage($("#personal-main-page"), "none");
    });

    $('#menu-property').click(function() {
        $('#insuranceType').val('property');
        setmenu(getPropertyMenu(), "Property Insurance");
        loadOccupations(false);
        loadFinanceCodes(false);
        loadRoofWallsTypes();
        $.mobile.changePage($("#personal-main-page"), "none");
    });


    //vehicle Used As
    // $('#vehicleUsedAs').change(function() {
    //     var select_value = $(this).val();
    //     setVehicleUsedAs(select_value);
    // });


    $('#vehicle-all-accidents').on('click', '.Add', function() {
        var elementGroup = $(this).closest('.vehicle-accident-block');
        cloneElement(elementGroup);
        resetAllAccident();
    });

    $('#vehicle-all-accidents').on('click', '.Delete', function() {
        var count = $('#vehicle-all-accidents').find(".vehicle-accident-block").length;
        if (count == 1) { //clear
            $(".vehicle-accident-block").find("input[type=text],input[type=number],textarea").val("");
        } else {
            //delete
            var elementGroup = $(this).closest('.vehicle-accident-block');
            elementGroup.remove();
        }
        resetAllAccident();
    });


    //resetHomeAllRiskArticles
    $('#HomeAllRiskInsured').on('click', '.Add', function() {
        var elementGroup = $(this).closest('.HomeAllRiskArticles');
        cloneElement(elementGroup);
        resetHomeAllRiskArticles();
        SetHomeAllRiskInsuredValue();
    });

    $('#HomeAllRiskInsured').on('click', '.Delete', function() {
        var count = $('#HomeAllRiskInsured').find(".HomeAllRiskArticles").length;
        if (count == 1) { //clear
            $(".HomeAllRiskArticles").find("input[type=text],input[type=number],textarea").val("");
        } else {
            //delete
            var elementGroup = $(this).closest('.HomeAllRiskArticles');
            elementGroup.remove();
        }
        resetHomeAllRiskArticles();
        SetHomeAllRiskInsuredValue();
    });

    //HomeInsurance
    $('#homeInsuranceProperty').on('click', '.Add', function() {
        var elementGroup = $(this).closest('.homeInsurancePropertyItems');
        cloneElement(elementGroup);
        resetHomeInsuranceProperty();
        SetHomeInsuranceValue();
    });

    $('#homeInsuranceProperty').on('click', '.Delete', function() {
        var count = $('#homeInsuranceProperty').find(".homeInsurancePropertyItems").length;
        if (count == 1) { //clear
            $(".homeInsurancePropertyItems").find("input[type=text],input[type=number],textarea").val("");
        } else {
            //delete
            var elementGroup = $(this).closest('.homeInsurancePropertyItems');
            elementGroup.remove();
        }
        resetHomeInsuranceProperty();
        SetHomeInsuranceValue();
    });

    $('#HomeAllRiskInsured').on('keyup', '.article-value input', function() {
        SetHomeAllRiskInsuredValue();
    });

    $('#homeInsuranceProperty').on('keyup', '.article-value input', function() {
        SetHomeInsuranceValue();
    });


    $('#HomeInsuranceContent .article-value').on('keyup', 'input', function() {
        SetContentTotalAmount();
    });

    //set home insurance values
    function SetContentTotalAmount() {
        var valList = [];
        $('#HomeInsuranceContent .article-value').find('input').each(function(index, element) {
            valList.push($(element).val());
        });
        $('#HomeInsuranceContentTotalAmount').val(GetTotal(valList));
    }


    $('#publicofficerelation').on('click', '.Add', function() {
        var elementGroup = $(this).closest('.publicofficerelations');
        cloneElement(elementGroup);
        resetApplicantRelativeInPublicOffice();
    });

    $('#publicofficerelation').on('click', '.Delete', function() {
        var count = $('#publicofficerelation').find(".publicofficerelations").length;
        if (count == 1) { //clear
            $(".publicofficerelations").find("input[type=text],input[type=number],textarea").val("");
        } else {
            //delete
            var elementGroup = $(this).closest('.publicofficerelations');
            elementGroup.remove();
        }
        resetApplicantRelativeInPublicOffice();
    });


    //delete vehicle
    $('#vehiclesToBeInsured').on('click', '.deleteVehicleRow', function() {
        var tr = $(this).closest('tr');
        var ans = confirm("Are you sure?");
        if (ans) {
            tr.remove();
            reIndexVehicles();
        }
    });

    //adjust vehcile value
    $('#vehiclesToBeInsured tbody').on("click", "button.adjust", function() {
        var selectedRow = $(this).closest("tr");
        var rowIndex = $("#vehiclesToBeInsured tbody tr").index(selectedRow);
        var r = {};
        r.plateNo = selectedRow.find('.ValueVehicleRegistrationNo').val();
        r.chassisNo = selectedRow.find('.ValueVehicleChassisNo').val();
        r.make = selectedRow.find('.ValueVehicleMake').val();
        r.model = selectedRow.find('.ValueVehicleModel').val();
        r.year = selectedRow.find('.ValueVehicleYear').val();
        r.vehicleBodyType = selectedRow.find('.ValueVehicleBody').val();
        r.engineNo = selectedRow.find('.ValueVehicleEngineNo').val();
        r.colour = selectedRow.find('.ValueVehicleColour').val();
        r.sumInsured = selectedRow.find('.ValueVehicleValue').val();
        var newValue = prompt("New Value of Vehicle?", r.sumInsured);
        newValue = accounting.unformat(newValue);
        if (newValue) {
            r.sumInsured = accounting.unformat(newValue);
            insertVehicle(r, rowIndex);
        }
    });




    $('.countries').change(function() {
        var $addressHolder = $(this).closest(".address");
        var isRequiredNecessary = $addressHolder.attr('id') != "employer";
        var jamaicaSelected = $(this).val() == "Jamaica";
        $addressHolder.find('.jamaica').css("display", jamaicaSelected ? "" : "none");
        $addressHolder.find('.international').css("display", !jamaicaSelected ? "" : "none");
        $addressHolder.find('.state').val('').prop("required", isRequiredNecessary && !jamaicaSelected);
        $addressHolder.find('.city').val('').prop("required", isRequiredNecessary && !jamaicaSelected);
        $addressHolder.find('.parish').val('').prop("required", isRequiredNecessary && jamaicaSelected);
        $addressHolder.find('.town').val('').prop("required", isRequiredNecessary && jamaicaSelected);
        $addressHolder.find('.postalcode').val('').prop("required", isRequiredNecessary && !jamaicaSelected);
    });


    //general toggle for all on/off sliders
    $('select[data-role="slider"]').change(function() {
        setResponseDetails($(this).attr('name'), this.value);
    });


}


function setSpecialEvents() {
    //initialize signature app
    $('#page-signature').on('pageshow', function(e, data) {
        if ($('#signature').find('.jSignature').length === 0) {
            $('#signature').jSignature({
                'UndoButton': false,
                color: "#000000",
                lineWidth: 1
            });
            //check signature
            $("#signature").bind('change', function(e) {
                /* 'e.target' will refer to div with "#signature" */
                g_signatureChangeCount = g_signatureChangeCount + 1;
            });
        }
    });


    //go tp home page
    $('[data-role=header]').on('click', '.home', function(event, ui) {
        navigator.app.loadUrl("file:///android_asset/www/index.html", {
            wait: 2000,
            loadingDialog: "Wait,Loading App",
            loadUrlTimeoutValue: 60000
        });
    });


    //exit app
    $(document).on('click', '.exitApp', function(event, ui) {
        //g_ironrock_service.signoff();
        navigator.app.exitApp();
    });

    //reload app
    $(document).on('click', '.reload', function(event, ui) {
        $("form").trigger('reset');
        //location.ass.reload();
        window.location = "index.html";
    });



    $(document).bind('pagebeforechange', function(e, data) {
        var currentDate = new Date();
        var currentDateJson = getDateJson(currentDate);
        var to = data.toPage,
            from = data.options.fromPage;

        if (typeof to === 'string') {
            var u = $.mobile.path.parseUrl(to);
            to = u.hash || '#' + u.pathname.substring(1);
        } else {
            to = '#' + to.attr('id');
        }
        if (from) from = '#' + from.attr('id');

        var isValid = true;
        if (IsNext(from, to)) {
            var curInputs = $(from).find(":input:visible");

            //$(".form-group").removeClass("has-error");
            for (var i = 0; i < curInputs.length; i++) {
                if (!curInputs[i].validity.valid) {
                    console.log(curInputs[i]);
                    isValid = false;
                }
            }
            switch (from) {
                case '#personal-main-page':
                    if ($('#getTRNDetails').is(":visible")) {
                        isValid = false;
                        alert("TRN needs to be validated!");
                    }
                    break;
                    //vehicle-particulars-page
                case '#vehicle-particulars-page':
                    if (isValid && $('#vehiclesToBeInsured tbody tr').length === 0) {
                        isValid = false;
                        alert("A Vehicle is required");
                    }

                    var mStartDateJson = getDateJson($('#motorStartDate').val());
                    if ((mStartDateJson.year * 12 * 31 + mStartDateJson.month * 31 + mStartDateJson.day) <
                        (currentDateJson.year * 12 * 31 + currentDateJson.month * 31 + currentDateJson.day)) {
                        isValid = false;
                        console.log("Start Date must be today or in the future!");
                        alert("Start Date must be today or in the future!");
                    }
                    break;
                case '#vehicle-insurance-coverage-page':
                    switch ($('#insuranceCoverage').val()) {
                        case "mpt":
                            break;
                        default:
                            $('#vehiclesToBeInsured .ValueVehicleValue').each(function(i, obj) {
                                var vehValue = parseFloat($(this).val());
                                if (!vehValue || vehValue <= 0) {
                                    isValid = false;
                                    var coverage = $("#insuranceCoverage option:selected").text();
                                    var errorMessage = coverage + " coverage requires a Motor Vehicle with a value";
                                    console.log(errorMessage);
                                    alert(errorMessage);
                                }
                            });
                            break;
                    }
                    break;
                case '#vehicle-driver-details-page':
                    if (!$('#regularDriversId').is(":visible")) {
                        isValid = false;
                        console.log("Driver is required");
                        alert("Driver is required");
                    }
                    break;
                case "#home-property-details-page":
                    var hStartDateJson = getDateJson($('#homeStartDate').val());
                    if ((hStartDateJson.year * 12 * 31 + hStartDateJson.month * 31 + hStartDateJson.day) <
                        (currentDateJson.year * 12 * 31 + currentDateJson.month * 31 + currentDateJson.day)) {
                        isValid = false;
                        console.log("Start Date must be today or in the future!");
                        alert("Start Date must be today or in the future!");
                    }
                    break;
            }
        }

        if (!isValid) {
            e.preventDefault();
            // remove active class on button
            // otherwise button would remain highlighted
            $.mobile.activePage
                .find('.ui-btn-active')
                .removeClass('ui-btn-active');
            alert("They are invalid entries!");
        }
    });
}


function getDateJson(date) {
    var json = {};
    if (typeof date === 'string') {
        json.day = parseInt(date.substring(8, 10));
        json.month = parseInt(date.substring(5, 7));
        json.year = parseInt(date.substring(0, 4));
    } else if (date instanceof Date) {
        json.day = date.getDate();
        json.month = date.getMonth() + 1;
        json.year = date.getFullYear();
    }
    return json;
}


function ConvertToJson(r) {
    try {
        var i = 0;
        while (i++ < 10) {
            r = JSON.parse(r);
        }
    } catch (e) {
        // not json
    }
    return r;
}




function loadOptions(obj, callback) {
    var timeInDay = 1000 * 60 * 60 * 24;
    var d = new Date();
    var currentTimeStamp = d.getTime();

    var prelimData = localStorage.getItem(_IronRockPreliminaryData);

    if (prelimData) {
        callback(null);
    } else {
        obj.getMiscOptions(function(err, json) {
            if (err) {
                callback(err);
            } else {
                json = ConvertToJson(json);
                localStorage.setItem(_IronRockPreliminaryData, JSON.stringify(json));
                callback(null);
            }
        });
    }
}


function loadingSpinner(state, $page) {
    if (state) {
        var $this = $page,
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

    } else {
        $.mobile.loading("hide");
    }
}


function IsNext(fromPage, toPage) {
    var toIdx = 0,
        fromIdx = 0;

    $("[data-role=page]").each(function(idx, obj) {
        var objsle = "#" + $(obj).attr('id');
        if (toPage == objsle) {
            toIdx = idx;
        }
        if (fromPage == objsle) {
            fromIdx = idx;
        }
    }); //data-role="page"
    return toIdx > fromIdx;
}

//add driver
function addDriver($this, id, callback) {
    loadingSpinner(true, $this);

    g_ironrock_service.getDriverLicenseDetails(id, function(err, json) {
        if (err) {
            loadingSpinner();
            callback(err);
        } else {
            //success handling
            loadingSpinner();
            //var json = JSON.parse(r);
            json = ConvertToJson(json);
            if (json.error_message) {
                callback(new Error("Invalid ID!!"));
            } else if (json.Message) {
                callback(new Error("Invalid ID!!"));
            } else {
                callback(null, json);
            }

        }
    });
}

//inline method
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
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

function populateApplicant(r) {
    //id
    $('#applicantIDNumber').val(r.driversLicenceNo);
    $('#dateFirstIssued').val(r.dateFirstIssued);
    $('#applicationIDExpirationDate').val(r.expiryDate);
    //address
    $('#applicantSurname').val(r.lastName);
    $('#applicantFirstName').val(r.firstName);
    $('#applicantMiddleName').val(r.middleName);
    $('#applicantDateOfBirth').val(r.dateOfBirth.substring(0, 10));
    $('#applicantTitle').val(r.gender == 'M' ? 'Mr.' : 'Ms.');
    //$('#applicantHomeCountry').val(r.CountryCode.toLowerCase()=='jamaica'?'JM':).trigger("change");
    //        $('#applicantHomeCountry option[value=' + r.CountryCode + ']').prop('selected', 'selected');
    //        $('#applicantHomeParish option[value=' + r.ParishCode + ']').prop('selected', 'selected');
    $('#applicantHomeStreetName').val(r.AddressMark + ', ' + r.AddressStreetNumber + ' ' + r.AddressStreetName);
    //
    $("#applicantPhoto").attr('src', 'data:image/png;base64,' + r.photograph);
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


//Load Quotation
function loadQuotation(r) {
    $('#signatureContainer').hide();
    $('#quotation_number').val(r.quotation_number);
    var container = $('#quotation');
    container.append('<h4>Note the Policy Limits</h4>');
    var table = $('<table/>'); //data-role="table" class="ui-responsive"
    table.attr('data-role', "table");
    table.addClass('ui-responsive');
    table.append('<tr><th>Quotation No:</th><td>' + r.quotation_number + '</td></tr>');
    table.append('<tr><th style="text-align: right;">Net Premium:</th><td style="text-align: right;">' + accounting.formatMoney(r.premium_calculation.net_premium) + '</td></tr>');
    table.append('<tr><th style="text-align: right;">Stamp Duty:</th><td style="text-align: right;">' + accounting.formatMoney(r.premium_calculation.stamp_duty) + '</td></tr>');
    table.append('<tr><th style="text-align: right;">Tax:</th><td style="text-align: right;">' + accounting.formatMoney(r.premium_calculation.tax) + '</td></tr>');
    table.append('<tr><th style="text-align: right;">Total Premium:</th><td style="text-align: right;">' + accounting.formatMoney(r.premium_calculation.total_premium) + '</td></tr>');
    table.appendTo(container);
    if (r.limits && r.limits.length > 0) {
        var limitHeader = $('<h4/>').text('Limits');
        limitHeader.appendTo(container);
        var limittable = $('<table/>').attr('data-role', "table").addClass('ui-responsive').html('<tr><th>Code</th><th>Heading</th><th  style="text-align:right">Limit</th><th>Description</th></tr>');

        $.each(r.limits, function(i, item) {
            limittable.append('<tr><td>' + item.code + '</td><td>' + item.heading + '</td><td style="text-align:right">' + accounting.formatMoney(item.limit) + '</td><td>' + item.description + '</td></tr>');
        });
        limittable.appendTo(container);
    }
}

//vehicle functions
function orderSelect($element) {
    var options = $element.find('option'),
        n_options = options.length,
        temp = [],
        parts,
        i;

    for (i = n_options; i--;) {
        temp[i] = options[i].text + "," + options[i].value;
    }

    temp.sort();

    for (i = n_options; i--;) {
        parts = temp[i].split(',');

        options[i].text = parts[0];
        options[i].value = parts[1];
    }
}


function loadColours() {
    $('#QueryVehicleColour').empty();
    $.each(_colours, function(key, value) {
        $('#QueryVehicleColour').append('<option value="' + value.name + '" style="background:' + value.hex + '">' + value.name + '</option>');
    });
}

//make/model
function loadVehicleMakes() {
    var options = JSON.parse(localStorage.getItem(_IronRockPreliminaryData));
    $('#QueryVehicleMake').empty();
    $.each(options.makeModels.data, function(key, value) {
        $('#QueryVehicleMake').append('<option value="' + value.make + '">' + value.make + '</option>');
    });
}

function loadBodyTypes() {
    var options = JSON.parse(localStorage.getItem(_IronRockPreliminaryData));
    $('#QueryVehicleBodyType').empty();
    $.each(options.makeModels.data, function(key, value) {
        $.each(value.models, function(key, value) {
            if ($('#QueryVehicleBodyType option[value="' + value.body_type + '"]').length === 0) {
                $('#QueryVehicleBodyType').append('<option value="' + value.body_type + '">' + value.body_type + '</option>');
            }
        });
    });
    orderSelect($('#QueryVehicleBodyType'));
}


function loadVehicleModels() {
    var options = JSON.parse(localStorage.getItem(_IronRockPreliminaryData));
    var models = [];
    var make = $('#QueryVehicleMake').val();
    $('#QueryVehicleModel').empty();
    $.each(options.makeModels.data, function(key, value) {
        if (make == value.make) {
            $.each(value.models, function(key, value) {
                if ($('#QueryVehicleModel option[value="' + value.model + '"]').length === 0) {
                    $('#QueryVehicleModel').append('<option value="' + value.model + '">' + value.model + '</option>');
                }
            });
            return;
        }
    });
}


//insert vehicle
function insertVehicle(r, rowIndex) {
    var tbl = $('#vehiclesToBeInsured tbody');
    var rows = $('tr', tbl);

    if (typeof rowIndex === "undefined") {
        rowIndex = rows.length;
    }

    if (IsDuplicateVehicle(r.chassisNo, rowIndex)) {
        alert('Duplicate Vehicle!');
        return;
    }

    var xRow;
    if (rowIndex == rows.length) {
        xRow = $('<tr/>').appendTo(tbl);
    } else {
        xRow = rows.eq(rowIndex).html('');
    }

    //motorVehicleID

    var htmlValues = '<span>' + r.plateNo + '</span>' +
        '<input type="hidden" class="ValueVehicleRegistrationNo" value="' + $.trim(r.plateNo) + '" />' +
        '<input type="hidden" class="ValueVehicleChassisNo" value="' + $.trim(r.chassisNo) + '" />' +
        '<input type="hidden" class="ValueVehicleMake" value="' + $.trim(r.make) + '" />' +
        '<input type="hidden" class="ValueVehicleModel" value="' + $.trim(r.model) + '" />' +
        '<input type="hidden" class="ValueVehicleYear" value="' + $.trim(r.year) + '" />' +
        '<input type="hidden" class="ValueVehicleBody" value="' + $.trim(r.vehicleBodyType) + '" />' +
        '<input type="hidden" class="ValueVehicleType" value="' + $.trim(r.vehicleType) + '" />' +
        '<input type="hidden" class="ValueVehicleEngineNo" value="' + $.trim(r.engineNo) + '" />' +
        '<input type="hidden" class="ValueVehicleColour" value="' + $.trim(r.colour) + '" />' +
        '<input type="hidden" class="ValueVehicleValue" value="' + $.trim(r.sumInsured) + '" />' +
        '<input type="hidden" class="ValueVehicleID" value="' + $.trim(r.motorVehicleID) + '" />';

    xRow.addClass('vehicle').attr('data-id', r.chassisNo);
    var registrationCell = $('<td/>');
    registrationCell.html(htmlValues);
    registrationCell.appendTo(xRow);
    //
    var makeModelCell = $('<td/>');
    makeModelCell.html(r.make + ' ' + r.model);
    makeModelCell.appendTo(xRow);
    //
    var detailsCell = $('<td/>');
    detailsCell.html(r.year + ' ' + r.vehicleBodyType + ' ' + r.colour);
    detailsCell.appendTo(xRow);
    //
    var chassisCell = $('<td/>');
    chassisCell.html(r.chassisNo + '/' + r.engineNo);
    chassisCell.appendTo(xRow);
    //
    var sumInsuredCell = $('<td/>');
    var sumInsuredHtml = '<div class="input-group"><input type="text" class="form-control" value="' + accounting.formatMoney(r.sumInsured) + '" disabled><span class="input-group-btn"><button class="btn btn-default adjust" type="button">Chg</button></span></div>';
    sumInsuredCell.html(sumInsuredHtml);
    sumInsuredCell.appendTo(xRow);
    //
    var deleteCell = $('<td/>');
    deleteCell.html('<button type="button" class="btn btn-link deleteVehicleRow">Delete</button>');
    deleteCell.appendTo(xRow);

    //
    reIndexVehicles();
}

//check duplicate
function IsDuplicateVehicle(chassisNo, idx) {
    var returnVal = false;
    $('#vehiclesToBeInsured tbody tr').each(function(xIndex, element) {
        var xChassisNo = $(this).attr('data-id');
        if (xChassisNo && chassisNo.trim() == xChassisNo.trim() && idx != xIndex) {
            returnVal = true;
            return false;
        }
    });
    return returnVal;
}

//need to index vehicles
function reIndexVehicles() {
    var CaptionBaseVehicleRegistrationNo = 'vehicleRegistrationNo';
    var CaptionBaseVehicleChassisNo = 'vehicleChassisNo';
    var CaptionBaseVehicleMake = 'vehicleMake';
    var CaptionBaseVehicleModel = 'vehicleModel';
    var CaptionBaseVehicleYear = 'vehicleYear';
    var CaptionBaseVehicleEngineNo = 'vehicleEngineType';
    var CaptionBaseVehicleBody = 'vehicleBody';
    var CaptionBaseVehicleType = 'vehicleType';
    var CaptionBaseVehicleColour = 'vehicleColour';
    var CaptionBaseVehicleID = 'motorVehicleID';
    var CaptionBaseVehicleValue = 'vehicleValue';
    var sumInsured = 0;
    $('#vehiclesToBeInsured tbody tr').each(function(index, element) {
        var xRow = $(element);
        xRow.find('.ValueVehicleRegistrationNo').attr("id", CaptionBaseVehicleRegistrationNo + index).attr("name", CaptionBaseVehicleRegistrationNo + index);
        xRow.find('.ValueVehicleChassisNo').attr("id", CaptionBaseVehicleChassisNo + index).attr("name", CaptionBaseVehicleChassisNo + index);
        xRow.find('.ValueVehicleMake').attr("id", CaptionBaseVehicleMake + index).attr("name", CaptionBaseVehicleMake + index);
        xRow.find('.ValueVehicleModel').attr("id", CaptionBaseVehicleModel + index).attr("name", CaptionBaseVehicleModel + index);
        xRow.find('.ValueVehicleYear').attr("id", CaptionBaseVehicleYear + index).attr("name", CaptionBaseVehicleYear + index);
        xRow.find('.ValueVehicleBody').attr("id", CaptionBaseVehicleBody + index).attr("name", CaptionBaseVehicleBody + index);
        xRow.find('.ValueVehicleType').attr("id", CaptionBaseVehicleType + index).attr("name", CaptionBaseVehicleType + index);
        xRow.find('.ValueVehicleEngineNo').attr("id", CaptionBaseVehicleEngineNo + index).attr("name", CaptionBaseVehicleEngineNo + index);
        xRow.find('.ValueVehicleColour').attr("id", CaptionBaseVehicleColour + index).attr("name", CaptionBaseVehicleColour + index);
        xRow.find('.ValueVehicleValue').attr("id", CaptionBaseVehicleValue + index).attr("name", CaptionBaseVehicleValue + index);
        xRow.find('.ValueVehicleID').attr("id", CaptionBaseVehicleID + index).attr("name", CaptionBaseVehicleID + index);
        sumInsured = sumInsured + parseFloat(xRow.find('.ValueVehicleValue').val());
    });
    var thirdPartyLimit = $('#thirdPartyLimit').empty();
    if (sumInsured < 2000000) {
        thirdPartyLimit.append('<option value="standard1">Standard Limits-$3M/$5M/$5M</option>');
        thirdPartyLimit.append('<option value="increased1Option1">Increased Limits-$5M/$7.5M/$5M</option>');
        thirdPartyLimit.append('<option value="increased1Option2">Increased Limits-$5M/10M/$5M</option>');
        thirdPartyLimit.append('<option value="increased1Option3">Increased Limits-$10M/$10M/$10M</option>');
    } else {
        thirdPartyLimit.append('<option value="standard2">Standard Limits-$5M/$10M/$5M</option>');
        thirdPartyLimit.append('<option value="increased2Option1">Increased Limits-$10M/$10M/$10M</option>');
    }
}



//set display of text based on Radio Button selection
function setResponseDetails(elementName, elementValue) {
    //var radioBtn = $('input[name=' + elementName + '][value=' + elementValue + ']');
    var displayElement = getDisplayElement(elementName);

    if (!displayElement.defaultValue) return;

    var $element;
    if (displayElement.id) {
        $element = $('#' + displayElement.id);
    } else {
        $element = $('.' + displayElement.class);
    }

    if (elementValue == displayElement.defaultValue) {
        $element.find('input[type=text],input[type=number],textarea').val('');
        removeElementsExceptFirst(elementName);
        $element.hide();
    } else {
        $element.show();
    }
}

//default Elements
function removeElementsExceptFirst(elementName) {
    switch (elementName) {
        case 'applicantRelativeInPublicOffice':
            $('.publicofficerelations').not(':first').remove();
            resetApplicantRelativeInPublicOffice();
            break;
        case 'involvedInAccident':
            $('.vehicle-accident-block').not(':first').remove();
            resetAllAccident();
            break;
        default:
            break;
    }
}

//set radio button
function setRadioButton(elementName, xvalue) {
    var buttonElement = 'input[name=' + elementName + '][value=' + xvalue + ']';
    $(buttonElement).prop('checked', true).trigger('click');
    setResponseDetails(elementName, xvalue);
}

//get display element
function getDisplayElement(elementName) {
    var returnValue = {};
    switch (elementName) {
        case 'vehicleKeptInSecureArea':
            returnValue.defaultValue = "yes";
            returnValue.id = "vehicleLocationDetailsClass";
            break;
        case 'mailingAddressSame':
            returnValue.defaultValue = "yes";
            returnValue.id = "mailingAddress";
            break;
        case 'applicantRelativeInPublicOffice':
            returnValue.defaultValue = "no";
            returnValue.id = "publicofficerelation";
            break;
        case 'isOwnerOfVehicle':
            returnValue.defaultValue = "yes";
            returnValue.class = "vehicleNameAddressOfOwner";
            break;
        case 'lienHolder':
            returnValue.defaultValue = "no";
            returnValue.class = "lienHolderClass";
            break;
        case 'vehicleAntiTheftDevice':
            returnValue.defaultValue = "no";
            returnValue.class = "VehicleAntiTheftDeviceProviderClass";
            break;
        case 'vehicleRegularCustody':
            returnValue.defaultValue = "yes";
            returnValue.class = "vehicleRegularCustodyDetailsClass";
            break;
        case 'vehicleGaragedAtProposersHome':
            returnValue.defaultValue = "yes";
            returnValue.class = "vehicleGaragedAtProposersHomeDetailsClass";
            break;
        case 'proposerInsured':
            returnValue.defaultValue = "no";
            returnValue.class = "proposerInsuranceDetailsClass";
            break;
            // case 'proposerEntitledToNOClaimDiscount':
            //     returnValue.defaultValue = "no";
            //     returnValue.id = "proposerEntitledToNOClaimDiscountProof";
            //     break;
        case 'applicantOtherInsurer':
            returnValue.defaultValue = "no";
            returnValue.class = "applicantOtherInsurerTypeClass";
            break;
        case 'applicantPreviouslyInsured':
            returnValue.defaultValue = "no";
            returnValue.class = "ApplicantPreviouslyInsuredClass";
            break;
        case 'involvedInAccident':
            returnValue.defaultValue = "no";
            returnValue.class = "involvedInAccidentClass";
            break;
        case 'driverSufferFromDefectiveHearingOrVision':
            returnValue.defaultValue = "no";
            returnValue.id = "divDriverSufferFromDefectiveHearingOrVisionDetails";
            break;
        case 'driverSufferFromDiabetesEpilepsyHeartDisease':
            returnValue.defaultValue = "no";
            returnValue.id = "divDriverSufferFromDiabetesEpilepsyHeartDiseaseDetails";
            break;
        case 'driverSufferFromPhysicalMentalInfirmity':
            returnValue.defaultValue = "no";
            returnValue.id = "divDriverSufferFromPhysicalMentalInfirmityDetails";
            break;
        case 'vehicleModified':
            returnValue.defaultValue = "no";
            returnValue.class = "vehicleModifiedDetailsClass";
            break;
        case 'driverTrafficTicket':
            returnValue.defaultValue = "no";
            returnValue.id = "driverTrafficTicketDetailGroup";
            break;
        case 'vehicleModified':
            returnValue.defaultValue = "no";
            returnValue.class = "vehicleModifiedDetailsClass";
            break;
        case 'garageOutBuildingExists':
            returnValue.defaultValue = "no";
            returnValue.class = "garageOutBuildingClass";
            break;
        case 'homeInGoodState':
            returnValue.defaultValue = "yes";
            returnValue.id = "divhomeInGoodStateDetails";
            break;
        case 'homeOccupiedByApplicantFamily':
            returnValue.defaultValue = "yes";
            returnValue.id = "divhomeOccupiedByApplicantFamily";
            break;
        case 'homeUsedForIncomeActivity':
            returnValue.defaultValue = "no";
            returnValue.id = "divhomeUsedForIncomeActivity";
            break;
        case 'homeHaveInterestFromIndividual':
            returnValue.defaultValue = "no";
            returnValue.id = "divhomeHaveInterestFromIndividual";
            break;
        case 'homeHasWatersideStructure':
            returnValue.defaultValue = "no";
            returnValue.id = "divhomeHasWatersideStructure";
            break;
        case 'currentPolicyWithCompanyOrInsurer':
            returnValue.defaultValue = "no";
            returnValue.id = "divcurrentPolicyWithCompanyOrInsurerDetails";
            break;
        case 'HomeInsuranceDeclined':
            returnValue.defaultValue = "no";
            returnValue.id = "divHomeInsuranceDeclined";
            break;
        case 'HomeInsuranceRequiredSpecialTerm':
            returnValue.defaultValue = "no";
            returnValue.id = "divHomeInsuranceRequiredSpecialTermDetails";
            break;
        case 'HomeInsuranceCancelled':
            returnValue.defaultValue = "no";
            returnValue.id = "divHomeInsuranceCancelledDetails";
            break;
        case 'HomeInsuranceIncreasedPremium':
            returnValue.defaultValue = "no";
            returnValue.id = "divHomeInsuranceIncreasedPremiumDetails";
            break;
        case 'HomeInsurancePerilsSuffer':
            returnValue.defaultValue = "no";
            returnValue.id = "divHomeInsurancePerilsSufferDetails";
            break;
        case 'HomeInsuranceSufferLoss':
            returnValue.defaultValue = "no";
            returnValue.id = "divHomeInsuranceSufferLossDetails";
            break;
    }
    return returnValue;
}

//miscellaneous functions
function setTown(parishId, parishValue) {
    var options = ConvertToJson(localStorage.getItem(_IronRockPreliminaryData));
    var towns;
    var townId;
    switch (parishId) {
        case 'applicantMailParish':
            townId = 'applicantMailTown';
            break;
        case 'employerParish':
            townId = 'employerTown';
            break;
        case 'homeRiskAddressParish':
            townId = 'homeRiskAddressTown';
            break;
        case 'applicantHomeParish':
            townId = 'applicantHomeTown';
            break;
    }
    $.each(options.ParishTowns.data, function(i, json) {
        if (parishValue == json.parish) {
            towns = json.towns;
        }
    });
    var $select;
    if (townId) {
        $select = $('#' + townId).empty();
    }
    if ($select && towns) {
        var justIn = true;
        $.each(towns, function(idx, value) {
            if (justIn) {
                $select.append('<option value=""></option>');
                justIn = false;
            } else {
                $select.append('<option value="' + value + '">' + value + '</option>');
            }
        });
    }
}


function SetHomeAllRiskInsuredValue() {
    var valList = [];
    $('#HomeAllRiskInsured .article-value').find('input').each(function(index, element) {
        valList.push($(element).val());
    });
    $('#HomeAllRiskTotalAmount').val(GetTotal(valList));
}

function SetHomeInsuranceValue() {
    var valList = [];
    $('#homeInsuranceProperty .article-value').find('input').each(function(index, element) {
        valList.push($(element).val());
    });
    $('#homeInsurancePropertySum').val(GetTotal(valList));
}

function resetAllAccident() {
    var objectList = [{
        "class": "year",
        "name": "accidentYear"
    }, {
        "class": "cost",
        "name": "accidentCost"
    }, {
        "class": "month",
        "name": "accidentMonth"
    }, {
        "class": "driver",
        "name": "accidentDriver"
    }, {
        "class": "brief",
        "name": "accidentBrief"
    }];
    var elementClass = $('.vehicle-accident-block');
    resetObjects(objectList, elementClass, "Add", "Delete", "Accident", true);
}


function setAllAccidentsYears() {
    var currentYear = new Date().getFullYear();
    for (i = 0; i < 3; i++) {
        var xYear = currentYear - i;
        var option = $('<option/>');
        option.attr('value', xYear);
        option.text(xYear);
        option.appendTo($('#accidentYear0'));

    }
}


function setVehicleUsedAs(select_value) {
    //hide and uncheck all inexperinecd driver elements
    //$('#InexperiencedDriverBlock input').prop('checked', false); // Unchecks it
    // var block = $('#InexperiencedDriverBlock');
    // block.find('label').hide();
    // block.find('.inexperiencedDriver').hide();
    // block.find('#21YearsOldPrivateCars').show();
    // block.find('label[for=21YearsOldPrivateCars]').show();
    // block.find('#24MonthsPrivateLicence').show();
    // block.find('label[for=24MonthsPrivateLicence]').show();
    //$('label[for=a], input#a').hide();
    //show relevant inputs
    // switch (select_value) {
    // case "CarriageOwnGoods": //private commercial
    // case "CarriagePassengersNotHire": //private commercial
    // case "CarriagePassengersHire": //private commercial
    // case "CommercialTravelling": //private commercial
    //     $('label[for=23YearsOldPrivateCommercial], input#23YearsOldPrivateCommercial').show();
    //     $('label[for=36MonthsGeneralLicencePrivateCommercial], input#36MonthsGeneralLicencePrivateCommercial').show();
    //     break;
    // case "GeneralCartage": //General Cartage
    //     $('label[for=25YearsOldGeneralCartage], input#25YearsOldGeneralCartage').show();
    //     $('label[for=5YearsGeneralLicencePublicCommercial], input#5YearsGeneralLicencePublicCommercial').show();
    //     break;
    // case "SocialDomesticPleasure": //private car
    // case "SocialDomesticPleasureBusiness": //private car
    //     $('label[for=21YearsOldPrivateCars], input#21YearsOldPrivateCars').show();
    //     $('label[for=24MonthsPrivateLicence], input#24MonthsPrivateLicence').show();
    //     break;
    // }
}


function loadOccupations(isMotor) {
    var options = JSON.parse(localStorage.getItem(_IronRockPreliminaryData));
    $('#applicantOccupation').html('<option value=""></option>');
    if (isMotor) {
        $('#regularDriversOccupation0').html('<option value=""></option>');
    }
    $.each(options.occupations.data, function(key, value) {
        $('#applicantOccupation').append('<option value="' + value.occupation.trim() + '">' + value.occupation + '</option>');
        if (isMotor) {
            $('#regularDriversOccupation0').append('<option value="' + value.occupation.trim() + '">' + value.occupation + '</option>');
        }
    });
}

function loadFinanceCodes(isMotor) {
    var options = ConvertToJson(localStorage.getItem(_IronRockPreliminaryData));
    var $selectIdString = isMotor ? "motorFinancialInstitutionCode" : "homeFinancialInstitutionCode";
    var $select = $('#' + $selectIdString).html('<option value="">None</Option>');
    $.each(options.mortgagees.mortgagees, function(idx, company) {
        $select.append('<option value="' + company.global_name_id + '">' + company.name + '</option>');
    });
}


function loadRoofWallsTypes() {
    var options = JSON.parse(localStorage.getItem(_IronRockPreliminaryData));
    //wall
    $('#constructionExternalWalls').html('<option value=""></option>');
    $.each(options.wallTypes.data, function(key, value) {
        $('#constructionExternalWalls').append('<option value="' + value + '">' + value + '</option>');
    });

    //roof
    $('#constructionRoof').html('<option value=""></option>');
    $.each(options.roofTypes.data, function(key, value) {
        $('#constructionRoof').append('<option value="' + value + '">' + value + '</option>');
    });
}



function GetTotal(InputArray) {
    var sum = 0;
    $.each(InputArray, function(index, val) {
        sum = sum + Number(val ? val : 0);
    });
    return '$' + sum.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

function resetHomeAllRiskArticles() {
    var objectList = [{
        "class": "article-name",
        "name": "HomeAllRiskArticleDescription"
    }, {
        "class": "article-value",
        "name": "HomeAllRiskArticleValue"
    }];
    var elementClass = $('.HomeAllRiskArticles');
    resetObjects(objectList, elementClass, "Add", "Delete", "Article", true);
}

function resetHomeInsuranceProperty() {
    var objectList = [{
        "class": "article-name",
        "name": "homeInsurancePropertyItem"
    }, {
        "class": "article-value",
        "name": "homeInsurancePropertyItemValue"
    }];
    var elementClass = $('.homeInsurancePropertyItems');
    resetObjects(objectList, elementClass, "Add", "Delete", "Building", true);
}



//regular drivers
function resetRegularDriver() {

    var objectList = [{
        "class": "name",
        "name": "regularDriversName"
    }, {
        "class": "occupation",
        "name": "regularDriversOccupation"
    }, {
        "class": "DateOfBirth",
        "name": "regularDriversDateOfBirth"
    }, {
        "class": "DriversDL",
        "name": "regularDriversDL"
    }, {
        "class": "DriversDLExpirationDate",
        "name": "regularDriversDLExpirationDate"
    }, {
        "class": "DriversDLOriginalDateOfIssue",
        "name": "regularDriversDLOriginalDateOfIssue"
    }, {
        "class": "DriversRelationshipToProposer",
        "name": "regularDriversRelationshipToProposer"
    }];
    var elementClass = $('.regularDriversCls');

    resetObjects(objectList, elementClass, "Add", "Delete", "Driver", true);
}


function resetApplicantRelativeInPublicOffice() {
    var objectList = [{
        "class": "office",
        "name": "applicantRelativeTypePublicOffice"
    }, {
        "class": "address",
        "name": "applicantRelativeTypePublicAddress"
    }, {
        "class": "relation",
        "name": "applicantRelativeTypePublicRelation"
    }, {
        "class": "name",
        "name": "applicantRelativeInPublicOfficeName"
    }];
    var elementClass = $('.publicofficerelations');

    resetObjects(objectList, elementClass, "Add", "Delete", "Relative", true);
}


function SignaturePageItem() {
    return {
        "name": "Signature",
        "value": "page-signature"
    };
}


function QuotationPageItem() {
    return {
        "name": "Validation",
        "value": "page-quotation"
    };
}


//function SetupSignaturePage() {
//    var signaturePage = $('#page-signature');
//    signaturePage.find("[data-role=header]").find("h1").text("Signature");
//    signaturePage.find("[data-role=footer]").find("h4").text("IronRock App");
//    signaturePage.find("[data-role=main]").show();
//}

function getPersonalMenu() {
    return [{
        "name": "Personal Details",
        "value": "personal-main-page"
    }, {
        "name": "Contact Details",
        "value": "personal-contact-page"
    }, {
        "name": "Employment Details",
        "value": "personal-employer-details-page"
    }];
}


//disable property elements
function disablePropertyItems() {
    $("#home-particulars-page :input").prop("disabled", true);
    $("#home-particulars-continued-page :input").prop("disabled", true);
    $("#home-property-details-page :input").prop("disabled", true);
    $("#home-all-risk-insurance-page :input").prop("disabled", true);
}


//disable property elements
function disableMotorVehicleItems() {
    $("#vehicle-particulars-page :input").prop("disabled", true);
    $("#vehicle-insurance-coverage-page :input").prop("disabled", true);
    $("#vehicle-driver-details-page :input").prop("disabled", true);
    $("#vehicle-accidents-page :input").prop("disabled", true);
    $("#vehicle-medical-history-page :input").prop("disabled", true);
    $("#taxOfficeVehicleDialog :input").prop("disabled", true);
}


function getVehicleMenu() {
    disablePropertyItems();
    var vehicleMenuList = [{
        "name": "Vehicle Particulars",
        "value": "vehicle-particulars-page"
    }, {
        "name": "Insurance Coverage",
        "value": "vehicle-insurance-coverage-page"
    }, {
        "name": "Drivers Details",
        "value": "vehicle-driver-details-page"
    }, {
        "name": "Accidents",
        "value": "vehicle-accidents-page"
    }, {
        "name": "Medical History",
        "value": "vehicle-medical-history-page"
    }];
    var newList = getPersonalMenu().concat(vehicleMenuList);
    newList.push(SignaturePageItem());
    return newList;
}


function getPropertyMenu() {
    disableMotorVehicleItems();
    var propertyMenuList = [{
        "name": "Home Particulars",
        "value": "home-particulars-page"
    }, {
        "name": "Home Particulars Con't",
        "value": "home-particulars-continued-page"
    }, {
        "name": "Home Property Details",
        "value": "home-property-details-page"
    }, {
        "name": "All Risk Insurance",
        "value": "home-all-risk-insurance-page"
    }];
    var newList = getPersonalMenu().concat(propertyMenuList);
    newList.push(SignaturePageItem());
    return newList;
}

function GetMenuPanelItems(menu_list) {
    var panelItems = "";
    $.each(menu_list, function(key, item) {
        panelItems = panelItems + '<li><a href="#' + item.value + '">' + item.name + '</a></li>';
    });
    return panelItems;
}


function setmenu(menu_list, menu_header) {
    var menuLinks = GetMenuPanelItems(menu_list);
    var last_page_dom = $("#" + menu_list[menu_list.length - 1].value).get(0);

    //var p = 1;
    $.each(menu_list, function(key, item) {
        var currentPage = $('#' + item.value);
        var currentHeader = currentPage.find('[data-role=header]').empty(); //.html('');
        var currentFooter = currentPage.find('[data-role=footer]').empty(); //html('');

        //set title
        var title = $('<h1/>').text(item.name);
        title.appendTo(currentHeader);
        //set logo and logo link
        var logoLink = $('<a/>').attr('data-role', 'button');
        logoLink.attr('data-corners', 'false');
        logoLink.attr('data-inline', 'true');
        logoLink.attr('data-shadow', 'false');
        logoLink.attr('style', 'border:none;background-color: transparent;');
        logoLink.attr('href', '#');
        logoLink.addClass('home');
        if (g_profile && g_profile.brokerDetails && g_profile.brokerDetails.logo) {
            var logo = $('<img/>').attr('border', '0').attr('alt', '');
            logo.attr('src', g_profile.brokerDetails.logo);
            logo.attr('style', 'vertical-align:middle;margin-top:-10px;height:30px');
            logoLink.append(logo);
            //
            logoLink.append('&nbsp;');
            logoLink.append('<span style="vertical-align:middle;line-height:30px;">Powered By</span>');
            logoLink.append('&nbsp;');
            logoLink.append('<img src="images/IronRockLogoSmall.png" height="30px" border="0" style="vertical-align:middle"/>');
            logoLink.appendTo(currentHeader);
        } else {
            logoLink.append('<img src="images/IronRockLogoSmall.png" height="30px" border="0" style="vertical-align:middle"/>');
            logoLink.appendTo(currentHeader);
        }


        //set footer copyright
        var currDate = new Date();
        var copyright = $('<h4/>').html('Copyright &nbsp; &copy;' + currDate.getFullYear() + ', IronRock Insurance Company Limited');
        copyright.appendTo(currentFooter);

        //set footer prev and next links
        var prevI = key - 1;
        var nextI = key + 1;
        var prevLink = '';
        if (key > 0) {
            //insert previous link
            prevLink = '<a href="#' + menu_list[prevI].value + '" class="ui-btn ui-btn-left ui-btn-corner-all ui-icon-arrow-l ui-btn-icon-notext" rel="prev">Prev</a>';
        } else {
            prevLink = '<a href="#" class="ui-btn ui-btn-left ui-btn-corner-all ui-icon-arrow-l ui-btn-icon-notext reload">Prev</a>';
        }
        currentFooter.append(prevLink);
        if (key < menu_list.length - 1) {
            //insert next link
            var nextLink = '<a href="#' + menu_list[nextI].value + '" class="ui-btn ui-btn-right ui-btn-corner-all ui-icon-arrow-r ui-btn-icon-notext" rel="next">Next</a>';
            currentFooter.append(nextLink);
        }

        //set menu panel
        var current_page_dom = currentPage.get(0);
        if (currentPage.find('[data-role=panel]').length === 0 && last_page_dom != current_page_dom) {
            var panelId = 'panel' + key;
            var panel = '<div data-role="panel" data-display="overlay" data-mini="true" class="menu" id="' + panelId + '" data-dismissible="true" data-swipe-close="true" data-position="right">';
            panel = panel + '<h2>' + menu_header + '</h2><ol data-role="listview" data-inset="true" data-mini="true">' + menuLinks + '</ol>';
            panel = panel + '<a href="#" class="ui-btn ui-btn-inline reload">Reload</a><br/>';
            panel = panel + '<a href="#" class="ui-btn ui-btn-inline exitApp">Exit</a></div>';
            currentPage.prepend(panel);

            var panelBtn = $('<a/>');
            panelBtn.attr('href', '#' + panelId);
            panelBtn.addClass('ui-btn ui-btn-corner-all ui-icon-bars ui-btn-icon-notext ui-btn-right');
            panelBtn.appendTo(currentHeader);
        }
    });
}


function loadCountriesOptions() {
    var options = ConvertToJson(localStorage.getItem(_IronRockPreliminaryData));
    $('select.countries').each(function(index, item) {
        var selectObj = $(this);
        selectObj.empty();
        $.each(options.countries.data, function(i, country) {
            var optionStr;
            if (country == 'Jamaica') {
                optionStr = '<option value="' + country + '" selected="selected">' + country + '</option>';
            } else {
                optionStr = '<option value="' + country + '">' + country + '</option>';
            }
            selectObj.append(optionStr);
        });
    });
    //load nationality separately
    var nationality = $('#applicantNationality').empty();
    $.each(_countries, function(i, country) {
        if (country.name == 'Jamaica') {
            nationality.append('<option value="' + country.name + '" selected>' + country.name + '</option>');
        } else {
            nationality.append('<option value="' + country.name + '">' + country.name + '</option>');
        }
    });
}

function loadParishes() {
    var options = ConvertToJson(localStorage.getItem(_IronRockPreliminaryData));
    var parishElements = $('.parish');
    parishElements.each(function(index, item) {
        var selectObj = $(this).empty();
        var justIn = true;
        $.each(options.ParishTowns.data, function(i, json) {
            if (justIn) {
                justIn = false;
                selectObj.append('<option value=""></option>');
            } else {
                selectObj.append('<option value="' + json.parish + '">' + json.parish + '</option>');
            }
        });
    });
}

//clone element
function cloneElement(elementGroup) {
    var clone = elementGroup.clone();
    clone.find("input[type=text],input[type=number],textarea").val("");
    var selectElements = clone.find("select");
    selectElements.each(function(idx, obj) {
        $(obj).closest('.ui-select').replaceWith($(obj));
        $(obj)[0].selectedIndex = 0;
    });
    clone.insertAfter(elementGroup);
    selectElements.parent().enhanceWithin();

    //if (clone.tagName === 'SELECT') clone[0].selectedIndex = 0;
    clone.show();
}



function resetObjects(objectList, elementClass, addBtnName, delBtnName, elementTitle, showDeleteButtonOnFirstPage) {
    var firstElement = elementClass.first();
    var lastElement = elementClass.last();

    var noOfItems = elementClass.length;
    var maxItems = 5;
    //var i = 0;

    elementClass.each(function(index, e) {
        var element = $(this);
        //change ids and names
        $.each(objectList, function(jIndex, item) {
            element.find('.' + item.class + ' :input').attr('id', item.name + index).attr('name', item.name + index);
            element.find('.' + item.class + ' textarea').attr('id', item.name + i).attr('name', item.name + i);
            element.find('.' + item.class + ' label').attr('for', item.name + index);
        });

        //set controls
        //delete button
        if (delBtnName) {
            var xDelBtnElement = element.find('.' + delBtnName);
            if (element.is(firstElement) && !showDeleteButtonOnFirstPage) {
                xDelBtnElement.hide();
            } else {
                xDelBtnElement.show();
            }
        }
        //add button
        if (addBtnName) {
            var xAddBtnElement = element.find('.' + addBtnName);
            if (element.is(lastElement) && noOfItems < maxItems) {
                xAddBtnElement.show();
            } else {
                xAddBtnElement.hide();
            }
        }

        //change title
        element.find('h4').text(elementTitle + ' ' + (index + 1));
    });
}


function setLastThreeYearsOwnership() {
    var currentYear = new Date().getFullYear();
    for (i = 1; i < 4; i++) {
        var previousYear = currentYear - i;
        var YearName = 'numberOfVehiclesOwned' + previousYear;
        var YearHtml = $('<div/>');
        YearHtml.addClass('ui-field-contain');
        var YearLabel = $('<label/>');
        YearLabel.attr('for', YearName);
        YearLabel.text(previousYear + ':Number of vehicles owned:');
        YearLabel.appendTo(YearHtml);
        var yearText = $('<input/>');
        yearText.attr('type', 'number');
        yearText.attr('name', YearName);
        yearText.attr('id', YearName);
        yearText.appendTo(YearHtml);
        YearHtml.appendTo($('#numberOfVehiclesOwned'));
    }
}



var _colours = [{
    "hex": "#F5F5DC",
    "name": "Beige",
    "rgb": "(245,245,220)"
}, {
    "hex": "#000000",
    "name": "Black",
    "rgb": "(0,0,0)"
}, {
    "hex": "#1F75FE",
    "name": "Blue",
    "rgb": "(31, 117, 254)"
}, {
    "hex": "#B4674D",
    "name": "Brown",
    "rgb": "(180, 103, 77)"
}, {
    "hex": "#800020",
    "name": "Burgundy",
    "rgb": ""
}, {
    "hex": "#F7E7CE",
    "name": "Champagne",
    "rgb": ""
}, {
    "hex": "#E7C697",
    "name": "Gold",
    "rgb": "(231, 198, 151)"
}, {
    "hex": "#95918C",
    "name": "Gray",
    "rgb": "(149, 145, 140)"
}, {
    "hex": "#1CAC78",
    "name": "Green",
    "rgb": "(28, 172, 120)"
}, {
    "hex": "#1CA9C9",
    "name": "Pacific Blue Pearl",
    "rgb": "(28, 169, 201)"
}, {
    "hex": "#8E4585",
    "name": "Plum Mist Metallic",
    "rgb": "(142, 69, 133)"
}, {
    "hex": "#EE204D",
    "name": "Red",
    "rgb": "(238,32 ,77 )"
}, {
    "hex": "#CDC5C2",
    "name": "Silver",
    "rgb": "(205, 197, 194)"
}, {
    "hex": "#18A7B5",
    "name": "Teal Mist Metallic",
    "rgb": "(24, 167, 181)"
}, {
    "hex": "#FFFFFF",
    "name": "White",
    "rgb": "(255, 255, 255)"
}];
