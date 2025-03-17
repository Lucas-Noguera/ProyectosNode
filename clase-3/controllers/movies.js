import { MovieModel } from '../models/database/movie.js'
import { validateMovie, validatePartialMovies } from '../schemas/movies.js'

export class MovieController {
  static async getAll (req, res) {
    const { genre } = req.query
    const movies = await MovieModel.getAll({ genre })
    res.json(movies)
  }

  static async getById (req, res) {
    const { id } = req.params
    console.log(id)
    const movie = await MovieModel.getById({ id })

    if (movie) return res.json(movie)

    res.status(404).json({ message: 'Movie not found' })
  }

  static async create (req, res) {
    const result = validateMovie(req.body)

    if (result.error) {
      return res.status(400).json({ error: result.error.issues })
    }

    console.log(result.data)

    const newMovies = await MovieModel.create({ input: result.data })
    res.status(201).json(newMovies)
  }

  static async edit (req, res) {
    const result = validatePartialMovies(req.body)

    if (!result.success) {
      return res.status(400).json({ error: result.error.issues })
    }

    const { id } = req.params
    const updateMovie = await MovieModel.edit({ id, input: result.data })

    res.json(updateMovie)
  }

  static async delete (req, res) {
    const { id } = req.params
    const result = await MovieModel.delete({ id })

    if (result === false) {
      return res.json({ message: 'Movie not found' })
    }

    return res.json({ message: 'Movie delted' })
  }
}
