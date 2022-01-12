<script>
$(".collapse-guidelines-button").on('click', function(){
    $(this).text(function(i, v){
        return (v.startsWith('Show') ? 'Hide' : 'Show') + ' Instructions';
    });
});

function setup_task_timeout_display(timeout) {
    timeout && parseInt(timeout) &&
        setTimeout(function() {
            var selector = 'button.submit-button,button.submit-last-button';
            var msg = 'This task has timed-out after ' + timeout + ' seconds.';

            window.pybossaNotify(msg, true, 'error');

            document.querySelectorAll(selector).forEach(function(button) {
                button.disabled = true;
                button.setAttribute('title', msg);
            });
        },  timeout * 1000);
}
setup_task_timeout_display({{ project.timeout }});
</script>
