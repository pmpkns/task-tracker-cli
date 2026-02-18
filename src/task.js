const TaskStatus = Object.freeze({
  PENDING: "pending",
  INPROGRESS: "inprogress",
  DONE: "done",
})

export class Task {
  static primaryKey = 0
  constructor(description) {
    primaryKey++
    this.id = primaryKey
    this.description = description
    this.status = TaskStatus.PENDING
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }
  updateStatus(status) {
    if (status in TaskStatus) this.status = status
    else throw new Error("Invalid status provided.")
  }
}
