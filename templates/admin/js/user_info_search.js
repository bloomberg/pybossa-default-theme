<script>
(function () {
    var firstShow = true;
    var filterCount = 0;
    var filterRowModel = null;
    $('.remove-filter-button').click(removeFilterRow);

    function removeFilterRow() {
        if (filterCount === 1) {
            $('.filter-field-name').val(0);
            $('.filter-field-value').val(null).prop('disabled', true);
        }
        else {
            $(this).parents('.row').remove();
            filterCount -= 1;
        }
    };

    function enableOnChange(event) {
        var row = $(this).parents('.row');
        row.find('.filter-field-value').prop('disabled', false);
        row.find('.filter-field-operator').prop('disabled', false);

        if (row.find('.filter-field-name').val() == 'timezone'){
            row.find(".filter-field-value").replaceWith(createDropdown(timezones));
        }
        else if (row.find('.filter-field-name').val() == 'user_type'){
            row.find(".filter-field-value").replaceWith(createDropdown(userTypes));
        }
        else if (row.find('.filter-field-name').val() == 'languages'){
            row.find(".filter-field-value").replaceWith(createDropdown(languages));
        }
        else if (row.find('.filter-field-name').val() == 'locations'){
            row.find(".filter-field-value").replaceWith(createDropdown(locations));
        }
        else if (row.find('.filter-field-name').val() == 'start_time' || row.find('.filter-field-name').val() == 'end_time'){
            var timeInput = $("<input type='time' class='form-control filter-field-value' style='width:214px' placeholder='00:00'>");
            row.find(".filter-field-value").replaceWith(timeInput);
        }
        else {
            var textInput = $("<input class='form-control filter-field-value' style='width:214px'>");
            row.find(".filter-field-value").replaceWith(textInput);
        }
    };

    function createDropdown(choiceList){
        var dropdown = $("<select class='form-control filter-field-value' style='width:214px'>");
        choiceList.forEach(function(elt){
            dropdown.append($('<option>', {
                        value: elt,
                        text: elt
            }));
        })
        return dropdown;
    }

    function addFieldFilterRow(fieldName, operator, fieldValue, enabled) {
        fieldName = fieldName || "";
        operator = operator || "";
        fieldValue = fieldValue || "";

        var toAppend = filterRowModel.clone();

        toAppend.find('.filter-field-name')
                .val(fieldName)
                .change(enableOnChange);
        toAppend.find('.filter-field-operator')
                .val(operator)
                .prop('disabled', !enabled);
        toAppend.find('.filter-field-value')
                .val(fieldValue)
                .prop('disabled', !enabled);
        toAppend.find('.remove-filter-button')
                .click(removeFilterRow);

        $('#filterModal .filter-rows').append(toAppend);
        filterCount += 1;
    };

    function createFilterRowModel() {
        $('.filter-field-name').change(enableOnChange);
        var model = $('#filterModal .filter-rows .row').first();
        filterRowModel = model.clone();
        model.remove();
    };

    $('#filterModal').on('show.bs.modal', function(event) {
        if (firstShow) {
            createFilterRowModel();
            addFieldFilterRow();
        }
        if (firstShow && filter_data.filter_by_field) {
            filter_data.filter_by_field.forEach(function(elt) {
            addFieldFilterRow(elt[0], elt[1], elt[2], true);
            });
        }
        firstShow = false;
    });

    $('#saveFilterModal').click(function() {
        var filterRows = $('#filterModal .filter-rows .row');
        filterRows = $.makeArray(filterRows);

        var filters = filterRows.map(function(elt) {
            var elt = $(elt);
            var fieldName = elt.find('.filter-field-name').val();
            var operator = elt.find('.filter-field-operator').val();
            var fieldValue = elt.find('.filter-field-value').val();
            if (fieldName) {
                return [fieldName, operator, fieldValue];
            }
        }).filter(function(elt) {
            return elt;
        });
        filter_data.filter_by_field = filters;

        $('#filterModal').modal('hide');
        refresh();
    });

    $('.add-filter-row-button').off().click(function(evt) {
        addFieldFilterRow();
    });

    function getSelection() {
        var taskIds = [];
        for (var id in selectedTasks) {
            if (selectedTasks[id]) {
                taskIds.push(parseInt(id));
            }
        }
        return taskIds;
    };

    function prepareFilters() {
        var preparedFilters = $.extend(true, {}, filter_data);
        var filter_by_field = preparedFilters['filter_by_field'] || [];

        for(key in preparedFilters) {
            if(preparedFilters[key] == null) {
                delete preparedFilters[key];
            }
        }

        if (filter_by_field.length > 0) {
            preparedFilters['filter_by_field'] = JSON.stringify(filter_by_field);
        }
        return preparedFilters;
    }

    function refresh() {
        var preparedFilters = prepareFilters();
        var location = first_page_url + '?' + $.param(preparedFilters);
        window.location.replace(location);
    }
})();
</script>
