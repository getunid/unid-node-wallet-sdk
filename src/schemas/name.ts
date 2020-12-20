import { Text } from 'schema-dts'
import { UNiDVerifiableCredential } from '.'

// NameCredentialV1

export interface NamePerson {
    '@id'  : Readonly<Text>,
    '@type': 'NamePerson',
    name: Readonly<Text>,
    giveName: Readonly<Text>,
    familyName: Readonly<Text>,
}

export interface NameOrganization {
    '@id'  : Readonly<Text>,
    '@type': 'NameOrganization',
    name: Readonly<Text>,
    giveName: Readonly<Text>,
    familyName: Readonly<Text>,
}

export type NameCredentialV1 = UNiDVerifiableCredential<
    'https://docs.unid.plus/docs/2020/credentials/name',
    'NamePerson' | 'NameOrganization',
    NamePerson | NameOrganization
>