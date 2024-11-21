import { env } from 'process'
import express from 'express'
import { randomBytes } from 'crypto'
import { readFileSync, existsSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { hostname } from 'os'

function getServerID() {
  if ('SERVICE_ID' in env && env.SERVICE_ID.length > 0) {
    return env.SERVICE_ID
  }
  if ('SERVICE_ID_FILE' in env) {
    const filePath = resolve(env.SERVICE_ID_FILE)
    if (existsSync(filePath)) {
      console.info(`Reading server ID from ${filePath}`)
      return readFileSync(filePath, 'utf-8').trim()
    }
  }
  return randomBytes(8).toString('hex') // 8-char random string
}

function saveServerID(id) {
  if ('SERVICE_ID_FILE' in env) {
    const filePath = resolve(env.SERVICE_ID_FILE)
    writeFileSync(filePath, id)
    console.info(`Server ID saved to ${filePath}`)
  } else {
    console.warn('No SERVICE_ID_FILE env var, server ID is ephemeral')
  }
}


const port = 'SERVICE_PORT' in env ? env.SERVICE_PORT : 8080
const hostName = hostname()
const serverID = getServerID();
saveServerID(serverID)

const server = express()

let counter = 0
 
server.get('/', function (req, res) {
  res.send(`[${serverID}@${hostName}:${port}] Hit ${++counter} times`)
})
 
console.log(`Service ${serverID} listening on ${hostName}:${port}`)
server.listen(port)
