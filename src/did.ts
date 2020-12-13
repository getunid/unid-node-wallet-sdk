import { MnemonicKeyring } from 'src/keyring/mnemonic'

export class UNiDDid {
    private keyring: MnemonicKeyring

    constructor(keyring: MnemonicKeyring) {
        this.keyring = keyring
    }

    /**
     */
    public async getSeedPhrase(): Promise<Array<string>> {
        return this.keyring.getSeedPhrases()
    }

    /**
     */
    public async verifySeedPhrase(phrase: Array<string>): Promise<boolean> {
        return this.keyring.verifySeedPhrase(phrase)
    }

    /**
     */
    public async getIdentifier(): Promise<string> {
        return this.keyring.identifier
    }

    /**
     */
    public async getDidDocument() {
    }

    /**
     */
    public async createCredential() {}

    /**
     */
    public async postCredential() {}

    /**
     */
    public async getCredential() {}

    /**
     */
    public async getCredentials() {}

    /**
     */
    public async createPresentation() {}
}