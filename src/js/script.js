const addTaskBtn = document.querySelector(".add-task--button");
const inputTask = document.querySelector(".input-task--text");
const addTask = document.querySelector(".add-task");
const tasks = document.querySelector(".list-task");
const task = document.querySelector(".task");
const tasksComplited = document.querySelector(".tasks-complited");
const tasksQuantity = document.querySelector(".tasks-quantity");
const removeAll = document.querySelector(".remove-all");
const timerRemove = document.querySelector(".timer-remove");
const localTasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Delete Task
const deleteTask = (e) => {
  if (e.target.closest(".remove-task")) {
    const selectTask = e.target.closest(".task");
    localTasks.splice(
      localTasks.findIndex((ind) => +ind.index === +selectTask.dataset.index),
      1
    );
    selectTask.classList.add("hidden");
    updateStorage();
    setTimeout(() => {
      selectTask.remove();
      counterUpdate();
      if (!tasks.querySelector(".task")) {
        generateFirstTask();
      }
    }, 300);
  }
};

const changeTaskStatus = (e) => {
  if (!e.target.closest(".task")) return;
  if (!e.target.closest(".remove-task")) {
    const taskDone = e.target.closest(".task");
    const uncheckTask = taskDone.querySelector("input");
    if (!e.target.closest("input")) uncheckTask.checked = !uncheckTask.checked;
    const textDoneTask = taskDone.querySelector(".text-task");
    const findTaskIndex = localTasks.findIndex(
      (t) => t.index === taskDone.dataset.index.padStart(5, 0)
    );
    if (findTaskIndex >= 0)
      localTasks[findTaskIndex].done = !localTasks[findTaskIndex].done;
    textDoneTask.classList.toggle("done-task");
    updateStorage();
    counterUpdate();
  }
};

const deleteFirstTask = () => {
  const selectTasks = tasks.querySelectorAll(".task");
  selectTasks.forEach((selectTask) => {
    if (+selectTask.dataset.index === 0) {
      selectTask.closest(".task").remove();
    }
    counterUpdate();
  });
};

const generateID = () => {
  return String(new Date().getTime()).slice(-9).padStart(5, 0);
};

const addToStorage = (taskText, index) => {
  localTasks.push({
    taskText,
    index,
    done: false,
  });
};

const generateFirstTask = () => {
  generateTask("Add your daily tasks", 0, false, false);
};

const createTask = (taskText, id = generateID()) => {
  generateTask(taskText, id, false, false);
  addToStorage(taskText, id);
};

const generateTask = function (
  textTask,
  taskIndex = generateID(),
  done = false,
  isLocal = false
) {
  const markup = `
  <div class="task ${isLocal ? "" : "hidden"}" data-index = ${taskIndex}>
  <form class="task-form">
    <input type="checkbox" ${done ? "checked" : ""}/>
    <div class="text-task ${done ? "done-task" : ""}">${textTask}</div>
  </form>
  <button class="remove-task frame-button button-hov">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="trash-task"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  </button>
</div>`;

  deleteFirstTask();
  tasks.insertAdjacentHTML("beforeend", markup);
  setTimeout(function () {
    tasks.lastChild.classList.remove("hidden");
  }, 10);
};

const updateStorage = function () {
  localStorage.setItem("tasks", JSON.stringify(localTasks));
};
function uploadTasks() {
  if (localTasks.length > 0) {
    localTasks.forEach((t, i) =>
      generateTask(t.taskText, +t.index, t.done, true)
    );
  } else generateFirstTask();
}
function counterUpdate() {
  const doneTasks = Array.from(tasks.querySelectorAll(".text-task"));
  const counter = doneTasks.reduce(
    (curr, don) => curr + don.classList.contains("done-task"),
    0
  );
  tasksComplited.textContent = counter;
  tasksQuantity.textContent = doneTasks.length || 1;
}

// Update Counter and Local Storage
const updateAll = () => {
  counterUpdate();
  updateStorage();
};

// Click Events
tasks.addEventListener("click", function (e) {
  // DONE TASK
  changeTaskStatus(e);
  // DELETE TASK
  deleteTask(e);
});
// Submit task
addTask.addEventListener("submit", function (e) {
  e.preventDefault();
  const taskText = inputTask.value;
  if (taskText.trim().length === 0) return;
  createTask(taskText, generateID());
  counterUpdate();
  updateStorage();
  inputTask.value = "";
});

// Timer for removeAll button
let timer;

// Remove all Timer
["mousedown", "touchstart"].forEach((press) => {
  removeAll.addEventListener(press, function (e) {
    removeAll.classList.add("active-remove-button");
    e.preventDefault();
    const checkHold = setTimeout(function () {
      localTasks.splice(0);
      const doneTasks = Array.from(tasks.querySelectorAll(".task"));
      removeAll.classList.remove("active-remove-button");

      doneTasks.forEach((task) => task.remove());
      generateFirstTask();
      updateAll();
    }, 2000);
    let i = 2;
    timerRemove.innerHTML = `[${i}]`;
    timer = setInterval(function () {
      i--;
      timerRemove.innerHTML = `[${i}]`;
      if (i < 1) {
        clearInterval(timer);
        timerRemove.innerHTML = "";
      }
    }, 1000);

    ["mouseup", "touchend"].forEach((unpress) => {
      removeAll.addEventListener(unpress, () => {
        clearTimeout(checkHold);
        clearInterval(timer);
        timerRemove.innerHTML = "";
        removeAll.classList.remove("active-remove-button");
      });
    });
  });
});

/// init
const init = () => {
  uploadTasks();
  updateAll();
};

init();
