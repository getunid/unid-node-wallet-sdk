import { MnemonicKeyringModel } from "src/keyring/mnemonic";

export abstract class BaseConnector {
    abstract async upsert(payload: MnemonicKeyringModel): Promise<MnemonicKeyringModel>
    abstract async findById(did: string): Promise<MnemonicKeyringModel | undefined>
    abstract async deleteById(payload: MnemonicKeyringModel): Promise<MnemonicKeyringModel>
}