;(function(){
var dateModalInfo = '';

function dirtyView(showHint = true) {
    if (filter_data.changed === false) {
        filter_data.changed = true;
        showHint && $('[data-toggle=popover]').popover('show');
    }
}

function getTaskbrowseBookmarksUrl() {
    return window.location.origin + '/account/user/taskbrowse_bookmarks/testproject2'
}

function setBookmarks(bookmarks) {

}

$(document).ready(function() {
    if (filter_data.priority_to === 0) {
        filter_data.priority_to = 0.0001;
    }
    if (filter_data.pcomplete_to === 0) {
        filter_data.pcomplete_to = 0.0001;
    }
    var priority = [filter_data.priority_from || 0, filter_data.priority_to || 1]
    var pcomplete = [filter_data.pcomplete_from || 0, filter_data.pcomplete_to || 100]
    $('#priority').slider({
        formater: function(value) {
            return value.toFixed(2);
        },
        value: priority
    }).on('slide', function(ev) {
        dirtyView();
        filter_data.priority_from = ev.value[0].toFixed(2);
        filter_data.priority_to = ev.value[1].toFixed(2);
    });

    $('#pcomplete').slider({
        value: pcomplete
    }).on('slide', function(ev) {
        dirtyView();
        filter_data.pcomplete_from = ev.value[0];
        filter_data.pcomplete_to = ev.value[1];
    });

    $('#task_id').change(function() {
        dirtyView();
        filter_data.task_id = $(this).val();
    });

    $('#gold_task').val(filter_data.gold_task)
    .change(function() {
        dirtyView();
        filter_data.gold_task = $(this).val();
    });

    $('#in-progress').val(filter_data.in_progress)
      .change(function() {
          dirtyView();
          filter_data.in_progress = $(this).val();
      });

    $('.datepicker').datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'yy-mm-dd'
    });

    $('#dateModal').on('show.bs.modal', function(event) {
        var button = $(event.relatedTarget);
        var info = button.data('info');

        dateModalInfo = info;

        var modal = $(this);
        var interval = ['from', 'to'];

        interval.forEach(function(attr) {
            var dateTime = filter_data[info + '_' + attr];
            var dateEntry = modal.find('.modal-body #date_' + attr);
            var timeEntry = modal.find('.modal-body #time_' + attr);

            if (dateTime) {
                dateEntry.val(dateTime.substring(0, dateTime.indexOf('T')));
                timeEntry.val(dateTime.substring(dateTime.indexOf('T') + 1));
            }
            else{
                dateEntry.val('');
                timeEntry.val('');
            }
        });
    });

    $('#saveDateModal').click(function() {
        var info = dateModalInfo;
        var modal = $('#dateModal');

        var time_from = modal.find('.modal-body #time_from').val();
        var time_to = modal.find('.modal-body #time_to').val();
        var date_from = modal.find('.modal-body #date_from').val();
        var date_to = modal.find('.modal-body #date_to').val();

        var from = '', to = '';
        if (date_from) {
            from = date_from + 'T' + (time_from || '00:00');
        }
        if (date_to) {
            to = date_to + 'T' + (time_to || '23:59');
        }

        filter_data[info + '_from'] = from;
        filter_data[info + '_to'] = to;

        modal.modal('hide');
        refresh();
    });

    $('.records_per_page').click(function() {
        records_per_page = parseInt($(this).text());
        refresh();
    });

    $('.download-type').click(function() {
        exportTasks($(this).attr('id'));
    });

    $('#btnRefresh').click(function() {
        refresh();
    });

    $('#btn-edit-submission').click(function() {
        // toggle button border
        const btn_border = this.style.borderColor;
        if (btn_border == ""){
            filter_data["view"] = "edit_submission";
            this.style.borderColor = "1px solid grey";
        } else {
            filter_data["view"] = "";
            this.style.borderColor = "";
        }

        refresh();
    });

    $('#tasksGrid th[data-sort]').click(function(evt) {
        dirtyView(evt.ctrlKey);

        var column = $(this);

        if (!evt.ctrlKey) {
            $('#tasksGrid th[data-sort!=' + column.attr('data-sort') + ']').removeClass('sort-asc sort-desc');
        }

        if (!column.hasClass('sort-asc') && !column.hasClass('sort-desc')) {
            column.addClass('sort-desc');
        }
        else {
            $(this).toggleClass('sort-asc sort-desc');
        }

        // If not selecting multiple columns, refresh the page with the single sort.
        !evt.ctrlKey && refresh();
    });

    $('#infoModal').on('show.bs.modal', function(event) {
        var button = $(event.relatedTarget);
        var url = button.data('info');

        var loadingInfo = $('#loadingInfo').show();
        var taskInfo = $('#taskInfo').hide().text('');

        $.get(url)
        .done(function(data) {
            displayTaskInfo(taskInfo, data);
        })
        .fail(function() {
            taskInfo.text('Error loading data');
        })
        .always(function() {
            loadingInfo.hide(); taskInfo.show();
        });
    });

    $('#taskRunStatusModal').on('show.bs.modal', function(event) {
        var button = $(event.relatedTarget);
        var url = button.data('info');

        var loadingTaskRunStatusInfo =
            $('#loadingTaskRunStatusInfo').show();
        var taskRunStatusInfo =
            $('#taskRunStatusInfo').hide().text('');

        $.get(url)
        .done(function(data) {
            var tokens = url.split('/')
            var project_shortname = tokens[2]
            var task_id = tokens[3]
            displayTaskRunStatusInfo(taskRunStatusInfo, data, project_shortname, task_id);
        })
        .fail(function() {
            taskRunStatusInfo.text('Error loading data');
        })
        .always(function() {
            loadingTaskRunStatusInfo.hide();
            taskRunStatusInfo.show();
        });
    });

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
        row.find('.filter-field-value')
           .prop('disabled', false);
        row.find('.filter-field-operator')
           .prop('disabled', false);
    };

    function addFieldFilterRow(fieldName, operator, fieldValue, enabled) {
        fieldName = fieldName || '';
        operator = operator || 'equals';
        fieldValue = fieldValue || '';

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

    $('#add-bookmark').click(() => {
        var modal = $('#bookmarkModal');

        data = {
            "name":$('.modal-body #bookmark-name').val(),
            "url": window.location.href
        }
        sendUpdateRequest(getTaskbrowseBookmarksUrl(), data).done(function(res) {
            console.log(res)
            setBookmarks(res)
        });
        modal.modal('hide');
    });

    $('.delete-bookmark').click(e => {
        let url = getTaskbrowseBookmarksUrl()
        data = {
            "name": $(e.target).children("#bookmark-name").text(),
        }
        sendDeleteRequest(url, data).done(function(res) {
            console.log(res)
            setBookmarks(res)
        });
    });

    $('.add-filter-row-button').click(function(evt) {
        addFieldFilterRow();
    });

    function getSelection() {
        if (selectedTask) {
            return [selectedTask];
        }
        return [];
    };

    $('#btn-edit-priority').click(function() {
        showPriorityUpdateModal();
    });

    $('#btn-edit-redundancy').click(function() {
        showRedundancyUpdateModal()
    });

    $('#btn-assign-worker').click(function() {
        showAssignWorkerModal()
    });

    // reset the local variable as well as the state
    function resetSelectedTask() {
        selectedTask = undefined;
        taskBrowse.setSelectedTask(selectedTask);
    }

    $('#delete-tasks-modal .cancel-delete').on('click', function() {
        resetSelectedTask();
    });

    var projNameEntry = $('#delete-task-project-name'),
        isProdCheck = $('#delete-task-prod'),
        deleteButton = $('#delete-btn');
    function resetDelete() {
        projNameEntry.val('');
        isProdCheck.prop('checked', false);
        deleteButton.attr('disabled', true);
    }

    $('#delete-tasks-modal').on('show.bs.modal', function(e) {
        if (!(selectedTask || pybTaskBrowse.filterCount)) {
            alert('No tasks to delete!');
            e.preventDefault();
        }
        resetDelete();
        var modalBody = this.querySelector('.modal-body p');
        var text;
        if (selectedTask) {
            text = 'You are about to delete task ' + selectedTask;
        }
        else {
            var sfx = pybTaskBrowse.filterCount != 1 ? 's' : '';
            text = 'You are about to delete ' + pybTaskBrowse.filterCount + ' filtered task'+ sfx + '.';
        }
        modalBody.innerHTML = text;
    });

    $('#delete-btn').click(function() {
        $('#delete-tasks-modal').modal('hide');
        window.scrollTo(0, 0);
        var data = getFilterObject();
        var url = getUrlFor('/deleteselected');
        sendUpdateRequest(url, data).done(function(res) {
            if (res.enqueued) {
                setSpinner(false);
                pybossaNotify('Your request has been enqueued, you will receive an email when the task deletion is complete.', true, 'warning');
            }
            else {
                refresh();
            }
        });
        pybossaNotify('Your request is being executed. Please wait...', true, 'warning')
    });

    const wizardHeight = $('#wizard-container').height() || 0;
    const navbarHeight = 100;

    $('body').on('contextmenu', '#tasksGrid tbody tr', function(e) {
        $('#context-menu').css({
            display: 'block',
            left: e.pageX - $(this).offset().left,
            top: e.pageY - navbarHeight - wizardHeight
        });
        selectedTask = $(this).find('td:first').text()
                              .trim().split(' ')[0].substring(1).trim();
        taskBrowse.setSelectedTask(selectedTask);
        $('#tasksGrid tr').removeClass('selected');
        $(this).toggleClass('selected');
        return false;
    });

    $('#info-columns').on('hide.bs.dropdown', function(event) {
        refresh();
    });

    $('#info-columns').on('click', 'li', function(event) {
        event.stopPropagation();

        if (!$(event.target).is(':checkbox')) {
            event.preventDefault();
            dropdownCheckboxToggle(this);
        }
    });

    $('#columnsSettings').on('hide.bs.dropdown', function(event) {
        refresh();
    });

    $('#columnsSettings').on('click', 'li', function(event) {
        event.stopPropagation();

        if (!$(event.target).is(':checkbox')) {
            event.preventDefault();
            dropdownCheckboxToggle(this);
        }
    });

    $('html').click(function() {
        $('#context-menu').hide();
        $('#tasksGrid tr').removeClass('selected');
    });

    $('#edit-pri').click(function() {
        showPriorityUpdateModal();
    });

    $('#edit-red').click(function() {
        showRedundancyUpdateModal()
    });

    $('#edit-user').click(function() {
        showAssignWorkerModal()
    });

    function dropdownCheckboxToggle(elm) {
        var checkbox = $(elm).find('input[type="checkbox"]');

        if (checkbox.length && !checkbox.prop('disabled') ) {
            checkbox.prop('checked', !checkbox.prop('checked'));
        }
    }

    function getUrlFor(endpoint) {
        var baseUrl = window.location.pathname.split('/browse')[0];
        return baseUrl + endpoint;
    };

    function getFilterObject() {
        taskIds = getSelection();
        if (taskIds.length) {
            return {
                taskIds: taskIds
            };
        }
        else {
            return {
                filters: prepareFilters()
            };
        }
    };

    function onEnterKey(cb) {
        return function(e) {
            var keyCode = e.keyCode || e.which,
                KEY_CODE_ENTER = 13;

            if(keyCode == KEY_CODE_ENTER) {
                cb();
            }
        }
    }

    function showPriorityUpdateModal() {
        $('#priority-value').keypress(onEnterKey(updateTaskPriority));

        $('#save-priority-modal').click(function() {
            updateTaskPriority();
        });

        $('#update-priority-modal').on('shown.bs.modal', function () {
          $('#priority-value').focus()
        })

        $('#update-priority-modal').modal('show');
    }

    function updateTaskPriority() {
        var priority = parseFloat($('#priority-value').val());
        $('#update-priority-modal').modal('hide');
        window.scrollTo(0, 0);
        if (isNaN(priority) || priority < 0 || priority > 1) {
            pybossaNotify('Invalid priority', true, 'warning');
            return;
        }
        var data = getFilterObject();
        data.priority_0 = priority;
        var url = getUrlFor('/priorityupdate');
        sendUpdateRequest(url, data).done(function(res) {
            refresh();
        });
    }

    function showRedundancyUpdateModal() {
        $('#redundancy-value').keypress(onEnterKey(updateTaskRedundancy));

        $('#save-redundancy-modal').click(function() {
            updateTaskRedundancy();
        });

        $('#update-redundancy-modal').on('shown.bs.modal', function () {
            $('#redundancy-value').focus()
        })

        $('#update-redundancy-modal').modal('show');
    }

    function updateTaskRedundancy() {
        var redundancy = parseInt($('#redundancy-value').val());
        $('#update-redundancy-modal').modal('hide');
        MAX_ALLOWED = 1000;
        MIN_ALLOWED = 1;
        window.scrollTo(0, 0);
        if (isNaN(redundancy) || redundancy < MIN_ALLOWED || redundancy > MAX_ALLOWED) {
            pybossaNotify('Invalid redundancy: please enter a value between ' +
                          MIN_ALLOWED + ' and ' + MAX_ALLOWED, true, 'warning');
            return;
        }
        var data = getFilterObject();
        data.n_answers = redundancy;
        var url = getUrlFor('/redundancyupdate');
        sendUpdateRequest(url, data).done(function(res) {
            refresh();
        });
    }

    function showAssignWorkerModal() {
        // make ajax call to get users data
        $('#update-assign-worker-modal').on('shown.bs.modal', function () {
            $('#assign-worker-value').focus()
        })
        $('#update-assign-worker-modal').modal('show');
    }

    function updateAssignWorker() {
        refresh();
    }

    function sendUpdateRequest(endpoint, data) {
        setSpinner(true);
        return $.ajax({
            type: 'POST',
            url: endpoint,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(data)
        }).fail(function(res) {
            setSpinner(false);
            var message = 'There was an error processing the request.';
            var severity = 'warning';
            if (res.status === 403) {
                message = 'You do not have the permissions to perform this action.';
                severity = 'danger';
            }
            pybossaNotify(message, true, severity);
        });
    };

    function sendDeleteRequest(endpoint, data) {
        setSpinner(true);
        return $.ajax({
            type: 'DELETE',
            url: endpoint,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(data)
        }).fail(function(res) {
            setSpinner(false);
            var message = 'There was an error processing the request.';
            var severity = 'warning';
            if (res.status === 403) {
                message = 'You do not have the permissions to perform this action.';
                severity = 'danger';
            }
            pybossaNotify(message, true, severity);
        });
    };

    function sendGetRequest(endpoint, data) {
        return $.ajax({
            type: 'GET',
            url: endpoint,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(data)
        }).fail(function(res) {
            var message = 'There was an error processing the request.';
            var severity = 'warning';
            if (res.status === 403) {
                message = 'You do not have the permissions to perform this action.';
                severity = 'danger';
            }
            pybossaNotify(message, true, severity);
        });
    };

    $("#multiple-languages").select2({
        placeholder: "Pick language",
        allowClear: false
    });
    $("#multiple-locations").select2({
        placeholder: "Pick location",
        allowClear: false
    });

    if (filter_data.filter_by_upref){
        var selected_lang = filter_data.filter_by_upref.languages;
        var selected_loc = filter_data.filter_by_upref.locations;
        if (selected_lang){
            $("#multiple-languages").val(selected_lang).trigger('change');
        }
        if (selected_loc){
            $("#multiple-locations").val(selected_loc).trigger('change');
        }
    }

    function filterTasksByUserPreference(){
      languages = $("#multiple-languages").select2("val");
      locations = $("#multiple-locations").select2("val");

      filter_data.filter_by_upref = {'languages': languages, 'locations': locations};
      $('#filter-upref-modal').modal('hide');
      refresh();
    }

    $('#upref-filter-modal-search-button').click(function() {
        filterTasksByUserPreference();
    });

    // When clicking bulk update dropdown button, reset selectedTask
    $('#btn-edit-tasks').click(function() {
        resetSelectedTask();
    });

    // When clicking bulk delete button, reset selectedTask
    $('#btn-delete-tasks').click(function() {
        resetSelectedTask();
    });

    // TODO: init bookmarks
    setBookmarks()


});

