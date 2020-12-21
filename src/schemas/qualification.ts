import { Text, EducationalOccupationalCredential } from 'schema-dts'
import { UNiDVC, UNiDVCBase, UNiDVCContext, UNiDVCOptions } from '.'

// QualificationCredentialV1

export interface QualificationPerson {
    '@id'  : Readonly<Text>,
    '@type': 'QualificationPerson',
    hasCredential: Array<EducationalOccupationalCredential>,
}

type CredentialV1 = UNiDVC<
    'QualificationPerson',
    QualificationPerson
>

type CredentialV1Context = UNiDVCContext<
    'https://docs.unid.plus/docs/2020/credentials/qualification'
>

export type QualificationCredentialV1Schema = CredentialV1 & CredentialV1Context

export class QualificationCredentialV1 extends UNiDVCBase<QualificationCredentialV1Schema> {
    public constructor(credential: CredentialV1, options?: UNiDVCOptions) {
        super(options)

        this.credential = Object.assign<CredentialV1Context, CredentialV1>({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://docs.unid.plus/docs/2020/credentials/qualification',
            ],
        }, credential)
    }
}