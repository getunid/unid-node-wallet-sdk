import { Secp256k1HexKeyPair } from '../keyring/secp256k1'

export interface MnemonicKeyringModel {
    did?    : string,
    sign    : Secp256k1HexKeyPair,
    update  : Secp256k1HexKeyPair,
    recovery: Secp256k1HexKeyPair,
    mnemonic: string,
    seed    : string,
}

export abstract class BaseConnector {
    abstract upsert(payload: MnemonicKeyringModel): Promise<MnemonicKeyringModel>
    abstract findByDid(did: string): Promise<MnemonicKeyringModel | undefined>
    abstract deleteById(payload: MnemonicKeyringModel): Promise<MnemonicKeyringModel>
}