const sanitizeChars = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};
const sanitizeRegex = new RegExp('[' + Object.keys(sanitizeChars).join('') + ']', 'g');

function sanitizeHtml(text) {
    return text.replace(sanitizeRegex, function (c) {
        return sanitizeChars[c];
    })
}

function displayTaskInfo(taskInfo, data) {
    if (data.length < 1) {
        return;
    }

    var dataInfo = data["taskruns_info"]
    var headers = [];
    var info = '<table class="table"><thead><tr>';
    // Extract headers
    for (var headerName in dataInfo[0].info) {
        headers.push(headerName);
        info += '<th>' + headerName + '</th>'
    }
    info += '</tr></thead><tbody>';
    for (var i = 0; i < dataInfo.length; i++) {
        info += '<tr>';
        for (var j = 0; j < headers.length; j++) {
            var headerName = headers[j];
            info += '<td>' + sanitizeHtml(JSON.stringify(dataInfo[i].info[headerName])) + '</td>';
        }
        info += '</tr>';
    }
    info += '</tbody></table>';

    var dataGoldAnswers = data["gold_answers"]
    if (Object.keys(dataGoldAnswers).length){
        info += '<b>Gold answers</b><table class="table">';
        info += '<thead><tr><th>Field Name</th>'
        info += '<th>Field Value</th></tr></thead><tbody>'
        for (var fieldName in dataGoldAnswers){
            info += '<tr><td>' + fieldName + '</td>'
            info += '<td>' + sanitizeHtml(dataGoldAnswers[fieldName]) + '</td></tr>'
        }
        info += '</tbody></table>';
    }
    taskInfo.html(info);
}

