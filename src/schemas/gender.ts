import { Text } from 'schema-dts'
import { UNiDVerifiableCredential, UNiDVerifiableCredentialBase, UNiDVerifiableCredentialContext, UNiDVerifiableCredentialOptions } from '.'

// GenderCredentialV1

export interface GenderPerson {
    '@id'  : Readonly<Text>,
    '@type': 'GenderPerson',
    gender : Readonly<Text>,
}

type CredentialV1 = UNiDVerifiableCredential<
    'GenderPerson',
    GenderPerson
>

type CredentialV1Context = UNiDVerifiableCredentialContext<
    'https://docs.unid.plus/docs/2020/credentials/gender'
>

export type GenderCredentialV1Schema = CredentialV1 & CredentialV1Context

export class GenderCredentialV1 extends UNiDVerifiableCredentialBase<GenderCredentialV1Schema> {
    public constructor(credential: CredentialV1, options?: UNiDVerifiableCredentialOptions) {
        super(options)

        this.credential = Object.assign<CredentialV1Context, CredentialV1>({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.unid.plus/docs/2020/credentials/gender',
            ],
        }, credential)
    }
}