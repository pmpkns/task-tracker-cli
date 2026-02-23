import { taskStatus } from "./constants.js"
import { getNextId } from "./pk.js"

export class Task {
  readonly id: number
  description: string
  status: string
  readonly createdAt: Date
  updatedAt: Date

  constructor(description: string) {
    this.description = description
    this.id = getNextId()
    this.status = taskStatus.TODO
    this.createdAt = new Date()
    this.updatedAt = this.createdAt
  }
}
