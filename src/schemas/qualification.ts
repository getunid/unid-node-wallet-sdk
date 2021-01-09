import { EducationalOccupationalCredential } from 'schema-dts'
import { UNiDCredentialSubjectMeta, UNiDVerifiableCredential, UNiDVerifiableCredentialBase, UNiDVerifiableCredentialContext, UNiDVerifiableCredentialOptions } from '.'

// QualificationCredentialV1

/**
 */
export interface QualificationPerson extends UNiDCredentialSubjectMeta {
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
    public constructor(credentialSubject: QualificationPerson, options?: UNiDVerifiableCredentialOptions) {
        super(options)

        const credential: CredentialV1 = {
            type: [ 'VerifiableCredential', 'QualificationCredentialV1' ],
            credentialSubject: credentialSubject,
        }

        this.$credential = Object.assign<CredentialV1Context, CredentialV1>({
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

        return new QualificationCredentialV1(input.credentialSubject)
    }

    /**
     * @param vcs 
     */
    public static select(vcs: Array<any>): QualificationCredentialV1 | undefined {
        const selected = vcs.filter((vc) => {
            return QualificationCredentialV1.isCompatible(vc)
        })

        if (1 < selected.length) {
            throw new Error()
        }

        const select = selected.shift()

        if (select === undefined) {
            return undefined
        }
        if (! QualificationCredentialV1.isCompatible(select)) {
            return undefined
        }

        return new QualificationCredentialV1(select.credentialSubject)
    }
}