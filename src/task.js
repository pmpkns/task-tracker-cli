import { TaskStatus } from "./constants.js"

let primaryKey = 0

export class Task {
  constructor(description) {
    this.id = primaryKey++
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
