$(document).ready(function (e) {

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
        setTimeout(
  function () {
      var registrationNo = $('#QueryVehicleRegistrationNo').val();

      $.mobile.loading("hide");
      var gridRow = $('<div/>');
      gridRow.addClass('ui-grid-d').attr('data-id', registrationNo);
      var registrationCell = $('<div/>');
      registrationCell.addClass('ui-block-a');
      registrationCell.html(registrationNo);
      registrationCell.appendTo(gridRow);
      //
      var makeModelCell = $('<div/>');
      makeModelCell.addClass('ui-block-b');
      makeModelCell.html('Toyota Corolla');
      makeModelCell.appendTo(gridRow);
      //
      var yearCell = $('<div/>');
      yearCell.addClass('ui-block-c');
      yearCell.html('2010');
      yearCell.appendTo(gridRow);
      //
      var sumInsuredCell = $('<div/>');
      sumInsuredCell.addClass('ui-block-d');
      sumInsuredCell.html('2,000,000.00');
      sumInsuredCell.appendTo(gridRow);
      //Controls
      var controlCell = $('<div/>');
      controlCell.addClass('ui-block-e');
      controlCell.html('<a href="#" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-left ui-btn-inline ui-mini">Delete</a>');
      controlCell.appendTo(gridRow);
      //
      if (!registrationNo) {
          alert("Not valid!");
      } else if (IsDuplicate(registrationNo)) {
          alert('Duplicate!');
      } else {
          gridRow.appendTo($('#vehiclesToBeInsured'));
          $(':mobile-pagecontainer').pagecontainer('change', '#vehicle-particulars-page');
      }
  }, 5000);

    }).on("click", "#queryTaxiVehicleStop", function () {
        $.mobile.loading("hide");
    });

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




});

