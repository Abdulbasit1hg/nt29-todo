import todoArray from "./../api/todos.js";
import * as lib from "./helpers/lib.js";

let form = document.getElementById("formik");
let storage = window.localStorage;
let storageTodos = storage.getItem("todos");

let data = storageTodos ? JSON.parse(storageTodos) : todoArray;

let makerTodo = document.querySelector(".maker-todo");
let addTodo = document.querySelector(".add-todo");
let listGroup = document.querySelector(".list-group");

// enter || when submit
form.addEventListener("submit", (event) => {
  event.preventDefault();
});

listGroup.addEventListener("click", (event) => {
  let pressedNode = event.target;

  if (!listGroup.contains(pressedNode)) return;

  if (!pressedNode.closest("[data-type]")) return;

  switch (pressedNode.dataset.type) {
    case "delete":
      let deleteParentNode = pressedNode.parentNode.parentNode;
      // data arraydan tanlangan todoni o'chirish
      data = data.filter((todo) => {
        return todo.id != deleteParentNode.dataset.id;
      });

      // storagega qayta ishlangan massivni saqlash
      storage.setItem("todos", JSON.stringify(data));
      // ekrandan LIni o'chirish
      deleteParentNode.remove();
      break;
    case "edit":
      let editParentNode = pressedNode.parentNode.parentNode;
      let todoText = editParentNode.childNodes[1].textContent;
      let editId = editParentNode.dataset.id;

      editTodo.dataset.id = editId;
      editTodo.value = todoText;

      break;
    case "check":
      let checkParentNode = pressedNode.parentNode;

      checkParentNode.classList.toggle("task-done");

      data = data.map((todo) => {
        if (todo.id == checkParentNode.dataset.id) {
          todo.isDone = !todo.isDone;
        }

        return todo;
      });

      // storagega qayta ishlangan massivni saqlash
      storage.setItem("todos", JSON.stringify(data));

      break;
  }
});

// inputdan listga todoni qo'shish
addTodo.addEventListener("click", () => {
  if (makerTodo.value.trim().length <= 3) {
    alert("belgilar soni 4tadan kam");
    return;
  }

  let newTodoObject = lib.todoObjectCreator(makerTodo.value);
  data.push(newTodoObject);

  // storagega qayta ishlangan massivni saqlash
  storage.setItem("todos", JSON.stringify(data));

  let newTodoNode = lib.createElement(
    newTodoObject.id,
    newTodoObject.isDone,
    newTodoObject.text
  );

  listGroup.prepend(newTodoNode);
  makerTodo.value = "";
});

// statik datani listga reverse shaklda render qilish
data.forEach((todo) => {
  let newTodoNode = lib.createElement(todo.id, todo.isDone, todo.text);

  listGroup.prepend(newTodoNode);
});

// edit todo save
saveTodoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let newTodo = editTodo.value;
  let todoId = editTodo.dataset.id;

  data = data.map((todo) => {
    if (todo.id == todoId) {
      todo.text = newTodo;
    }

    return todo;
  });

  // storagega qayta ishlangan massivni saqlash
  storage.setItem("todos", JSON.stringify(data));

  lib.render(data, listGroup);
});
