//function onDeviceReady() {

//$(document).ready(function (e) {

function doMiscellaneous() {
    setVehicleUsedAs("SocialDomesticPleasure");
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


    $('.parish').change(function() {
        var parishValue = $(this).val();
        var parishId = $(this).attr("id");
        setTown(parishId, parishValue);
    });

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
        $.mobile.changePage($("#personal-main-page"), "none");
    });

    $('#menu-property').click(function() {
        $('#insuranceType').val('property');
        setmenu(getPropertyMenu(), "Property Insurance");
        loadOccupations(false);
        loadRoofWallsTypes();
        $.mobile.changePage($("#personal-main-page"), "none");
    });


    //vehicle Used As
    $('#vehicleUsedAs').change(function() {
        var select_value = $(this).val();
        setVehicleUsedAs(select_value);
    });



    //medical history
    $('.medicalCondition').change(function() {
        var isChecked = false;
        $('.medicalCondition').each(function(index, element) {
            var checked_value = $(element).is(':checked');
            if (checked_value) {
                isChecked = true;
                return true;
            }
        });
        if (isChecked) {
            $('#medicalConditionDetails').show();
        } else {
            $('#medicalConditionDetails').hide();
        }
    });








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


    //garageOutBuildingClass
    $('#garageOutBuildingExists').change(function() {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('.garageOutBuildingClass').show();
        } else if (select_value == 'no') {
            $('.garageOutBuildingClass').hide();
        }
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


    $('#HomeAllRiskInsured').on('keyup', '.article-value input', function() {
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

    $('#homeInsuranceProperty').on('keyup', '.article-value input', function() {
        SetHomeInsuranceValue();
    });


    $('#HomeInsuranceContent .article-value').on('keyup', 'input', function() {
        var valList = [];
        $('#HomeInsuranceContent .article-value').find('input').each(function(index, element) {
            valList.push($(element).val());
        });
        $('#HomeInsuranceContentTotalAmount').val(GetTotal(valList));
    });

    ////totalValueExceedOneThirdTotalSum
    //$('#totalValueExceedOneThirdTotalSum').change(function () {
    //    var select_value = $(this).val();
    //    if (select_value == 'yes') {
    //        $('#totalValueExceedOneThirdTotalSumIfYesAmount').removeAttr('disabled'); //.show();
    //    }
    //    else if (select_value == 'no') {
    //        $('#totalValueExceedOneThirdTotalSumIfYesAmount').attr('disabled', 'disabled');
    //    }
    //});


    //homeInGoodState
    $('#homeInGoodState').change(function() {
        var select_value = $(this).val();
        if (select_value == 'no') {
            $('#divhomeInGoodStateDetails').show();
        } else if (select_value == 'yes') {
            $('#divhomeInGoodStateDetails').hide();
        }
    });


    //homeHasWatersideStructure
    $('#homeHasWatersideStructure').change(function() {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('#divhomeHasWatersideStructure').show();
        } else if (select_value == 'no') {
            $('#divhomeHasWatersideStructure').hide();
        }
    });



    //homeHaveInterestFromIndividual
    $('#homeHaveInterestFromIndividual').change(function() {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('#divhomeHaveInterestFromIndividual').show();
        } else if (select_value == 'no') {
            $('#divhomeHaveInterestFromIndividual').hide();
        }
    });




    //homeOccupiedByApplicantFamily
    $('#homeUsedForIncomeActivity').change(function() {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('#divhomeUsedForIncomeActivity').show();
        } else if (select_value == 'no') {
            $('#divhomeUsedForIncomeActivity').hide();
        }
    });

    //homeOccupiedByApplicantFamily
    $('#homeOccupiedByApplicantFamily').change(function() {
        var select_value = $(this).val();
        if (select_value == 'no') {
            $('#divhomeOccupiedByApplicantFamily').show();
        } else if (select_value == 'yes') {
            $('#divhomeOccupiedByApplicantFamily').hide();
        }
    });


    //applicantRelativeInPublicOffice
    $('#applicantRelativeInPublicOffice').change(function() {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('#publicofficerelation').show();
        } else if (select_value == 'no') {
            $('#publicofficerelation').hide();
        }
    });

    //homeInGoodState
    $('#homeInGoodState').change(function() {
        var select_value = $(this).val();
        if (select_value == 'no') {
            $('#divhomeInGoodStateDetails').show();
        } else if (select_value == 'yes') {
            $('#divhomeInGoodStateDetails').hide();
        }
    });

    //currentPolicyWithCompanyOrInsurer
    $('#currentPolicyWithCompanyOrInsurer').change(function() {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('#divcurrentPolicyWithCompanyOrInsurerDetails').show();
        } else if (select_value == 'no') {
            $('#divcurrentPolicyWithCompanyOrInsurerDetails').hide();
        }
    });

    //HomeInsuranceDeclined
    $('#HomeInsuranceDeclined').change(function() {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('#divHomeInsuranceDeclined').show();
        } else if (select_value == 'no') {
            $('#divHomeInsuranceDeclined').hide();
        }
    });

    //HomeInsuranceRequiredSpecialTerm
    $('#HomeInsuranceRequiredSpecialTerm').change(function() {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('#divHomeInsuranceRequiredSpecialTermDetails').show();
        } else if (select_value == 'no') {
            $('#divHomeInsuranceRequiredSpecialTermDetails').hide();
        }
    });

    //HomeInsuranceCancelled
    $('#HomeInsuranceCancelled').change(function() {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('#divHomeInsuranceCancelledDetails').show();
        } else if (select_value == 'no') {
            $('#divHomeInsuranceCancelledDetails').hide();
        }
    });

    //HomeInsuranceIncreasedPremium
    $('#HomeInsuranceIncreasedPremium').change(function() {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('#divHomeInsuranceIncreasedPremiumDetails').show();
        } else if (select_value == 'no') {
            $('#divHomeInsuranceIncreasedPremiumDetails').hide();
        }
    });

    //HomeInsurancePerilsSuffer
    $('#HomeInsurancePerilsSuffer').change(function() {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('#divHomeInsurancePerilsSufferDetails').show();
        } else if (select_value == 'no') {
            $('#divHomeInsurancePerilsSufferDetails').hide();
        }
    });

    //HomeInsuranceSufferLoss
    $('#HomeInsuranceSufferLoss').change(function() {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('#divHomeInsuranceSufferLossDetails').show();
        } else if (select_value == 'no') {
            $('#divHomeInsuranceSufferLossDetails').hide();
        }
    });



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




    //lienHolder
    $('#lienHolder').change(function() {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('.lienHolderClass').show();
        } else if (select_value == 'no') {
            $('.lienHolderClass').hide();
        }
    });

    //accidents
    $('#involvedInAccident').change(function() {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('.involvedInAccidentClass').show();
        } else if (select_value == 'no') {
            $('.involvedInAccidentClass').hide();
        }
    });




    //vehicle to be insured
    $('#isOwnerOfVehicle').change(function() {
        var select_value = $(this).val();
        if (select_value == 'no') {
            $('.vehicleNameAddressOfOwner').show();
        } else if (select_value == 'yes') {
            $('.vehicleNameAddressOfOwner').hide();
        }
    });

    $('#vehicleToBeInsuredCtrl').on('click', '.Add', function() {
        var elementGroup = $(this).parent().parent().parent();
        cloneElement(elementGroup);
        resetVehiclesToBeInsured();
    });

    $('#vehicleToBeInsuredCtrl').on('click', '.Delete', function() {
        var elementGroup = $(this).parent().parent().parent();
        elementGroup.remove();
        resetVehiclesToBeInsured();
    });

    //anti-theft device
    $('#vehicleAntiTheftDevice').change(function() {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('.VehicleAntiTheftDeviceProviderClass').show();
        } else if (select_value == 'no') {
            $('.VehicleAntiTheftDeviceProviderClass').hide();
        }
    });

    //vehicleRegularCustodyDetails
    $('#vehicleRegularCustody').change(function() {
        var select_value = $(this).val();
        if (select_value == 'no') {
            $('.vehicleRegularCustodyDetailsClass').show();
        } else if (select_value == 'yes') {
            $('.vehicleRegularCustodyDetailsClass').hide();
        }
    });

    //vehicleGaragedAtProposersHome
    $('#vehicleGaragedAtProposersHome').change(function() {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('.vehicleGaragedAtProposersHomeDetailsClass').hide();
        } else if (select_value == 'no') {
            $('.vehicleGaragedAtProposersHomeDetailsClass').show();
        }
    });

    //vehicleKeptIn
    $('input[type=radio][name=vehicleKeptIn]').change(function() {
        var select_value = $(this).val();
        if (select_value == 'vehicleKeptInOther') {
            $('.vehicleKeptInOtherClass').show();
        } else {
            $('.vehicleKeptInOtherClass').hide();
        }
    });

    //proposerInsured
    $('#proposerInsured').change(function() {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('.proposerInsuranceDetailsClass').show();
        } else if (select_value == 'no') {
            $('.proposerInsuranceDetailsClass').hide();
        }
    });


    //proposerEntitledToNOClaimDiscount
    $('#proposerEntitledToNOClaimDiscount').change(function() {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('#proposerEntitledToNOClaimDiscountProof').show();
        } else if (select_value == 'no') {
            $('#proposerEntitledToNOClaimDiscountProof').hide();
        }
    });

    //applicantOtherInsurer
    $('#applicantOtherInsurer').change(function() {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('.applicantOtherInsurerTypeClass').show();
        } else if (select_value == 'no') {
            $('.applicantOtherInsurerTypeClass').hide();
        }
    });

    //applicantOtherInsurer
    $('#applicantPreviouslyInsured').change(function() {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('.ApplicantPreviouslyInsuredClass').show();
        } else if (select_value == 'no') {
            $('.ApplicantPreviouslyInsuredClass').hide();
        }
    });


    $('#mailingAddressSame').change(function() {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('#mailingAddress').hide();
        } else if (select_value == 'no') {
            $('#mailingAddress').show();
        }
    });


    $('#applicantHomeCountry').change(function() {
        var select_value = $(this).val();
        if (select_value == "JM") {
            $('#homeAddress .jamaica').show();
            $('#homeAddress .international').hide();
        } else {
            $('#homeAddress .jamaica').hide();
            $('#homeAddress .international').show();
        }
    });


    $('#applicantMailCountry').change(function() {
        var select_value = $(this).val();
        if (select_value == "JM") {
            $('#mailingAddress').find('.jamaica').show();
            $('#mailingAddress').find('.international').hide();
        } else {
            $('#mailingAddress').find('.jamaica').hide();
            $('#mailingAddress').find('.international').show();
        }
    });


    $('#employerNationality').change(function() {
        var select_value = $(this).val();
        if (select_value == "JM") {
            $('#employer').find('.jamaica').show();
            $('#employer').find('.international').hide();
        } else {
            $('#employer').find('.jamaica').hide();
            $('#employer').find('.international').show();
        }
    });

} //);






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
    if (towns) {
        var $select = $('#' + townId).empty();
        var justIn = true;
        $.each(towns, function(idx, value) {
            $select.append('<option value="' + value + '">' + value + '</option>');
            if (justIn) {
                $select.prop("selected", true);
                justIn = false;
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
    $('#InexperiencedDriverBlock input').prop('checked', false); // Unchecks it
    $('#InexperiencedDriverBlock label, #InexperiencedDriverBlock input').hide();
    //$('label[for=a], input#a').hide();
    //show relevant inputs
    switch (select_value) {
        case "CarriageOwnGoods": //private commercial
        case "CarriagePassengersNotHire": //private commercial
        case "CarriagePassengersHire": //private commercial
        case "CommercialTravelling": //private commercial
            $('label[for=23YearsOldPrivateCommercial], input#23YearsOldPrivateCommercial').show();
            $('label[for=36MonthsGeneralLicencePrivateCommercial], input#36MonthsGeneralLicencePrivateCommercial').show();
            break;
        case "GeneralCartage": //General Cartage
            $('label[for=25YearsOldGeneralCartage], input#25YearsOldGeneralCartage').show();
            $('label[for=5YearsGeneralLicencePublicCommercial], input#5YearsGeneralLicencePublicCommercial').show();
            break;
        case "SocialDomesticPleasure": //private car
        case "SocialDomesticPleasureBusiness": //private car
            $('label[for=21YearsOldPrivateCars], input#21YearsOldPrivateCars').show();
            $('label[for=24MonthsPrivateLicence], input#24MonthsPrivateLicence').show();
            break;
    }
}


function loadOccupations(isMotor) {
    var options = JSON.parse(localStorage.getItem(_IronRockPreliminaryData));
    $('#applicantOccupation').empty();
    $.each(options.occupations.data, function(key, value) {
        $('#applicantOccupation').append('<option value="' + value.occupation.trim() + '">' + value.occupation + '</option>');
        if (isMotor) {
            $('#regularDriversOccupation0').append('<option value="' + value.occupation.trim() + '">' + value.occupation + '</option>');
        }
    });
}

function loadRoofWallsTypes() {
    var options = JSON.parse(localStorage.getItem(_IronRockPreliminaryData));
    //wall
    $('#constructionExternalWalls').empty();
    $.each(options.wallTypes.data, function(key, value) {
        $('#constructionExternalWalls').append('<option value="' + value + '">' + value + '</option>');
    });

    //roof
    $('#constructionRoof').empty();
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

function resetVehiclesToBeInsured() {
    var objectList = [{
        "class": "registration",
        "name": "vehicleRegistrationNo"
    }, {
        "class": "make",
        "name": "vehicleMake"
    }, {
        "class": "model",
        "name": "vehicleModel"
    }, {
        "class": "engine",
        "name": "vehicleEngineNo"
    }, {
        "class": "chassis",
        "name": "vehicleChassisNo"
    }, {
        "class": "year",
        "name": "vehicleYearOfMake"
    }, {
        "class": "rating",
        "name": "vehicleCcRating"
    }, {
        "class": "seating",
        "name": "vehicleSeating"
    }, {
        "class": "body",
        "name": "vehicleTypeOfBody"
    }, {
        "class": "insured",
        "name": "vehicleSumInsured"
    }, {
        "class": "trailer",
        "name": "vehicleTrailerUsed"
    }];
    var elementClass = $('.vehicleToBeInsured');
    resetObjects(objectList, elementClass, "Add", "Delete", "Vehicle", true);
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
        if (g_profile.brokerDetails && g_profile.brokerDetails.logo) {
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
}

function loadParishes() {
    var options = ConvertToJson(localStorage.getItem(_IronRockPreliminaryData));
    var parishElements = $('.parish');
    parishElements.each(function(index, item) {
        var selectObj = $(this).empty();
        $.each(options.ParishTowns.data, function(i, json) {
            selectObj.append('<option value="' + json.parish + '">' + json.parish + '</option>');
        });
    });
}

//clone element
function cloneElement(elementGroup) {
    var clone = elementGroup.clone().insertAfter(elementGroup);
    clone.find("input[type=text],input[type=number],textarea").val("");
    clone.show();
}

//default Elements
function removeElementsExceptFirst(RadioName) {
    switch (RadioName) {
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
    "hex": "#EFDECD",
    "name": "Almond",
    "rgb": "(239, 222, 205)"
}, {
    "hex": "#CD9575",
    "name": "Antique Brass",
    "rgb": "(205, 149, 117)"
}, {
    "hex": "#FDD9B5",
    "name": "Apricot",
    "rgb": "(253, 217, 181)"
}, {
    "hex": "#78DBE2",
    "name": "Aquamarine",
    "rgb": "(120, 219, 226)"
}, {
    "hex": "#87A96B",
    "name": "Asparagus",
    "rgb": "(135, 169, 107)"
}, {
    "hex": "#FFA474",
    "name": "Atomic Tangerine",
    "rgb": "(255, 164, 116)"
}, {
    "hex": "#FAE7B5",
    "name": "Banana Mania",
    "rgb": "(250, 231, 181)"
}, {
    "hex": "#9F8170",
    "name": "Beaver",
    "rgb": "(159, 129, 112)"
}, {
    "hex": "#FD7C6E",
    "name": "Bittersweet",
    "rgb": "(253, 124, 110)"
}, {
    "hex": "#000000",
    "name": "Black",
    "rgb": "(0,0,0)"
}, {
    "hex": "#ACE5EE",
    "name": "Blizzard Blue",
    "rgb": "(172, 229, 238)"
}, {
    "hex": "#1F75FE",
    "name": "Blue",
    "rgb": "(31, 117, 254)"
}, {
    "hex": "#A2A2D0",
    "name": "Blue Bell",
    "rgb": "(162, 162, 208)"
}, {
    "hex": "#6699CC",
    "name": "Blue Gray",
    "rgb": "(102, 153, 204)"
}, {
    "hex": "#0D98BA",
    "name": "Blue Green",
    "rgb": "(13, 152, 186)"
}, {
    "hex": "#7366BD",
    "name": "Blue Violet",
    "rgb": "(115, 102, 189)"
}, {
    "hex": "#DE5D83",
    "name": "Blush",
    "rgb": "(222, 93, 131)"
}, {
    "hex": "#CB4154",
    "name": "Brick Red",
    "rgb": "(203, 65, 84)"
}, {
    "hex": "#B4674D",
    "name": "Brown",
    "rgb": "(180, 103, 77)"
}, {
    "hex": "#FF7F49",
    "name": "Burnt Orange",
    "rgb": "(255, 127, 73)"
}, {
    "hex": "#EA7E5D",
    "name": "Burnt Sienna",
    "rgb": "(234, 126, 93)"
}, {
    "hex": "#B0B7C6",
    "name": "Cadet Blue",
    "rgb": "(176, 183, 198)"
}, {
    "hex": "#FFFF99",
    "name": "Canary",
    "rgb": "(255, 255, 153)"
}, {
    "hex": "#1CD3A2",
    "name": "Caribbean Green",
    "rgb": "(28, 211, 162)"
}, {
    "hex": "#FFAACC",
    "name": "Carnation Pink",
    "rgb": "(255, 170, 204)"
}, {
    "hex": "#DD4492",
    "name": "Cerise",
    "rgb": "(221, 68, 146)"
}, {
    "hex": "#1DACD6",
    "name": "Cerulean",
    "rgb": "(29, 172, 214)"
}, {
    "hex": "#BC5D58",
    "name": "Chestnut",
    "rgb": "(188, 93, 88)"
}, {
    "hex": "#DD9475",
    "name": "Copper",
    "rgb": "(221, 148, 117)"
}, {
    "hex": "#9ACEEB",
    "name": "Cornflower",
    "rgb": "(154, 206, 235)"
}, {
    "hex": "#FFBCD9",
    "name": "Cotton Candy",
    "rgb": "(255, 188, 217)"
}, {
    "hex": "#FDDB6D",
    "name": "Dandelion",
    "rgb": "(253, 219, 109)"
}, {
    "hex": "#2B6CC4",
    "name": "Denim",
    "rgb": "(43, 108, 196)"
}, {
    "hex": "#EFCDB8",
    "name": "Desert Sand",
    "rgb": "(239, 205, 184)"
}, {
    "hex": "#6E5160",
    "name": "Eggplant",
    "rgb": "(110, 81, 96)"
}, {
    "hex": "#CEFF1D",
    "name": "Electric Lime",
    "rgb": "(206, 255, 29)"
}, {
    "hex": "#71BC78",
    "name": "Fern",
    "rgb": "(113, 188, 120)"
}, {
    "hex": "#6DAE81",
    "name": "Forest Green",
    "rgb": "(109, 174, 129)"
}, {
    "hex": "#C364C5",
    "name": "Fuchsia",
    "rgb": "(195, 100, 197)"
}, {
    "hex": "#CC6666",
    "name": "Fuzzy Wuzzy",
    "rgb": "(204, 102, 102)"
}, {
    "hex": "#E7C697",
    "name": "Gold",
    "rgb": "(231, 198, 151)"
}, {
    "hex": "#FCD975",
    "name": "Goldenrod",
    "rgb": "(252, 217, 117)"
}, {
    "hex": "#A8E4A0",
    "name": "Granny Smith Apple",
    "rgb": "(168, 228, 160)"
}, {
    "hex": "#95918C",
    "name": "Gray",
    "rgb": "(149, 145, 140)"
}, {
    "hex": "#1CAC78",
    "name": "Green",
    "rgb": "(28, 172, 120)"
}, {
    "hex": "#1164B4",
    "name": "Green Blue",
    "rgb": "(17, 100, 180)"
}, {
    "hex": "#F0E891",
    "name": "Green Yellow",
    "rgb": "(240, 232, 145)"
}, {
    "hex": "#FF1DCE",
    "name": "Hot Magenta",
    "rgb": "(255, 29, 206)"
}, {
    "hex": "#B2EC5D",
    "name": "Inchworm",
    "rgb": "(178, 236, 93)"
}, {
    "hex": "#5D76CB",
    "name": "Indigo",
    "rgb": "(93, 118, 203)"
}, {
    "hex": "#CA3767",
    "name": "Jazzberry Jam",
    "rgb": "(202, 55, 103)"
}, {
    "hex": "#3BB08F",
    "name": "Jungle Green",
    "rgb": "(59, 176, 143)"
}, {
    "hex": "#FEFE22",
    "name": "Laser Lemon",
    "rgb": "(254, 254, 34)"
}, {
    "hex": "#FCB4D5",
    "name": "Lavender",
    "rgb": "(252, 180, 213)"
}, {
    "hex": "#FFF44F",
    "name": "Lemon Yellow",
    "rgb": "(255, 244, 79)"
}, {
    "hex": "#FFBD88",
    "name": "Macaroni and Cheese",
    "rgb": "(255, 189, 136)"
}, {
    "hex": "#F664AF",
    "name": "Magenta",
    "rgb": "(246, 100, 175)"
}, {
    "hex": "#AAF0D1",
    "name": "Magic Mint",
    "rgb": "(170, 240, 209)"
}, {
    "hex": "#CD4A4C",
    "name": "Mahogany",
    "rgb": "(205, 74, 76)"
}, {
    "hex": "#EDD19C",
    "name": "Maize",
    "rgb": "(237, 209, 156)"
}, {
    "hex": "#979AAA",
    "name": "Manatee",
    "rgb": "(151, 154, 170)"
}, {
    "hex": "#FF8243",
    "name": "Mango Tango",
    "rgb": "(255, 130, 67)"
}, {
    "hex": "#C8385A",
    "name": "Maroon",
    "rgb": "(200, 56, 90)"
}, {
    "hex": "#EF98AA",
    "name": "Mauvelous",
    "rgb": "(239, 152, 170)"
}, {
    "hex": "#FDBCB4",
    "name": "Melon",
    "rgb": "(253, 188, 180)"
}, {
    "hex": "#1A4876",
    "name": "Midnight Blue",
    "rgb": "(26, 72, 118)"
}, {
    "hex": "#30BA8F",
    "name": "Mountain Meadow",
    "rgb": "(48, 186, 143)"
}, {
    "hex": "#C54B8C",
    "name": "Mulberry",
    "rgb": "(197, 75, 140)"
}, {
    "hex": "#1974D2",
    "name": "Navy Blue",
    "rgb": "(25, 116, 210)"
}, {
    "hex": "#FFA343",
    "name": "Neon Carrot",
    "rgb": "(255, 163, 67)"
}, {
    "hex": "#BAB86C",
    "name": "Olive Green",
    "rgb": "(186, 184, 108)"
}, {
    "hex": "#FF7538",
    "name": "Orange",
    "rgb": "(255, 117, 56)"
}, {
    "hex": "#FF2B2B",
    "name": "Orange Red",
    "rgb": "(255, 43, 43)"
}, {
    "hex": "#F8D568",
    "name": "Orange Yellow",
    "rgb": "(248, 213, 104)"
}, {
    "hex": "#E6A8D7",
    "name": "Orchid",
    "rgb": "(230, 168, 215)"
}, {
    "hex": "#414A4C",
    "name": "Outer Space",
    "rgb": "(65, 74, 76)"
}, {
    "hex": "#FF6E4A",
    "name": "Outrageous Orange",
    "rgb": "(255, 110, 74)"
}, {
    "hex": "#1CA9C9",
    "name": "Pacific Blue",
    "rgb": "(28, 169, 201)"
}, {
    "hex": "#FFCFAB",
    "name": "Peach",
    "rgb": "(255, 207, 171)"
}, {
    "hex": "#C5D0E6",
    "name": "Periwinkle",
    "rgb": "(197, 208, 230)"
}, {
    "hex": "#FDDDE6",
    "name": "Piggy Pink",
    "rgb": "(253, 221, 230)"
}, {
    "hex": "#158078",
    "name": "Pine Green",
    "rgb": "(21, 128, 120)"
}, {
    "hex": "#FC74FD",
    "name": "Pink Flamingo",
    "rgb": "(252, 116, 253)"
}, {
    "hex": "#F78FA7",
    "name": "Pink Sherbet",
    "rgb": "(247, 143, 167)"
}, {
    "hex": "#8E4585",
    "name": "Plum",
    "rgb": "(142, 69, 133)"
}, {
    "hex": "#7442C8",
    "name": "Purple Heart",
    "rgb": "(116, 66, 200)"
}, {
    "hex": "#9D81BA",
    "name": "Purple Mountain's Majesty",
    "rgb": "(157, 129, 186)"
}, {
    "hex": "#FE4EDA",
    "name": "Purple Pizzazz",
    "rgb": "(254, 78, 218)"
}, {
    "hex": "#FF496C",
    "name": "Radical Red",
    "rgb": "(255, 73, 108)"
}, {
    "hex": "#D68A59",
    "name": "Raw Sienna",
    "rgb": "(214, 138, 89)"
}, {
    "hex": "#714B23",
    "name": "Raw Umber",
    "rgb": "(113, 75, 35)"
}, {
    "hex": "#FF48D0",
    "name": "Razzle Dazzle Rose",
    "rgb": "(255, 72, 208)"
}, {
    "hex": "#E3256B",
    "name": "Razzmatazz",
    "rgb": "(227, 37, 107)"
}, {
    "hex": "#EE204D",
    "name": "Red",
    "rgb": "(238,32 ,77 )"
}, {
    "hex": "#FF5349",
    "name": "Red Orange",
    "rgb": "(255, 83, 73)"
}, {
    "hex": "#C0448F",
    "name": "Red Violet",
    "rgb": "(192, 68, 143)"
}, {
    "hex": "#1FCECB",
    "name": "Robin's Egg Blue",
    "rgb": "(31, 206, 203)"
}, {
    "hex": "#7851A9",
    "name": "Royal Purple",
    "rgb": "(120, 81, 169)"
}, {
    "hex": "#FF9BAA",
    "name": "Salmon",
    "rgb": "(255, 155, 170)"
}, {
    "hex": "#FC2847",
    "name": "Scarlet",
    "rgb": "(252, 40, 71)"
}, {
    "hex": "#76FF7A",
    "name": "Screamin' Green",
    "rgb": "(118, 255, 122)"
}, {
    "hex": "#9FE2BF",
    "name": "Sea Green",
    "rgb": "(159, 226, 191)"
}, {
    "hex": "#A5694F",
    "name": "Sepia",
    "rgb": "(165, 105, 79)"
}, {
    "hex": "#8A795D",
    "name": "Shadow",
    "rgb": "(138, 121, 93)"
}, {
    "hex": "#45CEA2",
    "name": "Shamrock",
    "rgb": "(69, 206, 162)"
}, {
    "hex": "#FB7EFD",
    "name": "Shocking Pink",
    "rgb": "(251, 126, 253)"
}, {
    "hex": "#CDC5C2",
    "name": "Silver",
    "rgb": "(205, 197, 194)"
}, {
    "hex": "#80DAEB",
    "name": "Sky Blue",
    "rgb": "(128, 218, 235)"
}, {
    "hex": "#ECEABE",
    "name": "Spring Green",
    "rgb": "(236, 234, 190)"
}, {
    "hex": "#FFCF48",
    "name": "Sunglow",
    "rgb": "(255, 207, 72)"
}, {
    "hex": "#FD5E53",
    "name": "Sunset Orange",
    "rgb": "(253, 94, 83)"
}, {
    "hex": "#FAA76C",
    "name": "Tan",
    "rgb": "(250, 167, 108)"
}, {
    "hex": "#18A7B5",
    "name": "Teal Blue",
    "rgb": "(24, 167, 181)"
}, {
    "hex": "#EBC7DF",
    "name": "Thistle",
    "rgb": "(235, 199, 223)"
}, {
    "hex": "#FC89AC",
    "name": "Tickle Me Pink",
    "rgb": "(252, 137, 172)"
}, {
    "hex": "#DBD7D2",
    "name": "Timberwolf",
    "rgb": "(219, 215, 210)"
}, {
    "hex": "#17806D",
    "name": "Tropical Rain Forest",
    "rgb": "(23, 128, 109)"
}, {
    "hex": "#DEAA88",
    "name": "Tumbleweed",
    "rgb": "(222, 170, 136)"
}, {
    "hex": "#77DDE7",
    "name": "Turquoise Blue",
    "rgb": "(119, 221, 231)"
}, {
    "hex": "#FFFF66",
    "name": "Unmellow Yellow",
    "rgb": "(255, 255, 102)"
}, {
    "hex": "#926EAE",
    "name": "Violet (Purple)",
    "rgb": "(146, 110, 174)"
}, {
    "hex": "#324AB2",
    "name": "Violet Blue",
    "rgb": "(50, 74, 178)"
}, {
    "hex": "#F75394",
    "name": "Violet Red",
    "rgb": "(247, 83, 148)"
}, {
    "hex": "#FFA089",
    "name": "Vivid Tangerine",
    "rgb": "(255, 160, 137)"
}, {
    "hex": "#8F509D",
    "name": "Vivid Violet",
    "rgb": "(143, 80, 157)"
}, {
    "hex": "#FFFFFF",
    "name": "White",
    "rgb": "(255, 255, 255)"
}, {
    "hex": "#A2ADD0",
    "name": "Wild Blue Yonder",
    "rgb": "(162, 173, 208)"
}, {
    "hex": "#FF43A4",
    "name": "Wild Strawberry",
    "rgb": "(255, 67, 164)"
}, {
    "hex": "#FC6C85",
    "name": "Wild Watermelon",
    "rgb": "(252, 108, 133)"
}, {
    "hex": "#CDA4DE",
    "name": "Wisteria",
    "rgb": "(205, 164, 222)"
}, {
    "hex": "#FCE883",
    "name": "Yellow",
    "rgb": "(252, 232, 131)"
}, {
    "hex": "#C5E384",
    "name": "Yellow Green",
    "rgb": "(197, 227, 132)"
}, {
    "hex": "#FFAE42",
    "name": "Yellow Orange",
    "rgb": "(255, 174, 66)"
}];
