import { join, dirname } from "node:path"
import { fileURLToPath } from "url"

export const commands = {
  ADD: "add",
  UPDATE: "update",
  DELETE: "delete",
  MARKINPROGRESS: "mark-in-progress",
  MARKDONE: "mark-done",
  LIST: "list",
} as const

export const taskStatus = {
  TODO: "todo",
  INPROGRESS: "in-progress", //ERROR! при конвертации в uppercase - не работает
  DONE: "done",
} as const

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const STORAGE_CONFIG = {
  filePrimaryKey: join(__dirname, "..", "data", "primaryKey.json"),
  initialValue: 0,
  encoding: "utf-8",
  fileDatabase: join(__dirname, "..", "data", "tasks-db.json"),
} as const

export class AppError extends Error {}
export class CriticalError extends Error {}

export const ERROR_MESSAGE = {
  INVALID_ID: "Task with ID({0}) does not exist.",
  MISSING_ARGUMENTS: "Missing arguments.",
  MISSING_ARG: "Missing {0} argument.",
  INVALID_COMMAND: `Invalid command. Try ${Object.values(commands).join(", ")} instead.`,
} as const

export const WARN_MESSAGE = {
  EXTRA_ARGS: "Extra arguments ignored.",
} as const

export const formatError = (template: string, ...args: unknown[]): string => {
  return template.replace(/{(\d+)}/g, (match, index) => {
    const argIndex = Number(index)
    return args[argIndex] !== undefined ? String(args[argIndex]) : match
  })
}
