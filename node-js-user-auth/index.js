import express from 'express'
import { UserRepository } from './user-repository.js'
import { validateUser } from './schemas/users.js'

const app = express()

const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.json())

app.get('/', (req, res) => {
  res.render('example', { username: 'ANASHE' })
})

app.post('/login', (req, res) => {
  const result = validateUser(req.body)

  if (result.error) {
    return res.status(400).json({ error: result.error.issues })
  }

  const { username, password } = result.data
  UserRepository.login({ username, password })
    .then((user) => {
      res.send({ user })
    })
    .catch((error) => {
      res.status(400).send(error.message)
    })
})

app.post('/register', async (req, res) => {
  const result = validateUser(req.body)

  if (result.error) {
    return res.status(400).json({ error: result.error.issues })
  }

  const { username, password } = result.data

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
