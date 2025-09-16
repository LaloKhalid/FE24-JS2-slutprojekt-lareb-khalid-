import {Member} from "./models/Member"
import {Task} from "./models/Task"

console.log("Scrum Board Innitialzed!")
// Create some members

const alice = new Member ("1", "Alice", "frontend");
console.log("Member Created", alice);

//dummy task 
const task1 = new Task("101","Build Login form","Create a simple login UI","frontend",new Date())

//assign Alice to the task
task1.assign(alice.id);
console.log("After Assigning:", task1);

//marking the task as done
task1.markDone();
console.log("After marking done", task1)