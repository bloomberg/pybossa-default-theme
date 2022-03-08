//
// Module for saving both guidelines and task presenter tabs when clicking Update on either.
//
const TaskPresenterTabManager = {
  _activeTab: {
    key: 'activeTab',
    guidelines: 'guidelines',
    presenter: 'presenter'
  },

  _dom: {
    presenter: '<input type="hidden" id="task-presenter" name="task-presenter" value="Update"></input>',
    guidelines: '<input type="hidden" id="task-guidelines" name="task-guidelines" value="Update"></input>'
  },

  _isDirty: {},

  initialize: editor => {
    // Setup click event for guidelines Update button.
    $("input[name='task-guidelines']").click(() => {
      if (TaskPresenterTabManager._isDirty.presenter) {
        // Insert the task presenter payload into the guidelines form to save both tabs.
        const formElement = $(`#form-${TaskPresenterTabManager._activeTab.guidelines}`);

        // Get HTML from task presenter editor and encode.
        const html = TaskPresenterTabManager.clean(editor.getValue());

        // Insert hidden form elements on the guidelines tab.
        formElement.append(TaskPresenterTabManager._dom.presenter);
        formElement.append(`<input type="hidden" id="editor" name="editor" value="${html}"></input>`);
      }

      // Persist the active tab (since we are saving both tabs, we only want the visible one focused after refresh).
      localStorage[TaskPresenterTabManager._activeTab.key] = TaskPresenterTabManager._activeTab.guidelines;

      // Submit the form.
      return true;
    });

    // Setup click event for task presenter Update button.
    $("input[name='task-presenter']").click(() => {
      if (TaskPresenterTabManager._isDirty.guidelines) {
        // Insert the task guidelines payload into the presenter form to save both tabs.
        const formElement = $(`#form-${TaskPresenterTabManager._activeTab.presenter}`);

        // Get HTML from task presenter editor and encode.
        const html = TaskPresenterTabManager.clean($('#guidelines').summernote('code'));

        // Insert hidden form elements on the presenter tab.
        formElement.append(TaskPresenterTabManager._dom.guidelines);
        formElement.append(`<input type="hidden" id="guidelines" name="guidelines" value="${html}"></input>`);
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

  autoFormat: selector => {
    // Setup auto-format HTML in guidelines code view.
    $('.btn-codeview').each(function(index) {
      $(this).on('mousedown', function() {
        // Format HTML code in guidelines tab.
        let content = TaskPresenterTabManager.format($(selector).summernote('code'));
        $(selector).summernote('code', content);
      });
    });
  },

  focus: (isGuidelinesActive, isPresenterActive) => {
    // Set focus to the recently saved tab. Default is guidelines.
    let isFocusGuidelines;

    if (localStorage[TaskPresenterTabManager._activeTab.key] === TaskPresenterTabManager._activeTab.guidelines) {
      isFocusGuidelines = true;
    }
    else if (localStorage[TaskPresenterTabManager._activeTab.key] === TaskPresenterTabManager._activeTab.presenter) {
      isFocusGuidelines = false;
    }
    else if (isGuidelinesActive || !isPresenterActive) {
      isFocusGuidelines = true;
    }
    else if (isPresenterActive) {
      isFocusGuidelines = false;
    }

    if (isFocusGuidelines == true) {
      $('#tab-nav-guidelines').addClass('active');
      $('#tab-content-guidelines').addClass('active');
      window.location.hash = window.location.hash  == '' ? "content-guidelines" : window.location.hash = window.location.hash;
    }
    else if (isFocusGuidelines == false) {
      $('#tab-nav-presenter').addClass('active');
      $('#tab-content-presenter').addClass('active');
      window.location.hash = "content-presenter";
    }

    delete(localStorage[TaskPresenterTabManager._activeTab.key]);
  },

  clean: html => {
    return $('<span>').text(html).html().replace(/"/g, '&quot;');
  },

  format: html => {
    try {
      return (prettier == null || prettierPlugins == null) ? html : prettier.format(html, {
        parser: 'html',
        plugins: prettierPlugins
      });
    }
    catch (e) {
      console.warn(e);
      return html;
    }
  }
};