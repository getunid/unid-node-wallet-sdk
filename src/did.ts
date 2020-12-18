import { MnemonicKeyring } from './keyring/mnemonic'
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
     * CREATE: VC
     */
    public async createCredential() {
        try {
        // const key2 = new EcdsaSecp256k1KeyClass2019({
        //     id: this.getIdentifier(),
        //     controller: '',
        //     privateKeyJwk: this.keyring.signKeyPair.toJwk(true),
        // })

        // const suite = new EcdsaSecp256k1Signature2019({
        //     key: key2,
        // });

        // const credential = {
        //     issuer: this.getIdentifier(),
        // };

        // const signedVC = await vc.issue({ credential, suite });
        // const result = await vc.verifyCredential({
        //     credential: signedVC,
        //     suite,
        //     documentLoader: defaultDocumentLoader,
        // });
        // console.log(signedVC)

        // const cipher = crypto.createHash('sha256')

        // cipher.update(JSON.stringify(credential))

        // const message = cipher.digest()
        // const key = this.keyring.signKeyPair

        // const ret = secp256k1.ecdsaSign(Uint8Array.from(message), Uint8Array.from(key.privateKey))

        // console.log(base64url.encode(Buffer.from(ret.signature).toString()))
        // console.log(signedVC)

        // console.log(await jsonld.expand(signedVC))

        // console.log(JSON.stringify(result, null, 2))

        } catch (err) {
            console.log(err)
        }
    }

    /**
     * TO: SDS
     */
    public async postCredential() {}

    /**
     * FROM: SDS
     */
    public async getCredential() {}

    /**
     * FROM: SDS
     */
    public async getCredentials() {}

    /**
     * CREATE: VP
     */
    public async createPresentation<T>() {}
}