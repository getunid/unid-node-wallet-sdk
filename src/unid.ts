import { UNiDDidOperator, PublicKeyPurpose, UNiDDidDocument } from '@unid/did-operator'
import { BaseConnector } from './connector/base'
import { UNiDNotImplementedError } from "./error"
import { KeyRingType } from './keyring'
import { MnemonicKeyring, MnemonicKeyringOptions } from './keyring/mnemonic'

interface UNiDContext {
    connector: BaseConnector
}

const SIGNING_KEY_ID = 'signingKey'

/**
 */
export class UNiD {
    private readonly _context: UNiDContext
    private readonly _operator: UNiDDidOperator

    /**
     * @param context 
     */
    public constructor(context: UNiDContext) {
        this._context  = context
        this._operator = new UNiDDidOperator()
    }

    /**
     */
    public async loadDid(params: { did: string }) {
        console.log(this._context)
    }

    /**
     */
    public async createDidDocument(type: KeyRingType.Mnemonic, options?: MnemonicKeyringOptions): Promise<UNiDDidDocument>
    public async createDidDocument(type: KeyRingType, options?: MnemonicKeyringOptions): Promise<UNiDDidDocument> {
        switch (type) {
            case KeyRingType.Mnemonic: {
                const mnemonicOptions = options as MnemonicKeyringOptions
                const keyring  = await MnemonicKeyring.createKeyring(this.connector, mnemonicOptions)
                const document = await this._operator.create({
                    publicKeys: [
                        keyring.signKeyPair.toPublicKey(SIGNING_KEY_ID, Object.values(PublicKeyPurpose))
                    ],
                    commitmentKeys: {
                        update  : keyring.updateKeyPair.toJwk(),
                        recovery: keyring.recoveryKeyPair.toJwk(),
                    },
                    serviceEndpoints: []
                })

                // [TODO]: ローカルストアに鍵リングと DID を記録する

                return document
            }
            default: {
                throw new Error()
            }
        }
    }

    /**
     * @param params 
     */
    public async getDidDocument(params: { did: string }): Promise<UNiDDidDocument> {
        return await this._operator.resolve(params)
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

    /**
     */
    private get connector(): BaseConnector {
        return this._context.connector
    }
}