import {
  AppError,
  commands,
  formatError,
  taskStatus,
  ERROR_MESSAGE,
  WARN_MESSAGE,
} from "./constants.js"
import JsonFileDatabase, { type FilterStatusOptions } from "./database.js"
import type { Task } from "./task.js"

const db = new JsonFileDatabase()

const parseDescription = (descArray: string[]) => {
  try {
    if (!descArray.length)
      throw new AppError(formatError(ERROR_MESSAGE.MISSING_ARG, "description"))
    let description = ""
    if (descArray.length === 1) {
      if (!descArray[0]) throw new AppError(ERROR_MESSAGE.MISSING_ARGUMENTS)
      description = descArray[0].substring(1, descArray[0].length - 1)
    } else {
      description = descArray.join(" ")
      description = description.substring(1, description.length - 1)
    }
    return description
  } catch (error) {
    throw error
  }
}

const addTask = async (args: string[]): Promise<void> => {
  try {
    let description = parseDescription(args)
    const id = await db.create(description)
    console.log(`Task added successfully (ID: ${id})`)
  } catch (error) {
    throw error
  }
}
const deleteTask = async (args: string[]): Promise<void> => {
  try {
    if (!args.length)
      throw new AppError(formatError(ERROR_MESSAGE.MISSING_ARG, "ID"))
    if (args.length > 1) console.warn(WARN_MESSAGE.EXTRA_ARGS)
    if (!args[0])
      throw new AppError(formatError(ERROR_MESSAGE.MISSING_ARG, "ID"))
    let id = Number.parseInt(args[0], 10)
    await db.delete(id)
    console.log("Task deleted successfully.")
  } catch (error) {
    throw error
  }
}
const updateTaskDescription = async (args: string[]): Promise<void> => {
  try {
    if (!args.length) throw new AppError(ERROR_MESSAGE.MISSING_ARGUMENTS)
    if (!args[0])
      throw new AppError(formatError(ERROR_MESSAGE.MISSING_ARG, "ID"))
    let id = Number.parseInt(args[0])
    args = args.slice(1)
    let description = parseDescription(args)
    await db.updateDescription(id, description)
    console.log("Task updated successfully.")
  } catch (error) {
    throw error
  }
}

const updateTaskStatusToInProgress = async (args: string[]): Promise<void> => {
  try {
    if (!args.length)
      throw new AppError(formatError(ERROR_MESSAGE.MISSING_ARG, "ID"))
    if (args.length > 1) console.warn(WARN_MESSAGE.EXTRA_ARGS)
    if (!args[0])
      throw new AppError(formatError(ERROR_MESSAGE.MISSING_ARG, "ID"))
    let id = Number.parseInt(args[0], 10)
    await db.updateStatus(id, "in-progress")
    console.log("Task updated successfully.")
  } catch (error) {
    throw error
  }
}

const updateTaskStatusToDone = async (args: string[]): Promise<void> => {
  try {
    if (!args.length) throw new AppError(ERROR_MESSAGE.MISSING_ARGUMENTS)
    if (args.length > 1) console.warn(WARN_MESSAGE.EXTRA_ARGS)
    if (!args[0]) throw new Error(formatError(ERROR_MESSAGE.MISSING_ARG, "ID"))
    let id = Number.parseInt(args[0], 10)
    await db.updateStatus(id, "done")
    console.log("Task updated successfully.")
  } catch (error) {
    throw error
  }
}

const listTasks = async (args: string[]): Promise<void> => {
  try {
    let data: Task[] = []
    if (args.length === 0) {
      data = await db.read()
    } else {
      if (args[0] && args[0].replaceAll("-", "").toUpperCase() in taskStatus) {
        data = await db.read(args[0] as FilterStatusOptions)
      } else {
        throw new AppError(
          `Unknown task status. Try list ${Object.values(taskStatus).join(", ")} instead `,
        )
      }
      if (args.length > 1) console.warn(WARN_MESSAGE.EXTRA_ARGS)
    }

    if (!data.length) {
      console.log("No tasks.")
      return
    }
    data.forEach((task) =>
      console.log(`(${task.id}) ${task.description} - ${task.status}`),
    )
  } catch (error) {
    throw error
  }
}

const nullCallback = async (): Promise<void> => {
  console.log("No action provided for this command.")
}

type CommandHandler = (args: string[]) => Promise<void>

const commandCallbacks: Record<keyof typeof commands, CommandHandler> = {
  ADD: addTask,
  UPDATE: updateTaskDescription,
  DELETE: deleteTask,
  MARKINPROGRESS: updateTaskStatusToInProgress,
  MARKDONE: updateTaskStatusToDone,
  LIST: listTasks,
}

export class Command {
  #executeCallback: CommandHandler = nullCallback
  #command: string
  constructor(
    command: string,
    public args: string[],
  ) {
    try {
      this.#command = command.replaceAll("-", "").toUpperCase()
      if (this.#isValidCommand(this.#command)) {
        this.#bind(this.#command as keyof typeof commands)
      } else throw new AppError(ERROR_MESSAGE.INVALID_COMMAND)
    } catch (error) {
      throw error
    }
  }

  #isValidCommand(cmd: string): cmd is keyof typeof commands {
    return cmd in commands
  }

  #bind(command: keyof typeof commands) {
    this.#executeCallback = commandCallbacks[command]
  }

  async execute() {
    try {
      await this.#executeCallback(this.args)
    } catch (error) {
      throw error
    }
  }
}
