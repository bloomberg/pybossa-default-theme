<script>
  $("#show-types").on('click', function(){
    $("#categories").show();
    $("#show-types").addClass("hidden");
    $('#hide-types').show();
  })

  $("#hide-types").on('click', function(){
    $("#categories").hide();
    $("#hide-types").hide();
    $("#show-types").removeClass("hidden");
  })
</script>
