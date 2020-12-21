import { ContactPoint, Text } from 'schema-dts'
import { UNiDVC, UNiDVCBase, UNiDVCContext, UNiDVCOptions } from '.'

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

type CredentialV1 = UNiDVC<
    'ContactPointPerson' | 'ContactPointOrganization',
    ContactPointPerson | ContactPointOrganization
>

type CredentialV1Context = UNiDVCContext<
    'https://docs.unid.plus/docs/2020/credentials/contactPoint'
>

export type ContactPointCredentialV1Schema = CredentialV1 & CredentialV1Context

export class ContactPointCredentialV1 extends UNiDVCBase<ContactPointCredentialV1Schema> {
    public constructor(credential: CredentialV1, options?: UNiDVCOptions) {
        super(options)

        this.credential = Object.assign<CredentialV1Context, CredentialV1>({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.unid.plus/docs/2020/credentials/contactPoint',
            ],
        }, credential)
    }
}