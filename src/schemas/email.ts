import { Text } from 'schema-dts'
import { UNiDVerifiableCredential, UNiDVerifiableCredentialBase, UNiDVerifiableCredentialContext, UNiDVerifiableCredentialOptions } from '.'

// EmailCredentialV1

/**
 */
export interface EmailPerson {
    '@id'  : Readonly<Text>,
    '@type': 'EmailPerson',
    email  : Readonly<Text>,
}

/**
 */
export interface EmailOrganization {
    '@id'  : Readonly<Text>,
    '@type': 'EmailOrganization',
    email  : Readonly<Text>,
}

/**
 */
type CredentialV1 = UNiDVerifiableCredential<
    'EmailCredentialV1',
    EmailPerson | EmailOrganization
>

/**
 */
type CredentialV1Context = UNiDVerifiableCredentialContext<
    'https://docs.getunid.io/docs/2020/credentials/email'
>

/**
 */
export type EmailCredentialV1Schema = CredentialV1 & CredentialV1Context

/**
 */
export class EmailCredentialV1 extends UNiDVerifiableCredentialBase<EmailCredentialV1Schema> {
    /**
     * @param credential 
     * @param options 
     */
    public constructor(credential: CredentialV1, options?: UNiDVerifiableCredentialOptions) {
        super(options)

        this.credential = Object.assign<CredentialV1Context, CredentialV1>({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.getunid.io/docs/2020/credentials/email',
            ],
        }, credential)
    }

    /**
     * @param input 
     */
    public static isCompatible(input: any): input is EmailCredentialV1Schema {
        if (typeof input !== 'object') {
            return false
        }
        if (Object.keys(input).indexOf('type') < 0) {
            return false
        }
        if (Array.isArray(input.type) !== true) {
            return false
        }
        if (Array.from(input.type).indexOf('EmailCredentialV1') < 0) {
            return false
        }
        return true
    }

    /**
     * @param input 
     */
    public static fromObject(input: any): EmailCredentialV1 {
        if (! EmailCredentialV1.isCompatible(input)) {
            throw new Error()
        }

        return new EmailCredentialV1(input)
    }
}