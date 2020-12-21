import { Organization, Text } from 'schema-dts'
import { UNiDVerifiableCredential, UNiDVerifiableCredentialBase, UNiDVerifiableCredentialContext, UNiDVerifiableCredentialOptions } from '.'

// AlumniOfCredentialV1

export interface AlumniOfOrganization {
    '@id'  : Readonly<Text>,
    '@type': 'AlumniOfOrganization',
    alumniOf: Array<Organization>,
}

type CredentialV1 = UNiDVerifiableCredential<
    'AlumniOfOrganization',
    AlumniOfOrganization
>

type CredentialV1Context = UNiDVerifiableCredentialContext<
    'https://docs.unid.plus/docs/2020/credentials/alumniOf'
>

export type AlumniOfCredentialV1Schema = CredentialV1 & CredentialV1Context

export class AlumniOfCredentialV1 extends UNiDVerifiableCredentialBase<AlumniOfCredentialV1Schema> {
    public constructor(credential: CredentialV1, options?: UNiDVerifiableCredentialOptions) {
        super(options)

        this.credential = Object.assign<CredentialV1Context, CredentialV1>({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.unid.plus/docs/2020/credentials/alumniOf',
            ],
        }, credential)
    }
}