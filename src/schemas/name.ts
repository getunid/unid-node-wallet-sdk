import { Text } from 'schema-dts'
import { UNiDVC, UNiDVCBase, UNiDVCContext, UNiDVCOptions } from '.'

// NameCredentialV1

export interface NamePerson {
    '@id'  : Readonly<Text>,
    '@type': 'NamePerson',
    name: Readonly<Text>,
    giveName: Readonly<Text>,
    familyName: Readonly<Text>,
}

export interface NameOrganization {
    '@id'  : Readonly<Text>,
    '@type': 'NameOrganization',
    name: Readonly<Text>,
    giveName: Readonly<Text>,
    familyName: Readonly<Text>,
}

type CredentialV1 = UNiDVC<
    'NamePerson' | 'NameOrganization',
    NamePerson | NameOrganization
>

type CredentialV1Context = UNiDVCContext<
    'https://docs.unid.plus/docs/2020/credentials/name'
>

export type NameCredentialV1Schema = CredentialV1 & CredentialV1Context

export class NameCredentialV1 extends UNiDVCBase<NameCredentialV1Schema> {
    public constructor(credential: CredentialV1, options?: UNiDVCOptions) {
        super(options)

        this.credential = Object.assign<CredentialV1Context, CredentialV1>({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.unid.plus/docs/2020/credentials/name',
            ],
        }, credential)
    }
}