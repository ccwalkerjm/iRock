// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
////////////outside functions


////stop default initialization
$(document).on("mobileinit", function () {
    $.mobile.autoInitializePage = false;
});

//$(document).one("pagebeforeshow", "#page-signature", function () {
//    $(':mobile-pagecontainer').pagecontainer('change', '#main-page');  
//});

document.addEventListener('deviceready', onDeviceReady.bind(this), false);

function onDeviceReady() {
    // Handle the Cordova pause and resume events
    document.addEventListener('pause', onPause.bind(this), false);
    document.addEventListener('resume', onResume.bind(this), false);

    window.location.hash = 'main-page';
    // #initialise jQM
    $.mobile.initializePage();
};

function onPause() {
    // TODO: This application has been suspended. Save application state here.
};

function onResume() {
    // TODO: This application has been reactivated. Restore application state here.
};



var sigCapture = null;
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

    sigCapture = new SignatureCapture("signature");
    $('#submit-btn').click(function () {
        var sig = sigCapture.toString();
        $('#signatureBytes').val(sig);
        var data = $('form').serialize();
        alert(data);
    });

    $('#clear-canvas').click(function () {
        var sig = sigCapture.clear();
    });

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
    //validate function
    loadCountriesOptions();

});




//functions
function loadCountriesOptions() {
    $('.countries').each(function (index, item) {
        var selectObj = $(this);
        selectObj.html('');
        $.each(_countries, function (i, json) {
            if (json.code == 'JM') {
                selectObj.append('<option value="' + json.code + '" selected="selected">' + json.name + '</option>');
            } else {
                selectObj.append('<option value="' + json.code + '">' + json.name + '</option>');
            }
        });
    });
}


