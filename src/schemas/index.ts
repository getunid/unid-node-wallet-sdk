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
 * Verifiable Credential
 */
export class UNiDVerifiableCredentialBase<T> {
    public  credential?: T
    private issuanceDate?: Date
    private expirationDate?: Date

    public constructor(options?: UNiDVerifiableCredentialOptions) {
        if (options) {
            this.issuanceDate   = options.issuanceDate
            this.expirationDate = options.expirationDate
        }
    }

    public toVerifiableCredential(): T {
        if (this.credential === undefined) {
            throw new Error()
        }

        return this.credential
    }

    public getIssuanceDate(): Date {
        if (this.issuanceDate === undefined) {
            return (new Date())
        }

        return this.issuanceDate
    }

    public getExpirationDate(): Date | undefined {
        return this.expirationDate
    }
}

export interface UNiDVerifiableCredentialMeta extends ProofContext {
    id: string,
    issuer: string,
    issuanceDate: string,
    expirationDate?: string,
}

export interface UNiDVerifiableCredentialContext<T> {
    '@context': Array<'https://www.w3.org/2018/credentials/v1' | T>,
}

export interface UNiDVerifiableCredential<T1, T2> {
    type: Array<'VerifiableCredential' | T1>,
    credentialSubject: T2,
}

export interface UNiDVerifiableCredentialOptions {
    issuanceDate?: Date,
    expirationDate?: Date,
}

/**
 * Verifiable Presentation
 */
export class UNiDVerifiablePresentationBase {
    public  presentation?: Object
    private issuanceDate?: Date
    private expirationDate?: Date

    public constructor(options?: UNiDVerifiablePresentationOptions) {
        if (options) {
            this.issuanceDate   = options.issuanceDate
            this.expirationDate = options.expirationDate
        }
    }

    public toVerifiablePresentation(): Object {
        if (this.presentation === undefined) {
            throw new Error()
        }

        return this.presentation
    }

    public getIssuanceDate(): Date {
        if (this.issuanceDate === undefined) {
            return (new Date())
        }

        return this.issuanceDate
    }

    public getExpirationDate(): Date | undefined {
        return this.expirationDate
    }
}

export interface UNiDVerifiablePresentationMeta extends ProofContext {
    id: string,
    issuer: string,
    issuanceDate: string,
    expirationDate?: string,
}

export interface UNiDVerifiablePresentationContext<T> {
    '@context': Array<'https://www.w3.org/2018/credentials/v1' | T>,
}

export interface UNiDVerifiablePresentation<T1, T2> {
    type: Array<'VerifiablePresentation' | T1>,
    verifiableCredential: Array<T2>,
}

export interface UNiDVerifiablePresentationOptions {
    issuanceDate?: Date,
    expirationDate?: Date,
}