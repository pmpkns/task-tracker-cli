import { CommandList, CommandArguments, databaseFile } from "./constants.js"
import { Task } from "./task.js"
import { addObjectToJsonFile } from "./helpers.js"

const addTask = async (args) => {
  try {
    let description = args[0].substring(1, args[0].length - 1)
    const task = new Task(description)
    const data = await addObjectToJsonFile(databaseFile, task)
    console.log(data)
    console.log("Task successfully added.")
  } catch (error) {
    throw new Error(error)
  }
}
const nullCallback = () => {
  console.log("Empty callback executed!")
} //temp

const commandCallbacks = Object.freeze({
  [CommandList.ADD]: addTask,
  [CommandList.UPDATE]: nullCallback,
  [CommandList.DELETE]: nullCallback,
  [CommandList.MARKINPROGRESS]: nullCallback,
  [CommandList.MARKDONE]: nullCallback,
  [CommandList.LIST]: nullCallback,
})

export class Command {
  constructor(command, args) {
    try {
      this.#validate(command, args)
      this.command = command
      this.args = args
      this.executeCallback = nullCallback
      this.#bind()
    } catch (error) {
      throw new Error(error)
    }
  }

  #validate(command, args) {
    console.log(command, CommandList[command.toUpperCase()])
    console.log(args)
    if (
      CommandList[command.toUpperCase()] &&
      args.length === CommandArguments[command].argc
    ) {
      for (const [i, entry] of CommandArguments[command].argv.entries()) {
        console.log(entry.type)
        console.log(args[i])
        console.log(args[i].type)
        if (entry.type !== typeof args[i])
          throw new Error("Invalid type of an argument provided.")
      }
    } else throw new Error("Invalid command or arguments provided.") //TODO - сделать листинг доступных команд при ошибке пользователя
  }

  #bind() {
    this.executeCallback = commandCallbacks[this.command]
  }

  execute() {
    try {
      this.executeCallback(this.args)
    } catch (error) {
      throw new Error(error)
    }
  }
}
