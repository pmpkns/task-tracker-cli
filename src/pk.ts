import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs"
import { dirname } from "path"
import { STORAGE_CONFIG } from "./constants.js"

let primaryKey = STORAGE_CONFIG.initialValue
let isInitialized = false

export function ensureDirectoryExists(filePath: string) {
  const dir = dirname(filePath)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
}

function loadPrimaryKey() {
  try {
    if (existsSync(STORAGE_CONFIG.filePrimaryKey)) {
      const data = JSON.parse(
        readFileSync(STORAGE_CONFIG.filePrimaryKey, STORAGE_CONFIG.encoding),
      )
      primaryKey = data.lastId ?? STORAGE_CONFIG.initialValue
    }
  } catch (error) {
    primaryKey = STORAGE_CONFIG.initialValue
  }
  isInitialized = true
  return primaryKey
}

function savePrimaryKey(id: number) {
  try {
    ensureDirectoryExists(STORAGE_CONFIG.filePrimaryKey)
    writeFileSync(
      STORAGE_CONFIG.filePrimaryKey,
      JSON.stringify({ lastId: id }, null, 2),
      STORAGE_CONFIG.encoding,
    )
  } catch (error) {
    throw error
  }
}

export function getNextId() {
  if (!isInitialized) {
    loadPrimaryKey()
  }
  const id = ++primaryKey
  savePrimaryKey(id)
  return id
}

export function getCurrentId() {
  if (!isInitialized) {
    loadPrimaryKey()
  }
  return primaryKey
}

export function resetPrimaryKey(value = STORAGE_CONFIG.initialValue) {
  primaryKey = value
  savePrimaryKey(value)
  return value
}

loadPrimaryKey()
