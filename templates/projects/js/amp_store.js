<script type="text/javascript">
$(function() {
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
</script>