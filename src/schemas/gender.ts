import { Text } from 'schema-dts'
import { UNiDCredentialSubjectMeta, UNiDVerifiableCredential, UNiDVerifiableCredentialBase, UNiDVerifiableCredentialContext, UNiDVerifiableCredentialMetaInternal, UNiDVerifiableCredentialOptions } from '.'

// GenderCredentialV1

/**
 */
export interface GenderPerson extends UNiDCredentialSubjectMeta {
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
    public constructor(credentialSubject: GenderPerson, options?: UNiDVerifiableCredentialOptions) {
        super(options)

        const credential: CredentialV1 = {
            type: [ 'VerifiableCredential', 'GenderCredentialV1' ],
            credentialSubject: credentialSubject,
        }

        this.$credential = Object.assign<CredentialV1Context, CredentialV1>({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.getunid.io/docs/2020/credentials/gender',
            ],
        }, credential)
    }

    /**
     * @param input 
     */
    private static isCompatible(input: any): input is GenderCredentialV1Schema & UNiDVerifiableCredentialMetaInternal {
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

        return new GenderCredentialV1(input.credentialSubject)
    }

    /**
     * @param vcs 
     */
    public static select(vcs: Array<any>): GenderCredentialV1Schema & UNiDVerifiableCredentialMetaInternal | undefined {
        const selected = vcs.filter((vc) => {
            return GenderCredentialV1.isCompatible(vc)
        })

        if (1 < selected.length) {
            throw new Error()
        }

        const select = selected.shift()

        if (select === undefined) {
            return undefined
        }
        if (! GenderCredentialV1.isCompatible(select)) {
            return undefined
        }

        return select
    }
}