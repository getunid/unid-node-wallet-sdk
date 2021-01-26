import { Db, ObjectId, WithId } from 'mongodb'
import { UNiDInvalidDataError } from '../../error';
import { MongoDBClient } from "../adapters/mongodb";
import { BaseConnector, MnemonicKeyringModel, Id } from "./base";
import { Cipher } from '../cipher/cipher';
import { ContextManager } from '../../context';

interface MongoDBConnectorContext {
    client: MongoDBClient
}

export class MongoDBConnector implements BaseConnector {
    /**
     */
    private database: Db

    /**
     */
    private readonly DATABASE_NAME: string   = 'node_wallet_sdk'

    /**
     */
    private readonly COLLECTION_NAME: string = 'keyring'

    /**
     * @param context 
     */
    constructor(context: MongoDBConnectorContext) {
        this.database = MongoDBClient.agent.db(this.DATABASE_NAME, {})
    }

    /**
     * @param payload 
     * @returns
     */
    async insert(payload: MnemonicKeyringModel): Promise<Id<MnemonicKeyringModel>> {
        const coll   = this.database.collection<MnemonicKeyringModel>(this.COLLECTION_NAME, {})
        const model  = await this.encryptModel(payload)
        const result = await coll.insertOne(model)

        return Object.assign<Id<{}>, MnemonicKeyringModel>({ _id: result.insertedId.toHexString() }, payload)
    }

    /**
     * @param _id 
     * @param payload 
     * @returns
     */
    async update(_id: string, payload: MnemonicKeyringModel): Promise<Id<MnemonicKeyringModel>> {
        const coll  = this.database.collection<WithId<MnemonicKeyringModel>>(this.COLLECTION_NAME, {})
        const model = await this.encryptModel(payload)
        const item  = await coll.findOne({
            _id: new ObjectId(_id),
        })
        if (item === undefined) {
            throw new UNiDInvalidDataError()
        }

        await coll.updateOne({ 
            _id: new ObjectId(_id),
        }, {
            $set: model,
        })

        return Object.assign<Id<{}>, MnemonicKeyringModel>({ _id: _id }, payload)
    }

    /**
     * @param did 
     * @returns
     */
    async findByDid(did: string): Promise<Id<MnemonicKeyringModel> | undefined> {
        const coll = this.database.collection<WithId<MnemonicKeyringModel>>(this.COLLECTION_NAME, {})
        const item = await coll.findOne({ did: did })

        if (item) {
            const model = await this.decryptModel(item)

            return Object.assign<Id<{}>, MnemonicKeyringModel>({ _id: item._id.toHexString() }, model)
        } else {
            return undefined
        }
    }

    /**
     * @param payload 
     */
    async deleteById(payload: MnemonicKeyringModel): Promise<MnemonicKeyringModel> {
        throw new Error()
    }

    /**
     * @param model 
     * @returns
     */
    private async encryptModel(model: MnemonicKeyringModel): Promise<MnemonicKeyringModel> {
        const secret: Buffer = Buffer.from(ContextManager.context.encryptionKey, 'hex')

        model.sign.private = (await Cipher.encrypt(
            Buffer.from(model.sign.private, 'utf-8'), secret
        )).toString('base64')

        model.update.private = (await Cipher.encrypt(
            Buffer.from(model.update.private, 'utf-8'), secret
        )).toString('base64')

        model.recovery.private = (await Cipher.encrypt(
            Buffer.from(model.recovery.private, 'utf-8'), secret
        )).toString('base64')

        model.encrypt.private = (await Cipher.encrypt(
            Buffer.from(model.encrypt.private, 'utf-8'), secret
        )).toString('base64')

        model.seed = (await Cipher.encrypt(
            Buffer.from(model.seed, 'utf-8'), secret
        )).toString('base64')

        if (model.mnemonic !== undefined && model.mnemonic !== null) {
            model.mnemonic = (await Cipher.encrypt(
                Buffer.from(model.mnemonic, 'utf-8'), secret
            )).toString('base64')
        }

        return model
    }

    /**
     * @param model 
     * @returns
     */
    private async decryptModel(model: WithId<MnemonicKeyringModel>): Promise<WithId<MnemonicKeyringModel>> {
        const secret: Buffer = Buffer.from(ContextManager.context.encryptionKey, 'hex')

        model.sign.private = (await Cipher.decrypt(
            Buffer.from(model.sign.private, 'base64'), secret
        )).toString('utf-8')

        model.update.private = (await Cipher.decrypt(
            Buffer.from(model.update.private, 'base64'), secret
        )).toString('utf-8')

        model.recovery.private = (await Cipher.decrypt(
            Buffer.from(model.recovery.private, 'base64'), secret
        )).toString('utf-8')

        model.encrypt.private = (await Cipher.decrypt(
            Buffer.from(model.encrypt.private, 'base64'), secret
        )).toString('utf-8')

        model.seed = (await Cipher.decrypt(
            Buffer.from(model.seed, 'base64'), secret
        )).toString('utf-8')

        if (model.mnemonic !== undefined && model.mnemonic !== null) {
            model.mnemonic = (await Cipher.decrypt(
                Buffer.from(model.mnemonic, 'base64'), secret
            )).toString('utf-8')
        }

        return model
    }
}