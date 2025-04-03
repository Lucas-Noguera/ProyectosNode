import express from 'express'

const app = express()

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/login', (req, res) => {
  res.send('<h1>Login</h1>')
})
app.post('/register', (req, res) => {})
app.post('/logout', (req, res) => {})
app.get('/protected', (req, res) => {})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
