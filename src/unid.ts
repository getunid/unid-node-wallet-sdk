import { UNiDDidOperator, PublicKeyPurpose, UNiDDidDocument } from './core'
import { ContextManager } from './context'
import { BaseConnector } from './did-unid/connector/base'
import { UNiDDid } from './did-unid/did'
import { VerifiableCredential } from './did-unid/did/credential'
import { VerifiablePresentation } from './did-unid/did/presentation'
import { UNiDNotCompatibleError, UNiDNotImplementedError } from "./error"
import { KeyRingType } from './did-unid/keyring'
import { MnemonicKeyring, MnemonicKeyringOptions } from './did-unid/keyring/mnemonic'
import {
    UNiDCredentialSubjectMetadata,
    UNiDExportedVerifiableCredentialMetadata,
    UNiDExportedVerifiablePresentationMetadata,
    UNiDVerifiableCredential,
    UNiDVerifiableCredentialMetadata,
    UNiDVerifiablePresentation,
    UNiDVerifiablePresentationMetadata,
    UNiDWithoutProofVerifiableCredentialMetadata,
    UNiDWithoutProofVerifiablePresentationMetadata,
} from './did-unid/schemas'

/**
 */
export enum UNiDNetworkType {
    Mainnet,
    Testnet
}

/**
 */
export interface UNiDContext {
    clientId     : string,
    clientSecret : string,
    connector    : BaseConnector,
    encryptionKey: string,
    envNetwork?  : UNiDNetworkType
}

/**
 */
export const SIGNING_KEY_ID = 'signingKey'

/**
 */
export interface UNiDVerifyCredentialResponse<T1, T2, T3> {
    isValid : boolean,
    payload : UNiDVerifiableCredential<T1, T2, T3> & UNiDWithoutProofVerifiableCredentialMetadata,
    metadata: UNiDExportedVerifiableCredentialMetadata
    toJSON(): string
}

/**
 */
export interface UNiDVerifyPresentationResponse<T1> {
    isValid : boolean,
    payload : UNiDVerifiablePresentation<UNiDVerifiableCredential<string, string, T1>> & UNiDWithoutProofVerifiablePresentationMetadata
    metadata: UNiDExportedVerifiablePresentationMetadata,
    toJSON(): string
}

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
        ContextManager.setContext(context)
    }

    /**
     * @returns
     */
    private getConnector(): BaseConnector {
        return ContextManager.context.connector
    }

    /**
     * @param params 
     * @returns
     */
    public async loadDid(params: { did: string }): Promise<UNiDDid> {
        const keyring = await MnemonicKeyring.loadKeyring(this.getConnector(), params.did)

        return new UNiDDid({
            keyring : keyring,
            operator: this.operator,
        })
    }

    /**
     * @param type 
     * @param options 
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
     * @returns
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
     * @param credential 
     * @returns
     */
    public async verifyCredential<T1, T2, T3>(credential: UNiDVerifiableCredential<T1, T2, T3> & UNiDVerifiableCredentialMetadata): Promise<UNiDVerifyCredentialResponse<T1, T2, T3>> {
        if (! this.isVerifiableCredential<T1, T2, T3>(credential)) {
            throw new UNiDNotCompatibleError()
        }

        return await VerifiableCredential.verify(credential)
    }

    /**
     * @param presentation 
     * @returns
     */
    public async verifyPresentation<T1>(presentation: UNiDVerifiablePresentation<UNiDVerifiableCredential<string, string, T1>> & UNiDVerifiablePresentationMetadata): Promise<UNiDVerifyPresentationResponse<T1>> {
        if (! this.isVerifiablePresentation<T1>(presentation)) {
            throw new UNiDNotCompatibleError()
        }

        return await VerifiablePresentation.verify(presentation)
    }

    /**
     * @param request 
     * @returns
     */
    public async validateAuthenticationRequest<T1>(request: UNiDVerifiablePresentation<UNiDVerifiableCredential<string, string, T1>> & UNiDVerifiablePresentationMetadata): Promise<UNiDVerifyPresentationResponse<T1>> {
        const verified = this.verifyPresentation(request)

        return verified
    }

    /**
     * @param response 
     * @returns
     */
    public async validateAuthenticationResponse<T1>(response: UNiDVerifiablePresentation<UNiDVerifiableCredential<string, string, T1>> & UNiDVerifiablePresentationMetadata): Promise<UNiDVerifyPresentationResponse<T1>> {
        const verified = this.verifyPresentation(response)

        return verified
    }

    /**
     * @param input 
     * @returns
     */
    public isVerifiableCredential<T1 = string, T2 = string, T3 = UNiDCredentialSubjectMetadata>(input: any): input is UNiDVerifiableCredential<T1, T2, T3> & UNiDVerifiableCredentialMetadata {
        if (typeof(input) !== 'object') {
            return false
        }

        if ((Object.keys(input).indexOf('@context') < 0) ||
            (Object.keys(input).indexOf('type') < 0) ||
            (Object.keys(input).indexOf('credentialSubject') < 0) ||
            (Object.keys(input).indexOf('proof') < 0)
        ) {
            return false
        }

        return true
    }

    /**
     * @param input 
     * @returns
     */
    public isVerifiablePresentation<T1 = object>(input: any): input is UNiDVerifiablePresentation<UNiDVerifiableCredential<string, string, T1>> & UNiDVerifiablePresentationMetadata {
        if (typeof(input) !== 'object') {
            return false
        }

        if ((Object.keys(input).indexOf('@context') < 0) ||
            (Object.keys(input).indexOf('type') < 0) ||
            (Object.keys(input).indexOf('verifiableCredential') < 0) ||
            (Object.keys(input).indexOf('proof') < 0)
        ) {
            return false
        }

        return true
    }
}

export const UNiD = new UNiDKlass()