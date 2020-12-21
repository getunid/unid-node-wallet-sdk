import { Text } from 'schema-dts'
import { UNiDVC, UNiDVCBase, UNiDVCContext, UNiDVCOptions } from '.'

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

type CredentialV1 = UNiDVC<
    'PhonePerson' | 'PhoneOrganization',
    PhonePerson | PhoneOrganization
>

type CredentialV1Context = UNiDVCContext<
    'https://docs.unid.plus/docs/2020/credentials/phone'
>

export type PhoneCredentialV1Schema = CredentialV1 & CredentialV1Context

export class PhoneCredentialV1 extends UNiDVCBase<PhoneCredentialV1Schema> {
    public constructor(credential: CredentialV1, options?: UNiDVCOptions) {
        super(options)

        this.credential = Object.assign<CredentialV1Context, CredentialV1>({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.unid.plus/docs/2020/credentials/phone',
            ],
        }, credential)
    }
}