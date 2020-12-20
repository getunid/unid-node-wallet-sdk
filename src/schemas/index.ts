import { ProofContext } from "../cipher/signer"

export interface UNiDVC<T1, T2, T3> extends ProofContext {
    '@context': Array<'https://www.w3.org/2018/credentials/v1' | T1>,
    id: string,
    type: Array<'VerifiableCredential' | T2>,
    issuer: string,
    issuanceDate: string,
    credentialSubject: T3,
}