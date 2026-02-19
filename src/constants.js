export const databaseFile = "./tasks-db.json"

export const CommandList = Object.freeze({
  ADD: "add",
  UPDATE: "update",
  DELETE: "delete",
  MARKINPROGRESS: "mark-in-progress",
  MARKDONE: "mark-done",
  LIST: "list",
})

//TODO - решить проблему: что, если схема аргументов более сложная (различные комбинации)
//сейчас argc- фиксированно, и валидация команды срабатывает только если все argv по порядку идут
//??? возможно оформить все это в виде графа?
export const CommandArguments = Object.freeze({
  [CommandList.ADD]: {
    argc: 1,
    argv: [{ name: "description", type: "string", required: true }],
  },
  [CommandList.UPDATE]: {
    argc: 2,
    argv: [
      { name: "id", type: "number", required: true },
      { name: "description", type: "string", required: true },
    ],
  },
  [CommandList.DELETE]: {
    argc: 1,
    argv: [{ name: "id", type: "number", required: true }],
  },
  [CommandList.MARKINPROGRESS]: {
    argc: 1,
    argv: [{ name: "id", type: "number", required: true }],
  },
  [CommandList.MARKDONE]: {
    argc: 1,
    argv: [{ name: "id", type: "number", required: true }],
  },
  [CommandList.LIST]: {
    argc: 1,
    argv: [
      { name: "done", type: "string", required: false },
      { name: "todo", type: "string", required: false },
      { name: "in-progress", type: "string", required: false },
    ],
  },
})

export const TaskStatus = Object.freeze({
  TODO: "todo",
  INPROGRESS: "in-progress",
  DONE: "done",
})
