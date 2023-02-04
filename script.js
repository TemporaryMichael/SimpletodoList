const addTaskBtn = document.querySelector(".add-task--button");
const inputTask = document.querySelector(".input-task--text");
const addTask = document.querySelector(".add-task");
const tasks = document.querySelector(".list-task");
const task = document.querySelector(".task");
const sampleTask = document.querySelector(".sample-task");
const getLocal = JSON.parse(localStorage.getItem("tasks"));
const localTasks = getLocal ? getLocal : [];
addTask.addEventListener("submit", function (e) {
  if (sampleTask) sampleTask.remove();
  e.preventDefault();
  const taskText = inputTask.value;
  if (taskText === "") return;
  createTask(
    taskText,
    String(new Date().getTime()).slice(-5).padStart(5, 0),
    false,
    false
  );
  localTasks.push({
    taskText,
    index: String(new Date().getTime()).slice(-5).padStart(5, 0),
    done: false,
  });
  updateStorage();
  inputTask.value = "";
});
const createTask = function (
  textTask,
  taskIndex = String(new Date().getTime()).slice(-5).padStart(5, 0),
  done = false,
  isLocal = false
) {
  const markup = `          
  <div class="task sample-task ${
    isLocal ? "" : "hidden"
  }" data-index = ${taskIndex}>
  <form class="task-form">
    <input id="task-${taskIndex}" type="checkbox" ${done ? "checked" : ""}/>
    <label for="task-${taskIndex}" class="text-task ${
    done ? "done-task" : ""
  }">${textTask}</label>
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
  tasks.insertAdjacentHTML("beforeend", markup);
  setTimeout(function () {
    tasks.lastChild.classList.remove("hidden");
  }, 10);
};
tasks.addEventListener("click", function (e) {
  // DONE TASK
  if (e.target.localName === "input") {
    const taskDone = e.target.closest(".task");
    const textDoneTask = taskDone.querySelector(".text-task");
    const findTaskIndex = localTasks.findIndex(
      (t) =>
        t.index === taskDone.dataset.index.padStart(5, 0) ||
        t.index === String(+taskDone.dataset.index + 1).padStart(5, 0)
    );
    localTasks[findTaskIndex].done = !localTasks[findTaskIndex].done;
    // const getTaskByIndex = localTasks.find(ind=>ind.index === )
    textDoneTask.classList.toggle("done-task");
    updateStorage();
  }
  // DELETE TASK
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
    }, 300);
  }
});

const updateStorage = function () {
  localStorage.setItem("tasks", JSON.stringify(localTasks));
};

if (localTasks.length > 0) {
  task.remove();
  getLocal.forEach((t, i) => createTask(t.taskText, +t.index, t.done, true));
}
