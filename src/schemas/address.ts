import { PostalAddress, Text } from 'schema-dts'
import { UNiDVerifiableCredential, UNiDVerifiableCredentialBase, UNiDVerifiableCredentialContext, UNiDVerifiableCredentialOptions } from '.';

// AddressCredentialV1

interface AddressPerson {
    '@id'  : Readonly<Text>,
    '@type': 'AddressPerson',
    address: PostalAddress,
}

interface AddressOrganization {
    '@id'  : Readonly<Text>,
    '@type': 'AddressOrganization',
    address: PostalAddress,
}

type CredentialV1 = UNiDVerifiableCredential<
    'AddressPerson' | 'AddressOrganization',
    AddressPerson | AddressOrganization
>

type CredentialV1Context = UNiDVerifiableCredentialContext<
    'https://docs.unid.plus/docs/2020/credentials/address'
>

export type AddressCredentialV1Schema = CredentialV1 & CredentialV1Context

export class AddressCredentialV1 extends UNiDVerifiableCredentialBase<AddressCredentialV1Schema> {
    public constructor(credential: CredentialV1, options?: UNiDVerifiableCredentialOptions) {
        super(options)

        this.credential = Object.assign<CredentialV1Context, CredentialV1>({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.unid.plus/docs/2020/credentials/address',
            ],
        }, credential)
    }
}