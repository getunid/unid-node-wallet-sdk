import { Secp256k1HexKeyPair } from '../keyring/secp256k1'

export type Id<T> = T & { _id: string }

export interface MnemonicKeyringModel {
    did?     : string,
    sign     : Secp256k1HexKeyPair,
    update   : Secp256k1HexKeyPair,
    recovery : Secp256k1HexKeyPair,
    encrypt  : Secp256k1HexKeyPair,
    mnemonic?: string,
    seed     : string,
}

export abstract class BaseConnector {
    abstract insert(payload: MnemonicKeyringModel): Promise<Id<MnemonicKeyringModel>>
    abstract update(id: string, payload: MnemonicKeyringModel): Promise<Id<MnemonicKeyringModel>>
    abstract findByDid(did: string): Promise<Id<MnemonicKeyringModel> | undefined>
    abstract deleteById(payload: MnemonicKeyringModel): Promise<MnemonicKeyringModel>
}