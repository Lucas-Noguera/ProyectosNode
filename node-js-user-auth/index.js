import express from 'express'
import jws from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { UserRepository } from './user-repository.js'
import { validateUser } from './schemas/users.js'
import { config } from './config.js'

const app = express()

app.set('view engine', 'ejs')
app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
  const token = req.cookies.access_token
  req.session = { user: null }

  try {
    const data = jws.verify(token, config.jwtSecret)
    req.session.user = data
  } catch {}

  next()
})

app.get('/', (req, res) => {
  const { user } = req.session
  res.render('index', user)
})

app.post('/login', async (req, res) => {
  try {
    const result = validateUser(req.body)

    if (result.error) {
      return res.status(400).json({ error: result.error.issues })
    }

    const { username, password } = result.data
    const user = await UserRepository.login({ username, password })

    const token = jws.sign(
      { id: user._id, username: user.username },
      config.jwtSecret,
      { expiresIn: '1h' }
    )

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600 * 1000 // 1 hour
      })
      .send({ user, token })
  } catch (error) {
    res.status(400).send(error.message)
  }
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

app.post('/logout', (req, res) => {
  res
    .clearCookie('access_token')
    .send({ message: 'Session destroyed' })
})

app.get('/protected', (req, res) => {
  const { user } = req.session
  if (!user) return res.status(403).send('Access not authorized')
  res.render('protected', user)
})

app.listen(config.port, () => {
  console.log(`Example app listening at http://localhost:${config.port}`)
})
