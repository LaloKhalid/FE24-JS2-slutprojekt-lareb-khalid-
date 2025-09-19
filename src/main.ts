import { Member } from "./models/Member";
import { Task } from "./models/Task";
import { 
    getMembers, 
    getTasks, 
    updateTask, 
    deleteTask, 
    addMember, 
    addTask 
} from "./services/firebase";

console.log("Scrum Board Initialized!");

// ---------------------------
// DOM references
// ---------------------------
const newColumn = document.getElementById("new-tasks")!;
const inProgressColumn = document.getElementById("in-progress")!;
const doneColumn = document.getElementById("done")!;

// ---------------------------
// Global state
// ---------------------------
let members: Member[] = [];
let tasks: Task[] = [];

// ---------------------------
// Initialize Board
// ---------------------------
async function initBoard() {
    // Fetch members and tasks from Firestore
    members = (await getMembers()).map(
        m => new Member(m.id, m.name, m.role)
    );

    tasks = (await getTasks()).map(
        t => new Task(
            t.id,
            t.title,
            t.description,
            t.category,
            new Date(t.timestamp),
            t.status ?? "new",
            t.assigned ?? null
        )
    );

    renderTasks();
}

// ---------------------------
// Render Tasks
// ---------------------------
function renderTasks() {
    // Clear columns
    newColumn.innerHTML = "<h2>New</h2>";
    inProgressColumn.innerHTML = "<h2>In Progress</h2>";
    doneColumn.innerHTML = "<h2>Done</h2>";

    tasks.forEach(task => {
        const card = document.createElement("div");
        card.className = "task-card";
        card.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Category: ${task.category}</p>
            <p>Created: ${task.timestamp.toLocaleString()}</p>
            <p>Assigned: ${task.assigned ? getMemberName(task.assigned) : "None"}</p>
            ${task.status === "new" ? renderAssignDropdown(task) : ""}
            ${task.status === "in progress" ? `<button class="done-btn">Mark Done</button>` : ""}
            ${task.status === "done" ? `<button class="delete-btn">Delete</button>` : ""}
        `;

        // Append card to proper column
        if (task.status === "new") newColumn.appendChild(card);
        else if (task.status === "in progress") inProgressColumn.appendChild(card);
        else doneColumn.appendChild(card);

        // ---------------------------
        // Event listeners
        // ---------------------------
        if (task.status === "new") {
            const select = card.querySelector("select")!;
            select.addEventListener("change", async () => {
                const memberId = (select as HTMLSelectElement).value;
                if (!memberId) return;
                task.assign(memberId);
                task.status = "in progress";
                await updateTask(task.id, { assigned: memberId, status: "in progress" });
                renderTasks();
            });
        }

        if (task.status === "in progress") {
            const btn = card.querySelector(".done-btn")!;
            btn.addEventListener("click", async () => {
                task.markDone();
                await updateTask(task.id, { status: "done" });
                renderTasks();
            });
        }

        if (task.status === "done") {
            const btn = card.querySelector(".delete-btn")!;
            btn.addEventListener("click", async () => {
                await deleteTask(task.id);
                tasks = tasks.filter(t => t.id !== task.id);
                renderTasks();
            });
        }
    });
}

// ---------------------------
// Helpers
// ---------------------------
function renderAssignDropdown(task: Task) {
    let options = `<option value="">Assign Member</option>`;
    members.forEach(m => {
        if (m.role.toLowerCase() === task.category.toLowerCase()) {
            options += `<option value="${m.id}">${m.name} (${m.role})</option>`;
        }
    });
    return `<select>${options}</select>`;
}

function getMemberName(id: string) {
    const member = members.find(m => m.id === id);
    return member ? member.name : "Unknown";
}

// ---------------------------
// Initialize App
// ---------------------------
initBoard();
