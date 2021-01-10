import { MnemonicKeyring } from '../keyring/mnemonic'
import { UNiDDidOperator } from '@unid/did-operator'
import { UNiDVerifiableCredential } from './credential'
import {
    UNiDVerifiableCredentialBase,
    UNiDVerifiableCredentialMetaInternal,
    UNiDVerifiablePresentation as UNiDVP,
    UNiDVerifiableCredential as UNiDVC,
    UNiDVerifiablePresentationContext,
    UNiDVerifiablePresentationMeta,
    UNiDVerifiableCredentialSchema,
    VC_ID,
    UNiDCredentialSubjectMeta,
} from '../schemas'
import { DateTimeTypes, DateTimeUtils } from '../utils/datetime'
import { UNiDNotImplementedError } from '../error'
import { UNiDVerifiablePresentation } from './presentation'

interface UNiDDidContext {
    keyring : MnemonicKeyring
    operator: UNiDDidOperator
}

interface UNiDDidAuthRequestClaims {
    requiredCredentialTypes: Array<UNiDVerifiableCredentialSchema>,
    optionalCredentialTypes: Array<UNiDVerifiableCredentialSchema>,
}

interface UNiDDidAuthRequest {
    iss          : string,
    response_type: 'callback',
    callback_uri : string,
    claims       : UNiDDidAuthRequestClaims,
}

export type Weaken<T, K extends keyof T> = {
    [P in keyof T]: P extends K ? any : T[P]
}

export interface UNiDVPSchema<T> extends Object, UNiDVerifiablePresentationMeta, UNiDVerifiablePresentationContext<Object>, UNiDVP<Object, T> {}

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
     * Create: Verifiable Credential
     */
    public async createCredential<T>(credential: UNiDVerifiableCredentialBase<T>) {
        const iss = (new DateTimeUtils(credential.issuanceDate)).$toString(DateTimeTypes.default)
        const exp = (new DateTimeUtils(credential.expirationDate)).toString(DateTimeTypes.default)

        const data: T & UNiDVerifiableCredentialMetaInternal = Object.assign<UNiDVerifiableCredentialMetaInternal, T>({
            id    : VC_ID,
            issuer: this.getIdentifier(),
            issuanceDate: iss,
        }, credential.verifiableCredential)

        if (exp !== undefined) {
            data.expirationDate = exp
        }

        const verifiableCredential = new UNiDVerifiableCredential<T & UNiDVerifiableCredentialMetaInternal>(data)

        return await verifiableCredential.sign({
            did    : this.keyring.getIdentifier(),
            context: this.keyring.getSignKeyPair(),
        })
    }

    /**
     * Create: Verifiable Presentation
     */
    public async createPresentation<T>(credentials: Array<T & UNiDVC<string, UNiDCredentialSubjectMeta>>) {
        const iss = (new DateTimeUtils(new Date())).$toString(DateTimeTypes.default)
        const types: Array<string> = []

        credentials.forEach((credential) => {
            credential.type.forEach((type) => {
                // [TODO]: 'VerifiableCredential' should be a constant
                if (type !== 'VerifiableCredential') {
                    types.push(type)
                }
            })
        })

        const duplicated = types.filter((type, index, self) => {
            return self.indexOf(type) !== self.lastIndexOf(type)
        })

        if (0 < duplicated.length) {
            throw new Error()
        }

        const data: UNiDVPSchema<T> = {
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
            ],
            type  : [ 'VerifiablePresentation' ],
            id    : VC_ID,
            issuer: this.getIdentifier(),
            issuanceDate: iss,
            verifiableCredential: credentials,
        }

        const verifiablePresentation = new UNiDVerifiablePresentation(data)

        return await verifiablePresentation.sign({
            did    : this.keyring.getIdentifier(),
            context: this.keyring.getSignKeyPair(),
        })
    }

    /**
     * To: SDS
     */
    public async postCredential() {
        throw new UNiDNotImplementedError()
    }

    /**
     * From: SDS
     */
    public async getCredential() {
        throw new UNiDNotImplementedError()
    }

    /**
     * From: SDS
     */
    public async getCredentials() {
        throw new UNiDNotImplementedError()
    }

    /**
     */
    public async generateAuthenticationRequest(params: {
        claims     : UNiDDidAuthRequestClaims,
        callbackUri: string,
    }) {
        const payload: UNiDDidAuthRequest = {
            iss          : this.getIdentifier(),
            response_type: 'callback',
            callback_uri : params.callbackUri,
            claims       : params.claims,
        }
        const request = new UNiDVerifiableCredential<UNiDDidAuthRequest>(payload)

        return await request.sign({
            did    : this.keyring.getIdentifier(),
            context: this.keyring.getSignKeyPair(),
        })
    }
}