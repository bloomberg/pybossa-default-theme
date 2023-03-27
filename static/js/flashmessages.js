function pybossaNotify(msg, showNotification, type, keepPreviousNotification, sticky=false, timeout=0) {
    if (!keepPreviousNotification)
        $('[id^=pybossa-notification]').remove();  // remove id starts with 'pybossa-notification'
    var div = $("<div/>");
    var timestamp = new Date().getTime(); // generate a unique timestamp
    div.addClass("pybossa-notification"); // add a class for easier selection
    div.attr("id", "pybossa-notification-" + timestamp); // append timestamp to ID
    var icon = $("<li/>");
    var close = $("<li/>");
    close.addClass("fa fa-2x fa-close pull-right");
    close.on('click', function(){
        $("#pybossa-notification-" + timestamp).addClass("hide-notification");
        hidePybossaNotification(timestamp);
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
        const index = $('[id^=pybossa-notification]').length;
        div.attr("data-index", index); // add data-index attribute to the notification
    }
    else {
        $("#pybossa-notification-" + timestamp).addClass("hide-notification");
        hidePybossaNotification(timestamp);
    }

    window.onscroll = function() {
        $('[id^=pybossa-notification]').each(function() {
            const notification = $(this);
            const index = notification.attr("data-index");
            if (sticky) {
                const headerHeight = 60;
                const bannerHeight = 40;
                const pageYOffset = window.pageYOffset
                const offsetForMultipleBanners = (index - 1) * bannerHeight
                if (pageYOffset < headerHeight + bannerHeight) {
                    let pos = Math.max(0, (pageYOffset - headerHeight));
                    notification.css({position: "relative", top: pos});
                } else {
                    notification.css({position: "sticky", top: -bannerHeight + offsetForMultipleBanners});
                }
            }
        });
    }

    if (timeout > 0) {
        hidePybossaNotification(timestamp, timeout);
    }
}

function hidePybossaNotification(id, timeout=500) {
    /*
    a workaround to hide the notification after hide-notification animation.
    The top margin for some pages is hardcoded to 30 or 50px, the browser mis-calulates
    the margines when the notification area is present in the page, eventhough it's hidden.
    */
    setTimeout(function() { $("#pybossa-notification-" + id).remove() }, timeout);
}
