import { Text, EducationalOccupationalCredential } from 'schema-dts'
import { UNiDVerifiableCredential, UNiDVerifiableCredentialBase, UNiDVerifiableCredentialContext, UNiDVerifiableCredentialOptions } from '.'

// QualificationCredentialV1

/**
 */
export interface QualificationPerson {
    '@id'  : Readonly<Text>,
    '@type': 'QualificationPerson',
    hasCredential: Array<EducationalOccupationalCredential>,
}

/**
 */
type CredentialV1 = UNiDVerifiableCredential<
    'QualificationCredentialV1',
    QualificationPerson
>

/**
 */
type CredentialV1Context = UNiDVerifiableCredentialContext<
    'https://docs.getunid.io/docs/2020/credentials/qualification'
>

/**
 */
export type QualificationCredentialV1Schema = CredentialV1 & CredentialV1Context

/**
 */
export class QualificationCredentialV1 extends UNiDVerifiableCredentialBase<QualificationCredentialV1Schema> {
    /**
     * @param credential 
     * @param options 
     */
    public constructor(credential: CredentialV1, options?: UNiDVerifiableCredentialOptions) {
        super(options)

        this.credential = Object.assign<CredentialV1Context, CredentialV1>({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.getunid.io/docs/2020/credentials/qualification',
            ],
        }, credential)
    }

    /**
     * @param input 
     */
    private static isCompatible(input: any): input is QualificationCredentialV1Schema {
        if (typeof input !== 'object') {
            return false
        }
        if (Object.keys(input).indexOf('type') < 0) {
            return false
        }
        if (Array.isArray(input.type) !== true) {
            return false
        }
        if (Array.from(input.type).indexOf('QualificationCredentialV1') < 0) {
            return false
        }
        return true
    }

    /**
     * @param input 
     */
    public static fromObject(input: any): QualificationCredentialV1 {
        if (! QualificationCredentialV1.isCompatible(input)) {
            throw new Error()
        }

        return new QualificationCredentialV1(input)
    }
}