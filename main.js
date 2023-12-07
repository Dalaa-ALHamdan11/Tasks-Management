// Retrieve tasks from local storage or initialize an empty array

  var tasks = JSON.parse(localStorage.getItem('tasks')) || [];


// Function to render the task table
function renderTaskTable() {
    const taskTableBody = document.getElementById("taskTableBody");


    taskTableBody.innerHTML = '';

    tasks.forEach((task, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${task.title}</td>
          <td>${task.description}</td>
          <td>${task.dueDate}</td>
          <td>${task.completed ? 'Completed' : 'Not Completed'}</td>
          <td>
          <button type="button" class="btn btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="editTask(${index})">Edit</button>
    <button class="btn btn btn-outline-secondary" onclick="deleteTask(${index})">Delete</button>
      <button type="button" class="btn btn btn-outline-secondary" onclick="completedTask(${index})">complete</button>
            </td>
        `;
        taskTableBody.appendChild(row);
    });
}

// Function to add a new task
function addTask(event) {
    event.preventDefault();

    const taskTitle = document.getElementById('taskTitle').value;
    const taskDescription = document.getElementById('taskDescription').value;
    const taskDueDate = document.getElementById('taskDueDate').value;

    const newTask = {
        title: taskTitle,
        description: taskDescription,
        dueDate: taskDueDate,
        completed: false
    };

    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskTable();
    clearAddTaskForm();
}

// Function to clear the "Add Task" form inputs
function clearAddTaskForm() {
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskDueDate').value = '';
}

// Function to mark a task as complete or incomplete
function completedTask(index) {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskTable();
}

// Function to delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskTable();
}

// Function to edit a task
// Add an event listener to the "Save changes" button
const saveChangesButton = document.querySelector('#exampleModal .modal-footer .btns');
saveChangesButton.addEventListener('click', saveChanges);

// Function to save the changes
function saveChanges() {

  // Get the values from the input fields in the modal
  const taskTitleInput = document.querySelector('#exampleModal #taskTitle');
  const taskDescriptionInput = document.querySelector('#exampleModal #taskDescription');
  const taskDueDateInput = document.querySelector('#exampleModal #taskDueDate');
  // Retrieve the index of the task being edited from the modal
  const taskIndex = parseInt(document.querySelector('#exampleModal').getAttribute('data-task-index'));

  // Update the task object with the new values
  tasks[taskIndex].title = taskTitleInput.value;
  tasks[taskIndex].description = taskDescriptionInput.value;
  tasks[taskIndex].dueDate = taskDueDateInput.value;
//   save to local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
  // Render the task table again with the updated data
    renderTaskTable();
    // Close the modal
    const modal = bootstrap.Modal.getInstance(document.querySelector('#exampleModal'));
  modal.hide();
}
// function editTask
function editTask(index) {
  const task = tasks[index];

  // Set the values of the form input fields
  const taskTitleInput = document.querySelector('#exampleModal #taskTitle');
  const taskDescriptionInput = document.querySelector('#exampleModal #taskDescription');
  const taskDueDateInput = document.querySelector('#exampleModal #taskDueDate');

  taskTitleInput.value = task.title;
  taskDescriptionInput.value = task.description;
  taskDueDateInput.value = task.dueDate;

  // Set the data-task-index attribute on the modal
  const modal = document.querySelector('#exampleModal');
  modal.setAttribute('data-task-index', index);

}
// Function to filter tasks based on title or description
function filterTasks() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    const filteredTasks = tasks.filter(task => {
        const taskTitle = task.title.toLowerCase();
        const taskDescription = task.description.toLowerCase();
        return taskTitle.includes(searchInput) || taskDescription.includes(searchInput);
    });

    renderFilteredTaskTable(filteredTasks);
}

// Function to render the filtered task table
function renderFilteredTaskTable(filteredTasks) {
    const taskTableBody = document.getElementById('taskTableBody');
    taskTableBody.innerHTML = '';

    filteredTasks.forEach((task, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${task.title}</td>
          <td>${task.description}</td>
          <td>${task.dueDate}</td>
          <td>${task.completed ? 'Completed' : 'Not Completed'}</td>
          <td>
      <button class="btn btn btn-outline-secondary" onclick="editTask(${index})">Edit</button>
      <button class="btn btn btn-outline-secondary" onclick="deleteTask(${index})">Delete</button>
      <button type="button" class="btn btn btn-outline-secondary" onclick="completedTask(${index})">complete</button>
        `;

        taskTableBody.appendChild(row);
    });
}


// Event listener for the "Add Task" form submission
document.getElementById('addTaskForm').addEventListener('submit', addTask);

// Event listener for the "Mark Complete" and "Mark Incomplete" buttons
document.getElementById('taskTableBody').addEventListener('click', event => {
    if (event.target.classList.contains('mark-complete-btn')) {
        const index = event.target.dataset.taskIndex;
        markTaskComplete(index);
    }
});

// Event listener for the "Delete" buttons
document.getElementById('taskTableBody').addEventListener('click', event => {
    if (event.target.classList.contains('delete-task-btn')) {
        const index = event.target.dataset.taskIndex;
        deleteTask(index);
    }
});



// Event listener for the search input
document.getElementById('searchInput').addEventListener('input', filterTasks);

// Event listener for the sorting options
document.getElementById('sortBy').addEventListener('change', event => {
    const sortBy = event.target.value;

    if (sortBy === 'dueDate') {
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        tasks.forEach(task => console.log(task.title, task.dueDate));
        renderTaskTable();
    } else if (sortBy === 'status') {
        tasks.sort((a, b) => a.completed - b.completed);
        renderTaskTable();
    }

    renderTaskTable();
});
// Initial rendering of the task table
    renderTaskTable();
