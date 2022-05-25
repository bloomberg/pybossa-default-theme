<script>
$(".collapse-guidelines-button").on('click', function(){
    $(this).text(function(i, v){
        return (v.startsWith('Show') ? 'Hide' : 'Show') + ' Instructions';
    });
});
</script>