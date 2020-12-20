import { Text, EducationalOccupationalCredential } from 'schema-dts'
import { UNiDVC } from '.'

// QualificationCredentialV1

export interface QualificationPerson {
    '@id'  : Readonly<Text>,
    '@type': 'QualificationPerson',
    hasCredential: Array<EducationalOccupationalCredential>,
}

export type QualificationCredentialV1 = UNiDVC<
    'https://docs.unid.plus/docs/2020/credentials/qualification',
    'QualificationPerson',
    QualificationPerson
>