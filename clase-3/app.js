const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const { validateMovie, validatePartialMovies } = require('./schemas/movies')

const app = express()
app.use(express.json())
app.disable('x-powered-by')

app.get('/', (req, res) => {
  // eslint-disable-next-line n/no-path-concat, no-irregular-whitespace
  res.sendFile(__dirname + '/web/index.html')
})

app.get('/movies', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }

  res.json(movies)
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
  const result = validateMovie(req.body)
  if (result.error) {
    return res.status(400).json({ error: result.error.issues })
  }

  console.log(result.data)

  const newMovies = {
    id: crypto.randomUUID(),
    ...result.data
  }

  movies.push(newMovies)

  res.status(201).json(newMovies)
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovies(req.body)

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues })
  }

  const { id } = req.params

  const movieIndex = movies.findIndex((movie) => movie.id === id)
  console.log(movieIndex)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie

  res.json(updateMovie)
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
