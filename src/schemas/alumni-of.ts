import { Organization } from 'schema-dts'
import { UNiDCredentialSubjectMetadata, UNiDVerifiableCredential, UNiDVerifiableCredentialBase, UNiDVerifiableCredentialContext, UNiDVerifiableCredentialMetadata, UNiDVerifiableCredentialOptions } from '.'

// AlumniOfCredentialV1

/**
 */
export interface AlumniOfOrganization extends UNiDCredentialSubjectMetadata {
    '@type': 'AlumniOfOrganization',
    alumniOf: Array<Organization>,
}

/**
 */
export type AlumniOfCredentialV1Schema = UNiDVerifiableCredential<
    'https://docs.getunid.io/docs/2020/credentials/alumniOf',
    'AlumniOfCredentialV1',
    AlumniOfOrganization
>

/**
 */
export class AlumniOfCredentialV1 extends UNiDVerifiableCredentialBase<AlumniOfCredentialV1Schema> {
    /**
     * @param credential 
     * @param options 
     */
    public constructor(credentialSubject: AlumniOfOrganization, options?: UNiDVerifiableCredentialOptions) {
        super(options)

        this.$credential = {
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.getunid.io/docs/2020/credentials/alumniOf',
            ],
            type: [ 'VerifiableCredential', 'AlumniOfCredentialV1' ],
            credentialSubject: credentialSubject,
        }
    }

    /**
     * @param input 
     */
    private static isCompatible(input: any): input is AlumniOfCredentialV1Schema & UNiDVerifiableCredentialMetadata {
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

        return new AlumniOfCredentialV1(input.credentialSubject)
    }

    /**
     * @param vcs 
     */
    public static select(vcs: Array<any>): AlumniOfCredentialV1Schema & UNiDVerifiableCredentialMetadata | undefined {
        const selected = vcs.filter((vc) => {
            return AlumniOfCredentialV1.isCompatible(vc)
        })

        if (1 < selected.length) {
            throw new Error()
        }

        const select = selected.shift()

        if (select === undefined) {
            return undefined
        }
        if (! AlumniOfCredentialV1.isCompatible(select)) {
            return undefined
        }
        
        return select
    }
}