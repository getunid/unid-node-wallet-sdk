import { ContactPoint } from 'schema-dts'
import { UNiDCredentialSubjectMeta, UNiDVerifiableCredential, UNiDVerifiableCredentialBase, UNiDVerifiableCredentialContext, UNiDVerifiableCredentialMetaInternal, UNiDVerifiableCredentialOptions } from '.'

// ContactPointCredentialV1

/**
 */
export interface ContactPointPerson extends UNiDCredentialSubjectMeta {
    '@type': 'ContactPointPerson',
    contactPoint: ContactPoint
}

/**
 */
export interface ContactPointOrganization extends UNiDCredentialSubjectMeta {
    '@type': 'ContactPointOrganization',
    contactPoint: ContactPoint,
}

/**
 */
type CredentialV1 = UNiDVerifiableCredential<
    'ContactPointCredentialV1',
    ContactPointPerson | ContactPointOrganization
>

/**
 */
type CredentialV1Context = UNiDVerifiableCredentialContext<
    'https://docs.getunid.io/docs/2020/credentials/contactPoint'
>

/**
 */
export type ContactPointCredentialV1Schema = CredentialV1 & CredentialV1Context

/**
 */
export class ContactPointCredentialV1 extends UNiDVerifiableCredentialBase<ContactPointCredentialV1Schema> {
    /**
     * @param credential 
     * @param options 
     */
    public constructor(credentialSubject: ContactPointPerson | ContactPointOrganization, options?: UNiDVerifiableCredentialOptions) {
        super(options)

        const credential: CredentialV1 = {
            type: [ 'VerifiableCredential', 'ContactPointCredentialV1' ],
            credentialSubject: credentialSubject,
        }

        this.$credential = Object.assign<CredentialV1Context, CredentialV1>({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.getunid.io/docs/2020/credentials/contactPoint',
            ],
        }, credential)
    }

    /**
     * @param input 
     */
    private static isCompatible(input: any): input is ContactPointCredentialV1Schema & UNiDVerifiableCredentialMetaInternal {
        if (typeof input !== 'object') {
            return false
        }
        if (Object.keys(input).indexOf('type') < 0) {
            return false
        }
        if (Array.isArray(input.type) !== true) {
            return false
        }
        if (Array.from(input.type).indexOf('ContactPointCredentialV1') < 0) {
            return false
        }
        return true
    }

    /**
     * @param input 
     */
    public static fromObject(input: any): ContactPointCredentialV1 {
        if (! ContactPointCredentialV1.isCompatible(input)) {
            throw new Error()
        }

        return new ContactPointCredentialV1(input.credentialSubject)
    }

    /**
     * @param vcs 
     */
    public static select(vcs: Array<any>): ContactPointCredentialV1Schema & UNiDVerifiableCredentialMetaInternal | undefined {
        const selected = vcs.filter((vc) => {
            return ContactPointCredentialV1.isCompatible(vc)
        })

        if (1 < selected.length) {
            throw new Error()
        }

        const select = selected.shift()

        if (select === undefined) {
            return undefined
        }
        if (! ContactPointCredentialV1.isCompatible(select)) {
            return undefined
        }

        return select
    }
}