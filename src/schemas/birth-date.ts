import { Date } from 'schema-dts'
import { UNiDCredentialSubjectMeta, UNiDVerifiableCredential, UNiDVerifiableCredentialBase, UNiDVerifiableCredentialContext, UNiDVerifiableCredentialMetaInternal, UNiDVerifiableCredentialOptions } from '.'

// BirthDateCredentialV1

/**
 */
export interface BirthDatePerson extends UNiDCredentialSubjectMeta {
    '@type': 'BirthDatePerson',
    birthDate: Date,
}

/**
 */
type CredentialV1 = UNiDVerifiableCredential<
    'BirthDateCredentialV1',
    BirthDatePerson
>

/**
 */
type CredentialV1Context = UNiDVerifiableCredentialContext<
    'https://docs.getunid.io/docs/2020/credentials/birthDate'
>

/**
 */
export type BirthDateCredentialV1Schema = CredentialV1 & CredentialV1Context

/**
 */
export class BirthDateCredentialV1 extends UNiDVerifiableCredentialBase<BirthDateCredentialV1Schema> {
    /**
     * @param credential 
     * @param options 
     */
    public constructor(credentialSubject: BirthDatePerson, options?: UNiDVerifiableCredentialOptions) {
        super(options)

        const credential: CredentialV1 = {
            type: [ 'VerifiableCredential', 'BirthDateCredentialV1' ],
            credentialSubject: credentialSubject,
        }

        this.$credential = Object.assign<CredentialV1Context, CredentialV1>({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.getunid.io/docs/2020/credentials/birthDate',
            ],
        }, credential)
    }

    /**
     * @param input 
     */
    private static isCompatible(input: any): input is BirthDateCredentialV1Schema & UNiDVerifiableCredentialMetaInternal {
        if (typeof input !== 'object') {
            return false
        }
        if (Object.keys(input).indexOf('type') < 0) {
            return false
        }
        if (Array.isArray(input.type) !== true) {
            return false
        }
        if (Array.from(input.type).indexOf('BirthDateCredentialV1') < 0) {
            return false
        }
        return true
    }

    /**
     * @param input 
     */
    public static fromObject(input: any): BirthDateCredentialV1 {
        if (! BirthDateCredentialV1.isCompatible(input)) {
            throw new Error()
        }

        return new BirthDateCredentialV1(input.credentialSubject)
    }

    /**
     * @param vcs 
     */
    public static select(vcs: Array<any>): BirthDateCredentialV1Schema & UNiDVerifiableCredentialMetaInternal | undefined {
        const selected = vcs.filter((vc) => {
            return BirthDateCredentialV1.isCompatible(vc)
        })

        if (1 < selected.length) {
            throw new Error()
        }

        const select = selected.shift()

        if (select === undefined) {
            return undefined
        }
        if (! BirthDateCredentialV1.isCompatible(select)) {
            return undefined
        }

        return select
    }
}