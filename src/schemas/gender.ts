import { Text } from 'schema-dts'
import { UNiDVC } from '.'

// GenderCredentialV1

export interface GenderPerson {
    '@id'  : Readonly<Text>,
    '@type': 'GenderPerson',
    gender : Readonly<Text>,
}

export type GenderCredentialV1 = UNiDVC<
    'https://docs.unid.plus/docs/2020/credentials/gender',
    'GenderPerson',
    GenderPerson
>