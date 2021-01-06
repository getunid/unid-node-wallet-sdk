import { Organization, Text } from 'schema-dts'
import { UNiDVerifiableCredential, UNiDVerifiableCredentialBase, UNiDVerifiableCredentialContext, UNiDVerifiableCredentialOptions } from '.'

// AlumniOfCredentialV1

/**
 */
export interface AlumniOfOrganization {
    '@id'  : Readonly<Text>,
    '@type': 'AlumniOfOrganization',
    alumniOf: Array<Organization>,
}

/**
 */
type CredentialV1 = UNiDVerifiableCredential<
    'AlumniOfCredentialV1',
    AlumniOfOrganization
>

/**
 */
type CredentialV1Context = UNiDVerifiableCredentialContext<
    'https://docs.getunid.io/docs/2020/credentials/alumniOf'
>

/**
 */
export type AlumniOfCredentialV1Schema = CredentialV1 & CredentialV1Context

/**
 */
export class AlumniOfCredentialV1 extends UNiDVerifiableCredentialBase<AlumniOfCredentialV1Schema> {
    /**
     * @param credential 
     * @param options 
     */
    public constructor(credential: CredentialV1, options?: UNiDVerifiableCredentialOptions) {
        super(options)

        this.credential = Object.assign<CredentialV1Context, CredentialV1>({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.getunid.io/docs/2020/credentials/alumniOf',
            ],
        }, credential)
    }

    /**
     * @param input 
     */
    private static isCompatible(input: any): input is AlumniOfCredentialV1Schema {
        if (typeof input !== 'object') {
            return false
        }
        if (Object.keys(input).indexOf('type') < 0) {
            return false
        }
        if (Array.isArray(input.type) !== true) {
            return false
        }
        if (Array.from(input.type).indexOf('AlumniOfCredentialV1') < 0) {
            return false
        }
        return true
    }

    /**
     * @param input 
     */
    public static fromObject(input: any): AlumniOfCredentialV1 {
        if (! AlumniOfCredentialV1.isCompatible(input)) {
            throw new Error()
        }

        return new AlumniOfCredentialV1(input)
    }
}