import "./styles.css"; // ✅ Import the CSS file for Webpack

document.addEventListener("DOMContentLoaded", () => {
    const addProjectBtn = document.getElementById("addProjectBtn");
    const projectList = document.getElementById("projectList");
    const todoContainer = document.getElementById("todoContainer");

    let projects = JSON.parse(localStorage.getItem("projects")) || [];

    function renderProjects() {
        projectList.innerHTML = "";
        projects.forEach((project, index) => {
            const li = document.createElement("li");

            // Project name
            const projectName = document.createElement("span");
            projectName.innerText = project.name;
            projectName.addEventListener("click", () => openTodoTable(index));

            // ❌ Delete Button
            const deleteBtn = document.createElement("button");
            deleteBtn.innerText = "❌";
            deleteBtn.classList.add("delete-project");
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation(); // Prevent opening the project when clicking ❌
                projects.splice(index, 1);
                localStorage.setItem("projects", JSON.stringify(projects));
                renderProjects();
                todoContainer.innerHTML = ""; // Clear To-Do table if the project is deleted
            });

            li.appendChild(projectName);
            li.appendChild(deleteBtn);
            projectList.appendChild(li);
        });
    }

    addProjectBtn.addEventListener("click", () => {
        const projectName = prompt("Enter project name:");
        if (projectName) {
            projects.push({ name: projectName, todos: [] });
            localStorage.setItem("projects", JSON.stringify(projects));
            renderProjects();
        }
    });

    function openTodoTable(projectIndex) {
        const project = projects[projectIndex];
        todoContainer.innerHTML = `
            <h2>${project.name}</h2>
            <table class="todo-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Due Date</th>
                        <th>Urgency</th>
                    </tr>
                </thead>
                <tbody id="todoList"></tbody>
            </table>
            <div id="todoFormContainer" class="hidden">
                <input type="text" id="todoTitle" placeholder="Title" required>
                <input type="date" id="todoDueDate" required>
                <select id="todoUrgency">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
                <button id="saveTodoBtn">Save To-Do</button>
            </div>
        `;
        todoDueDate.value = new Date().toISOString().split("T")[0]; // Set today's date as default
        const todoList = document.getElementById("todoList");
        const todoFormContainer = document.getElementById("todoFormContainer");
        const saveTodoBtn = document.getElementById("saveTodoBtn");

        function renderTodos() {
            todoList.innerHTML = "";
            project.todos.forEach((todo, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${todo.title}</td>
                    <td>${todo.dueDate}</td>
                    <td>${todo.urgency}</td>
                    <td class="green-tick" data-index="${index}">&#10004;</td>
                    <td class="delete-todo" data-index="${index}">&#10008;</td>
                `;
                if (todo.completed) {
                    row.classList.add("completed");
                }
                todoList.appendChild(row);
            });
        }

        saveTodoBtn.addEventListener("click", () => {
            const title = document.getElementById("todoTitle").value;
            const dueDate = document.getElementById("todoDueDate").value;
            const urgency = document.getElementById("todoUrgency").value;

            if (title && dueDate && urgency) {
                project.todos.push({ title, dueDate, urgency, completed: false });
                localStorage.setItem("projects", JSON.stringify(projects));
                renderTodos();
            }
        });

        todoList.addEventListener("click", (event) => {
            if (event.target.classList.contains("green-tick")) {
                const index = event.target.getAttribute("data-index");
                project.todos[index].completed = !project.todos[index].completed;
                localStorage.setItem("projects", JSON.stringify(projects));
                renderTodos();
            }
            if (event.target.classList.contains("delete-todo")) {
                const index = event.target.getAttribute("data-index");
                project.todos.splice(index, 1);
                localStorage.setItem("projects", JSON.stringify(projects));
                renderTodos();
            }
        });

        renderTodos();
    }

    renderProjects();
});
