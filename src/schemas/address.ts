import { PostalAddress, Text } from 'schema-dts'
import { UNiDVerifiableCredential } from '.';

// AddressCredentialV1

export interface AddressPerson {
    '@id'  : Readonly<Text>,
    '@type': 'AddressPerson',
    address: PostalAddress,
}

export interface AddressOrganization {
    '@id'  : Readonly<Text>,
    '@type': 'AddressOrganization',
    address: PostalAddress,
}

export type AddressCredentialV1 = UNiDVerifiableCredential<
    'https://docs.unid.plus/docs/2020/credentials/address',
    'AddressPerson' | 'AddressOrganization',
    AddressPerson | AddressOrganization
>