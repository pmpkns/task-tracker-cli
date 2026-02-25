import * as fs from "node:fs/promises"
import type { Encoding } from "node:crypto"
import { CriticalError } from "./constants.js"

export const readFile = async (
  filePath: string,
  encoding: Encoding,
): Promise<string> => {
  try {
    const fileContent = await fs.readFile(filePath, encoding)
    return fileContent
  } catch (error) {
    throw error
  }
}

export const parseJson = async <T>(jsonContent: string): Promise<T[]> => {
  try {
    let data: T[] = []
    data = JSON.parse(jsonContent)
    if (!Array.isArray(data)) {
      throw new CriticalError("Database file corrupted.")
    }
    return data
  } catch (error) {
    throw error
  }
}

export const writeJson = async <T>(
  data: T[],
  fileName: string,
  encoding: Encoding,
): Promise<void> => {
  try {
    await fs.writeFile(fileName, JSON.stringify(data, null, 2), encoding)
  } catch (error) {
    throw error
  }
}
