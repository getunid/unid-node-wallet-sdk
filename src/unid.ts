import { UNiDDidOperator, PublicKeyPurpose, UNiDDidDocument } from '@unid/did-operator'
import { BaseConnector } from './connector/base'
import { UNiDDid } from './did'
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
    public async loadDid(params: { did: string }): Promise<UNiDDid> {
        return new UNiDDid(
            await MnemonicKeyring.loadKeyring(this.connector, params.did)
        )
    }

    /**
     */
    public async createDidDocument(type: KeyRingType.Mnemonic, options?: MnemonicKeyringOptions): Promise<UNiDDid>
    public async createDidDocument(type: KeyRingType, options?: MnemonicKeyringOptions): Promise<UNiDDid> {
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

                await keyring.setDid(document.identifier)

                return new UNiDDid(keyring)
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