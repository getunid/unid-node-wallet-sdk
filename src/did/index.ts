import { MnemonicKeyring } from '../keyring/mnemonic'
import { UNiDDidOperator } from '@unid/did-operator'
import { VerifiableCredential } from './credential'
import {
    VC_ID,
    UNiDVerifiableCredentialBase,
    UNiDVerifiableCredentialMetadata,
    UNiDVerifiableCredential,
    UNiDVerifiableCredentialSchema,
    UNiDCredentialSubjectMetadata,
    UNiDVerifiablePresentationV1,
} from '../schemas'
import { DateTimeTypes, DateTimeUtils } from '../utils/datetime'
import { UNiDNotImplementedError } from '../error'
import { VerifiablePresentation } from './presentation'

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

        const data = credential.getVerifiableCredential({
            id    : VC_ID,
            issuer: this.getIdentifier(),
            issuanceDate: iss,
        })

        if (exp !== undefined) {
            data.expirationDate = exp
        }

        const verifiableCredential = new VerifiableCredential(data)

        return await verifiableCredential.sign({
            did    : this.keyring.getIdentifier(),
            context: this.keyring.getSignKeyPair(),
        })
    }

    /**
     * Create: Verifiable Presentation
     */
    public async createPresentation<T>(credentials: Array<UNiDVerifiableCredential<string, string, T> & UNiDVerifiableCredentialMetadata>) {
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

        const presentation = new UNiDVerifiablePresentationV1(credentials, {
        })

        const iss = (new DateTimeUtils(presentation.issuanceDate)).$toString(DateTimeTypes.default)
        const exp = (new DateTimeUtils(presentation.expirationDate)).toString(DateTimeTypes.default)

        const data = presentation.getVerifiablePresentation({
            id    : VC_ID,
            issuer: this.getIdentifier(),
            issuanceDate: iss,
        })

        if (exp !== undefined) {
            data.expirationDate = exp
        }

        const verifiablePresentation = new VerifiablePresentation(data)

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
        const request = new VerifiableCredential<UNiDDidAuthRequest>(payload)

        return await request.sign({
            did    : this.keyring.getIdentifier(),
            context: this.keyring.getSignKeyPair(),
        })
    }
}