import { PostalAddress, Text } from 'schema-dts'
import { UNiDVerifiableCredential, UNiDVerifiableCredentialBase, UNiDVerifiableCredentialContext, UNiDVerifiableCredentialOptions } from '.';

// AddressCredentialV1

/**
 */
interface AddressPerson {
    '@id'  : Readonly<Text>,
    '@type': 'AddressPerson',
    address: PostalAddress,
}

/**
 */
interface AddressOrganization {
    '@id'  : Readonly<Text>,
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
     * @param credential 
     * @param options 
     */
    public constructor(credential: CredentialV1, options?: UNiDVerifiableCredentialOptions) {
        super(options)

        this.credential = Object.assign<CredentialV1Context, CredentialV1>({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.getunid.io/docs/2020/credentials/address',
            ],
        }, credential)
    }

    /**
     * @param input 
     */
    private static isCompatible(input: any): input is AddressCredentialV1Schema {
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

        return new AddressCredentialV1(input)
    }
}