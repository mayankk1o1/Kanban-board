const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const columns = document.querySelectorAll('.task-container');
let draggedTask = null;

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  const task = createTaskElement(text);
  document.querySelector('[data-status="todo"]').appendChild(task);
  taskInput.value = '';
}

function createTaskElement(text) {
  const task = document.createElement('div');
  task.className = 'task';
  task.draggable = true;
  task.innerHTML = `<span>${text}</span><button class="text-red-500 text-xl">&times;</button>`;

  task.addEventListener('dragstart', () => {
    draggedTask = task;
    setTimeout(() => task.classList.add('dragging'), 0);
  });

  task.addEventListener('dragend', () => {
    task.classList.remove('dragging');
    draggedTask = null;
  });

  task.querySelector('button').addEventListener('click', () => {
    task.remove();
  });

  return task;
}

columns.forEach(column => {
  column.addEventListener('dragover', e => {
    e.preventDefault();
    column.classList.add('drag-over');
  });

  column.addEventListener('dragleave', () => {
    column.classList.remove('drag-over');
  });

  column.addEventListener('drop', () => {
    column.classList.remove('drag-over');
    if (draggedTask) {
      column.appendChild(draggedTask);
      if (column.dataset.status === 'done') triggerConfetti();
    }
  });
});

function triggerConfetti() {
  const duration = 1000;
  const end = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  const interval = setInterval(() => {
    const timeLeft = end - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);
    confetti({ ...defaults, particleCount: 30, origin: { x: Math.random(), y: 0.5 } });
  }, 250);
}
