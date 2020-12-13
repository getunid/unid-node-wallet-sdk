import { UNiDDidOperator, PublicKeyPurpose } from '@unid/did-operator'
import { UNiDNotImplementedError } from "./error"
import { KeyRingType } from './keyring'
import { MnemonicKeyring, MnemonicKeyringOptions } from './keyring/mnemonic'

interface UNiDContext {
}

export class UNiD {
    private readonly context: UNiDContext
    private readonly operator: UNiDDidOperator

    public constructor(context: UNiDContext) {
        this.context  = context
        this.operator = new UNiDDidOperator()
    }

    /**
     */
    public async loadDid(params: { did: string }) {
        console.log(this.context)
    }

    /**
     */
    public async createDidDocument(type: KeyRingType.Mnemonic, options?: MnemonicKeyringOptions): Promise<void>
    public async createDidDocument(type: KeyRingType, options?: MnemonicKeyringOptions) {
        switch (type) {
        case KeyRingType.Mnemonic:
            const _options   = options as MnemonicKeyringOptions
            const _keyring   = await MnemonicKeyring.createKeyring(_options)
            const _signKeyId = 'signingKey'

            const r = await this.operator.create({
                publicKeys: [{
                    id  : _signKeyId,
                    type: 'EcdsaSecp256k1VerificationKey2019',
                    jwk : _keyring.signKeyPair.toJwk(),
                    purpose: Object.values(PublicKeyPurpose),
                }],
                commitmentKeys: {
                    update: _keyring.updateKeyPair.toJwk(),
                    recovery: _keyring.recoverKeyPair.toJwk(),
                },
                serviceEndpoints: []
            })

            console.log(r)
            break
        }
    }

    /**
     * @param params 
     */
    public async getDidDocument(params: { did: string }) {
        return await this.operator.resolve(params)
    }

    /**
     */
    public async updateDidDocument() {
        throw new UNiDNotImplementedError()
    }

    /**
     */
    public async validateCredential() {
        throw new UNiDNotImplementedError()
    }
}