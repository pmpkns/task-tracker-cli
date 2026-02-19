import * as readline from "node:readline/promises"
import { stdin as input, stdout as output } from "node:process"
import { Command } from "./command.js"

const rl = readline.createInterface({ input, output })

const main = async () => {
  console.log("Welcome to CLI Task Tracker!")

  while (true) {
    try {
      const input = await rl.question("> ")
      const parts = input.trim().toLowerCase().split(/\s+/)
      const [cmd, ...args] = parts
      const command = new Command(cmd, args)
      command.execute()
    } catch (error) {
      console.error("Error:", error)
      rl.close()
      process.exit(0)
    }
  }
}

// Обработка прерывания (Ctrl+C)
process.on("SIGINT", () => {
  console.log("\nПрерывание работы")
  rl.close()
  process.exit(0)
})

main()
