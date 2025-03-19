// Importación ES Module
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'

const uri = 'mongodb+srv://lucas2005n:76Li5Yc4hnstV9qQ@cluster0.louka.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function connect () {
  try {
    await client.connect()
    const db = client.db('database')
    return db.collection('movies')
  } catch (error) {
    console.error('Error connecting to the database')
    console.error(error)
    await client.close()
  }
}

export class MovieModel {
  static async getAll ({ genre }) {
    const collection = await connect()

    if (genre) {
      return collection
        .find({
          genre: {
            $elemMatch: {
              $regex: genre,
              $options: 'i'
            }
          }
        })
        .toArray()
    }

    return collection.find({}).toArray()
  }

  static async getById ({ id }) {
    const collection = await connect()
    const objectId = new ObjectId(String(id))
    return collection.findOne({ _id: objectId })
  }

  static async create ({ input }) {
    const collection = await connect()
    const result = await collection.insertOne(input)

    return {
      id: result.insertedId,
      ...input
    }
  }

  static async delete ({ id }) {
    const collection = await connect()
    const objectId = new ObjectId(String(id))
    const result = await collection.deleteOne({ _id: objectId })
    return result.deletedCount > 0
  }

  static async update ({ id, input }) {
    const collection = await connect()
    const objectId = new ObjectId(String(id))

    const result = await collection.findOneAndUpdate(
      { _id: objectId },
      { $set: input },
      { returnDocument: 'after' } // opción actual recomendada
    )

    if (!result.ok) return false

    return result.value
  }
}

// Exportación ES Module
export { connect, client }
