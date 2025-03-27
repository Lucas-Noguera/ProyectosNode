import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import { createClient } from '@libsql/client'

import { Server } from 'socket.io'
import { createServer } from 'node:http'

import { Agent } from 'undici'

dotenv.config()
const port = process.env.PORT || 3000
const app = express()
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {}
})

const agent = new Agent({
  connect: {
    rejectUnauthorized: false // Acepta certificados autofirmados
  }
})

const db = createClient({
  url: 'libsql://positive-metal-master-lucas-noguera.aws-us-east-1.turso.io',
  authToken: process.env.DB_TOKEN,
  dispatcher: agent // Pasa el agente personalizado
})

await db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT
  )
  
  `)

io.on('connection', (socket) => {
  console.log('A user connected')

  socket.on('disconnect', () => {
    console.log('A user disconnected')
  })

  socket.on('chat message', async (msg) => {
    let result
    try {
      result = await db.execute({
        sql: 'INSERT INTO messages (content) VALUES (:msg)',
        args: { msg }
      })
    } catch (error) {
      console.log(error)
      return
    }

    io.emit('chat message', msg, result.lastInsertRowid.toString())
  })
})

app.use(logger('dev'))

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => {
  console.log(`Server running port http://localhost:${port}`)
})
