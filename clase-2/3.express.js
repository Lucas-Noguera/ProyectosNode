const express = require('express')
const app = express()
const ditto = require('./pokemon/ditto.json')

app.disable('x-powered-by')

const PORT = process.env.PORT ?? 1234

app.use((req, res, next) => {
  if (req.method !== 'POST') return next()
  if (req.headers['content-type'] !== 'application/json') return next()

  let body = ''
  req.on('data', (chunk) => {
    body += chunk.toString()
  })

  req.on('end', () => {
    const pokemon = JSON.parse(body)
    req.body = pokemon
    next()
  })
})

app.get('/', (req, res) => {
  res.send('<h1>Bienvenido a mi página web</h1>')
})

app.get('/pokemon/ditto', (req, res) => {
  res.json(ditto)
})

app.post('/pokemon', (req, res) => {
  res.status(201).json(req.body)
})

app.use((req, res) => {
  res.status(404).send('<h1>404 Not Found</h1>')
})

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
