
$(document).ready(function () {

    var SELECTION_ATTR = "data-dropdown-selection";

    $(".combo-box a").on("click", function () {
        var parent = $(this).parents(".dropdown");
        var selected_value = $(this).attr(SELECTION_ATTR);
        var selection = parent.find(".selection");
        selection.text($(this).html());
        selection.attr(SELECTION_ATTR, selected_value);
    });

    $(".sort-by-button").on("click", function () {
        var parent = $(this).parents(".order-panel");
        var col = getSortColumn(parent);
        var dir = getSortDirection(parent);
        sort_query = col + ":" + dir;
        var url = window.location.pathname + "?order_by=" + sort_query;
        window.location.href = url;
    });

    function getSortOptions(sortByPanel) {
        getSortColumn(sortByPanel);
        getSortDirection(sortByPanel);
    };

    function getSortColumn(sortByPanel) {
        return getSelection(sortByPanel, "project-column-selection");
    };

    function getSortDirection(sortByPanel) {
        return getSelection(sortByPanel, "project-dir-selection");
    };

    function getSelection(sortByPanel, dropdownId) {
        var selection = sortByPanel.find("#" + dropdownId + " .selection");
        return selection.attr(SELECTION_ATTR);
    }

});
