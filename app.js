const tasks = [
  {
    _id: "5d2ca9e2e03d40b326596aa7",
    completed: false,
    body: "Learn JavaScript\r\n",
    title: "JS"
  },
  {
    _id: "5d2ca9e29c8a94095c1288e0",
    completed: false,
    body: "Learn HTML\r\n",
    title: "HTML"
  },
  {
    _id: "5d2ca9e2e03d40b3232496aa7",
    completed: false,
    body: "Learn CSS\r\n",
    title: "CSS"
  },
  {
    _id: "5d2ca9e29c8a94095564788e0",
    completed: false,
    body: "Learn VueJs\r\n",
    title: "Vue"
  }
];

(function (arrOfTasks) {

  const ObjectOfStorage = JSON.parse(localStorage.getItem('Task_Object')); 
  
  let objOfTasks = ObjectOfStorage || arrOfTasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {});

  const themes = {
    default: {
      '--base-text-color': '#212529',
      '--header-bg': '#007bff',
      '--header-text-color': '#fff',
      '--default-btn-bg': '#007bff',
      '--default-btn-text-color': '#fff',
      '--default-btn-hover-bg': '#0069d9',
      '--default-btn-border-color': '#0069d9',
      '--danger-btn-bg': '#dc3545',
      '--danger-btn-text-color': '#fff',
      '--danger-btn-hover-bg': '#bd2130',
      '--danger-btn-border-color': '#dc3545',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#80bdff',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
    },
    dark: {
      '--base-text-color': '#212529',
      '--header-bg': '#343a40',
      '--header-text-color': '#fff',
      '--default-btn-bg': '#58616b',
      '--default-btn-text-color': '#fff',
      '--default-btn-hover-bg': '#292d31',
      '--default-btn-border-color': '#343a40',
      '--default-btn-focus-box-shadow':
        '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
      '--danger-btn-bg': '#b52d3a',
      '--danger-btn-text-color': '#fff',
      '--danger-btn-hover-bg': '#88222c',
      '--danger-btn-border-color': '#88222c',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#78818a',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
    },
    light: {
      '--base-text-color': '#212529',
      '--header-bg': '#fff',
      '--header-text-color': '#212529',
      '--default-btn-bg': '#fff',
      '--default-btn-text-color': '#212529',
      '--default-btn-hover-bg': '#e8e7e7',
      '--default-btn-border-color': '#343a40',
      '--default-btn-focus-box-shadow':
        '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
      '--danger-btn-bg': '#f1b5bb',
      '--danger-btn-text-color': '#212529',
      '--danger-btn-hover-bg': '#ef808a',
      '--danger-btn-border-color': '#e2818a',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#78818a',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
    },
  };
  
  let lastSelectedTheme = localStorage.getItem('theme') || 'default';

  // Elements UI
  const listContainer = document.querySelector(".tasks-list-section .list-group");
  createButtonSort();

  const sortAllBtn = document.querySelector('#sortAllBtn');
  const sortIncompleteBtn = document.querySelector('#sortIncompleteBtn');

  const form = document.forms["addTask"];
  const intupTitle = form.elements["title"];
  const inputBody = form.elements["body"];
  const themeSelect = document.getElementById('themeSelect');

  // Events
  form.addEventListener("submit", onFormSubmitHandler);

  listContainer.addEventListener("click", onDeleteHandler);
  listContainer.addEventListener("click", onDoneHandler);

  sortAllBtn.addEventListener('click', e => {
      const allTasks = document.querySelectorAll('li');
      allTasks.forEach(el => el.classList.remove('display-none'));
  });
  
  sortIncompleteBtn.addEventListener('click', sortIncompleteTasks);

  themeSelect.addEventListener('change', onThemeSelectHandler);

  // Function
  setTheme(lastSelectedTheme);

  renderAllTasks(objOfTasks);

  check();

  function renderAllTasks(tasksList) {
    if (!tasksList) {
      alert("Передайте список задач!");
      return;
    }

    const fragment = document.createDocumentFragment();

    Object.values(tasksList).forEach(task => {
      const li = listItemTemplate(task);
      fragment.appendChild(li);
    });

    listContainer.appendChild(fragment);
  }

  function listItemTemplate({ _id, title, body } = {}) {
    const li = document.createElement("li");
    li.classList.add("list-group-item", "d-flex", "align-items-center", "flex-wrap", "mt-2");

    li.setAttribute('data-task-id', _id);

    const span = document.createElement("span");
    span.textContent = title;
    span.style.fontWeight = "bold";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete task";
    deleteBtn.classList.add("btn", "btn-danger", "ml-auto", "delete-btn");

    const doneBtn = document.createElement('button');
    doneBtn.textContent = 'Mark as done';
    doneBtn.classList.add("btn",'btn-done');

    const article = document.createElement("p");
    article.textContent = body;
    article.classList.add("mt-2", "w-100");

    const decisionDisplay = document.createElement('p');
    decisionDisplay.textContent = 'Not resolved';
    decisionDisplay.classList.add("mt-2", "w-100", 'task-status', 'color-orange');

    li.appendChild(span);
    li.appendChild(deleteBtn);
    li.appendChild(doneBtn);
    li.appendChild(article);
    li.appendChild(decisionDisplay);

    return li;
  }

  // Input
  function onFormSubmitHandler(e) {
    e.preventDefault();
    const titleValue = intupTitle.value;
    const bodyValue = inputBody.value;

    if (!titleValue || !bodyValue) {
      alert("Заполните оба поля");
      return;
    }

    const task = createNewTask(titleValue, bodyValue);
    const listItem = listItemTemplate(task);
    listContainer.insertAdjacentElement("afterbegin", listItem);
    form.reset();

  }

  // Create
  function createNewTask(title, body) {
    const newTask = {
      title,
      body,
      completed: false,
      _id: `task-${Math.random()}`
    };

    objOfTasks[newTask._id] = newTask;
    localStorage.setItem('Task_Object', JSON.stringify(objOfTasks));

    return { ...newTask };
  }

  // Delete
  function deleteTaskFromHtml(confirmed, el) {
    if (!confirmed) return;
    el.remove();
  }

  function deleteTask(id) {
    const { title } = objOfTasks[id];
    const isConfirm = confirm(`Вы подтверждаете удаление задачи: ${title} ?`);
    if (!isConfirm) {
      return isConfirm;
    }
    delete objOfTasks[id];
    return isConfirm;
  }

  function onDeleteHandler({ target }) {
    if (target.classList.contains('delete-btn')) {
      const parent = target.closest('[data-task-id]');
      const id = parent.dataset.taskId;
      const confirmed = deleteTask(id);
      deleteTaskFromHtml(confirmed, parent);
      check();
      localStorage.setItem('Task_Object', JSON.stringify(objOfTasks));
    }
  }

  // Done
  function onDoneHandler({ target }) {
    if (target.classList.contains('btn-done')) {
      const parent = target.closest('[data-task-id]');
      const taskStatus = parent.querySelector('.task-status');
      const id = parent.dataset.taskId;      
      parent.classList.toggle('done-cont');

        if (parent.classList.contains('done-cont')) {
          objOfTasks[id].completed = true;
          taskStatus.textContent = 'Resolved';
          taskStatus.classList.add('color-greenyellow', 'font-weight');
          parent.classList.add('task-is-done');
          sortIncompleteTasks();

        } else {
          objOfTasks[id].completed = false;
          taskStatus.textContent = 'Not resolved';
          taskStatus.classList.remove('color-greenyellow');
          parent.classList.remove('task-is-done');
        }
    }
 }
  
  // Check
  function check() {
    let check = checkObjOfTasks();
    if (check) {
      return;
    }
    li = addEmptyLi();
    listContainer.appendChild(li);    
 }

  function checkObjOfTasks(obj = objOfTasks) {
    if (Object.keys(obj).length == 0) {
      return null;
    }
    return true;
 }

  function addEmptyLi() {
    const li = document.createElement('li');
    li.classList.add( "list-group-item", "d-flex", "align-items-center", "flex-wrap", "mt-2");
    li.style.background = '#dc3545';
    li.textContent = 'Список задач пуст!!!';
    return li; 
  }

  // Sort
  function createButtonSort() {
    const sortAllBtn = document.createElement('button');
    sortAllBtn.textContent = 'Show all tasks';
    sortAllBtn.classList.add("btn", "ml-auto", 'btn-sort', "sort-all-tasks");
    sortAllBtn.setAttribute('id', 'sortAllBtn');
  
    const sortIncompleteBtn = document.createElement('button');
    sortIncompleteBtn.textContent = 'Show incomplete tasks';
    sortIncompleteBtn.classList.add("btn", "ml-auto", 'btn-sort', "sort-incomplete-tasks");
    sortIncompleteBtn.setAttribute('id', 'sortIncompleteBtn');

    listContainer.insertAdjacentElement("beforebegin" , sortAllBtn);
    listContainer.insertAdjacentElement("beforebegin", sortIncompleteBtn);
  }

  function sortIncompleteTasks() {
      const allTasks = document.querySelectorAll('li');
        allTasks.forEach(el => {
          if (el.classList.contains('task-is-done')) {
            el.classList.add('display-none');
          }
        })
  }

  // Theme
  function onThemeSelectHandler(e) {
    const selectedTheme = themeSelect.value;
    const isConfirmed = confirm(`Изменить тему на ${selectedTheme}`);
    if (!isConfirmed) {
      themeSelect.value = lastSelectedTheme;
      return;
    }
    setTheme(selectedTheme);
    lastSelectedTheme = selectedTheme;
    localStorage.setItem('theme', selectedTheme);
  }

  function setTheme(name) {
    const selectedThemeObj = themes[name];
    Object.entries(selectedThemeObj).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }
})(tasks);