(function(){

  function isProductOrSubproductDeprecated(product, subproduct) {
    if (!deprecatedprodssubprods) {
      return false;
    }

    if (deprecatedprodssubprods[product] && deprecatedprodssubprods[product].includes(subproduct)) {
      return true;
    }

    return false;
  }

  function getDeprecationWarningMessage() {
    return deprecationWarningMsg || 'Combination of selected Product and Subproduct has been deprecated and will be removed in future. Refer to GIGwork documentation for taxonomy updates.';
  }

  function showInlineWarning(fieldId, message) {
    hideInlineWarning(fieldId);

    // Create warning element
    var warningHtml = '<div id="' + fieldId + '-warning" class="alert alert-warning" style="margin-top: 5px; margin-bottom: 0px;">' +
                      '<i class="fa fa-exclamation-triangle"></i> ' + message +
                      '</div>';

    // Insert warning after the field
    $("#" + fieldId).parent().append(warningHtml);
  }

  function hideInlineWarning(fieldId) {
    $("#" + fieldId + "-warning").remove();
  }

  $("#product").change(function(){
    var product = $(this).val();

    // Remove previous product warning
    hideInlineWarning('product');

    var subproducts = ps[product];
    $("#subproduct").empty();
    $("#subproduct").append($("<option></option>").attr("value", "").text(""));
    for (var i = 0; i < subproducts.length; i++) {
      $("#subproduct").append(
          $("<option></option>").attr(
              "value", subproducts[i]).text(subproducts[i])
      );
    }

    // Clear subproduct warning since options changed
    hideInlineWarning('subproduct');
  });

  $("#subproduct").change(function(){
    var subproduct = $(this).val();
    var product = $("#product").val();

    // Remove previous subproduct warning
    hideInlineWarning('subproduct');

    // Check for subproduct deprecation and show warning
    if (product && subproduct && isProductOrSubproductDeprecated(product, subproduct)) {
      showInlineWarning('subproduct', getDeprecationWarningMessage());
    }
  });
}());
