import { Db } from 'mongodb'
import { MongoDBClient } from "../adapters/mongodb";
import { BaseConnector, MnemonicKeyringModel } from "./base";

interface MongoDBConnectorContext {
    client: MongoDBClient
}

export class MongoDBConnector implements BaseConnector {
    private database: Db

    private readonly DATABASE_NAME: string   = 'node_wallet_sdk'
    private readonly COLLECTION_NAME: string = 'keyring'

    constructor(context: MongoDBConnectorContext) {
        this.database = MongoDBClient.agent.db(this.DATABASE_NAME, {})
    }

    async upsert(payload: MnemonicKeyringModel): Promise<MnemonicKeyringModel> {
        const coll = this.database.collection<MnemonicKeyringModel>(this.COLLECTION_NAME, {})
        const item = await coll.findOne({
            $or: [{
                did: payload.did,
            }, {
                sign    : payload.sign,
                update  : payload.update,
                recovery: payload.recovery,
            }]
        })

        if (item) {
            await coll.updateOne({ 
                $or: [{
                    did: payload.did,
                }, {
                    sign    : payload.sign,
                    update  : payload.update,
                    recovery: payload.recovery,
                }]
            }, {
                $set: payload,
            })
        } else {
            await coll.insertOne(payload)
        }

        return payload
    }

    async findByDid(did: string): Promise<MnemonicKeyringModel | undefined> {
        const coll = this.database.collection<MnemonicKeyringModel>(this.COLLECTION_NAME, {})
        const item = await coll.findOne({ did: did })

        if (item) {
            return item
        } else {
            return undefined
        }
    }

    async deleteById(payload: MnemonicKeyringModel): Promise<MnemonicKeyringModel> {
        throw new Error()
    }
}