function displayTaskRunStatusInfo(taskRunStatusInfo, data, project_shortname, task_id) {
    if (data.length < 1) {
        return;
    }

    var users = data.user_details;
    var modal = document.getElementById('taskRunStatusModal');
    var table = document.createElement('table');
    var header = document.createElement('thead');
    var headerRow = document.createElement('tr');
    var body = document.createElement('tbody');
    var colNames = [
        '#',
        'User ID',
        'User Email',
        'Status',
        'Lock Expires'
    ]

    table.className += 'table';

    // Headers
    colNames.forEach(function(colName) {
        var th = document.createElement('th');
        var colNameText = document.createTextNode(colName);
        th.appendChild(colNameText);
        headerRow.appendChild(th);
    });
    header.appendChild(headerRow);
    table.appendChild(header);

    // Rows
    for (var i = 0; i < data.redundancy; i++) {
        var num = i + 1;
        var user = users[i];
        var row = document.createElement('tr');
        var userId = '-';
        var userEmail = '-';
        var trStatus = 'Available';
        var clock = makeCell('-');

        row.setAttribute('id', `row-${i + 1}`);

        if (user) {
            userId = user.user_id;
            userEmail = user.user_email;
            trStatus = user.status;
        }

        if (user && user.lock_ttl) {
            countdown(clock, user.lock_ttl);
        }

        row.appendChild(makeCell(num));
        row.appendChild(makeCell(userId));
        row.appendChild(makeCell(userEmail));
        row.appendChild(makeCell(trStatus));
        row.appendChild(clock);
        body.appendChild(row);
    }

    table.appendChild(body);
    taskRunStatusInfo.html(table);

    for (let i = 0; i < data.redundancy; i++) {
        const user = users[i];
        const row = document.getElementById(`row-${i + 1}`);
        if (user && user.status === "Completed") {
            const url = '/project/' + project_shortname + '/task/' + task_id + '/' + user.user_id + '?mode=read_only';
            row.addEventListener('click', () =>{
                window.open(url, '_blank');
            });
            row.addEventListener('mouseover', (e) => {
                row.setAttribute('style', 'cursor: pointer; background-color: #dee0e3; outline: none');
            });
            row.addEventListener("mouseout", (e) => {
                row.setAttribute('style', 'background-color: None');
            });
        }
    }

    function makeCell(content) {
        var td = document.createElement('td');
        var text = document.createTextNode(content);
        td.appendChild(text);
        return td;
    }

    function countdown(clock, t) {
        var counter = setInterval(_countdown, 1000);
        function _countdown() {
            var seconds = Math.floor(t % 60);
            var minutes = Math.floor((t / 60) % 60);
            var hours = Math.floor(t / 60 / 60);

            clock.innerHTML = hours + 'h ' + minutes + 'm ' + seconds + 's';

            t--;
            if (t <= 0 || modal.style.display === 'none') {
                clearInterval(counter);
                clock.innerHTML = 'EXPIRED';
                return;
            }
        }
    }
}

