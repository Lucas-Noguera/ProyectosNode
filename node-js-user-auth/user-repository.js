import crypto from 'node:crypto'
import bcrypt from 'bcrypt'
import { User } from './schemas/users.js'

export class UserRepository {
  static async create ({ username, password }) {
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

  static async login ({ username, password }) {
    const user = User.findOne({ username })
    if (!user) throw new Error('username not found')

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new Error('password not valid')

    const { password: _, ...publicUser } = user
    return publicUser
  }
}
