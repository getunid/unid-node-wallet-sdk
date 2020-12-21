import { MnemonicKeyring } from '../keyring/mnemonic'
import { UNiDDidOperator } from '@unid/did-operator'
import { UNiDVerifiableCredential } from './credential'
import { UNiDVerifiableCredentialBase, UNiDVerifiableCredentialMeta, UNiDVerifiableCredentialSchema, VC_ID } from '../schemas'
import { DateTimeTypes, DateTimeUtils } from '../utils/datetime'

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
     * Create: VC
     */
    public async createCredential<T>(credential: UNiDVerifiableCredentialBase<T>) {
        const iss = (new DateTimeUtils(credential.getIssuanceDate())).$toString(DateTimeTypes.default)
        const exp = (new DateTimeUtils(credential.getExpirationDate())).toString(DateTimeTypes.default)

        const data: T & UNiDVerifiableCredentialMeta = Object.assign<UNiDVerifiableCredentialMeta, T>({
            id    : VC_ID,
            issuer: this.getIdentifier(),
            issuanceDate  : iss,
        }, credential.toVerifiableCredential())

        if (exp !== undefined) {
            data.expirationDate = exp
        }

        const verifiableCredential = new UNiDVerifiableCredential<T & UNiDVerifiableCredentialMeta>(data)

        return await verifiableCredential.sign({
            did    : this.keyring.getIdentifier(),
            context: this.keyring.getSignKeyPair(),
        })
    }

    /**
     * Create: VP
     */
    public async createPresentation<T>() {}

    /**
     * To: SDS
     */
    public async postCredential() {}

    /**
     * From: SDS
     */
    public async getCredential() {}

    /**
     * From: SDS
     */
    public async getCredentials() {}

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