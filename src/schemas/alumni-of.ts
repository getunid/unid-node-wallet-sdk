import { Organization, Text } from 'schema-dts'
import { UNiDVerifiableCredential } from '.'

// AlumniOfCredentialV1

export interface AlumniOfOrganization {
    '@id'  : Readonly<Text>,
    '@type': 'AlumniOfOrganization',
    alumniOf: Array<Organization>,
}

export type AlumniOfCredentialV1 = UNiDVerifiableCredential<
    'https://docs.unid.plus/docs/2020/credentials/alumniOf',
    'AlumniOfOrganization',
    AlumniOfOrganization
>