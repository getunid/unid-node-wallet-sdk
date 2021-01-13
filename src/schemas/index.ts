import { ProofContext } from "../cipher/signer"

export const VC_ID: string = 'https://sds.getunid.io/api/v1'

export type UNiDVerifiableCredentialSchema =
    | 'AddressPerson'
    | 'AddressOrganization'
    | 'AlumniOfOrganization'
    | 'ContactPointPerson'
    | 'ContactPointOrganization'
    | 'EmailPerson'
    | 'EmailOrganization'
    | 'GenderPerson'
    | 'NamePerson'
    | 'NameOrganization'
    | 'PhonePerson'
    | 'PhoneOrganization'
    | 'QualificationPerson'

/**
 */
export type Weaken<T, K extends keyof T> = {
    [P in keyof T]: P extends K ? any : T[P]
}

/**
 * 
 */
export interface UNiDCredentialSubjectMetadata {
    '@id'  : string,
    '@type': string,
}

/**
 */
export interface UNiDVerifiableCredentialMetadata extends ProofContext {
    // [REQUIRED FIELDS]:
    id: string,
    issuer: string,
    issuanceDate: string,

    // [OPTIONAL FIELDS]:
    expirationDate?: string,
}

/**
 */
export interface UNiDVerifiableCredentialContext<T1, T2> {
    '@context': Array<'https://www.w3.org/2018/credentials/v1' | T1>,
    type: Array<'VerifiableCredential' | T2>,
}

/**
 */
export interface UNiDWithoutProofVerifiableCredentialMetadata extends
    Omit<UNiDVerifiableCredentialMetadata, 'proof'> {
}

/**
 */
export interface UNiDExportedVerifiableCredentialMetadata extends
    Weaken<UNiDWithoutProofVerifiableCredentialMetadata, 'issuanceDate' | 'expirationDate'> {
    issuanceDate   : Date,
    expirationDate?: Date,
}

/**
 */
export interface UNiDVerifiableCredential<T1, T2, T3> extends UNiDVerifiableCredentialContext<T1, T2> {
    credentialSubject: T3,
}

/**
 */
export interface UNiDVerifiableCredentialOptions {
    issuanceDate?: Date,
    expirationDate?: Date,
}

/**
 */
export interface UNiDVerifiablePresentationMetadata extends ProofContext {
    // [REQUIRED FIELDS]:
    id: string,
    issuer: string,
    issuanceDate: string,

    // [OPTIONAL FIELDS]:
    expirationDate?: string,
}

/**
 */
export interface UNiDVerifiablePresentationContext {
    '@context': Array<'https://www.w3.org/2018/credentials/v1'>,
    type: Array<'VerifiablePresentation'>,
}

/**
 */
export interface UNiDWithoutProofVerifiablePresentationMetadata extends
    Omit<UNiDVerifiablePresentationMetadata, 'proof'> {
}

/**
 */
export interface UNiDExportedVerifiablePresentationMetadata extends
    Weaken<UNiDWithoutProofVerifiablePresentationMetadata, 'issuanceDate' | 'expirationDate'> {
    issuanceDate   : Date,
    expirationDate?: Date,
    credentialTypes: Array<string>,
}

/**
 */
export interface UNiDVerifiablePresentation<T> extends UNiDVerifiablePresentationContext {
    verifiableCredential: Array<T>,
}

/**
 */
export interface UNiDVerifiablePresentationOptions {
    issuanceDate?: Date,
    expirationDate?: Date,
}

/**
 * Verifiable Credential
 */
export class UNiDVerifiableCredentialBase<T> {
    protected $credential?: T
    private   $issuanceDate?: Date
    private   $expirationDate?: Date

    /**
     * @param options 
     */
    public constructor(options?: UNiDVerifiableCredentialOptions) {
        if (options) {
            this.$issuanceDate   = options.issuanceDate
            this.$expirationDate = options.expirationDate
        }
    }

    /**
     */
    public getVerifiableCredential(metadata: UNiDVerifiableCredentialMetadata): T & UNiDVerifiableCredentialMetadata {
        if (this.$credential === undefined) {
            throw new Error()
        }

        return Object.assign<UNiDVerifiableCredentialMetadata, T>(metadata, this.$credential)
    }

    /**
     */
    public get issuanceDate(): Date {
        if (this.$issuanceDate === undefined) {
            return (new Date())
        }

        return this.$issuanceDate
    }

    /**
     */
    public get expirationDate(): Date | undefined {
        return this.$expirationDate
    }
}

/**
 * Verifiable Presentation
 */
class UNiDVerifiablePresentationBase<T1> {
    protected $presentation?: UNiDVerifiablePresentation<UNiDVerifiableCredential<string, string, T1>>
    private   $issuanceDate?: Date
    private   $expirationDate?: Date

    /**
     * @param options 
     */
    public constructor(options?: UNiDVerifiablePresentationOptions) {
        if (options) {
            this.$issuanceDate   = options.issuanceDate
            this.$expirationDate = options.expirationDate
        }
    }

    /**
     */
    public getVerifiablePresentation(metadata: UNiDVerifiablePresentationMetadata): UNiDVerifiablePresentation<UNiDVerifiableCredential<string, string,T1>> & UNiDVerifiablePresentationMetadata {
        if (this.$presentation === undefined) {
            throw new Error()
        }

        return Object.assign<UNiDVerifiablePresentationMetadata, UNiDVerifiablePresentation<UNiDVerifiableCredential<string, string,T1>>>(metadata, this.$presentation)
    }

    /**
     */
    public get issuanceDate(): Date {
        if (this.$issuanceDate === undefined) {
            return (new Date())
        }

        return this.$issuanceDate
    }

    /**
     */
    public get expirationDate(): Date | undefined {
        return this.$expirationDate
    }
}

export class UNiDVerifiablePresentationV1 extends UNiDVerifiablePresentationBase<UNiDVerifiableCredential<string, string, UNiDCredentialSubjectMetadata>> {
    /**
     * @param credentialSubject 
     * @param options 
     */
    public constructor(verifiableCredential: Array<UNiDVerifiableCredential<any, any, any> & UNiDVerifiableCredentialMetadata>, options?: UNiDVerifiableCredentialOptions) {
        super(options)

        this.$presentation = {
            '@context': [ 'https://www.w3.org/2018/credentials/v1' ],
            type: [ 'VerifiablePresentation' ],
            verifiableCredential: verifiableCredential,
        }
    }
}