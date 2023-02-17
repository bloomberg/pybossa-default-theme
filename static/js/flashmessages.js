function pybossaNotify(msg, showNotification, type, keepPreviousNotification, sticky=false){
    if (!keepPreviousNotification)
        $("#pybossa-notification").remove();
    var div = $("<div/>");
    div.attr("id", "pybossa-notification");
    var icon = $("<li/>");
    var close = $("<li/>");
    close.addClass("fa fa-2x fa-close pull-right");
    close.on('click', function(){
        $("#pybossa-notification").addClass("hide-notification");
        hidePybossaNotification();
    });
    if (type === undefined) {
        type = 'info';
    }
    if ((type === 'danger') || (type === 'error') || (type === 'warning') || (type == 'message')) {
        icon.addClass("fa fa-2x fa-exclamation-triangle pull-left");
    }

    if (type === 'message') {
        type = 'warning';
    }

    if (type === 'info') {
        icon.addClass("fa fa-2x fa-bullhorn pull-left");
    }

    if (type === 'success') {
        icon.addClass("fa fa-2x fa-check pull-left");
    }

    if (type === 'loading') {
        icon.addClass("fa fa-2x fa-circle-o-notch fa-spin pull-left");
        type = 'info';
    }


    var text = $("<span/>");
    text.html(msg);
    if (type === 'error') {
        type = 'danger';
    }
    div.addClass("alert-" + type);
    div.prepend(icon);
    div.append(text);
    div.append(close);
    if (showNotification === true) {
        div.addClass("show-notification");
        $("body").prepend(div);
    }
    else {
        $("#pybossa-notification").addClass("hide-notification");
        hidePybossaNotification();
    }

    window.onscroll = function() {
        if (sticky) {
            let banner = $("#pybossa-notification");
            if (window.pageYOffset > 100) {
                banner.css({position: "sticky", top: -40});
            } else {
                banner.css({position: "relative", top: 0});
            }
        }
    }
}

function hidePybossaNotification() {
    /*
    a workaround to hide the notification after hide-notification animation.
    The top margin for some pages is hardcoded to 30 or 50px, the browser mis-calulates
    the margines when the notification area is present in the page, eventhough it's hidden.
    */
    setTimeout(function() { $("#pybossa-notification").remove() }, 500);
}
