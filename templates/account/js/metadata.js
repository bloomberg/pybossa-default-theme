<script>
let country_name_to_country_code = new Map(Object.entries({{ country_name_to_country_code }}))
let country_code_to_country_name = new Map(Object.entries({{ country_code_to_country_name }}))

// hide location dropdown, use country code and country name instead
$("#input-form > form > div:nth-child(3)").hide();
$('#locations').val([]);

$("#edit-button").on('click', function () {
  $("#input-form").removeClass("hidden");
  $("#edit-button").hide();
  $("#no-info-text").hide();
  $("#user-info").hide();
});

let previous_ccs = get_val_or_default('#country_codes', []);
let previous_cns = get_val_or_default('#country_names', []);

$('#country_codes').change(function () {
  let current_ccs = $(this).val() || [];
  let added_ccs = current_ccs.filter(x => !previous_ccs.includes(x));
  let removed_ccs = previous_ccs.filter(x => !current_ccs.includes(x));

  let selected_cns_map = new Set($('#country_names').val());

  if (added_ccs.length > 0) {
    added_ccs.forEach(cc => {
      selected_cns_map.add(country_code_to_country_name.get(cc));
    });
  }
  if (removed_ccs.length > 0) {
    removed_ccs.forEach(cc => {
      selected_cns_map.delete(country_code_to_country_name.get(cc));
    });
  }

  // Update the previous_ccs for the next change event
  previous_ccs = current_ccs;

  new_selected_cns = Array.from(selected_cns_map);
  if (!arraysEqual(new_selected_cns, get_val_or_default('#country_names', []))) {
    $('#country_names').val(new_selected_cns).trigger('change');
  }
});


$('#country_names').change(function () {
  let current_cns = $(this).val() || [];
  let added_cns = current_cns.filter(x => !previous_cns.includes(x));
  let removed_cns = previous_cns.filter(x => !current_cns.includes(x));

  let selected_ccs_map = new Set($('#country_codes').val());

  if (added_cns.length > 0) {
    added_cns.forEach(cc => {
      selected_ccs_map.add(country_name_to_country_code.get(cc));
    });
  }
  if (removed_cns.length > 0) {
    removed_cns.forEach(cc => {
      selected_ccs_map.delete(country_name_to_country_code.get(cc));
    });
  }

  // Update the previous_cns for the next change event
  previous_cns = current_cns;

  new_selected_ccs = Array.from(selected_ccs_map);
  if (!arraysEqual(new_selected_ccs, get_val_or_default('#country_codes', []))) {
    $('#country_codes').val(new_selected_ccs).trigger('change');
  }
});

function get_val_or_default(selector, def) {
  return $(selector).val() || def;
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null || a == undefined || b == undefined) return false;
  if (a.length == 0 && b.length == 0) return true
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
</script>
