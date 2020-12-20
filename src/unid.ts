import { UNiDDidOperator, PublicKeyPurpose, UNiDDidDocument } from '@unid/did-operator'
import { ConfigManager } from './config'
import { BaseConnector } from './connector/base'
import { UNiDDid } from './did'
import { UNiDNotImplementedError } from "./error"
import { KeyRingType } from './keyring'
import { MnemonicKeyring, MnemonicKeyringOptions } from './keyring/mnemonic'

export enum UNiDNetworkType {
    Mainnet,
    Testnet
}

export interface UNiDContext {
    clientId    : string,
    clientSecret: string,
    connector   : BaseConnector,
    envNetwork? : UNiDNetworkType
}

const SIGNING_KEY_ID = 'signingKey'

/**
 */
class UNiDKlass {
    private readonly operator: UNiDDidOperator

    /**
     * @param context 
     */
    public constructor() {
        this.operator = new UNiDDidOperator()
    }

    /**
     * @param context 
     */
    public init(context: UNiDContext) {
        ConfigManager.setContext(context)
    }

    /**
     */
    public async loadDid(params: { did: string }): Promise<UNiDDid> {
        const keyring = await MnemonicKeyring.loadKeyring(this.getConnector(), params.did)

        return new UNiDDid({
            keyring : keyring,
            operator: this.operator,
        })
    }

    /**
     */
    public async createDid(type: KeyRingType.Mnemonic, options?: MnemonicKeyringOptions): Promise<UNiDDid>
    public async createDid(type: KeyRingType, options?: MnemonicKeyringOptions): Promise<UNiDDid> {
        switch (type) {
            case KeyRingType.Mnemonic: {
                const mnemonicOptions = options as MnemonicKeyringOptions
                const keyring  = await MnemonicKeyring.createKeyring(this.getConnector(), mnemonicOptions)
                const document = await this.operator.create({
                    publicKeys: [
                        keyring.getSignKeyPair().toPublicKey(SIGNING_KEY_ID, Object.values(PublicKeyPurpose))
                    ],
                    commitmentKeys: {
                        update  : keyring.getUpdateKeyPair().toJwk(),
                        recovery: keyring.getRecoveryKeyPair().toJwk(),
                    },
                    serviceEndpoints: []
                })

                await keyring.setDid(document.identifier)

                return new UNiDDid({
                    keyring : keyring,
                    operator: this.operator,
                })
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

    /**
     */
    private getConnector(): BaseConnector {
        return ConfigManager.context.connector
    }
}

export const UNiD = new UNiDKlass()