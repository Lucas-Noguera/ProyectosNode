import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'moviesdb'
}

const connection = mysql.createConnection(config)

export class MovieModel {
  static async getAll ({ genre }) {
    const conn = await connection

    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      const [movies] = await conn.query(
            `
            SELECT 
              m.title, 
              m.year, 
              m.director, 
              m.duration, 
              m.poster, 
              m.rate, 
              BIN_TO_UUID(m.id) as id
            FROM movie m
            JOIN movie_genres mg ON m.id = mg.movie_id
            JOIN genre g ON mg.genre_id = g.id
            WHERE LOWER(g.name) = ?;
            `,
            [lowerCaseGenre]
      )

      return movies
    }

    const [movies] = await conn.query(
          `
          SELECT 
            title, 
            year, 
            director, 
            duration, 
            poster, 
            rate, 
            BIN_TO_UUID(id) as id 
          FROM movie;
          `
    )

    return movies
  }

  static async getById ({ id }) {
    const [movies] = await (await connection).query(
          `
          SELECT 
            title, 
            year, 
            director, 
            duration, 
            poster, 
            rate, 
            BIN_TO_UUID(id) as id 
          FROM movie
          WHERE BIN_TO_UUID(id) = ?;
          `,
          [id]
    )

    if (movies.length === 0) return false

    return movies[0]
  }

  static async create ({ input }) {
    const {
      title,
      year,
      director,
      duration,
      poster,
      rate
    } = input

    const [uuidResult] = await (await connection).query('SELECT UUID() uuid')
    const [{ uuid }] = uuidResult

    try {
      await (await connection).query(
         ` INSERT INTO movie (id, title, year, director, duration, poster, rate)
            VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
         [title, year, director, duration, poster, rate]
      )
    } catch (error) {
      throw new Error('Error creating movie')
    }

    const [movies] = await (await connection).query(
        `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) as id 
        FROM movie WHERE id = UUID_TO_BIN(?);`, [uuid]
    )
    return movies[0]
  }

  static async delete ({ id }) {
    const [result] = await (await connection).query(
      'DELETE FROM movie WHERE BIN_TO_UUID(id) = ?', [id]
    )

    if (result.affectedRows === 0) return false
    return true
  }

  static async edit ({ id, input }) {
    const {
      title,
      year,
      director,
      duration,
      poster,
      rate
    } = input

    const db = await connection
    try {
      const [result] = await db.query(
        `
        UPDATE movie
        SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ?
        WHERE id = UUID_TO_BIN(?);
        `,
        [title, year, director, duration, poster, rate, id]
      )

      if (result.affectedRows === 0) {
        return null
      }

      const [movies] = await db.query(
        `
        SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) as id
        FROM movie
        WHERE id = UUID_TO_BIN(?);
        `,
        [id]
      )

      return movies[0]
    } catch (error) {
      console.error('Error updating movie:', error)
      throw new Error('Error updating movie')
    }
  }
}
