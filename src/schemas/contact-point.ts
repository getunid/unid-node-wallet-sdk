import { ContactPoint, Text } from 'schema-dts'
import { UNiDVerifiableCredential, UNiDVerifiableCredentialBase, UNiDVerifiableCredentialContext, UNiDVerifiableCredentialOptions } from '.'

// ContactPointCredentialV1

/**
 */
export interface ContactPointPerson {
    '@id'  : Readonly<Text>,
    '@type': 'ContactPointPerson',
    contactPoint: ContactPoint
}

/**
 */
export interface ContactPointOrganization {
    '@id'  : Readonly<Text>,
    '@type': 'ContactPointOrganization',
    contactPoint: ContactPoint,
}

/**
 */
type CredentialV1 = UNiDVerifiableCredential<
    'ContactPointCredentialV1',
    ContactPointPerson | ContactPointOrganization
>

/**
 */
type CredentialV1Context = UNiDVerifiableCredentialContext<
    'https://docs.getunid.io/docs/2020/credentials/contactPoint'
>

/**
 */
export type ContactPointCredentialV1Schema = CredentialV1 & CredentialV1Context

/**
 */
export class ContactPointCredentialV1 extends UNiDVerifiableCredentialBase<ContactPointCredentialV1Schema> {
    /**
     * @param credential 
     * @param options 
     */
    public constructor(credential: CredentialV1, options?: UNiDVerifiableCredentialOptions) {
        super(options)

        this.credential = Object.assign<CredentialV1Context, CredentialV1>({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.getunid.io/docs/2020/credentials/contactPoint',
            ],
        }, credential)
    }

    /**
     * @param input 
     */
    private static isCompatible(input: any): input is ContactPointCredentialV1Schema {
        if (typeof input !== 'object') {
            return false
        }
        if (Object.keys(input).indexOf('type') < 0) {
            return false
        }
        if (Array.isArray(input.type) !== true) {
            return false
        }
        if (Array.from(input.type).indexOf('ContactPointCredentialV1') < 0) {
            return false
        }
        return true
    }

    /**
     * @param input 
     */
    public static fromObject(input: any): ContactPointCredentialV1 {
        if (! ContactPointCredentialV1.isCompatible(input)) {
            throw new Error()
        }

        return new ContactPointCredentialV1(input)
    }
}