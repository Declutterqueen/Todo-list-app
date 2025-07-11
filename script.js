let tasks = [];

function loadTasks() {
  const stored = localStorage.getItem("tasks");
  if (stored) {
    tasks = JSON.parse(stored);
    tasks.forEach(renderTask);
  }
  updateInfo();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateInfo();
}

function renderTask(task) {
  const li = document.createElement('li');
  li.textContent = task.text;
  li.className = task.done ? 'done' : '';

  li.onclick = () => {
    task.done = !task.done;
    li.classList.toggle('done');
    saveTasks();
  };

  const delBtn = document.createElement('button');
  delBtn.textContent = '❌';
  delBtn.onclick = (e) => {
    e.stopPropagation();
    tasks = tasks.filter(t => t !== task);
    saveTasks();
    li.remove();
  };

  li.appendChild(delBtn);
  document.getElementById('taskList').appendChild(li);
}

function addTask() {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();
  if (!text) return;

  const task = { text, done: false };
  tasks.push(task);
  saveTasks();
  renderTask(task);
  input.value = '';
}

function updateInfo() {
  const taskCount = document.getElementById('taskCount');
  const emptyMessage = document.getElementById('emptyMessage');

  taskCount.textContent = `Tasks: ${tasks.length}`;
  emptyMessage.style.display = tasks.length === 0 ? 'block' : 'none';
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// Add Enter key support
document.getElementById('taskInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    addTask();
  }
});

loadTasks();
