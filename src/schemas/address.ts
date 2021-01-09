import { PostalAddress } from 'schema-dts'
import { UNiDCredentialSubjectMeta, UNiDVerifiableCredential, UNiDVerifiableCredentialBase, UNiDVerifiableCredentialContext, UNiDVerifiableCredentialOptions } from '.';

// AddressCredentialV1

/**
 */
interface AddressPerson extends UNiDCredentialSubjectMeta {
    '@type': 'AddressPerson',
    address: PostalAddress,
}

/**
 */
interface AddressOrganization extends UNiDCredentialSubjectMeta {
    '@type': 'AddressOrganization',
    address: PostalAddress,
}

/**
 */
type CredentialV1 = UNiDVerifiableCredential<
    'AddressCredentialV1',
    AddressPerson | AddressOrganization
>

/**
 */
type CredentialV1Context = UNiDVerifiableCredentialContext<
    'https://docs.getunid.io/docs/2020/credentials/address'
>

/**
 */
export type AddressCredentialV1Schema = CredentialV1 & CredentialV1Context

/**
 */
export class AddressCredentialV1 extends UNiDVerifiableCredentialBase<AddressCredentialV1Schema> {
    /**
     * @param credentialSubject 
     * @param options 
     */
    public constructor(credentialSubject: AddressPerson | AddressOrganization, options?: UNiDVerifiableCredentialOptions) {
        super(options)

        const credential: CredentialV1 = {
            type: [ 'VerifiableCredential', 'AddressCredentialV1' ],
            credentialSubject: credentialSubject,
        }

        this.$credential = Object.assign<CredentialV1Context, CredentialV1>({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.getunid.io/docs/2020/credentials/address',
            ],
        }, credential)
    }

    /**
     * @param input 
     */
    private static isCompatible(input: any): input is CredentialV1 {
        if (typeof input !== 'object') {
            return false
        }
        if (Object.keys(input).indexOf('type') < 0) {
            return false
        }
        if (Array.isArray(input.type) !== true) {
            return false
        }
        if (Array.from(input.type).indexOf('AddressCredentialV1') < 0) {
            return false
        }
        return true
    }

    /**
     * @param input 
     */
    public static fromObject(input: any): AddressCredentialV1 {
        if (! AddressCredentialV1.isCompatible(input)) {
            throw new Error()
        }

        return new AddressCredentialV1(input.credentialSubject)
    }

    /**
     * @param vcs 
     */
    public static select(vcs: Array<any>): AddressCredentialV1 | undefined {
        const selected = vcs.filter((vc) => {
            return AddressCredentialV1.isCompatible(vc)
        })

        if (1 < selected.length) {
            throw new Error()
        }

        const select = selected.shift()

        if (select === undefined) {
            return undefined
        }
        if (! AddressCredentialV1.isCompatible(select)) {
            return undefined
        }

        return new AddressCredentialV1(select.credentialSubject)
    }
}