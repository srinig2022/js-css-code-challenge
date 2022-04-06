var taskInput = document.getElementById("new-task");
var addButton = document.getElementsByTagName("button")[0];
var incompleteTasksHolder = document.getElementById("incomplete-tasks");
var completedTasksHolder = document.getElementById("completed-tasks");


var createNewTaskElement = function(taskString,id, checked) {
  listItem = document.createElement("li");
  listItem.setAttribute('data-id', id);
  checkBox = document.createElement("input");
  label = document.createElement("label");
  editInput = document.createElement("input");
  editButton = document.createElement("button");
  deleteButton = document.createElement("button");

  checkBox.type = "checkbox";
  if(checked){
    checkBox.setAttribute('checked', checked)
  } 
  editInput.type = "text";
  editButton.innerText = "Edit";
  editButton.className = "edit";
  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";
  label.innerText = taskString;

  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  return listItem;
};

var addTask = function (e) {
  e.preventDefault();
  if(taskInput.value == ""){
    alert("Item can not be empty")
    return;
  }
  var listItemName = taskInput.value
  var id = new Date().getTime();
  listItem = createNewTaskElement(listItemName, id, false)

  localStorage.setItem("tasks", JSON.stringify([...JSON.parse(localStorage.getItem("tasks") || "[]"), { id: id, task: taskInput.value, completed: false }]));

  incompleteTasksHolder.appendChild(listItem)
  bindTaskEvents(listItem, taskCompleted)
  taskInput.value = "";
};

addButton.addEventListener("click", addTask);



window.onload  = function () {
  
  let taskList = JSON.parse(localStorage.getItem("tasks"));
  
  for (var i = 0; i < taskList.length; i++) {   
       let itemVal =  createNewTaskElement(taskList[i].task, taskList[i].id, taskList[i].completed)
      
    if(taskList[i].completed){
      completedTasksHolder.appendChild(itemVal)
      bindTaskEvents(itemVal,  taskIncomplete);
    }     
    else{
      incompleteTasksHolder.appendChild(itemVal)
      bindTaskEvents(itemVal, taskCompleted);
    }  
   
  }
}

var editTask = function () {
  var listItem = this.parentNode;
  //
  var editInput = listItem.querySelector("input[type=text");
  var label = listItem.querySelector("label");
  var button = listItem.getElementsByTagName("button")[0];

  

  var containsClass = listItem.classList.contains("editMode");
  if (containsClass) {
     

      if(editInput.value == ""){
        alert("Item can not be empty")
        return;
      }else{
        label.innerText = editInput.value
        button.innerText = "Edit";
      }

      let taskList = JSON.parse(localStorage.getItem("tasks"));
      taskList =  taskList.map(item => {
   
       if(item.id == listItem.getAttribute('data-id') ){
           item.task = editInput.value
       }
       return item
   })
   
   localStorage.setItem("tasks", JSON.stringify(taskList));

  } else {
     editInput.value = label.innerText
     button.innerText = "Save";
  }
  
  listItem.classList.toggle("editMode");

  

};

//
var deleteTask = function () {
  var listItem = this.parentNode;
  var ul = listItem.parentNode;
  ul.removeChild(listItem);

  let taskList = JSON.parse(localStorage.getItem("tasks"));
      taskList =  taskList.filter(item => {
   
       if(item.id == listItem.getAttribute('data-id') ){
          return false
       }
       return true
   })
   
   localStorage.setItem("tasks", JSON.stringify(taskList));

};

var taskCompleted = function (e) {
  var listItem = this.parentNode;
  completedTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskIncomplete);
  

  let taskList = JSON.parse(localStorage.getItem("tasks"));
 taskList =  taskList.map(item => {
  
      if(item.id == listItem.getAttribute('data-id') ){
          item.completed = true
      }
      return item
  })
  
  localStorage.setItem("tasks", JSON.stringify(taskList));

};

var taskIncomplete = function() {
  var listItem = this.parentNode;
  incompleteTasksHolder.appendChild(listItem); 
  bindTaskEvents(listItem, taskCompleted);

  let taskList = JSON.parse(localStorage.getItem("tasks"));
 taskList =  taskList.map(item => {
  
      if(item.id == listItem.getAttribute('data-id') ){
          item.completed = false
      }
      return item
  })
  
  localStorage.setItem("tasks", JSON.stringify(taskList)); 
};





var bindTaskEvents = function(taskListItem, checkBoxEventHandler) {
  var checkBox = taskListItem.querySelector("input[type=checkbox]");
  var editButton = taskListItem.querySelector("button.edit");
  var deleteButton = taskListItem.querySelector("button.delete");
  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
  checkBox.onchange = checkBoxEventHandler;
};



for (var i = 0; i < incompleteTasksHolder.children.length; i++) {
  bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
}

for (var i = 0; i < completedTasksHolder.children.length; i++) {
  bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
}