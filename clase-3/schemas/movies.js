const z = require('zod')

const moviesSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title musy be a string',
    required_error: 'Movie title is required'

  }),
  year: z.number().int().min(1900).max(2027),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10),
  poster: z.string().url({
    message: 'Invalid URL'
  }),
  genre: z.array(
    z.enum(['Action', 'Adventure',
      'Comedy', 'Drama',
      'Horror', 'Thriller',
      'Sci-Fi', 'Fantasy']),
    {
      required_error: 'Movie genre is required',
      invalid_type_error: 'Movie genre must be an array of strings'
    })
})

function validateMovie (object) {
  return moviesSchema.parse(object)
}
