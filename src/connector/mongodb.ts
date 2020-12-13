import { Db } from 'mongodb'
import { MongoDBClient } from "src/adapters/mongodb";
import { BaseConnector } from "./base";
import { MnemonicKeyringModel } from 'src/keyring/mnemonic'

export class MongoDBConnector implements BaseConnector {
    private database: Db

    private readonly DATABASE_NAME: string   = 'node_wallet_sdk'
    private readonly COLLECTION_NAME: string = 'keyring'

    constructor(client: MongoDBClient) {
        this.database = MongoDBClient.agent.db(this.DATABASE_NAME, {})
    }

    public async upsert(payload: MnemonicKeyringModel): Promise<MnemonicKeyringModel> {
        const coll = this.database.collection<MnemonicKeyringModel>(this.COLLECTION_NAME, {})
        const item = await coll.findOne({ did: payload.did })

        if (item) {
            await coll.updateOne({
                did: payload.did,
            }, payload)
        } else {
            await coll.insertOne(payload)
        }

        return payload
    }

    public async findById(did: string): Promise<MnemonicKeyringModel | undefined> {
        const coll = this.database.collection<MnemonicKeyringModel>(this.COLLECTION_NAME, {})
        const item = await coll.findOne({ did })

        if (item) {
            return item
        } else {
            return undefined
        }
    }

    public async deleteById(payload: MnemonicKeyringModel): Promise<MnemonicKeyringModel> {
        throw new Error()
    }
}