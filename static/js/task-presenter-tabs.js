//
// Module for saving both guidelines and task presenter tabs when clicking Update on either.
//
const TaskPresenterTabManager = {
  _activeTab: {
    key: 'activeTab',
    guidelines: 'guidelines',
    presenter: 'presenter'
  },

  _isDirty: {},

  initialize: editor => {
    // Setup click event for guidelines Update button.
    $("input[name='task-guidelines']").click(() => {
      if (TaskPresenterTabManager._isDirty.presenter) {
        // Insert the task presenter payload into the form submission to save both tabs.
        var formElement = $('#form-guidelines'); //$('#editor-page').find('form')[0]);

        // Get HTML from task presenter editor and encode.
        var html = editor.getValue();
        var safeHtml = $('<span>').text(html).html();
        safeHtml = safeHtml.replace(/"/g, '&quot;');

        // Insert hidden form elements on the guidelines tab.
        formElement.append(`<input type="hidden" id="task-presenter" name="task-presenter" value="Update"></input>`);
        formElement.append(`<input type="hidden" id="editor" name="editor" value="${safeHtml}"></input>`);
      }

      // Persist the active tab (since we are saving both tabs, we only want the visible one focused after refresh).
      localStorage[TaskPresenterTabManager._activeTab.key] = TaskPresenterTabManager._activeTab.guidelines;

      // Submit the form.
      return true;
    });

    // Setup click event for task presenter Update button.
    $("input[name='task-presenter']").click(() => {
      if (TaskPresenterTabManager._isDirty.guidelines) {
        // Insert the task guidelines payload into the form submission to save both tabs.
        var formElement = $('#form-task-presenter'); //$('#editor-page').find('form')[1]);

        // Get HTML from task presenter editor and encode.
        var html = $('#guidelines').summernote('code');
        var safeHtml = $('<span>').text(html).html();
        safeHtml = safeHtml.replace(/"/g, '&quot;');

        // Insert hidden form elements on the guidelines tab.
        formElement.append(`<input type="hidden" id="task-guidelines" name="task-guidelines" value="Update"></input>`);
        formElement.append(`<input type="hidden" id="guidelines" name="guidelines" value="${safeHtml}"></input>`);
      }

      // Persist the active tab (since we are saving both tabs, we only want the visible one focused after refresh).
      localStorage[TaskPresenterTabManager._activeTab.key] = TaskPresenterTabManager._activeTab.presenter;

      // Submit the form.
      return true;
    });

    // Setup change event for guidelines editor.
    $("#guidelines").on("summernote.change", e => {
      TaskPresenterTabManager._isDirty.guidelines = true;
    });

    // Setup change event for task presenter code editor.
    editor.on('change', (control, change) => {
      TaskPresenterTabManager._isDirty.presenter = true;
    });
  },

  focus: (isGuidelinesActive, isPresenterActive) => {
    // Set focus to the recently saved tab. Default is guidelines.
    if (isGuidelinesActive || !isPresenterActive || localStorage[TaskPresenterTabManager._activeTab.key] === 'guidelines') {
        $('#tab-nav-guidelines').addClass('active');
        $('#tab-content-guidelines').addClass('active');
        window.location.hash = window.location.hash  == '' ? "content-guidelines" : window.location.hash = window.location.hash;
    }
    else if (isPresenterActive || localStorage[TaskPresenterTabManager._activeTab.key] === TaskPresenterTabManager._activeTab.presenter) {
        $('#tab-nav-presenter').addClass('active');
        $('#tab-content-presenter').addClass('active');
        window.location.hash = "content-presenter";
    }

    delete(localStorage[TaskPresenterTabManager._activeTab.key]);
  }
};