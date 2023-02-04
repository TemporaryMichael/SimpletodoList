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
  createTask(taskText);
  localTasks.push(taskText);
  updateStorage();
  inputTask.value = "";
});
const createTask = function (textTask, isLocal = false) {
  const markup = `          
  <div class="task ${isLocal ? "" : "hidden"}">
  <div class="text-task">${textTask}</div>
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
  if (e.target.closest(".remove-task")) {
    const selectTask = e.target.closest(".task");
    const getText = selectTask.querySelector(".text-task").textContent;
    localTasks.splice(
      localTasks.findIndex((i) => i === getText),
      1
    );
    updateStorage();
    console.log(getText);
    console.log(localTasks);
    selectTask.classList.add("hidden");
    setTimeout(() => {
      selectTask.remove();
    }, 200);
  }
});
const updateStorage = function () {
  localStorage.setItem("tasks", JSON.stringify(localTasks));
};

if (getLocal.length > 0) {
  task.remove();
  getLocal.forEach((t) => createTask(t, true));
}
