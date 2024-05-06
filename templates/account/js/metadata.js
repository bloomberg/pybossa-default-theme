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
  previous_ccs = handleLocationChange(previous_ccs, '#country_codes', '#country_names', country_code_to_country_name);
});

$('#country_names').change(function () {
  previous_cns = handleLocationChange(previous_cns, '#country_names', '#country_codes', country_name_to_country_code);
});

// handle sync between location dropdowns
function handleLocationChange(previousValues, currentSelector, relatedSelector, map_to_related) {
  const current_values = $(currentSelector).val() || [];
  const added_values = current_values.filter(x => !previousValues.includes(x));
  const removed_values = previousValues.filter(x => !current_values.includes(x));

  const related_values_set = new Set($(relatedSelector).val());

  if (added_values.length > 0) {
    added_values.forEach(value => {
      related_values_set.add(map_to_related.get(value));
    });
  }
  if (removed_values.length > 0) {
    removed_values.forEach(value => {
      related_values_set.delete(map_to_related.get(value));
    });
  }

  // update the other dropdown
  const new_related_values = Array.from(related_values_set);
  if (!arraysEqual(new_related_values, get_val_or_default(relatedSelector, []))) {
    $(relatedSelector).val(new_related_values).trigger('change');
  }
  return current_values;
}

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
