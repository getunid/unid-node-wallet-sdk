import { Text } from 'schema-dts'
import { UNiDVerifiableCredential, UNiDVerifiableCredentialBase, UNiDVerifiableCredentialContext, UNiDVerifiableCredentialOptions } from '.'

// NameCredentialV1

/**
 */
export interface NamePerson {
    '@id'  : Readonly<Text>,
    '@type': 'NamePerson',
    name: Readonly<Text>,
    giveName: Readonly<Text>,
    familyName: Readonly<Text>,
}

/**
 */
export interface NameOrganization {
    '@id'  : Readonly<Text>,
    '@type': 'NameOrganization',
    name: Readonly<Text>,
    giveName: Readonly<Text>,
    familyName: Readonly<Text>,
}

/**
 */
type CredentialV1 = UNiDVerifiableCredential<
    'NameCredentialV1',
    NamePerson | NameOrganization
>

/**
 */
type CredentialV1Context = UNiDVerifiableCredentialContext<
    'https://docs.getunid.io/docs/2020/credentials/name'
>

/**
 */
export type NameCredentialV1Schema = CredentialV1 & CredentialV1Context

/**
 */
export class NameCredentialV1 extends UNiDVerifiableCredentialBase<NameCredentialV1Schema> {
    /**
     * @param credential 
     * @param options 
     */
    public constructor(credential: CredentialV1, options?: UNiDVerifiableCredentialOptions) {
        super(options)

        this.credential = Object.assign<CredentialV1Context, CredentialV1>({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.getunid.io/docs/2020/credentials/name',
            ],
        }, credential)
    }

    /**
     * @param input 
     */
    public static isCompatible(input: any): input is NameCredentialV1Schema {
        if (typeof input !== 'object') {
            return false
        }
        if (Object.keys(input).indexOf('type') < 0) {
            return false
        }
        if (Array.isArray(input.type) !== true) {
            return false
        }
        if (Array.from(input.type).indexOf('NameCredentialV1') < 0) {
            return false
        }
        return true
    }

    /**
     * @param input 
     */
    public static fromObject(input: any): NameCredentialV1 {
        if (! NameCredentialV1.isCompatible(input)) {
            throw new Error()
        }

        return new NameCredentialV1(input)
    }
}