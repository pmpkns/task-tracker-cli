import * as fs from "node:fs/promises"
import type { Encoding } from "node:crypto"
import { CriticalError, STORAGE_CONFIG } from "./constants.js"
import { existsSync, writeFileSync } from "fs"

export const loadFile = (filePath: string) => {
  if (!existsSync(filePath)) {
    writeFileSync(
      STORAGE_CONFIG.fileDatabase,
      JSON.stringify([]),
      STORAGE_CONFIG.encoding,
    )
  }
}

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
