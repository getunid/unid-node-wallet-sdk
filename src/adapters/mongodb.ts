import { MongoClient, MongoClientOptions } from 'mongodb'

interface MongoDBClientContext {
    uri: string
}

export class MongoDBClient {
    private constructor() {}

    private static $conn: MongoClient | undefined

    public static async initialize(context: MongoDBClientContext): Promise<MongoClient> {
        const uri = context.uri

        const config: MongoClientOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }

        if (MongoDBClient.$conn === undefined) {
            MongoDBClient.$conn = await MongoClient.connect(uri, config)
        }

        return MongoDBClient.$conn
    }

    public static get agent(): MongoClient {
        if (MongoDBClient.$conn === undefined) {
            throw new Error()
        }

        return MongoDBClient.$conn
    }

    public static async kill(): Promise<void> {
        if (MongoDBClient.$conn === undefined) {
            throw new Error()
        }

        await MongoDBClient.$conn.close()
    }
}