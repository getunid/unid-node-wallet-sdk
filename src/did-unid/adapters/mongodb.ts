import { MongoClient, MongoClientOptions } from 'mongodb'

interface MongoDBClientContext {
    uri: string
}

/**
 */
export class MongoDBClient {
    /**
     */
    private constructor() {}

    /**
     */
    private static _conn: MongoClient | undefined

    /**
     * @param context 
     * @returns
     */
    public static async initialize(context: MongoDBClientContext): Promise<MongoClient> {
        const uri = context.uri

        const config: MongoClientOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }

        if (MongoDBClient._conn === undefined) {
            MongoDBClient._conn = await MongoClient.connect(uri, config)
        }

        return MongoDBClient._conn
    }

    /**
     */
    public static get agent(): MongoClient {
        if (MongoDBClient._conn === undefined) {
            throw new Error()
        }

        return MongoDBClient._conn
    }

    /**
     */
    public static async kill(): Promise<void> {
        if (MongoDBClient._conn === undefined) {
            throw new Error()
        }

        await MongoDBClient._conn.close()
    }
}