export type TaskStatus = "new" | "in progress" | "done";
export type TaskCategory = "ux" | "frontend" | "backend";

export class Task {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public category: TaskCategory,
    public timestamp: Date,
    public status: TaskStatus = "new",
    public assigned?: string // will hold Member ID
  ) {}

  assign(memberId: string) {
    this.assigned = memberId;
    this.status = "in progress";
  }

  markDone() {
    this.status = "done";
  }
}
