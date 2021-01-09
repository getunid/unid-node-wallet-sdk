import { Text } from 'schema-dts'
import { UNiDCredentialSubjectMeta, UNiDVerifiableCredential, UNiDVerifiableCredentialBase, UNiDVerifiableCredentialContext, UNiDVerifiableCredentialOptions } from '.'

// PhoneCredentialV1

/**
 */
export interface PhonePerson extends UNiDCredentialSubjectMeta {
    '@type': 'PhonePerson',
    telephone: Readonly<Text>
}

/**
 */
export interface PhoneOrganization extends UNiDCredentialSubjectMeta {
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
    public constructor(credentialSubject: PhonePerson | PhoneOrganization, options?: UNiDVerifiableCredentialOptions) {
        super(options)

        const credential: CredentialV1 = {
            type: [ 'VerifiableCredential', 'PhoneCredentialV1' ],
            credentialSubject: credentialSubject,
        }

        this.$credential = Object.assign<CredentialV1Context, CredentialV1>({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.getunid.io/docs/2020/credentials/phone',
            ],
        }, credential)
    }

    /**
     * @param input 
     */
    private static isCompatible(input: any): input is PhoneCredentialV1Schema {
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

        return new PhoneCredentialV1(input.credentialSubject)
    }

    /**
     * @param vcs 
     */
    public static select(vcs: Array<any>): PhoneCredentialV1 | undefined {
        const selected = vcs.filter((vc) => {
            return PhoneCredentialV1.isCompatible(vc)
        })

        if (1 < selected.length) {
            throw new Error()
        }

        const select = selected.shift()

        if (select === undefined) {
            return undefined
        }
        if (! PhoneCredentialV1.isCompatible(select)) {
            return undefined
        }

        return new PhoneCredentialV1(select.credentialSubject)
    }
}