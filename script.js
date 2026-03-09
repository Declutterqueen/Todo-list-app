let tasks = [];
let currentFilter = 'all';

// Load tasks from localStorage
function loadTasks() {
  const stored = localStorage.getItem("tasks");
  if (stored) {
    tasks = JSON.parse(stored);
    tasks.forEach(renderTask);
  }
  updateInfo();
  updateFilterCounts();
}

// Save tasks and update UI
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateInfo();
  updateFilterCounts();
}

// Render a single task
function renderTask(task) {
  const li = document.createElement('li');
  li.className = task.done ? 'done' : '';
  li.textContent = task.text;

  // DONE button
  const doneBtn = document.createElement('button');
  doneBtn.innerHTML = '✔️'; // Checkmark icon
  doneBtn.title = "Mark as Done";
  doneBtn.onclick = (e) => {
    e.stopPropagation();
    task.done = !task.done;
    li.classList.toggle('done');
    saveTasks();
    applyFilter(currentFilter);
  };

  // DELETE button
  const delBtn = document.createElement('button');
  delBtn.textContent = '❌';
  delBtn.title = "Delete Task";
  delBtn.onclick = (e) => {
    e.stopPropagation();
    tasks = tasks.filter(t => t !== task);
    li.remove();
    saveTasks();
    applyFilter(currentFilter);
  };

  li.appendChild(doneBtn);
  li.appendChild(delBtn);

  li.dataset.done = task.done;
  document.getElementById('taskList').appendChild(li);
}

// Add new task
function addTask() {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();
  if (!text) return;

  const task = { text, done: false };
  tasks.push(task);
  renderTask(task);
  saveTasks();
  input.value = '';
  applyFilter(currentFilter);
}

// Update task count and empty message
function updateInfo() {
  const taskCount = document.getElementById('taskCount');
  const emptyMessage = document.getElementById('emptyMessage');

  taskCount.textContent = `Tasks: ${tasks.length}`;
  emptyMessage.style.display = tasks.length === 0 ? 'block' : 'none';
}

// Update filter button counts
function updateFilterCounts() {
  const total = tasks.length;
  const pending = tasks.filter(t => !t.done).length;
  const done = tasks.filter(t => t.done).length;

  document.querySelector('.filter-btn[data-filter="all"]').textContent = `All (${total})`;
  document.querySelector('.filter-btn[data-filter="pending"]').textContent = `Pending (${pending})`;
  document.querySelector('.filter-btn[data-filter="done"]').textContent = `Completed (${done})`;
}

// Apply filter
function applyFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.filter-btn[data-filter="${filter}"]`).classList.add('active');

  document.querySelectorAll('#taskList li').forEach(li => {
    if(filter === 'all') li.style.display = 'flex';
    else if(filter === 'pending') li.style.display = li.classList.contains('done') ? 'none' : 'flex';
    else if(filter === 'done') li.style.display = li.classList.contains('done') ? 'flex' : 'none';
  });
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// Event listeners
document.getElementById('addBtn').addEventListener('click', addTask);
document.getElementById('taskInput').addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});
document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', e => applyFilter(e.target.dataset.filter));
});

// Initialize
loadTasks();