import { Text } from 'schema-dts'
import { UNiDVC } from '.'

// PhoneCredentialV1

export interface PhonePerson {
    '@id'  : Readonly<Text>,
    '@type': 'PhonePerson',
    telephone: Readonly<Text>
}

export interface PhoneOrganization {
    '@id'  : Readonly<Text>,
    '@type': 'PhoneOrganization',
    telephone: Readonly<Text>
}

export type PhoneCredentialV1 = UNiDVC<
    'https://docs.unid.plus/docs/2020/credentials/phone',
    'PhonePerson' | 'PhoneOrganization',
    PhonePerson | PhoneOrganization
>