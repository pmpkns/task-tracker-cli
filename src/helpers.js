import * as fs from "node:fs/promises"

export const addObjectToJsonFile = async (filePath, newObject) => {
  try {
    let data = []
    try {
      const fileContent = await fs.readFile(filePath, "utf8")
      data = JSON.parse(fileContent)
      if (!Array.isArray(data)) {
        data = []
      }
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.warn("File is broken, will be reset")
      }
      data = []
    }
    data.push(newObject)
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8")

    console.log("Объект успешно добавлен")
    return data
  } catch (error) {
    console.error("Error:", error)
    throw error
  }
}
