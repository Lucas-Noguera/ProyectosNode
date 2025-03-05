const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')

const app = express()
app.use(express.json())
app.disable('x-powered-by')

app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }
})

app.get('/movies/:id', (req, res) => {
  console.log(req)
  const id = req.params
  console.log(id)
  const movie = movies.find((movie) => movie.id === id.id)
  if (movie) return res.json(movie)
  res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  const {
    title,
    genre,
    year,
    director,
    duration,
    rate,
    poster
  } = req.body

  const newMovies = {
    id: crypto.randomUUID(),
    title,
    genre,
    year,
    director,
    duration,
    rate: rate ?? 0,
    poster
  }

  movies.push(newMovies)

  res.status(201).json(newMovies)
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
