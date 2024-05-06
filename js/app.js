const taskInput = document.getElementById("task-input")
const dateInput = document.getElementById("date-input")
const addButton = document.getElementById("add-button")
const editButton = document.getElementById("edit-button")
const alertMessage = document.getElementById("alert-message")
const toDosBody = document.querySelector("tbody")
const deleteAllButton = document.getElementById("delete-all-button")
const filterButtons = document.querySelectorAll(".filter-button")

let toDos = JSON.parse(localStorage.getItem("todos")) || []

const generateId = () => {
    const id = Math.round(Math.random() * Math.random() * Math.pow(10, 15)).toString()
    return id
}

const showAlert = (message, type) => {
    alertMessage.innerHTML = ""
    const alert = document.createElement("p")
    alert.innerText = message;
    alert.classList.add("alert")
    alert.classList.add(`alert-${type}`)
    alertMessage.appendChild(alert)

    setTimeout(() => {
        alert.style.display = "none"
    }, 2000);
}

const displayToDos = (data) => {
    const todoList = data || toDos
    toDosBody.innerHTML = ""
    if (!todoList.length) {
        toDosBody.innerHTML = '<tr><td colspan="4" >No task found!</td></tr>'
        return
    }
    todoList.forEach(todo => {
        toDosBody.innerHTML += `
            <tr>
            <td>${todo.task}</td>
            <td>${todo.date || "No Date"}</td>
            <td>${todo.completed ? 'completed' : 'pending'}</td>
            <td>
            <button  onClick ="editHandler('${todo.id}')">Edit</button>
            <button onClick ="toggleHandler('${todo.id}')">${todo.completed ? "Undo" : "Do"}</button>
            <button onClick ="deleteHandler('${todo.id}')">Delete</button> 
            </td> 
            </tr>`
    });
}

const saveToLOcalStorage = () => {
    localStorage.setItem("todos", JSON.stringify(toDos))
}

const addHandler = () => {
    const task = taskInput.value
    const date = dateInput.value
    const todo = {
        id: generateId(),
        task,
        date,
        completed: false
    }

    if (task) {
        toDos.push(todo);
        saveToLOcalStorage()
        displayToDos()
        taskInput.value = ''
        dateInput.value = ''
        showAlert("todo added successfully!", "success")

    } else {
        showAlert("please enter a todo!", "error")
    }
}


const deleteAllHandler = () => {
    if (toDos.length) {
        toDos = []
        saveToLOcalStorage()
        displayToDos()
        showAlert("All todos clear successfully", 'success')
    } else {
        showAlert("No todos to clear", 'error')

    }
}
const deleteHandler = (id) => {
    const newToDos = toDos.filter(todo => todo.id !== id)
    toDos = newToDos
    saveToLOcalStorage()
    displayToDos()
    showAlert(" todos deleted successfully", 'success')

}

const editHandler = id => {
    const todo = toDos.find(todo => todo.id === id)
    taskInput.value = todo.task;
    dateInput.value = todo.date;
    addButton.style.display = "none"
    editButton.style.display = "inline-block"
    editButton.dataset.id = id
}
const toggleHandler = id => {
    // const newToDos = toDos.map(todo => {
    //     if (todo.id === id) {
    //         return {
    //            ...todo,completed: !todo.completed
    //         }

    //     } else {
    //         return todo
    //     }
    // })
    // toDos = newToDos
    const todo = toDos.find((todo) => todo.id === id)
    todo.completed = !todo.completed
    saveToLOcalStorage()
    displayToDos()
    showAlert(" Todos status change successfully", 'success')

}
const applyEditHandler = (e) => {
    const id = e.target.dataset.id
    const todo = toDos.find(todo => todo.id === id)
    todo.task = taskInput.value
    todo.date = dateInput.value
    taskInput.value = ""
    dateInput.value = ""
    addButton.style.display = "inline-block"
    editButton.style.display = "none"
    saveToLOcalStorage()
    displayToDos()
    showAlert(" Todos edited successfully", 'success')

}
const filterHandler = (event) => {
    let filteredTodo = null;
    const filter = event.target.dataset.filter
    switch (filter) {
        case "pending":
            filteredTodo = toDos.filter(todo => todo.completed === false)
            break;
        case "completed":
            filteredTodo = toDos.filter(todo => todo.completed === true)
            break;

        default:
            filteredTodo = toDos
            break;
    }
    displayToDos(filteredTodo)
}
window.addEventListener("load", ()=>displayToDos())
addButton.addEventListener("click", addHandler)
editButton.addEventListener("click", applyEditHandler)
deleteAllButton.addEventListener("click", deleteAllHandler)
filterButtons.forEach((button) => { button.addEventListener("click", filterHandler) })