#!/usr/bin/env node
import { Command } from "./command.js"
import { AppError, INFO_MESSAGE } from "./constants.js"

const main = async () => {
  // process.argv[0] = node, process.argv[1] = path to script
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log("Welcome to CLI Task Tracker!")
    console.log("Usage: task-cli <command> [args]")
    console.log(INFO_MESSAGE.AVAILABLE_COMMANDS)
    return
  }

  try {
    const [cmd, ...cmdArgs] = args
    const command = new Command(cmd as string, cmdArgs)
    await command.execute()
  } catch (error) {
    if (error instanceof AppError) {
      console.warn(error.message)
      process.exit(1)
    } else {
      console.error(error)
      process.exit(1)
    }
  }
}

main()
