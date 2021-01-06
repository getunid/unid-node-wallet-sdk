import { Text } from 'schema-dts'
import { UNiDVerifiableCredential, UNiDVerifiableCredentialBase, UNiDVerifiableCredentialContext, UNiDVerifiableCredentialOptions } from '.'

// GenderCredentialV1

/**
 */
export interface GenderPerson {
    '@id'  : Readonly<Text>,
    '@type': 'GenderPerson',
    gender : Readonly<Text>,
}

/**
 */
type CredentialV1 = UNiDVerifiableCredential<
    'GenderCredentialV1',
    GenderPerson
>

/**
 */
type CredentialV1Context = UNiDVerifiableCredentialContext<
    'https://docs.getunid.io/docs/2020/credentials/gender'
>

/**
 */
export type GenderCredentialV1Schema = CredentialV1 & CredentialV1Context

/**
 */
export class GenderCredentialV1 extends UNiDVerifiableCredentialBase<GenderCredentialV1Schema> {
    /**
     * @param credential 
     * @param options 
     */
    public constructor(credential: CredentialV1, options?: UNiDVerifiableCredentialOptions) {
        super(options)

        this.credential = Object.assign<CredentialV1Context, CredentialV1>({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.getunid.io/docs/2020/credentials/gender',
            ],
        }, credential)
    }

    /**
     * @param input 
     */
    private static isCompatible(input: any): input is GenderCredentialV1Schema {
        if (typeof input !== 'object') {
            return false
        }
        if (Object.keys(input).indexOf('type') < 0) {
            return false
        }
        if (Array.isArray(input.type) !== true) {
            return false
        }
        if (Array.from(input.type).indexOf('GenderCredentialV1') < 0) {
            return false
        }
        return true
    }

    /**
     * @param input 
     */
    public static fromObject(input: any): GenderCredentialV1 {
        if (! GenderCredentialV1.isCompatible(input)) {
            throw new Error()
        }

        return new GenderCredentialV1(input)
    }
}