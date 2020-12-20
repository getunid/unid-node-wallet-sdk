import { MnemonicKeyring } from '../keyring/mnemonic'
import { UNiDDidOperator } from '@unid/did-operator'

interface UNiDDidContext {
    keyring : MnemonicKeyring
    operator: UNiDDidOperator
}

export class UNiDDid {
    private readonly keyring : MnemonicKeyring
    private readonly operator: UNiDDidOperator

    constructor(context: UNiDDidContext) {
        this.keyring  = context.keyring
        this.operator = context.operator
    }

    /**
     */
    public getSeedPhrase(): Array<string> {
        return this.keyring.getSeedPhrases()
    }

    /**
     */
    public async verifySeedPhrase(phrase: Array<string>, option: { isPersistent: boolean } = { isPersistent: false }): Promise<boolean> {
        return this.keyring.verifySeedPhrase(phrase, option)
    }

    /**
     */
    public getIdentifier(): string {
        return this.keyring.getIdentifier()
    }

    /**
     */
    public async getDidDocument() {
        return await this.operator.resolve({
            did: this.getIdentifier(),
        })
    }

    /**
     * Create: VC
     */
    public async createCredential<T>(credential: T) {
        try {
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * To: SDS
     */
    public async postCredential() {}

    /**
     * From: SDS
     */
    public async getCredential() {}

    /**
     * From: SDS
     */
    public async getCredentials() {}

    /**
     * Create: VP
     */
    public async createPresentation<T>() {}
}