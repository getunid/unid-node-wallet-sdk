import { ContactPoint, Text } from 'schema-dts'
import { UNiDVerifiableCredential, UNiDVerifiableCredentialBase, UNiDVerifiableCredentialContext, UNiDVerifiableCredentialOptions } from '.'

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

type CredentialV1 = UNiDVerifiableCredential<
    'ContactPointPerson' | 'ContactPointOrganization',
    ContactPointPerson | ContactPointOrganization
>

type CredentialV1Context = UNiDVerifiableCredentialContext<
    'https://docs.unid.plus/docs/2020/credentials/contactPoint'
>

export type ContactPointCredentialV1Schema = CredentialV1 & CredentialV1Context

export class ContactPointCredentialV1 extends UNiDVerifiableCredentialBase<ContactPointCredentialV1Schema> {
    public constructor(credential: CredentialV1, options?: UNiDVerifiableCredentialOptions) {
        super(options)

        this.credential = Object.assign<CredentialV1Context, CredentialV1>({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.unid.plus/docs/2020/credentials/contactPoint',
            ],
        }, credential)
    }
}