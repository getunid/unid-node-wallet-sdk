import { Text } from 'schema-dts'
import { UNiDCredentialSubjectMetadata, UNiDVerifiableCredential, UNiDVerifiableCredentialBase, UNiDVerifiableCredentialContext, UNiDVerifiableCredentialMetadata, UNiDVerifiableCredentialOptions } from '.'

// PhoneCredentialV1

/**
 */
export interface PhonePerson extends UNiDCredentialSubjectMetadata {
    '@type': 'PhonePerson',
    telephone: Readonly<Text>
}

/**
 */
export interface PhoneOrganization extends UNiDCredentialSubjectMetadata {
    '@type': 'PhoneOrganization',
    telephone: Readonly<Text>
}

/**
 */
export type PhoneCredentialV1Schema = UNiDVerifiableCredential<
    'https://docs.getunid.io/docs/2020/credentials/phone',
    'PhoneCredentialV1',
    PhonePerson | PhoneOrganization
>

/**
 */
export class PhoneCredentialV1 extends UNiDVerifiableCredentialBase<PhoneCredentialV1Schema> {
    /**
     * @param credential 
     * @param options 
     */
    public constructor(credentialSubject: PhonePerson | PhoneOrganization, options?: UNiDVerifiableCredentialOptions) {
        super(options)

        this.$credential = {
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.getunid.io/docs/2020/credentials/phone',
            ],
            type: [ 'VerifiableCredential', 'PhoneCredentialV1' ],
            credentialSubject: credentialSubject,
        }
    }

    /**
     * @param input 
     */
    private static isCompatible(input: any): input is PhoneCredentialV1Schema & UNiDVerifiableCredentialMetadata {
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
    public static select(vcs: Array<any>): PhoneCredentialV1Schema & UNiDVerifiableCredentialMetadata | undefined {
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

        return select
    }
}