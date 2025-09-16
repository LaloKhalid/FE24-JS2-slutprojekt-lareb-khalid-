import {Member} from "./models/Member"
import {Task} from "./models/Task"
import {
    filterTasksByMember,
    filterTasksByCategory,
    sortTasksByTimestamp,
    sortTasksByTitle
} from "./utils/taskUtils"

console.log("Scrum Board Innitialzed!")
// Create some members

const alice = new Member ("1", "Alice", "frontend");
const bob = new Member ("2", "Bob", "backend");
console.log("Member Created", alice);

//dummy task 
const task1 = new Task("101","Build Login form","Create a simple login UI","frontend",new Date())

//creating tasks

const tasks: Task[] = [
    new Task("102","Setup Database","Install and configure MongoDB","backend",new Date('2024-01-10')),
    new Task("103","API Integration","Integrate login API","backend",new Date('2024-01-12')),
    new Task("104","Design Homepage","Create homepage layout","frontend",new Date('2024-01-11')),
];

//assign Alice to the task
task1.assign(alice.id);
console.log("After Assigning:", task1);

tasks[0].assign(alice.id);
tasks[1].assign(bob.id);

//marking the task as done
task1.markDone();
console.log("After marking done", task1)

// Test filtering
console.log("Filter by member (Alice):", filterTasksByMember(tasks, alice.id));
console.log("Filter by category (backend):", filterTasksByCategory(tasks, "backend"));

// Test sorting
console.log("Sort by timestamp (asc):", sortTasksByTimestamp(tasks, "asc"));
console.log("Sort by title (desc):", sortTasksByTitle(tasks, "desc"));
