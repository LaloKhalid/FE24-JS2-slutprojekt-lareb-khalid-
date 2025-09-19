import { Member } from "./models/Member";
import { Task } from "./models/Task";
import {
  addMember,
  getMembers,
  addTask,
  getTasks,
  updateTask,
  deleteTask,
} from "./services/firebase";

// ---------------------------
// Global State
// ---------------------------
let members: Member[] = [];
let tasks: Task[] = [];

console.log("🚀 Scrum Board Initialized!");

// ---------------------------
// Render Tasks into Board
// ---------------------------
function renderTasks() {
  const newCol = document.getElementById("new-tasks")!;
  const inProgressCol = document.getElementById("in-progress")!;
  const doneCol = document.getElementById("done")!;

  // Reset columns
  newCol.innerHTML = "<h2>New</h2>";
  inProgressCol.innerHTML = "<h2>In Progress</h2>";
  doneCol.innerHTML = "<h2>Done</h2>";

  tasks.forEach((task) => {
    const div = document.createElement("div");
    div.className = "task";
    div.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <p><strong>Category:</strong> ${task.category}</p>
      <p><strong>Status:</strong> ${task.status}</p>
      
      <label>Assign to:</label>
      <select class="assign-dropdown" data-task-id="${task.id}">
        <option value="">-- Select Member --</option>
        ${members
          .map(
            (m) =>
              `<option value="${m.id}" ${
                task.assigned === m.id ? "selected" : ""
              }>${m.name}</option>`
          )
          .join("")}
      </select>

      <button class="mark-done" data-task-id="${task.id}">Mark Done</button>
      <button class="delete-task" data-task-id="${task.id}">Delete</button>
    `;

    if (task.status === "new") newCol.appendChild(div);
    else if (task.status === "in-progress") inProgressCol.appendChild(div);
    else if (task.status === "done") doneCol.appendChild(div);
  });

  // Event listeners
  document.querySelectorAll<HTMLSelectElement>(".assign-dropdown").forEach((dropdown) => {
    dropdown.addEventListener("change", async (e) => {
      const select = e.target as HTMLSelectElement;
      const taskId = select.dataset.taskId!;
      const memberId = select.value || null;

      await updateTask(taskId, {
        assigned: memberId,
        status: memberId ? "in-progress" : "new",
      });

      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        task.assign(memberId || "");
        task.status = memberId ? "in-progress" : "new";
      }

      renderTasks();
    });
  });

  document.querySelectorAll<HTMLButtonElement>(".mark-done").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const taskId = btn.dataset.taskId!;
      await updateTask(taskId, { status: "done" });

      const task = tasks.find((t) => t.id === taskId);
      if (task) task.markDone();

      renderTasks();
    });
  });

  document.querySelectorAll<HTMLButtonElement>(".delete-task").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const taskId = btn.dataset.taskId!;
      await deleteTask(taskId);

      tasks = tasks.filter((t) => t.id !== taskId);
      renderTasks();
    });
  });
}

// ---------------------------
// Render Members List
// ---------------------------
function renderMembers() {
  const memberList = document.getElementById("members-list")!;
  memberList.innerHTML = "<h2>Team Members</h2>";
  members.forEach((m) => {
    const div = document.createElement("div");
    div.textContent = `${m.name} (${m.role})`;
    memberList.appendChild(div);
  });
}

// ---------------------------
// Load Initial Data
// ---------------------------
async function loadData() {
  const firebaseMembers = await getMembers();
  members = firebaseMembers.map((m: any) => new Member(m.id, m.name, m.role));

  const firebaseTasks = await getTasks();
  tasks = firebaseTasks.map(
    (t: any) =>
      new Task(
        t.id,
        t.title,
        t.description,
        t.category,
        t.timestamp.toDate ? t.timestamp.toDate() : new Date(t.timestamp),
        t.status,
        t.assigned
      )
  );

  renderMembers();
  renderTasks();
}

// ---------------------------
// Form Handling
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Add member form
  const memberForm = document.getElementById("member-form") as HTMLFormElement;
  memberForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = (document.getElementById("member-name") as HTMLInputElement).value;
    const role = (document.getElementById("member-role") as HTMLInputElement).value;

    const docRef = await addMember(name, role);
    members.push(new Member(docRef.id, name, role));
    renderMembers();

    memberForm.reset();
  });

  // Add task form
  const taskForm = document.getElementById("task-form") as HTMLFormElement;
  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = (document.getElementById("task-title") as HTMLInputElement).value;
    const description = (document.getElementById("task-desc") as HTMLInputElement).value;
    const category = (document.getElementById("task-category") as HTMLInputElement).value;

    const docRef = await addTask(title, description, category);
    tasks.push(new Task(docRef.id, title, description, category, new Date()));
    renderTasks();

    taskForm.reset();
  });

  loadData();
});
