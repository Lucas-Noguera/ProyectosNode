import express from 'express'
import { UserRepository } from './user-repository.js'

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/login', (req, res) => {})

app.post('/register', async (req, res) => {
  const { username, password } = req.body

  try {
    const id = await UserRepository.create({ username, password })
    res.send({ id })
  } catch (error) {
    res.status(400).send(error.message)
  }
})
app.post('/logout', (req, res) => {})
app.get('/protected', (req, res) => {})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
