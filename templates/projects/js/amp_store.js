<script type="text/javascript">
$(function() {
  // default opt-in for new projects
  if (!$('#input_data_class').val() && !$('#output_data_class').val()){
    optInAmpStore();
  }

  // opt-out L1 projects, users need to explicitly opt-in
  let dataClassification = 'L1';
  $('#input_data_class').change(function (e) {
    if ($(e.target).val().includes(dataClassification)) {
      optOutAmpStore();
    }
  });
  $('#output_data_class').change(function (e) {
    if ($(e.target).val().includes(dataClassification)) {
      optOutAmpStore();
    }
  });
});

function optOutAmpStore() {
  document.getElementById("amp_store").checked = false;
}

function optInAmpStore() {
  document.getElementById("amp_store").checked = true;
}
</script>