function resetApplicantRelativeInPublicOffice() {

    var  Office = "applicantRelativeTypePublicOffice";
    var Address = "applicantRelativeTypePublicAddress";
    var Relation = "applicantRelativeTypePublicRelation";
    var OfficeName = "applicantRelativeInPublicOfficeName";

    var objectList = [
   {"class":"office" var  Office = "applicantRelativeTypePublicOffice";
    var Address = "applicantRelativeTypePublicAddress";
    var Relation = "applicantRelativeTypePublicRelation";
    var OfficeName = "applicantRelativeInPublicOfficeName";
    ]

    resetObjects(objectList, elementClass, addBtnName, delBtnName, elementTitle);


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

function SignatureItem() {
    return { "name": "Signature", "value": "page-signature" };
}

function getPersonalMenu() {
    return [
       //{ "name": "Start Page", "value": "main-page" },
        { "name": "Personal Details", "value": "personal-main-page" },
        { "name": "Contact Details", "value": "personal-contact-page" },
        { "name": "Home Address", "value": "personal-home-address-page" },
        { "name": "Mailing Address", "value": "personal-mailing-address-page" },
        { "name": "Employer Details", "value": "personal-employer-details-page" },
        { "name": "Public Office Association", "value": "personal-relative-public-office-page" }
    ];
}

function getVehicleMenu() {
    var vehicleMenuList = [
        { "name": "Vehicle Particulars", "value": "vehicle-particulars-page" },
        { "name": "Vehicle Mortgagee Details", "value": "vehicle-mortgagee-details-page" },
        { "name": "Vehicle Particular Con't", "value": "vehicle-particular-continued" },
        { "name": "Other Drivers", "value": "vehicle-other-drivers-page" },
        { "name": "Driver Details", "value": "vehicle-driver-details-page" },
        { "name": "Vehicles Owned", "value": "vehicles-owned-page" },
        { "name": "Accidents", "value": "vehicle-accidents-page" },
        { "name": "Medical History", "value": "vehicle-medical-history-page" }
    ];
    var newList = getPersonalMenu().concat(vehicleMenuList);
    newList.push(SignatureItem());
    return newList;
}


function getPropertyMenu() {
    var propertyMenuList = [
        { "name": "Home Particulars", "value": "home-particulars-page" },
        { "name": "Home Particulars Con't", "value": "home-particulars-continued-page" },
        { "name": "Home Property Details", "value": "home-property-details-page" },
        { "name": "All Risk Insurance", "value": "home-all-risk-insurance-page" }
    ];
    var newList = getPersonalMenu().concat(propertyMenuList);
    newList.push(SignatureItem());
    return newList;
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



var _countries =
    [

  { "name": 'Afghanistan', "code": 'AF' },
  { "name": 'Åland Islands', "code": 'AX' },
  { "name": 'Albania', "code": 'AL' },
  { "name": 'Algeria', "code": 'DZ' },
  { "name": 'American Samoa', "code": 'AS' },
  { "name": 'AndorrA', "code": 'AD' },
  { "name": 'Angola', "code": 'AO' },
  { "name": 'Anguilla', "code": 'AI' },
  { "name": 'Antarctica', "code": 'AQ' },
  { "name": 'Antigua and Barbuda', "code": 'AG' },
  { "name": 'Argentina', "code": 'AR' },
  { "name": 'Armenia', "code": 'AM' },
  { "name": 'Aruba', "code": 'AW' },
  { "name": 'Australia', "code": 'AU' },
  { "name": 'Austria', "code": 'AT' },
  { "name": 'Azerbaijan', "code": 'AZ' },
  { "name": 'Bahamas', "code": 'BS' },
  { "name": 'Bahrain', "code": 'BH' },
  { "name": 'Bangladesh', "code": 'BD' },
  { "name": 'Barbados', "code": 'BB' },
  { "name": 'Belarus', "code": 'BY' },
  { "name": 'Belgium', "code": 'BE' },
  { "name": 'Belize', "code": 'BZ' },
  { "name": 'Benin', "code": 'BJ' },
  { "name": 'Bermuda', "code": 'BM' },
  { "name": 'Bhutan', "code": 'BT' },
  { "name": 'Bolivia', "code": 'BO' },
  { "name": 'Bosnia and Herzegovina', "code": 'BA' },
  { "name": 'Botswana', "code": 'BW' },
  { "name": 'Bouvet Island', "code": 'BV' },
  { "name": 'Brazil', "code": 'BR' },
  { "name": 'British Indian Ocean Territory', "code": 'IO' },
  { "name": 'Brunei Darussalam', "code": 'BN' },
  { "name": 'Bulgaria', "code": 'BG' },
  { "name": 'Burkina Faso', "code": 'BF' },
  { "name": 'Burundi', "code": 'BI' },
  { "name": 'Cambodia', "code": 'KH' },
  { "name": 'Cameroon', "code": 'CM' },
  { "name": 'Canada', "code": 'CA' },
  { "name": 'Cape Verde', "code": 'CV' },
  { "name": 'Cayman Islands', "code": 'KY' },
  { "name": 'Central African Republic', "code": 'CF' },
  { "name": 'Chad', "code": 'TD' },
  { "name": 'Chile', "code": 'CL' },
  { "name": 'China', "code": 'CN' },
  { "name": 'Christmas Island', "code": 'CX' },
  { "name": 'Cocos (Keeling) Islands', "code": 'CC' },
  { "name": 'Colombia', "code": 'CO' },
  { "name": 'Comoros', "code": 'KM' },
  { "name": 'Congo', "code": 'CG' },
  { "name": 'Congo, The Democratic Republic of the', "code": 'CD' },
  { "name": 'Cook Islands', "code": 'CK' },
  { "name": 'Costa Rica', "code": 'CR' },
  { "name": 'Cote D\'Ivoire', "code": 'CI' },
  { "name": 'Croatia', "code": 'HR' },
  { "name": 'Cuba', "code": 'CU' },
  { "name": 'Cyprus', "code": 'CY' },
  { "name": 'Czech Republic', "code": 'CZ' },
  { "name": 'Denmark', "code": 'DK' },
  { "name": 'Djibouti', "code": 'DJ' },
  { "name": 'Dominica', "code": 'DM' },
  { "name": 'Dominican Republic', "code": 'DO' },
  { "name": 'Ecuador', "code": 'EC' },
  { "name": 'Egypt', "code": 'EG' },
  { "name": 'El Salvador', "code": 'SV' },
  { "name": 'Equatorial Guinea', "code": 'GQ' },
  { "name": 'Eritrea', "code": 'ER' },
  { "name": 'Estonia', "code": 'EE' },
  { "name": 'Ethiopia', "code": 'ET' },
  { "name": 'Falkland Islands (Malvinas)', "code": 'FK' },
  { "name": 'Faroe Islands', "code": 'FO' },
  { "name": 'Fiji', "code": 'FJ' },
  { "name": 'Finland', "code": 'FI' },
  { "name": 'France', "code": 'FR' },
  { "name": 'French Guiana', "code": 'GF' },
  { "name": 'French Polynesia', "code": 'PF' },
  { "name": 'French Southern Territories', "code": 'TF' },
  { "name": 'Gabon', "code": 'GA' },
  { "name": 'Gambia', "code": 'GM' },
  { "name": 'Georgia', "code": 'GE' },
  { "name": 'Germany', "code": 'DE' },
  { "name": 'Ghana', "code": 'GH' },
  { "name": 'Gibraltar', "code": 'GI' },
  { "name": 'Greece', "code": 'GR' },
  { "name": 'Greenland', "code": 'GL' },
  { "name": 'Grenada', "code": 'GD' },
  { "name": 'Guadeloupe', "code": 'GP' },
  { "name": 'Guam', "code": 'GU' },
  { "name": 'Guatemala', "code": 'GT' },
  { "name": 'Guernsey', "code": 'GG' },
  { "name": 'Guinea', "code": 'GN' },
  { "name": 'Guinea-Bissau', "code": 'GW' },
  { "name": 'Guyana', "code": 'GY' },
  { "name": 'Haiti', "code": 'HT' },
  { "name": 'Heard Island and Mcdonald Islands', "code": 'HM' },
  { "name": 'Holy See (Vatican City State)', "code": 'VA' },
  { "name": 'Honduras', "code": 'HN' },
  { "name": 'Hong Kong', "code": 'HK' },
  { "name": 'Hungary', "code": 'HU' },
  { "name": 'Iceland', "code": 'IS' },
  { "name": 'India', "code": 'IN' },
  { "name": 'Indonesia', "code": 'ID' },
  { "name": 'Iran, Islamic Republic Of', "code": 'IR' },
  { "name": 'Iraq', "code": 'IQ' },
  { "name": 'Ireland', "code": 'IE' },
  { "name": 'Isle of Man', "code": 'IM' },
  { "name": 'Israel', "code": 'IL' },
  { "name": 'Italy', "code": 'IT' },
  { "name": 'Jamaica', "code": 'JM' },
  { "name": 'Japan', "code": 'JP' },
  { "name": 'Jersey', "code": 'JE' },
  { "name": 'Jordan', "code": 'JO' },
  { "name": 'Kazakhstan', "code": 'KZ' },
  { "name": 'Kenya', "code": 'KE' },
  { "name": 'Kiribati', "code": 'KI' },
  { "name": 'Korea, Democratic People\'S Republic of', "code": 'KP' },
  { "name": 'Korea, Republic of', "code": 'KR' },
  { "name": 'Kuwait', "code": 'KW' },
  { "name": 'Kyrgyzstan', "code": 'KG' },
  { "name": 'Lao People\'S Democratic Republic', "code": 'LA' },
  { "name": 'Latvia', "code": 'LV' },
  { "name": 'Lebanon', "code": 'LB' },
  { "name": 'Lesotho', "code": 'LS' },
  { "name": 'Liberia', "code": 'LR' },
  { "name": 'Libyan Arab Jamahiriya', "code": 'LY' },
  { "name": 'Liechtenstein', "code": 'LI' },
  { "name": 'Lithuania', "code": 'LT' },
  { "name": 'Luxembourg', "code": 'LU' },
  { "name": 'Macao', "code": 'MO' },
  { "name": 'Macedonia, The Former Yugoslav Republic of', "code": 'MK' },
  { "name": 'Madagascar', "code": 'MG' },
  { "name": 'Malawi', "code": 'MW' },
  { "name": 'Malaysia', "code": 'MY' },
  { "name": 'Maldives', "code": 'MV' },
  { "name": 'Mali', "code": 'ML' },
  { "name": 'Malta', "code": 'MT' },
  { "name": 'Marshall Islands', "code": 'MH' },
  { "name": 'Martinique', "code": 'MQ' },
  { "name": 'Mauritania', "code": 'MR' },
  { "name": 'Mauritius', "code": 'MU' },
  { "name": 'Mayotte', "code": 'YT' },
  { "name": 'Mexico', "code": 'MX' },
  { "name": 'Micronesia, Federated States of', "code": 'FM' },
  { "name": 'Moldova, Republic of', "code": 'MD' },
  { "name": 'Monaco', "code": 'MC' },
  { "name": 'Mongolia', "code": 'MN' },
  { "name": 'Montserrat', "code": 'MS' },
  { "name": 'Morocco', "code": 'MA' },
  { "name": 'Mozambique', "code": 'MZ' },
  { "name": 'Myanmar', "code": 'MM' },
  { "name": 'Namibia', "code": 'NA' },
  { "name": 'Nauru', "code": 'NR' },
  { "name": 'Nepal', "code": 'NP' },
  { "name": 'Netherlands', "code": 'NL' },
  { "name": 'Netherlands Antilles', "code": 'AN' },
  { "name": 'New Caledonia', "code": 'NC' },
  { "name": 'New Zealand', "code": 'NZ' },
  { "name": 'Nicaragua', "code": 'NI' },
  { "name": 'Niger', "code": 'NE' },
  { "name": 'Nigeria', "code": 'NG' },
  { "name": 'Niue', "code": 'NU' },
  { "name": 'Norfolk Island', "code": 'NF' },
  { "name": 'Northern Mariana Islands', "code": 'MP' },
  { "name": 'Norway', "code": 'NO' },
  { "name": 'Oman', "code": 'OM' },
  { "name": 'Pakistan', "code": 'PK' },
  { "name": 'Palau', "code": 'PW' },
  { "name": 'Palestinian Territory, Occupied', "code": 'PS' },
  { "name": 'Panama', "code": 'PA' },
  { "name": 'Papua New Guinea', "code": 'PG' },
  { "name": 'Paraguay', "code": 'PY' },
  { "name": 'Peru', "code": 'PE' },
  { "name": 'Philippines', "code": 'PH' },
  { "name": 'Pitcairn', "code": 'PN' },
  { "name": 'Poland', "code": 'PL' },
  { "name": 'Portugal', "code": 'PT' },
  { "name": 'Puerto Rico', "code": 'PR' },
  { "name": 'Qatar', "code": 'QA' },
  { "name": 'Reunion', "code": 'RE' },
  { "name": 'Romania', "code": 'RO' },
  { "name": 'Russian Federation', "code": 'RU' },
  { "name": 'RWANDA', "code": 'RW' },
  { "name": 'Saint Helena', "code": 'SH' },
  { "name": 'Saint Kitts and Nevis', "code": 'KN' },
  { "name": 'Saint Lucia', "code": 'LC' },
  { "name": 'Saint Pierre and Miquelon', "code": 'PM' },
  { "name": 'Saint Vincent and the Grenadines', "code": 'VC' },
  { "name": 'Samoa', "code": 'WS' },
  { "name": 'San Marino', "code": 'SM' },
  { "name": 'Sao Tome and Principe', "code": 'ST' },
  { "name": 'Saudi Arabia', "code": 'SA' },
  { "name": 'Senegal', "code": 'SN' },
  { "name": 'Serbia and Montenegro', "code": 'CS' },
  { "name": 'Seychelles', "code": 'SC' },
  { "name": 'Sierra Leone', "code": 'SL' },
  { "name": 'Singapore', "code": 'SG' },
  { "name": 'Slovakia', "code": 'SK' },
  { "name": 'Slovenia', "code": 'SI' },
  { "name": 'Solomon Islands', "code": 'SB' },
  { "name": 'Somalia', "code": 'SO' },
  { "name": 'South Africa', "code": 'ZA' },
  { "name": 'South Georgia and the South Sandwich Islands', "code": 'GS' },
  { "name": 'Spain', "code": 'ES' },
  { "name": 'Sri Lanka', "code": 'LK' },
  { "name": 'Sudan', "code": 'SD' },
  { "name": 'Suriname', "code": 'SR' },
  { "name": 'Svalbard and Jan Mayen', "code": 'SJ' },
  { "name": 'Swaziland', "code": 'SZ' },
  { "name": 'Sweden', "code": 'SE' },
  { "name": 'Switzerland', "code": 'CH' },
  { "name": 'Syrian Arab Republic', "code": 'SY' },
  { "name": 'Taiwan, Province of China', "code": 'TW' },
  { "name": 'Tajikistan', "code": 'TJ' },
  { "name": 'Tanzania, United Republic of', "code": 'TZ' },
  { "name": 'Thailand', "code": 'TH' },
  { "name": 'Timor-Leste', "code": 'TL' },
  { "name": 'Togo', "code": 'TG' },
  { "name": 'Tokelau', "code": 'TK' },
  { "name": 'Tonga', "code": 'TO' },
  { "name": 'Trinidad and Tobago', "code": 'TT' },
  { "name": 'Tunisia', "code": 'TN' },
  { "name": 'Turkey', "code": 'TR' },
  { "name": 'Turkmenistan', "code": 'TM' },
  { "name": 'Turks and Caicos Islands', "code": 'TC' },
  { "name": 'Tuvalu', "code": 'TV' },
  { "name": 'Uganda', "code": 'UG' },
  { "name": 'Ukraine', "code": 'UA' },
  { "name": 'United Arab Emirates', "code": 'AE' },
  { "name": 'United Kingdom', "code": 'GB' },
  { "name": 'United States', "code": 'US' },
  { "name": 'United States Minor Outlying Islands', "code": 'UM' },
  { "name": 'Uruguay', "code": 'UY' },
  { "name": 'Uzbekistan', "code": 'UZ' },
  { "name": 'Vanuatu', "code": 'VU' },
  { "name": 'Venezuela', "code": 'VE' },
  { "name": 'Viet Nam', "code": 'VN' },
  { "name": 'Virgin Islands, British', "code": 'VG' },
  { "name": 'Virgin Islands, U.S.', "code": 'VI' },
  { "name": 'Wallis and Futuna', "code": 'WF' },
  { "name": 'Western Sahara', "code": 'EH' },
  { "name": 'Yemen', "code": 'YE' },
  { "name": 'Zambia', "code": 'ZM' },
  { "name": 'Zimbabwe', "code": 'ZW' }
    ];





function resetObjects(objectList, elementClass, addBtnName, delBtnName,elementTitle) {
    var firstElement = elementClass.first();
    var lastElement = elementClass.last();
    var i = 0;

    elementClass.each(function (index, e) {
        var element = $(this);
        //change ids and names
        objectList.each(function (i, item) {
            element.find('.' + item.class + ' input').attr('id', item.name + i).attr('name', item.name + i);
            element.find('.' + item.class + ' label').attr('for', item.name + i);
        })       

        //set controls
        if (element.is(firstElement) && element.is(lastElement)) {
            firstElement.find('.'+delBtnName).hide();
            lastElement.find('.'+addBtnName).show();
        }
        else if (element.is(firstElement)) {
            element.find('.' + delBtnName).hide();
            element.find('.' + addBtnName).hide();
        } else if (element.is(lastElement)) {
            element.find('.' + delBtnName).show();
            element.find('.' + addBtnName).show();
        }
        else {
            element.find('.' + delBtnName).hide();
            element.find('.' + addBtnName).hide();
        }
        //change title
        element.find('h4').text(elementTitle+' ' + ++i);
    });
}