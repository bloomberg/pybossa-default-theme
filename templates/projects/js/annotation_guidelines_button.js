<script>
const guidelines = $("#collapse-guidelines")
const button = $(".collapse-guidelines-button")
const key = '{{project.short_name}}' + "-guidelines-state"

if (localStorage.getItem(key) === "closed") {
  guidelines.collapse("hide")
  button.text('Show Instructions')
}

button.on('click', function(){
        if (localStorage.getItem(key) === "closed") {
            localStorage.setItem(key, "open")
            button.text('Hide Instructions')
        } else {
            localStorage.setItem(key, "closed")
            button.text('Show Instructions')
        }
});
</script>
