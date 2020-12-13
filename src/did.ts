import { MnemonicKeyring } from 'src/keyring/mnemonic'

export class DID {
    private keyring: MnemonicKeyring

    constructor(keyring: MnemonicKeyring) {
        this.keyring = keyring
    }

    /**
     */
    public async getSeedPhrase() {}

    /**
     */
    public async verifySeedPhrase() {}

    /**
     */
    public async getIdentifier() {}

    /**
     */
    public async getDidDocument() {}

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