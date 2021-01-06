import { Text } from 'schema-dts'
import { UNiDVerifiableCredential, UNiDVerifiableCredentialBase, UNiDVerifiableCredentialContext, UNiDVerifiableCredentialOptions } from '.'

// PhoneCredentialV1

/**
 */
export interface PhonePerson {
    '@id'  : Readonly<Text>,
    '@type': 'PhonePerson',
    telephone: Readonly<Text>
}

/**
 */
export interface PhoneOrganization {
    '@id'  : Readonly<Text>,
    '@type': 'PhoneOrganization',
    telephone: Readonly<Text>
}

/**
 */
type CredentialV1 = UNiDVerifiableCredential<
    'PhoneCredentialV1',
    PhonePerson | PhoneOrganization
>

/**
 */
type CredentialV1Context = UNiDVerifiableCredentialContext<
    'https://docs.getunid.io/docs/2020/credentials/phone'
>

/**
 */
export type PhoneCredentialV1Schema = CredentialV1 & CredentialV1Context

/**
 */
export class PhoneCredentialV1 extends UNiDVerifiableCredentialBase<PhoneCredentialV1Schema> {
    /**
     * @param credential 
     * @param options 
     */
    public constructor(credential: CredentialV1, options?: UNiDVerifiableCredentialOptions) {
        super(options)

        this.credential = Object.assign<CredentialV1Context, CredentialV1>({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.getunid.io/docs/2020/credentials/phone',
            ],
        }, credential)
    }

    /**
     * @param input 
     */
    public static isCompatible(input: any): input is PhoneCredentialV1Schema {
        if (typeof input !== 'object') {
            return false
        }
        if (Object.keys(input).indexOf('type') < 0) {
            return false
        }
        if (Array.isArray(input.type) !== true) {
            return false
        }
        if (Array.from(input.type).indexOf('PhoneCredentialV1') < 0) {
            return false
        }
        return true
    }

    /**
     * @param input 
     */
    public static fromObject(input: any): PhoneCredentialV1 {
        if (! PhoneCredentialV1.isCompatible(input)) {
            throw new Error()
        }

        return new PhoneCredentialV1(input)
    }
}