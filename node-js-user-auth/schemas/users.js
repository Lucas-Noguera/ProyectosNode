import DBLocal from 'db-local'
import zod from 'zod'
const { Schema } = new DBLocal({ path: './db' })

export const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

const userSchema = zod.object({
  username: zod.string({
    invalid_type_error: 'username must be a string',
    required_error: 'username is required'
  }).min(3).max(20),
  password: zod.string().min(3)
})

export function validateUser (object) {
  return userSchema.safeParse(object)
}
