import { Router } from 'express'

import { readJSON } from '../utils.js'
import { randomUUID } from 'node:crypto'
import { validateMovie, validatePartialMovies } from '../schemas/movies.js'
export const moviesRouter = Router()
const movies = readJSON('./movies.json')

moviesRouter.get('/', (req, res) => {
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

moviesRouter.get(':id', (req, res) => {
  console.log(req)
  const id = req.params
  console.log(id)
  const movie = movies.find((movie) => movie.id === id.id)
  if (movie) return res.json(movie)
  res.status(404).json({ message: 'Movie not found' })
})

moviesRouter.post('/', (req, res) => {
  const result = validateMovie(req.body)
  if (result.error) {
    return res.status(400).json({ error: result.error.issues })
  }
  console.log(result.data)

  const newMovies = {
    id: randomUUID(),
    ...result.data
  }

  movies.push(newMovies)

  res.status(201).json(newMovies)
})

moviesRouter.patch('/:id', (req, res) => {
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

moviesRouter.delete('/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)

  return res.json({ message: 'Movie deleted' })
})
