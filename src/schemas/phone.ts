import { Text } from 'schema-dts'
import { UNiDVerifiableCredential, UNiDVerifiableCredentialBase, UNiDVerifiableCredentialContext, UNiDVerifiableCredentialOptions } from '.'

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

type CredentialV1 = UNiDVerifiableCredential<
    'PhonePerson' | 'PhoneOrganization',
    PhonePerson | PhoneOrganization
>

type CredentialV1Context = UNiDVerifiableCredentialContext<
    'https://docs.unid.plus/docs/2020/credentials/phone'
>

export type PhoneCredentialV1Schema = CredentialV1 & CredentialV1Context

export class PhoneCredentialV1 extends UNiDVerifiableCredentialBase<PhoneCredentialV1Schema> {
    public constructor(credential: CredentialV1, options?: UNiDVerifiableCredentialOptions) {
        super(options)

        this.credential = Object.assign<CredentialV1Context, CredentialV1>({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.unid.plus/docs/2020/credentials/phone',
            ],
        }, credential)
    }
}