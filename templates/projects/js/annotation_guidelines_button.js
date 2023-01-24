<script>
const guidelines = $("#collapse-guidelines")
const button = $(".collapse-guidelines-button")

if (localStorage.getItem("guidelines-state") === "closed") {
  guidelines.collapse("hide")
  button.text('Show Instructions')
}

button.on('click', function(){
        if (localStorage.getItem("guidelines-state") === "closed") {
            localStorage.setItem("guidelines-state", "open")
            button.text('Hide Instructions')
        } else {
            localStorage.setItem("guidelines-state", "closed")
            button.text('Show Instructions')
        }
});
</script>
