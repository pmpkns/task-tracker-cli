import * as readline from "node:readline/promises"
import { stdin as input, stdout as output } from "node:process"
import { Command } from "./command.js"
import { AppError } from "./constants.js"

const rl = readline.createInterface({ input, output })

const main = async () => {
  console.log("Welcome to CLI Task Tracker!")

  while (true) {
    try {
      const input = await rl.question("> ")
      if (!input.trim()) continue
      const [cmd, ...args] = input.trim().toLowerCase().split(/\s+/)
      const command = new Command(cmd as string, args)
      await command.execute()
    } catch (error) {
      if ((error as any)?.code === "ABORT_ERR") {
        console.log("\nInterrupted by user.")
        try {
          rl.close()
        } catch (error) {}
        process.exit(0)
      }
      if (error instanceof AppError) {
        console.warn(error.message)
        continue
      } else {
        console.error(error)
        try {
          rl.close()
        } catch (error) {}
        process.exit(1)
      }
    }
  }
}

main()