function prepareFilters() {
    var preparedFilters = $.extend(true, {}, filter_data);
    preparedFilters['order_by'] = null;
    var filter_by_field = preparedFilters['filter_by_field'] || [];
    var filter_by_upref = preparedFilters['filter_by_upref'] || {};
    var order_by = [];
    var display_columns = [];
    var display_info_columns = [];
    var sortColumns = $('#tasksGrid th[data-sort]');
    sortColumns.filter('.sort-asc').each(function() {
        order_by.push($(this).attr('data-sort') + ' asc');
    });
    sortColumns.filter('.sort-desc').each(function() {
        order_by.push($(this).attr('data-sort') + ' desc');
    });

    if (order_by.length > 0) {
        preparedFilters['order_by'] = order_by.join(',');
    }

    preparedFilters['display_columns'] = null;
    $('a.columns_settings:has(input:checked)').each(function() {
        display_columns.push($(this).attr('data-value'));
    });

    if (display_columns.length > 0) {
        preparedFilters['display_columns'] = JSON.stringify(display_columns);
    }

    $('a.info_columns_settings:has(input:checked)').each(function() {
        display_info_columns.push($(this).attr('data-value'));
    });

    preparedFilters['display_info_columns'] = JSON.stringify(display_info_columns);

    for(key in preparedFilters) {
        if(preparedFilters[key] == null) {
            delete preparedFilters[key];
        }
    }

    if (filter_by_field.length > 0) {
        preparedFilters['filter_by_field'] = JSON.stringify(filter_by_field);
    }

    if (Object.keys(filter_by_upref).length > 0) {
        preparedFilters['filter_by_upref'] = JSON.stringify(filter_by_upref);
    }

    const eb = document.getElementById("btn-edit-submission");
    const eb_selected = eb && eb.style.border != "";
    if (eb_selected){
        preparedFilters["view"] = "edit_submission";
    }

    return preparedFilters;
}

function refresh(dropFilters) {
    let location = (first_page_url || '') + (!isNaN(records_per_page) ? ('/1/' + records_per_page) : '');

    if (!dropFilters) {
        const preparedFilters = prepareFilters();
        location += '?' + $.param(preparedFilters);
    }

    window.location.replace(location);
}

window.addEventListener('clearFilters', function() {
    refresh(true);
});

function exportTasks(downloadType) {
    let location = (first_page_url || '') + (!isNaN(records_per_page) ? ('/1/' + records_per_page) : '');
    const preparedFilters = prepareFilters();
    location += '?' + $.param(preparedFilters) + '&download_type=' + downloadType;
    window.location.replace(location);
}

function setSpinner(active) {
    var mask = $('.overlay');
    if (active) {
        mask.show();
    } else {
        mask.hide();
    }
}
})();
