import { Task } from '../models/Task';

//filter tasks by member ID

export const filterTasksByMember = (tasks: Task[], memberId: string): Task[] => 
    tasks.filter(task => task.assigned === memberId);

// filter tasks by category 
export const filterTasksByCategory = (tasks: Task[], category: string): Task[] =>
    tasks.filter(task => task.category === category);

//filter tasks by status
export const sortTasksByTimestamp = (tasks: Task[], direction: 'asc' | 'desc'): Task[] =>
[...tasks].sort((a, b) => 
    direction === 'asc' 
    ? a.timestamp.getTime() - b.timestamp.getTime() 
    : b.timestamp.getTime() - a.timestamp.getTime()
);

// sort by Title (A to Z or Z to A)
export const sortTasksByTitle = (tasks: Task[], direction: 'asc' | 'desc'): Task[] =>
[...tasks].sort((a, b) => 
    direction === 'asc' 
    ? a.title.localeCompare(b.title) 
    : b.title.localeCompare(a.title)
);