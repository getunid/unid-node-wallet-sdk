import { ProofContext } from "../cipher/signer"

export const VC_ID: string = 'https://sds.getunid.io/api/v1'

export type UNiDVCSchema =
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

export class UNiDVCBase<T> {
    public credential?: T
    private issuanceDate?: Date
    private expirationDate?: Date

    public constructor(options?: UNiDVCOptions) {
        if (options) {
            this.issuanceDate   = options.issuanceDate
            this.expirationDate = options.expirationDate
        }
    }

    public toVC(): T {
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

export interface UNiDVCMeta extends ProofContext {
    id: string,
    issuer: string,
    issuanceDate: string,
    expirationDate?: string,
}

export interface UNiDVCContext<T> {
    '@context': Array<'https://www.w3.org/2018/credentials/v1' | T>,
}

export interface UNiDVC<T1, T2> {
    type: Array<'VerifiableCredential' | T1>,
    credentialSubject: T2,
}

export interface UNiDVCOptions {
    issuanceDate?: Date,
    expirationDate?: Date,
}