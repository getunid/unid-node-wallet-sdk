import { Text } from 'schema-dts'
import { UNiDVerifiableCredential } from '.'

// GenderCredentialV1

export interface GenderPerson {
    '@id'  : Readonly<Text>,
    '@type': 'GenderPerson',
    gender : Readonly<Text>,
}

export type GenderCredentialV1 = UNiDVerifiableCredential<
    'https://docs.unid.plus/docs/2020/credentials/gender',
    'GenderPerson',
    GenderPerson
>