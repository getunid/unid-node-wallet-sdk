import { ContactPoint, Text } from 'schema-dts'
import { UNiDVC } from '.'

// ContactPointCredentialV1

export interface ContactPointPerson {
    '@id'  : Readonly<Text>,
    '@type': 'ContactPointPerson',
    contactPoint: ContactPoint
}

export interface ContactPointOrganization {
    '@id'  : Readonly<Text>,
    '@type': 'ContactPointOrganization',
    contactPoint: ContactPoint,
}

export type ContactPointCredentialV1 = UNiDVC<
    'https://docs.unid.plus/docs/2020/credentials/contactPoint',
    'ContactPointPerson' | 'ContactPointOrganization',
    ContactPointPerson | ContactPointOrganization
>