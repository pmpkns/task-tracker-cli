import * as Helpers from "./helpers.js"
import { Task } from "./task.js"
import { ensureDirectoryExists } from "./pk.js"
import {
  taskStatus,
  STORAGE_CONFIG,
  AppError,
  formatError,
  ERROR_MESSAGE,
} from "./constants.js"

interface Database {
  create: Function
  read: Function
  updateDescription: Function
  delete: Function
}

export type FilterStatusOptions = (typeof taskStatus)[keyof typeof taskStatus]

export default class JsonFileDatabase implements Database {
  constructor() {
    try {
      ensureDirectoryExists(STORAGE_CONFIG.fileDatabase)
      Helpers.loadFile(STORAGE_CONFIG.fileDatabase)
    } catch (error) {
      throw error
    }
  }
  #loadData = async (): Promise<Task[]> => {
    try {
      const content = await Helpers.readFile(
        STORAGE_CONFIG.fileDatabase,
        STORAGE_CONFIG.encoding,
      )
      if (!content) return []
      return await Helpers.parseJson(content)
    } catch (error) {
      throw error
    }
  }
  #saveData = async (data: Task[]): Promise<void> => {
    try {
      ensureDirectoryExists
      await Helpers.writeJson(
        data,
        STORAGE_CONFIG.fileDatabase,
        STORAGE_CONFIG.encoding,
      )
    } catch (error) {
      throw error
    }
  }
  create = async (description: string): Promise<number> => {
    try {
      const data: Task[] = await this.#loadData()
      const task = new Task(description)
      data.push(task)
      await this.#saveData(data)
      return task.id
    } catch (error) {
      throw error
    }
  }

  read = async (filter?: FilterStatusOptions): Promise<Task[]> => {
    try {
      let data: Task[] = await this.#loadData()
      if (filter) {
        data = data.filter((task) => task.status === filter)
      }
      return data
    } catch (error) {
      throw error
    }
  }

  updateDescription = async (id: number, description: string) => {
    try {
      const data: Task[] = await this.#loadData()
      const task = data.find((task) => task.id === id)
      if (task) {
        task.description = description
        task.updatedAt = new Date()
        await this.#saveData(data)
      } else {
        throw new AppError(formatError(ERROR_MESSAGE.INVALID_ID, id))
      }
    } catch (error) {
      throw error
    }
  }

  updateStatus = async (id: number, status: string) => {
    try {
      const data: Task[] = await this.#loadData()
      const task = data.find((task) => task.id === id)
      if (task) {
        task.status = status
        task.updatedAt = new Date()
        await this.#saveData(data)
      } else {
        throw new AppError(formatError(ERROR_MESSAGE.INVALID_ID, id))
      }
    } catch (error) {
      throw error
    }
  }

  delete = async (id: number) => {
    try {
      let data: Task[] = await this.#loadData()
      const task = data.find((task) => task.id === id)
      if (task) {
        data = data.filter((task) => task.id !== id)
      } else {
        throw new AppError(formatError(ERROR_MESSAGE.INVALID_ID, id))
      }
      await this.#saveData(data)
    } catch (error) {
      throw error
    }
  }
}
