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
 */
export type PickType<T, K extends keyof T> = T[K]

/**
 * 
 */
export interface UNiDCredentialSubjectMeta {
    '@id'  : string,
    '@type': string,
}

/**
 */
export interface UNiDVerifiableCredentialMetaInternal extends ProofContext {
    // [REQUIRED FIELDS]:
    id: string,
    issuer: string,
    issuanceDate: string,

    // [OPTIONAL FIELDS]:
    expirationDate?: string,
}

/**
 */
export interface UNiDVerifiableCredentialMetaExternal extends Weaken<UNiDVerifiableCredentialMetaInternal, 'issuanceDate' | 'expirationDate'> {
    issuanceDate: Date,
    expirationDate?: Date,
}

/**
 */
export interface UNiDVerifiableCredentialContext<T> {
    '@context': Array<'https://www.w3.org/2018/credentials/v1' | T>,
}

/**
 */
export interface UNiDVerifiableCredential<T1, T2> {
    type: Array<'VerifiableCredential' | T1>,
    credentialSubject: T2,
}

/**
 */
export interface UNiDVerifiableCredentialOptions {
    issuanceDate?: Date,
    expirationDate?: Date,
}

/**
 */
export interface UNiDVerifiablePresentationMeta extends ProofContext {
    id: string,
    issuer: string,
    issuanceDate: string,
    expirationDate?: string,
}

/**
 */
export interface UNiDVerifiablePresentationContext<T> {
    '@context': Array<'https://www.w3.org/2018/credentials/v1' | T>,
}

/**
 */
export interface UNiDVerifiablePresentation<T1, T2> {
    type: Array<'VerifiablePresentation' | T1>,
    verifiableCredential: Array<T2>,
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
    public get verifiableCredential(): T {
        if (this.$credential === undefined) {
            throw new Error()
        }

        return this.$credential
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
export class UNiDVerifiablePresentationBase {
    public  presentation?: object
    private issuanceDate?: Date
    private expirationDate?: Date

    /**
     * @param options 
     */
    public constructor(options?: UNiDVerifiablePresentationOptions) {
        if (options) {
            this.issuanceDate   = options.issuanceDate
            this.expirationDate = options.expirationDate
        }
    }

    /**
     */
    public verifiablePresentation(): object {
        if (this.presentation === undefined) {
            throw new Error()
        }

        return this.presentation
    }

    /**
     */
    public getIssuanceDate(): Date {
        if (this.issuanceDate === undefined) {
            return (new Date())
        }

        return this.issuanceDate
    }

    /**
     */
    public getExpirationDate(): Date | undefined {
        return this.expirationDate
    }
}