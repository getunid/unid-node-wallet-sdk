import { UNiDExportedVerifiableCredentialMetadata, UNiDVerifiableCredentialMetadata, UNiDVerifiableCredential, UNiDWithoutProofVerifiableCredentialMetadata, UNiDCredentialSubjectMetadata } from "../schemas"
import { CredentialSigner } from "../cipher/signer"
import { Secp256k1 } from "../keyring/secp256k1"
import { SIGNING_KEY_ID, UNiD } from '../unid'
import { DateTimeUtils } from "../utils/datetime"
import { UNiDInvalidDataError } from "../error"
import { utils } from "../utils/utils"

/**
 */
class VerifyContainer<T1, T2, T3> {
    private $object : UNiDVerifiableCredential<T1, T2, T3> & UNiDVerifiableCredentialMetadata
    private $payload: UNiDVerifiableCredential<T1, T2, T3> & UNiDWithoutProofVerifiableCredentialMetadata
    private $isValid: boolean

    constructor(
        object   : UNiDVerifiableCredential<T1, T2, T3> & UNiDVerifiableCredentialMetadata,
        validated: { payload: UNiDVerifiableCredential<T1, T2, T3> & UNiDWithoutProofVerifiableCredentialMetadata, isValid: boolean }
    ) {
        this.$object  = object
        this.$payload = validated.payload
        this.$isValid = validated.isValid
    }

    /**
     */
    public toJSON(): string {
        return JSON.stringify(this.$object)
    }

    /**
     */
    public get isValid(): boolean {
        return this.$isValid
    }

    /**
     */
    public get payload(): UNiDVerifiableCredential<T1, T2, T3> & UNiDWithoutProofVerifiableCredentialMetadata {
        return this.$payload
    }

    /**
     */
    public get metadata(): UNiDExportedVerifiableCredentialMetadata {
        // [TODO]: Modify not to use `any` type
        const subject        = (this.$payload.credentialSubject as any) as UNiDCredentialSubjectMetadata
        const issuanceDate   = (new DateTimeUtils(this.$payload.issuanceDate)).$toDate()
        const expirationDate = (new DateTimeUtils(this.$payload.expirationDate)).toDate()

        const context = this.$payload["@context"]
            .filter((context) => {
                return context !== 'https://www.w3.org/2018/credentials/v1'
            })
            .shift()

        const type = this.$payload.type
            .filter((type) => {
                return type !== 'VerifiableCredential'
            })
            .shift()

        if (context === undefined) {
            throw new UNiDInvalidDataError()
        }

        if (type === undefined) {
            throw new UNiDInvalidDataError()
        }

        const meta: UNiDExportedVerifiableCredentialMetadata = {
            '@context'          : (context as string),
            type                : (type as string),
            id                  : this.$payload.id,
            issuerDid           : this.$payload.issuer,
            credentialSubjectDid: subject["@id"],
            issuanceDate        : issuanceDate,
            expirationDate      : expirationDate,
        }

        return meta
    }
}

/**
 */
export class VerifiableCredential<T> {
    private $credential: T

    /**
     * @param credential 
     */
    constructor(credential: T) {
        this.$credential = credential
    }

    /**
     */
    public get credential(): T {
        return this.$credential
    }

    /**
     * @param suite 
     */
    public async sign(suite: { did: string, keyId: string, context: Secp256k1 }): Promise<T> {
        return await CredentialSigner.sign(this.$credential, {
            did    : suite.did,
            keyId  : suite.keyId,
            context: suite.context,
        })
    }

    /**
     * @param credential 
     */
    public static async verify<T1, T2, T3>(credential: UNiDVerifiableCredential<T1, T2, T3> & UNiDVerifiableCredentialMetadata): Promise<VerifyContainer<T1, T2, T3>> {
        if (credential.proof === undefined) {
            throw new Error()
        }

        const vm  = utils.splitDid(credential.proof.verificationMethod)
        const did = await UNiD.getDidDocument({
            did: vm.did,
        })

        const validated = await CredentialSigner.verify(credential, {
            keyId  : SIGNING_KEY_ID,
            context: Secp256k1.fromJwk(did.getPublicKey(SIGNING_KEY_ID).publicKeyJwk),
        })

        return new VerifyContainer(credential, validated)
    }
}