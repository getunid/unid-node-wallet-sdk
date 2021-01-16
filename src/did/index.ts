import { MnemonicKeyring } from '../keyring/mnemonic'
import { UNiDDidOperator } from '@unid/did-operator'
import { VerifiableCredential } from './credential'
import {
    VC_ID,
    UNiDVerifiableCredentialBase,
    UNiDVerifiableCredentialMetadata,
    UNiDVerifiableCredential,
    UNiDVerifiableCredentialSchema,
    UNiDVerifiablePresentationV1,
} from '../schemas'
import { DateTimeTypes, DateTimeUtils } from '../utils/datetime'
import { UNiDNotImplementedError, UNiDNotUniqueError } from '../error'
import { VerifiablePresentation } from './presentation'
import { UNiDVerifyCredentialResponse } from '../unid'
import { Cipher } from '../cipher/cipher'
import { SDSOperationCredentialV1 } from '../schemas/internal/sds-operation'
import { ConfigManager } from '../config'
import { UNiDSDSOperator } from '../sds/operator'

/**
 */
interface UNiDDidContext {
    keyring : MnemonicKeyring
    operator: UNiDDidOperator
}

/**
 */
interface UNiDDidAuthRequestClaims {
    requiredCredentialTypes: Array<UNiDVerifiableCredentialSchema>,
    optionalCredentialTypes: Array<UNiDVerifiableCredentialSchema>,
}

/**
 */
interface UNiDDidAuthRequest {
    iss          : string,
    response_type: 'callback',
    callback_uri : string,
    claims       : UNiDDidAuthRequestClaims,
}

/**
 */
interface UNiDFindOneQuery {
    type?                : string,
    issuerDid?           : string,
    credentialSubjectDid?: string,
    issuanceDate?        : { begin?: Date, end?: Date },
    expirationDate?      : { begin?: Date, end?: Date },
}

/**
 */
interface UNiDFindQuery extends UNiDFindOneQuery {
    limit?: number,
    page? : number,
}

/**
 */
export type Weaken<T, K extends keyof T> = {
    [P in keyof T]: P extends K ? any : T[P]
}

/**
 */
export class UNiDDid {
    /**
     */
    private readonly keyring : MnemonicKeyring

    /**
     */
    private readonly operator: UNiDDidOperator

    /**
     * @param context 
     */
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
            throw new UNiDNotUniqueError()
        }

        const presentation = new UNiDVerifiablePresentationV1(credentials)

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
    public async postCredential<T1, T2, T3>(credential: UNiDVerifyCredentialResponse<T1, T2, T3>): Promise<{ id: string }> {
        const operator = new UNiDSDSOperator()

        const data: Buffer   = Buffer.from(credential.toJSON(), 'utf-8')
        const secret: Buffer = this.keyring.getEncryptKeyPair().getPrivateKey()

        const metadata   = credential.metadata
        const encrypted  = (await Cipher.encrypt(data, secret)).toString('base64')
        const issuance   = (new DateTimeUtils(metadata.issuanceDate)).$toString(DateTimeTypes.iso8601)
        const expiration = (new DateTimeUtils(metadata.expirationDate)).toString(DateTimeTypes.iso8601)

        const payload = await this.createPresentation([
            await this.createCredential(
                new SDSOperationCredentialV1({
                    '@id'    : this.getIdentifier(),
                    '@type'  : 'CreateOperation',
                    clientId : ConfigManager.context.clientId,
                    payload  : encrypted,
                    context  : metadata['@context'],
                    type     : metadata.type,
                    issuerDid: metadata.issuerDid,
                    credentialSubjectDid: metadata.credentialSubjectDid,
                    issuanceDate  : issuance,
                    expirationDate: expiration,
                })
            )
        ])
        
        return await operator.create({ payload: payload })
    }

    /**
     * From: SDS
     */
    public async getCredential(query: UNiDFindOneQuery): Promise<any> {
        const operator = new UNiDSDSOperator()

        let issuanceDate  : { begin?: string, end?: string } | undefined = undefined
        let expirationDate: { begin?: string, end?: string } | undefined = undefined

        if (query.issuanceDate) {
            issuanceDate = {
                begin: (new DateTimeUtils(query.issuanceDate.begin)).toString(DateTimeTypes.iso8601),
                end  : (new DateTimeUtils(query.issuanceDate.end)).toString(DateTimeTypes.iso8601),
            }
        }
        if (query.expirationDate) {
            expirationDate = {
                begin: (new DateTimeUtils(query.expirationDate.begin)).toString(DateTimeTypes.iso8601),
                end  : (new DateTimeUtils(query.expirationDate.end)).toString(DateTimeTypes.iso8601),
            }
        }

        const payload = await this.createPresentation([
            await this.createCredential(
                new SDSOperationCredentialV1({
                    '@id'    : this.getIdentifier(),
                    '@type'  : 'FindOneOperation',
                    clientId : ConfigManager.context.clientId,
                    type     : query.type,
                    issuerDid: query.issuerDid,
                    credentialSubjectDid: query.credentialSubjectDid,
                    issuanceDate  : issuanceDate,
                    expirationDate: expirationDate,
                })
            )
        ])
        
        return await operator.findOne({ payload: payload })
    }

    /**
     * From: SDS
     */
    public async getCredentials(query: UNiDFindQuery): Promise<any> {
        const operator = new UNiDSDSOperator()

        let issuanceDate  : { begin?: string, end?: string } | undefined = undefined
        let expirationDate: { begin?: string, end?: string } | undefined = undefined

        if (query.issuanceDate) {
            issuanceDate = {
                begin: (new DateTimeUtils(query.issuanceDate.begin)).toString(DateTimeTypes.iso8601),
                end  : (new DateTimeUtils(query.issuanceDate.end)).toString(DateTimeTypes.iso8601),
            }
        }
        if (query.expirationDate) {
            expirationDate = {
                begin: (new DateTimeUtils(query.expirationDate.begin)).toString(DateTimeTypes.iso8601),
                end  : (new DateTimeUtils(query.expirationDate.end)).toString(DateTimeTypes.iso8601),
            }
        }

        const payload = await this.createPresentation([
            await this.createCredential(
                new SDSOperationCredentialV1({
                    '@id'    : this.getIdentifier(),
                    '@type'  : 'FindOperation',
                    clientId : ConfigManager.context.clientId,
                    limit    : query.limit,
                    page     : query.page,
                    type     : query.type,
                    issuerDid: query.issuerDid,
                    credentialSubjectDid: query.credentialSubjectDid,
                    issuanceDate  : issuanceDate,
                    expirationDate: expirationDate,
                })
            )
        ])
        
        return await operator.find({ payload: payload })
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