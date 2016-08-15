// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
////////////outside functions




//$(document).on("mobileinit", function () {
//    $.mobile.autoInitializePage = false;
//});

//var _apiBaseUrl = "https://api.courserv.com/ironrock"; //localhost:58633/api/";
//var _contentBaseUrl = "https://cdn.courserv.com/ironrock";
var _PreliminaryData = "PreliminaryData";
var g_ironrock_service; //AWS services
var g_profile;

var g_signatureChangeCount = 0; //signature based data;

$(document).ready(function (e) {
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
	//doPrimaryFunctions();
	//special events
	//$(':mobile-pagecontainer').pagecontainer('change', '#main-page');
	////
	loadingSpinner(true, $('#main-page'));

	g_ironrock_service = new ironrockcloudservice(function (err, $this) {
		if (err) {
			loadingSpinner();
			g_ironrock_service.signoff();
			///show login page
			$('#main-page-login').hide();
			$('#main-page-selection').hide();
			alert("Network/System Error Detected! Please reboot!")
			return;
		}
		doPrimaryFunctions();
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
	if (imgData)
		$('#brokerLogo').attr('src', imgData);
	else
		$('#brokerLogo').removeAttr('src');
}

//set when user is logged in
function setUserProfile(obj) {
	obj = obj || g_ironrock_service;
	obj.getProfile(function (err, data) {
		if (err) {
			alert(err.message);
			loadingSpinner();
		} else {
			g_profile = data;
			if (g_profile.brokerDetails && g_profile.brokerDetails.logo) {
				setBrokerLogo(g_profile.brokerDetails.logo);
			} else {
				setBrokerLogo();
			}
			//load miscellaneous items	
			loadOptions(obj, function (err) {
				if (err) {
					obj.signoff();
					$('#main-page-login').show();
					$('#main-page-selection').hide();
					loadingSpinner();
					alert("Network/System Error Detected! Please Try Again!")
				} else {
					$('#main-page-login').hide();
					$('#main-page-selection').show();
					doMiscellaneous();
					doSpecialEvents();
					loadingSpinner();
				}
			})
		}
	});
}


//$(document).ready(function (e) {
function doPrimaryFunctions(callback) {

	$('#main-page').on('click', '#login-submit', function () {
		//set loading
		loadingSpinner(true, $(this));


		var username = $('#main-page #username').val();
		var password = $('#main-page #password').val();

		g_ironrock_service.signin(username, password, function (err, $this) {
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
	$(document).one("pagebeforeshow", "#vehicle-driver-details-page", function () {
		if (!$('#regularDriversId').is(":visible")) {
			//var occupation = $('#applicantOccupation').val();
			var occupationIndex = $("#applicantOccupation option:selected").index()
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
	$('#regularDriversBtns').on('click', '.Add', function () {
		var $this = $('#regularDriversBtns .Add');
		var id = $('#regularDriverQueryID').val();
		addDriver($this, id, function (err, r) {
			if (err) {
				alert("error: " + err.statusText);
			}
			if (!err) {
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
				$('.regularDriversCls:last .DateOfBirth input').val(r.dateOfBirth.substring(0, 10));
				$('.regularDriversCls:last .DriversDL input').val(id);

				$('.regularDriversCls:last .DriversDLExpirationDate input').val('2020-06-22');
				$('.regularDriversCls:last .DriversDLOriginalDateOfIssue input').val('2000-06-22');
			}
		});
	});

	$('#regularDriversBtns').on('click', '.Reset', function () {
		$('.regularDriversCls').not('.regularDriversCls:first').remove();
		$('.regularDriversCls').find('input:text').val('');
		$('#regularDriversId').hide()
		resetRegularDriver();
	});

	///
	///////
	$('#personal-main-page').on('click', '#getTRNDetails', function () {
		loadingSpinner(true, $(this));

		var id = $('#applicantTRN').val();
		g_ironrock_service.getDriverLicenseDetails(id, function (err, r) {
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

	$('#personal-main-page').on('click', '#clearTRNDetails', function () {
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
	$('#page-signature').on('click', '#clear-canvas', function () {
		$('#signature').jSignature('clear');
		g_signatureChangeCount = 0;
	});


	/////Final//////////////////////
	$('#page-signature').on('click', '#submit-btn', function () {
		//add signature to form
		var sig = $('#signature').jSignature("getData", "svgbase64"); // jSignature("getData", "base30");
		if (g_signatureChangeCount == 0) {
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
		g_ironrock_service.submitQuote(formData, function (err, r) {
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

	$(document).on("pagebeforeshow", "#taxOfficeVehicleDialog", function () {
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


	$('#QueryVehicleMake').change(function () {
		loadVehicleModels();
	});


	//manual entry
	$('#taxOfficeVehicleDialog').on("click", "#queryVehicleAdd", function () {
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


	$('#taxOfficeVehicleDialog').on("click", "#queryVehicleSearch", function () {
		var plateno = $('#QueryVehicleRegistrationNo').val();
		var chassisno = $('#QueryVehicleChassisNo').val();

		//validate first
		if (plateno == null && chassisno == null) {
			alert("Registration No and Chassis No cannot be blank");
			return;
		}

		if ($('#QueryVehicleSumInsured').val() < 1000) {
			alert('Invalid Sum Insured!');
			return;
		}

		/*if (!VehicleRegistrationNo) {
		    alert("Not valid!");
		} else if (IsDuplicate(VehicleRegistrationNo)) {
		    alert('Duplicate!');
		}*/

		//set loading
		loadingSpinner(true, $(this));

		//use lambda to get vehcile details
		g_ironrock_service.getVehicleDetails(plateno, chassisno, function (err, data) {
			loadingSpinner();
			if (err) {
				alert("Err:" + err.statusText);
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
				}

			}
		});

	}).on("click", "#queryVehicleSearchStop", function () {
		loadingSpinner();
	});


}

//);

/*$(document).live('pagebeforeshow', function () {
	alert($.mobile.activePage.attr('id'));
});*/


function ConvertToJson(r) {
	try {
		r = JSON.parse(r);
		r = JSON.parse(r);
		r = JSON.parse(r);
	} catch (e) {
		// not json
	}
	return r;
}




/*
function setUserProfile(obj) {
	var username = obj.getUsername();
	obj.getUser(username, function (err, data) {
		if (err) {
			alert(err.message);
			loadingSpinner();
		} else {
			localStorage.setItem("ironrockUserProfile", data.Payload);
			//load miscellaneous items	
			loadOptions(obj, function (err) {
				if (err) {
					obj.signoff();
					$('#main-page-login').show();
					$('#main-page-selection').hide();
					loadingSpinner();
					alert("Network/System Error Detected! Please Try Again!")
				} else {
					$('#main-page-login').hide();
					$('#main-page-selection').show();
					doMiscellaneous();
					doSpecialEvents();
					loadingSpinner();
				}
			})
		}
	});
}
*/




function loadOptions(obj, callback) {
	var prelimData = localStorage.getItem(_PreliminaryData);
	if (prelimData && prelimData != "null") {
		callback(null);
	} else {
		obj.getMiscOptions(function (err, json) {
			if (err) {
				callback(err);
			} else {
				json = ConvertToJson(json);
				localStorage.setItem(_PreliminaryData, JSON.stringify(json));
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


function doSpecialEvents() {
	//initialize signature app
	$('#page-signature').on('pageshow', function (e, data) {
		if ($('#signature').find('.jSignature').length === 0) {
			$('#signature').jSignature({
				'UndoButton': false,
				color: "#000000",
				lineWidth: 1
			});
			//check signature 
			$("#signature").bind('change', function (e) {
				/* 'e.target' will refer to div with "#signature" */
				g_signatureChangeCount = g_signatureChangeCount + 1;
			});
		}
	});


	//go tp home page
	$('[data-role=header]').on('click', '.home', function (event, ui) {
		navigator.app.loadUrl("file:///android_asset/www/index.html", {
			wait: 2000,
			loadingDialog: "Wait,Loading App",
			loadUrlTimeoutValue: 60000
		});
	});


	//exit app
	$(document).on('click', '.exitApp', function (event, ui) {
		//g_ironrock_service.signoff();
		navigator.app.exitApp();
	});

	//reload app
	$(document).on('click', '.reload', function (event, ui) {
		$("form").trigger('reset');
		//location.ass.reload();
		window.location = "index.html";
	});



	$(document).bind('pagebeforechange', function (e, data) {
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
			var curInputs = $(from).find("input[type='text'],input[type='date'],input[type='url'],input[type='number'],input[type='email']");

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
				}
				break;
			case '#vehicle-particulars-page':
				if (isValid && $('#vehiclesToBeInsured .vehicle').length == 0)
					isValid = false;
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


function IsNext(fromPage, toPage) {
	var toIdx = 0,
		fromIdx = 0;

	$("[data-role=page]").each(function (idx, obj) {
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

	g_ironrock_service.getDriverLicenseDetails(id, function (err, json) {
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

		$.each(r.limits, function (i, item) {
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
	$.each(_colours, function (key, value) {
		//<option value="1" style="background:red">Apple</option>
		$('#QueryVehicleColour').append('<option value="' + value.name + '" style="background:' + value.hex + '">' + value.name + '</option>');
	});
}

//make/model
function loadVehicleMakes() {
	var options = JSON.parse(localStorage.getItem(_PreliminaryData));
	$('#QueryVehicleMake').empty();
	$.each(options.makeModels.data, function (key, value) {
		$('#QueryVehicleMake').append('<option value="' + value.make + '">' + value.make + '</option>');
	});
}

function loadBodyTypes() {
	var options = JSON.parse(localStorage.getItem(_PreliminaryData));
	$('#QueryVehicleBodyType').empty();
	$.each(options.makeModels.data, function (key, value) {
		$.each(value.models, function (key, value) {
			if ($('#QueryVehicleBodyType option[value="' + value.body_type + '"]').length == 0) {
				$('#QueryVehicleBodyType').append('<option value="' + value.body_type + '">' + value.body_type + '</option>');
			}
		});
	});
	orderSelect($('#QueryVehicleBodyType'));
}


function loadVehicleModels() {
	var options = JSON.parse(localStorage.getItem(_PreliminaryData));
	var models = [];
	var make = $('#QueryVehicleMake').val();
	$('#QueryVehicleModel').empty();
	$.each(options.makeModels.data, function (key, value) {
		if (make == value.make) {
			$.each(value.models, function (key, value) {
				if ($('#QueryVehicleModel option[value="' + value.model + '"]').length == 0) {
					$('#QueryVehicleModel').append('<option value="' + value.model + '">' + value.model + '</option>');
				}
			});
			return;
		}
	});
}



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
		'<input type="hidden" id="' + CaptionBaseVehicleRegistrationNo + cnt + '" name="' + CaptionBaseVehicleRegistrationNo + cnt + '" value="' + $.trim(r.plateNo) + '" />' +
		'<input type="hidden" id="' + CaptionBaseVehicleChassisNo + cnt + '" name="' + CaptionBaseVehicleChassisNo + cnt + '" value="' + $.trim(r.chassisNo) + '" />' +
		'<input type="hidden" id="' + CaptionBaseVehicleMake + cnt + '" name="' + CaptionBaseVehicleMake + cnt + '" value="' + $.trim(r.make) + '" />' +
		'<input type="hidden" id="' + CaptionBaseVehicleModel + cnt + '" name="' + CaptionBaseVehicleModel + cnt + '" value="' + $.trim(r.model) + '" />' +
		'<input type="hidden" id="' + CaptionBaseVehicleYear + cnt + '" name="' + CaptionBaseVehicleYear + cnt + '" value="' + $.trim(r.year) + '" />' +
		'<input type="hidden" id="' + CaptionBaseVehicleBody + cnt + '" name="' + CaptionBaseVehicleBody + cnt + '" value="' + $.trim(r.vehicleBodyType) + '" />' +
		'<input type="hidden" id="' + CaptionBaseVehicleType + cnt + '" name="' + CaptionBaseVehicleType + cnt + '" value="' + $.trim(r.vehicleType) + '" />' +
		'<input type="hidden" id="' + CaptionBaseVehicleEngineNo + cnt + '" name="' + CaptionBaseVehicleEngineNo + cnt + '" value="' + $.trim(r.engineNo) + '" />' +
		'<input type="hidden" id="' + CaptionBaseVehicleColour + cnt + '" name="' + CaptionBaseVehicleColour + cnt + '" value="' + $.trim(r.colour) + '" />' +
		'<input type="hidden" id="' + CaptionBaseVehicleValue + cnt + '" name="' + CaptionBaseVehicleValue + cnt + '" value="' + $.trim(r.sumInsured) + '" />' +
		'<input type="hidden" id="' + CaptionBaseVehicleStatus + cnt + '" name="' + CaptionBaseVehicleStatus + cnt + '" value="' + $.trim(r.vehicleStatus) + '" />';


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
	reIndexVehicles(CaptionBaseVehicleValue);
}


//need to index vehicles
function reIndexVehicles(baseValueCaption) {
	var sumInsured = 0;
	$('#vehiclesToBeInsured .vehicle').each(function (index, element) {
		sumInsured = sumInsured + parseFloat($(element).find('#' + baseValueCaption + index).val());
	});
	var thirdPartyLimit = $('#vehicle-medical-history-page').find('#thirdPartyLimit').empty();
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