import crypto from 'node:crypto'

import DBLocal from 'db-local'
import bcrypt from 'bcrypt'

const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

export class UserRepository {
  static async create ({ username, password }) {
    if (typeof username !== 'string') throw new Error('username must be a string')
    if (typeof password !== 'string') throw new Error('password must be a string')

    if (typeof password !== 'string') throw new Error('password must be a string')
    if (password.length < 3) throw new Error('password must be at least 3 characters')

    const user = User.findOne({ username })
    if (user) throw new Error('username already exists')

    const id = crypto.randomUUID()
    const hashedPassword = await bcrypt.hash(password, 10)

    User.create({
      _id: id,
      username,
      password: hashedPassword
    }).save()

    return id
  }

  static login ({ username, password }) {}
}
