import { UNiDExportedVerifiableCredentialMetadata, UNiDVerifiableCredentialMetadata, UNiDVerifiableCredential } from "../schemas"
import { CredentialSigner } from "../cipher/signer"
import { Secp256k1 } from "../keyring/secp256k1"
import { UNiD } from '../unid'
import { DateTimeUtils } from "src/utils/datetime"

/**
 */
class VerifyContainer<T1, T2, T3> {
    private $payload: UNiDVerifiableCredential<T1, T2, T3> & UNiDVerifiableCredentialMetadata
    private $isValid: boolean

    constructor(validated: { payload: UNiDVerifiableCredential<T1, T2, T3> & UNiDVerifiableCredentialMetadata, isValid: boolean }) {
        this.$payload = validated.payload
        this.$isValid = validated.isValid
    }

    /**
     */
    public get isValid(): boolean {
        return this.$isValid
    }

    /**
     */
    public get payload(): UNiDVerifiableCredential<T1, T2, T3> & UNiDVerifiableCredentialMetadata {
        return this.$payload
    }

    /**
     */
    public get metadata(): UNiDExportedVerifiableCredentialMetadata<T1, T2> {
        const meta: UNiDExportedVerifiableCredentialMetadata<T1, T2> = {
            '@context': this.$payload["@context"],
            type      : this.$payload.type,
            id        : this.$payload.id,
            issuer    : this.$payload.issuer,
            issuanceDate  : (new DateTimeUtils(this.$payload.issuanceDate)).$toDate(),
            expirationDate: (new DateTimeUtils(this.$payload.expirationDate)).toDate(),
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
    public async sign(suite: { did: string, context: Secp256k1 }): Promise<T> {
        return await CredentialSigner.sign(this.$credential, {
            did    : suite.did,
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

        const did = await UNiD.getDidDocument({
            did: credential.proof.verificationMethod,
        })

        const validated = await CredentialSigner.verify(credential, {
            context: Secp256k1.fromJwk(did.publicKeyJwk),
        })

        return new VerifyContainer(validated)
    }
}