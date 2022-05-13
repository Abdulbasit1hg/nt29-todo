import todoArray from "./../api/todos.js";
import * as lib from "./helpers/lib.js";

let storage = window.localStorage;
let storageTodos = storage.getItem("todos");

let data = storageTodos ? JSON.parse(storageTodos) : todoArray;

let makerTodo = document.querySelector(".maker-todo");
let addTodo = document.querySelector(".add-todo");
let listGroup = document.querySelector(".list-group");

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
      // lib.edit(editParentNode.dataset.id);
      break;
    case "check":
      let checkParentNode = pressedNode.parentNode;
      // lib.check(checkParentNode.dataset.id);
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
