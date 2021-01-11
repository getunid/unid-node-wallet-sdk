import { Text } from 'schema-dts'
import { UNiDCredentialSubjectMeta, UNiDVerifiableCredential, UNiDVerifiableCredentialBase, UNiDVerifiableCredentialContext, UNiDVerifiableCredentialMetaInternal, UNiDVerifiableCredentialOptions } from '.'

// EmailCredentialV1

/**
 */
export interface EmailPerson extends UNiDCredentialSubjectMeta {
    '@type': 'EmailPerson',
    email  : Readonly<Text>,
}

/**
 */
export interface EmailOrganization extends UNiDCredentialSubjectMeta {
    '@type': 'EmailOrganization',
    email  : Readonly<Text>,
}

/**
 */
type CredentialV1 = UNiDVerifiableCredential<
    'EmailCredentialV1',
    EmailPerson | EmailOrganization
>

/**
 */
type CredentialV1Context = UNiDVerifiableCredentialContext<
    'https://docs.getunid.io/docs/2020/credentials/email'
>

/**
 */
export type EmailCredentialV1Schema = CredentialV1 & CredentialV1Context

/**
 */
export class EmailCredentialV1 extends UNiDVerifiableCredentialBase<EmailCredentialV1Schema> {
    /**
     * @param credential 
     * @param options 
     */
    public constructor(credentialSubject: EmailPerson | EmailOrganization, options?: UNiDVerifiableCredentialOptions) {
        super(options)

        const credential: CredentialV1 = {
            type: [ 'VerifiableCredential', 'EmailCredentialV1' ],
            credentialSubject: credentialSubject,
        }

        this.$credential = Object.assign<CredentialV1Context, CredentialV1>({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.getunid.io/docs/2020/credentials/email',
            ],
        }, credential)
    }

    /**
     * @param input 
     */
    private static isCompatible(input: any): input is EmailCredentialV1Schema & UNiDVerifiableCredentialMetaInternal {
        if (typeof input !== 'object') {
            return false
        }
        if (Object.keys(input).indexOf('type') < 0) {
            return false
        }
        if (Array.isArray(input.type) !== true) {
            return false
        }
        if (Array.from(input.type).indexOf('EmailCredentialV1') < 0) {
            return false
        }
        return true
    }

    /**
     * @param input 
     */
    public static fromObject(input: any): EmailCredentialV1 {
        if (! EmailCredentialV1.isCompatible(input)) {
            throw new Error()
        }

        return new EmailCredentialV1(input.credentialSubject)
    }

    /**
     * @param vcs 
     */
    public static select(vcs: Array<any>): EmailCredentialV1Schema & UNiDVerifiableCredentialMetaInternal | undefined {
        const selected = vcs.filter((vc) => {
            return EmailCredentialV1.isCompatible(vc)
        })

        if (1 < selected.length) {
            throw new Error()
        }

        const select = selected.shift()

        if (select === undefined) {
            return undefined
        }
        if (! EmailCredentialV1.isCompatible(select)) {
            return undefined
        }

        return select
    }
}