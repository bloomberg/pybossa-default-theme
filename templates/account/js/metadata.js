<script>

  let country_name_to_country_code = new Map(Object.entries({{country_name_to_country_code}}))
  let country_code_to_country_name = new Map(Object.entries({{country_code_to_country_name}}))

  // hide location dropdown, use country code and country name instead
  $("#input-form > form > div:nth-child(3)").hide();

  $("#edit-button").on('click', function(){
    $("#input-form").removeClass("hidden");
    $("#edit-button").hide();
    $("#no-info-text").hide();
    $("#user-info").hide();
  });

  $("#country_codes").change(function(){
    let selected_ccs = $('#country_codes').val();

    let selected_cns_map = new Set($('#country_names').val());

    selected_ccs.forEach(cc => {
      selected_cns_map.add(country_code_to_country_name.get(cc));
    });
    new_selected_cns = Array.from(selected_cns_map);
    if (!arraysEqual(new_selected_cns, $('#country_names').val())) {
      $('#country_names').val(new_selected_cns);
      $('#country_names').trigger('change');
    }
  });


$("#country_names").change(function(){
  let selected_cns = $('#country_names').val();

  let selected_ccs_map = new Set($('#country_codes').val());
  selected_cns.forEach(cn => {
    selected_ccs_map.add(country_name_to_country_code.get(cn));
  });
  new_selected_ccs = Array.from(selected_ccs_map);
  if (!arraysEqual(new_selected_ccs, $('#country_codes').val())) {
    $('#country_codes').val(new_selected_ccs);
    $('#country_codes').trigger('change');
  }
  });

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null || a == undefined || b == undefined) return false;

  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

</script>
