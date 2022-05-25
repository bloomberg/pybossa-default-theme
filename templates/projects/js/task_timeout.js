<script>
const taskTimeout = {
    intervalId: null,
    taskId: null,
    remaining: null,
    total: null,
};

//
// Method to initialize the task timeout timer via setTimeout().
// The total timeout seconds and remaining seconds are provided from the server.
// If the page was refreshed, the remaining seconds are used. */
//
function setup_task_timeout_display(timeout, original_timeout) {
    // Ensure a valid timeout seconds.
    if (timeout && parseInt(timeout)) {
        // Store the total and remaining seconds for use on subsequent tasks.
        taskTimeout.remaining = timeout;
        taskTimeout.total = original_timeout;

        // Start the timer and store the interval id so it may be terminated.
        taskTimeout.intervalId = setTimeout(function() {
            // Create the timeout warning message.
            var selector = 'button.submit-button,button.submit-last-button';
            var msg = `Task ${taskTimeout.taskId} has timed-out after ${original_timeout || timeout} seconds.`;

            // Display the timeout warning message.
            window.pybossaNotify(msg, true, 'error');

            // Disable the submit buttons in the task presenter.
            document.querySelectorAll(selector).forEach(function(button) {
                button.disabled = true;
                button.setAttribute('title', msg);
            });
        },  timeout * 1000);
    }
}

// Initialize the timer.
setup_task_timeout_display({{ project.timeout or 0 }}, {{ project.original_timeout or project.timeout or 0 }});

//
// Event handler for when a task has loaded on the page.
//
pybossa.taskLoaded(function(task, deferred) {
    // Check if the task is in read-only mode or gold task mode
    if (!taskTimeout.intervalId || !taskTimeout.total) {
        console.log(`Task in read-only/gold-task mode. taskTimeout is: ${taskTimeout}`)
        deferred.resolve(task);
        return;
    }

    // Check if the task is valid and we have an active timeout interval already running.
    if ( !$.isEmptyObject(task) && taskTimeout.intervalId && taskTimeout.total) {
        // Stop the timer.
        clearTimeout(taskTimeout.intervalId);

        // If this task that has loaded is the different than the prior, then we have moved to a new task.
        if (taskTimeout.taskId && task.id !== taskTimeout.taskId) {
            // New task, update the remaining seconds to be the total seconds.
            taskTimeout.remaining = taskTimeout.total;
        }

        // Initialize the timer.
        setup_task_timeout_display(taskTimeout.remaining, taskTimeout.total);

        // Store the task id.
        taskTimeout.taskId = task.id;

        console.log(`Task #${taskTimeout.taskId}, timeout interval #${taskTimeout.intervalId}, ${Math.round(taskTimeout.remaining)}/${taskTimeout.total} seconds remaining.`);

        deferred.resolve(task);
    }
});
</script>