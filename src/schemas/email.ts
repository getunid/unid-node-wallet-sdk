import { Text } from 'schema-dts'
import { UNiDVerifiableCredential } from '.'

// EmailCredentialV1

export interface EmailPerson {
    '@id'  : Readonly<Text>,
    '@type': 'EmailPerson',
    email  : Readonly<Text>,
}

export interface EmailOrganization {
    '@id'  : Readonly<Text>,
    '@type': 'EmailOrganization',
    email  : Readonly<Text>,
}

export type EmailCredentialV1 = UNiDVerifiableCredential<
    'https://docs.unid.plus/docs/2020/credentials/email',
    'EmailPerson' | 'EmailOrganization',
    EmailPerson | EmailOrganization
>