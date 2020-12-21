import { Text } from 'schema-dts'
import { UNiDVerifiableCredential, UNiDVerifiableCredentialBase, UNiDVerifiableCredentialContext, UNiDVerifiableCredentialOptions } from '.'

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

type CredentialV1 = UNiDVerifiableCredential<
    'EmailPerson' | 'EmailOrganization',
    EmailPerson | EmailOrganization
>

type CredentialV1Context = UNiDVerifiableCredentialContext<
    'https://docs.unid.plus/docs/2020/credentials/email'
>

export type EmailCredentialV1Schema = CredentialV1 & CredentialV1Context

export class EmailCredentialV1 extends UNiDVerifiableCredentialBase<EmailCredentialV1Schema> {
    public constructor(credential: CredentialV1, options?: UNiDVerifiableCredentialOptions) {
        super(options)

        this.credential = Object.assign<CredentialV1Context, CredentialV1>({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.unid.plus/docs/2020/credentials/email',
            ],
        }, credential)
    }
}